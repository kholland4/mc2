//TODO: save/load entities
//TODO: swimming
//TODO: "life" property
//TODO: better in confined spaces
//TODO: fix potential infinite jump

var entities = [];
//Entities should face in the +Z direction
var entityTemplates = [
  /* 0 */ {
    name: "pig",
    model: entity_pig.getMesh(),
    animateWalk: entity_pig.animateWalk,
    life: 10,
    onDie: function(entity) { giveItem({id: 62, stack: randint(2, 4)}); }
  },
  /* 1 */ {
    name: "TestEntity2",
    model: new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({color: 0x9600db})),
    life: 4,
    onDie: function(entity) { giveItem({id: 65, stack: randint(1, 3)}); }
  },
  /* 2 */ {
    name: "TestEntity3",
    model: new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshLambertMaterial({color: 0x1a4a99})),
    life: 30,
    onDie: function(entity) { giveItem({id: 68, stack: randint(3, 8)}); }
  }
];

function spawnEntity(id, position) {
  var entity = {};
  
  entity.model = entityTemplates[id].model.clone();
  entity.model.position.set(position.x, position.y, position.z);
  
  entity.boundingBox = new THREE.Box3().setFromObject(entity.model);
  entity.model.rotateY(Math.PI / 2);
  entity.boundingBox.expandByObject(entity.model); //compute largest possible bounding box
  entity.model.rotateY(-Math.PI / 2);
  entity.boundingBox.min.sub(entity.model.position);
  entity.boundingBox.max.sub(entity.model.position);
  
  entity.name = entityTemplates[id].name;
  entity.id = id;
  entity.model.userData.entityID = entities.length;
  entity.data = {};
  
  entity.speed = new THREE.Vector3(0, 0, 0);
  //entity.targetPosition = new THREE.Vector3(position.x, position.y, position.z);
  entity.speedMul = 0.2;
  entityNewVector(entity);
  
  entity.life = entityTemplates[id].life;
  
  entities.push(entity);
  scene.add(entity.model);
  
  return entities.length - 1; //entity ID
}

function entityCheckCollision(position, boundingBox) {
  //speculativeSwimming = false;
  //headSwimming = false;
  
  //collision detection
  //apply x/y/z deltas to create a box around the player
  
  var incrementX = Math.min((boundingBox.max.x - boundingBox.min.x) / 3, 0.5);
  var incrementY = Math.min((boundingBox.max.y - boundingBox.min.y) / 3, 0.5);
  var incrementZ = Math.min((boundingBox.max.z - boundingBox.min.z) / 5, 0.5); /* entities are often long */
  
  for(var deltaX = boundingBox.min.x; deltaX <= boundingBox.max.x; deltaX += incrementX) {
    for(var deltaY = boundingBox.min.z; deltaY <= boundingBox.max.z; deltaY += incrementZ) {
      for(var deltaZ = boundingBox.min.y; deltaZ <= boundingBox.max.y; deltaZ += incrementY) {
        var chunkX = Math.floor(Math.round(position.x + deltaX) / chunkSize.x);
        var chunkY = Math.floor(Math.round(position.z + deltaY) / chunkSize.y);
        var relX = Math.round(position.x + deltaX) - (chunkX * chunkSize.x);
        var relY = Math.round(position.z + deltaY) - (chunkY * chunkSize.y);
        var relZ = Math.round(position.y + deltaZ);
        //console.log([relX, relY, relZ]);
        
        if(relZ >= 0 && relZ < chunkSize.z) {
          var data = getChunk(chunkX, chunkY);
          var blockID = data[relX][relY][relZ];
          var walkable = false;
          if("walkable" in blocks[blockID][2]) {
            if(blocks[blockID][2].walkable) {
              walkable = true;
            }
          }
          
          /*if(blockID == 6) {
            speculativeSwimming = true;
            if(deltaZ == 0) {
              headSwimming = true;
            }
          }*/
          
          if(!walkable) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

function entityNewVector(entity) {
  var newX = randint(Math.round(entity.model.position.x) - 10, Math.round(entity.model.position.x) + 10);
  var newZ = randint(Math.round(entity.model.position.z) - 10, Math.round(entity.model.position.z) + 10);
  entity.targetPosition = new THREE.Vector3(newX, 0, newZ);
  
  //FIXME
  var target = entity.targetPosition.clone().sub(entity.model.position);
  var target2 = new THREE.Vector2(target.x, target.z);
  target2.normalize();
  /*var quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), target);
  entity.model.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), quat.y);*/
  //entity.model.setRotationFromQuaternion(quat);
  /*var lookAt = entity.targetPosition.clone();
  lookAt.y = entity.model.position.y;
  entity.model.lookAt(lookAt);*/
  
  var angle = (target2.angle() + (Math.PI / 2)) % (Math.PI * 2);
  //var angle = target2.angle();
  entity.model.setRotationFromEuler(new THREE.Euler(0, angle, 0));
  
  /*entity.boundingBox = new THREE.Box3().setFromObject(entity.model);
  entity.boundingBox.min.sub(entity.model.position);
  entity.boundingBox.max.sub(entity.model.position);*/
}

function renderEntity(entity, timeDelta) {
  var nSpeed = entity.targetPosition.clone().sub(entity.model.position);
  nSpeed.y = 0;
  nSpeed.normalize();
  entity.speed.x = nSpeed.x * entity.speedMul;
  entity.speed.z = nSpeed.z * entity.speedMul;
  
  //motion
  var prevCanMove = entityCheckCollision(entity.model.position, entity.boundingBox);
  entity.model.translateX(entity.speed.x * timeDelta);
  entity.model.translateZ(entity.speed.z * timeDelta);
  var canMove = entityCheckCollision(entity.model.position, entity.boundingBox);
  
  if(!canMove && prevCanMove) {
    entity.model.translateX(-(entity.speed.x * timeDelta));
    entity.model.translateZ(-(entity.speed.z * timeDelta));
    
    entity.speed.y = Math.min(entity.speed.y + (timeDelta / 2), 2);
    if(!("stuckTime" in entity)) { entity.stuckTime = 0; }
    entity.stuckTime += timeDelta;
    
    if(entity.stuckTime > 10) {
      entityNewVector(entity);
      entity.stuckTime = 0;
    }
  } else {
    entity.stuckTime = 0;
  }
  
  //gravity
  entity.speed.y = Math.max(entity.speed.y - (timeDelta / 3), -4);
  
  prevCanMove = entityCheckCollision(entity.model.position, entity.boundingBox);
  entity.model.translateY(entity.speed.y);
  
  canMove = entityCheckCollision(entity.model.position, entity.boundingBox);
  
  if(!canMove && prevCanMove) {
    entity.model.translateY(-entity.speed.y);
    entity.speed.y = 0;
  }
  
  if(Math.abs(entity.model.position.x - entity.targetPosition.x) < 0.2 && Math.abs(entity.model.position.z - entity.targetPosition.z) < 0.2) {
    entityNewVector(entity);
  }
  
  if("animateWalk" in entityTemplates[entity.id]) {
    entityTemplates[entity.id].animateWalk(entity, timeDelta);
  }
}

function renderEntities(timeDelta) {
  for(var i = 0; i < entities.length; i++) {
    if(entities[i] != null) {
      renderEntity(entities[i], timeDelta);
    }
  }
}

function damageEntity(entityID, damage) {
  entities[entityID].life -= damage;
  if(entities[entityID].life <= 0) {
    entityTemplates[entities[entityID].id].onDie(entities[entityID]);
    
    scene.remove(entities[entityID].model);
    
    if(entities.length - 1 == entityID) {
      entities.splice(entityID, 1);
    } else {
      entities[entityID] = null; //TODO: clean up array when possible
    }
  }
}

function serializeEntities(entities) {
  var data = [];
  for(var i = 0; i < entities.length; i++) {
    var oEntity = entities[i];
    if(oEntity == null) { data.push(null); continue; }
    var entity = {};
    entity.position = [oEntity.model.position.x, oEntity.model.position.y, oEntity.model.position.z];
  
    entity.name = oEntity.name;
    entity.id = oEntity.id;
    entity.entityID = oEntity.model.userData.entityID;
    entity.data = oEntity.data;
    
    entity.speed = [oEntity.speed.x, oEntity.speed.y, oEntity.speed.z];
    entity.targetPosition = [oEntity.targetPosition.x, oEntity.targetPosition.y, oEntity.targetPosition.z];
    entity.speedMul = oEntity.speedMul;
    
    entity.life = oEntity.life;
    
    data.push(entity);
  }
  
  return data;
}

function deserializeEntities(data) {
  var entities = [];
  if(data == undefined || data == null) {
    return entities;
  }
  
  for(var i = 0; i < data.length; i++) {
    var oEntity = data[i];
    if(oEntity == null) { entities.push(null); continue; }
    var id = oEntity.id;
    var entity = {};
    
    entity.model = entityTemplates[id].model.clone();
    entity.model.position.set(oEntity.position[0], oEntity.position[1], oEntity.position[2]);
    entity.boundingBox = new THREE.Box3().setFromObject(entity.model);
    entity.boundingBox.min.sub(entity.model.position);
    entity.boundingBox.max.sub(entity.model.position);
    
    entity.name = oEntity.name;
    entity.id = id;
    entity.model.userData.entityID = oEntity.entityID;
    entity.data = oEntity.data;
    
    entity.speed = new THREE.Vector3(oEntity.speed[0], oEntity.speed[1], oEntity.speed[2]);
    entity.targetPosition = new THREE.Vector3(oEntity.targetPosition[0], oEntity.targetPosition[1], oEntity.targetPosition[2]);
    entity.speedMul = oEntity.speedMul;
    
    entity.life = oEntity.life;
    
    entities.push(entity);
  }
  
  return entities;
}
