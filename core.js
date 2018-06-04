//TODO: visual when dealing damage
//TODO: real entities
//TODO: fix entity-falling-when-spawned bug
//TODO: only show and process entities in loaded chunks
//TODO: timedActions only for loaded chunks
//TODO: use noise or seeded randomness or something else consistent for tree/ore/sugarcane generation
  //TODO: correct ore probabilites and clumping
  //TODO: better trees?
//TODO: chests/furnaces drop their contents when broken
  //TODO: for furnaces
//TODO: fix breaking-air-blocks bug
//TODO: fix keyboard-when-UI-open
//TODO: fix placing-block-where-it-overlaps-with-player bug
//TODO: directional block placing ("directional" property in blocklist; "direction" metadata tag)
  //torches
  //*furnaces
  //*chests
  //logs
//TODO: better terrain generation (inc. biomes, etc.)
  //TODO: more biomes
  //TODO: better biome noise generation
//TODO: cactus only on sand
//TODO: fix cactus framerate issue
//TODO: raycast=false blocks should be transparent to raycaster
//TODO: day/night cycle
//TODO: better GUI
  //TODO: options to set chunk render distance, FOV, lighting?, limit frame rate, etc.
//TODO: menu actually freezes game
//TODO: better furnaces - burn fuel regardless of block presence
//TODO: auto-resize crafting/furnace/menu (trigger from main resize() function?) (addEventListener on open and remove event listener on close?)
//TODO: Ctrl+S/Ctrl+O for save/load?
//TODO: sliding against "wall" in shift key mode
//TODO: fix lighting
//TODO: fix transparency all the way
//TODO: fog
//TODO: make sure you can't go through blocks when falling/jumping really fast
//TODO: slower sugarcane
  //TODO: "random ticks"
//TODO: fix instant block breaking
  //correct timing, etc.
  //no tool wear
//TODO: proper furnace speed - use flag?
//TODO: fix block break timing - better precision?, delay before showing breaker?
//TODO: correct block icons - 3D?
//TODO: clean up todo lists
//TODO: toggleable debug overlay
//TODO: merge in Google Keep todo list
//TODO: placing blocks on irregular meshes (ex.: sugarcane on sugarcane?)
//TODO: only placing some blocks on certain faces - plants on ground (except for torches); torches on all but ceiling
//TODO: "attachment blocks" for plants/torches?
//TODO: fences
//TODO: nicer-looking tool usage meters
//TODO: show hand onscreen?
//TODO: theme UIs? JSON to map positions of elements on a texture?
//TODO: stuff flying out when breaking blocks
//TODO: tool usage meter changes color?
//TODO: in save/restore, save just the deltas IF it results in a smaller output; everything otherwise
//TODO: better one-tap jump
//TODO: nicer jumping
//TODO: fix swimming
//TODO: multithreading?
//TODO: armor and player damage
//TODO: fix chest icon
//TODO: fix recipie matcher
//TODO: breathing limit when underwater
//TODO: water flow
//TODO: slow down block breaking when in air/underwater
//TODO: always have stone under lakes/rivers
//TODO: bedrock?
//TODO: limit inventory size
//TODO: mineral blocks
//TODO: decoration blocks
//TODO: XP
//TODO: custom key bindings
//TODO: flowerpots
//TODO: food
//TODO: generated structures (caves, villages, etc.)
//TODO: attack speed limit
//TODO: in-browser (localStorage) autosave?
//TODO: ladders
//TODO: irregular mesh custom collisions? (tighter fit - fences, etc.)
//TODO: block other actions while eating
//TODO: sound effects
//TODO: entity fall damage?
//TODO: cactus growth
//TODO: buttons pressing in
//TODO: instant glass breaking?
//TODO: natural entity spawning?
//TODO: fire
//TODO: better entity movement
//TODO: shears
  //TODO: wool
  //TODO: dye
//TODO: fix reload button

var camera;
var renderer;
var scene;
var controls;

var keysPressed = [false, false, false, false, false, false];
var motionDir = new THREE.Vector3(0, 0, 0);
var zSpeed = 0;
var fallStartZ = 0;

var textures;
var textureMap = [];
var blockTextures = {};

var mouse = new THREE.Vector2(0, 0);
var raycaster;
var line;
var selector;
var doPlace = false;
var doDestroy = false;
var blockToDestroyLocation = new THREE.Vector3();
var blockToPlaceLocation = new THREE.Vector3();
var entitySel = null;
var breakTime = 0;
var isBreaking = false;
var breaking;
var breakingTextures = [];
var breakingMaterials = [];
var isEating = false;
var eatTime = 0;

var chunkDistance = FLAG_CHUNK_DISTANCE;

var swimming = false;
var speculativeSwimming = false;
var headSwimming = false;

var mobile = false;

var jumpTime = 0;

var uiOpen = false;
var doAnimate = true;

function init() {
  scene = new THREE.Scene();  
  
  //THREE.PerspectiveCamera(fov, aspect, near, far)
  camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    3000
  );
  
  //controls = new THREE.PointerLockControls(camera);
  if(mobile) {
    //TODO
  } else {
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    controls.enabled = true;
  }
  
  controls.getObject().position.set(0, 90, 0);
  
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.vr.enabled = true;
  document.body.appendChild(renderer.domElement);
  
  //renderer.domElement.addEventListener("click", document.body.requestPointerLock);
  
  if(mobile) {
    //TODO
  } else {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    //document.addEventListener("mousemove", onMouseMove);
    
    //FIXME - just renderer, not GUI overlays
    renderer.domElement.addEventListener("click", function(e) {
      if(document.pointerLockElement != renderer.domElement && !uiOpen) {
        renderer.domElement.requestPointerLock();
      }
    });
    document.addEventListener("click", function(e) {
      if(document.pointerLockElement == renderer.domElement) {
        if(e.which == 1) {
          doDestroy = true;
        } else if(e.which == 3) {
          doPlace = true;
        }
      }
    });
    document.addEventListener("mousedown", function(e) {
      if(document.pointerLockElement == renderer.domElement) {
        if(e.which == 1) {
          isBreaking = true;
        } else if(e.which == 3) {
          isEating = true;
        }
      }
    });
    document.addEventListener("mouseup", function(e) {
      if(document.pointerLockElement == renderer.domElement) {
        if(e.which == 1) {
          isBreaking = false;
        } else if(e.which == 3) {
          isEating = false;
        }
      }
    });
    
    document.addEventListener("mousemove", showInventoryItemInHand);
  }
  window.addEventListener("resize", onResize);
  
  loadTextures();
  
  raycaster = new THREE.Raycaster();
  
  var geometry = new THREE.BufferGeometry();
  geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(4 * 3), 3));
  var material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2, transparent: true});
  line = new THREE.Line(geometry, material);
  scene.add(line);
  line.visible = false;
  
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  //var material = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 2, transparent: true});
  var material = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, wireframe: true});
  selector = new THREE.Mesh(geometry, material);
  //selector.material.side = THREE.DoubleSide;
  scene.add(selector);
  
  var geometry = new THREE.BoxGeometry(1.01, 1.01, 1.01);
  geometry.computeVertexNormals();
  for(var i = 0; i < 10; i++) {
    //TODO: fix alpha
    breakingMaterials.push(new THREE.MeshLambertMaterial({map: breakingTextures[i], transparent: true}));
  }
  breaking = new THREE.Mesh(geometry, breakingMaterials[0]);
  breaking.material.side = THREE.DoubleSide;
  scene.add(breaking);
  
  //VR
  /*window.addEventListener("vrdisplaypointerrestricted", function() {
    var pointerLockElement = renderer.domElement;
    if ( pointerLockElement && typeof(pointerLockElement.requestPointerLock) === 'function' ) {
      pointerLockElement.requestPointerLock();
    }
	}, false);
  window.addEventListener("vrdisplaypointerunrestricted", function() {
    var currentPointerLockElement = document.pointerLockElement;
    var expectedPointerLockElement = renderer.domElement;
    if ( currentPointerLockElement && currentPointerLockElement === expectedPointerLockElement && typeof(document.exitPointerLock) === 'function' ) {
      document.exitPointerLock();
    }
  }, false);
  document.body.appendChild(WEBVR.createButton(renderer));*/
  
  tint.style.width = window.innerWidth + "px";
  tint.style.height = window.innerHeight + "px";
  
  start();
}

function onKeyDown(e) {
  if(e.repeat) { return; }
  
  if(!uiOpen) {
    switch(e.keyCode) {
      case 38: //up
      case 87: //w
        keysPressed[0] = true;
        break;
      
      case 40: //down:
      case 83: //s
        keysPressed[1] = true;
        break;
      
      case 37: //left
      case 65: //a
        keysPressed[2] = true;
        break;
      
      case 39: //right
      case 68: //d
        keysPressed[3] = true;
        break;
      
      case 16: //shift
        keysPressed[4] = true;
        break;
      
      case 32: //space
        keysPressed[5] = true;
        break;
    }
    processKeys();
  }
}

function onKeyUp(e) {
  if(!uiOpen) {
    switch(e.keyCode) {
      case 38: //up
      case 87: //w
        keysPressed[0] = false;
        break;
      
      case 40: //down:
      case 83: //s
        keysPressed[1] = false;
        break;
      
      case 37: //left
      case 65: //a
        keysPressed[2] = false;
        break;
      
      case 39: //right
      case 68: //d
        keysPressed[3] = false;
        break;
      
      case 16: //shift
        keysPressed[4] = false;
        break;
      
      case 32: //space
        if(!FLAG_ONE_TAP_JUMP) {
          keysPressed[5] = false;
        }
        break;
      
      case 189: //minus
      case 173:
        hotbarSelectorPosition--;
        if(hotbarSelectorPosition < 0) {
          hotbarSelectorPosition = hotbarItemCount - 1;
        }
        updateInventoryUI();
        break;
      
      case 187: //plus/equals
      case 61:
        hotbarSelectorPosition++;
        if(hotbarSelectorPosition >= hotbarItemCount) {
          hotbarSelectorPosition = 0;
        }
        updateInventoryUI();
        break;
      
      //TODO: do on keydown for responsiveness?
      case 49: //1
      case 50: //2
      case 51: //3
      case 52: //4
      case 53: //5
      case 54: //6
      case 55: //7
      case 56: //8
      case 57: //9
        hotbarSelectorPosition = e.keyCode - 49;
        updateInventoryUI();
        break;
      
      case 69: //e
        openInventory(4);
        break;
      
      case 27: //esc
      case 77: //m
        openGUI();
        break;
    }
    processKeys();
  } else if(inventoryOpen) {
    //inventory open
    switch(e.keyCode) {
      case 16: //shift
        keysPressed[4] = false;
        break;
      
      case 27: //esc
      case 69: //e
        closeInventory();
        break;
    }
  } else if(furnaceOpen) {
    //inventory open
    switch(e.keyCode) {
      case 16: //shift
        keysPressed[4] = false;
        break;
      
      case 27: //esc
      case 69: //e
        closeFurnace();
        break;
    }
  } else if(chestOpen) {
    //inventory open
    switch(e.keyCode) {
      case 16: //shift
        keysPressed[4] = false;
        break;
      
      case 27: //esc
      case 69: //e
        closeChest();
        break;
    }
  } else if(guiOpen) {
    //inventory open
    switch(e.keyCode) {
      case 27: //esc
      case 77: //m
        closeGUI();
        break;
    }
  }
}

function processKeys() {
  if(keysPressed[2]) { //left
    motionDir.x = -1;
  } else if(keysPressed[3]) { //right
    motionDir.x = 1;
  } else {
    motionDir.x = 0;
  }
  
  if(keysPressed[0]) { //up
    motionDir.z = -1;
  } else if(keysPressed[1]) { //down
    motionDir.z = 1;
  } else {
    motionDir.z = 0;
  }
  
  if(keysPressed[4]) { //shift
    motionDir.y = -1;
  } else if(keysPressed[5]) { //space
    motionDir.y = 1;
  } else {
    motionDir.y = 0;
  }
  
  //motionDir = motionDir.multiplyScalar(0.3); //FIXME
}

/*function onMouseMove(e) {
  //https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_buffergeometry.html
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}*/

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  tint.style.width = window.innerWidth + "px";
  tint.style.height = window.innerHeight + "px";
}

var onGround = false;
function checkCollision() {
  speculativeSwimming = false;
  headSwimming = false;
  onGround = false;
  
  //collision detection
  //apply x/y/z deltas to create a box around the player
  for(var deltaX = -0.3; deltaX <= 0.3; deltaX += 0.6) {
    for(var deltaY = -0.3; deltaY <= 0.3; deltaY += 0.6) {
      for(var deltaZ = 0.3; deltaZ >= -1.5; deltaZ -= 0.3) {
        var chunkX = Math.floor(Math.round(controls.getObject().position.x + deltaX) / chunkSize.x);
        var chunkY = Math.floor(Math.round(controls.getObject().position.z + deltaY) / chunkSize.y);
        var relX = Math.round(controls.getObject().position.x + deltaX) - (chunkX * chunkSize.x);
        var relY = Math.round(controls.getObject().position.z + deltaY) - (chunkY * chunkSize.y);
        var relZ = Math.round(controls.getObject().position.y + deltaZ);
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
          
          if(blockID == 6) {
            speculativeSwimming = true;
            if(deltaZ == 0) {
              headSwimming = true;
            }
          }
          
          if(!walkable) {
            if(deltaZ == -1.5) {
              onGround = true;
            }
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

var prevTime = performance.now();
var frameCount = 0;
function animate() {
  requestAnimationFrame(animate);
  
  var time = performance.now();
  
  if(time - prevTime > 100) {
    //too high of a timeDelta can lead to entities falling through objects because they move too far
    prevTime = time - 100;
  }
  
  var actionTimeDelta = (time - prevTime);
	var timeDelta = (time - prevTime) / 100;
	prevTime = time;
  
  timeDelta *= FLAG_SPEED_MULTIPLIER;
  var oTimeDelta = timeDelta; //for use by entities - not altered by swimming
  
  if(doAnimate) {
    //TODO: apply speed multiplier to timed actions?
    timedActions(actionTimeDelta);
    
    //swimming physics
    checkCollision();
    swimming = speculativeSwimming;
    if(swimming) {
      timeDelta /= 3;
    }
    
    uiOpen = inventoryOpen || furnaceOpen || guiOpen || chestOpen || deathScreen;
    
    if(frameCount % FLAG_RAYCAST_FREQ == 0) {
      raycaster.setFromCamera(mouse, camera);
      //FIXME - can't interact w/ blocks through water but can interact through xmeshes
      var intersects = raycaster.intersectObjects(scene.children, true);
      if(intersects.length > 0) {
        for(var i = 0; i < intersects.length; i++) {
          var intersect = intersects[i];
          var object = intersect.object;
          while(object.parent != scene) { object = object.parent; }
          var face = intersect.face;
          
          if(object != null && "entityID" in object.userData) {
            entitySel = object.userData.entityID;
            selector.visible = false;
            doPlace = false;
            break;
          } else {
            entitySel = null;
          }
          
          if(object != null && face != null && object.geometry.attributes != undefined) {
            //TODO: clean up
            line.geometry.attributes.position.copyAt(0, object.geometry.attributes.position, face.a);
            line.geometry.attributes.position.copyAt(1, object.geometry.attributes.position, face.b);
            line.geometry.attributes.position.copyAt(2, object.geometry.attributes.position, face.c);
            line.geometry.attributes.position.copyAt(3, object.geometry.attributes.position, face.a);
            
            object.updateMatrix();
            
            line.geometry.applyMatrix(object.matrix);
            
            line.geometry.computeBoundingBox();
            var box = line.geometry.boundingBox;
            var pointA = box.min;
            var pointB = box.max;
            var center = new THREE.Vector3((pointA.x + pointB.x) / 2, (pointA.y + pointB.y) / 2, (pointA.z + pointB.z) / 2);
            
            //TODO: round center position to account for irregular meshes?
            
            var extruded = center.clone();
            var intruded = center.clone();
            
            var cFactor = 0.01;
            if(pointB.x - pointA.x == 0) {
              if(controls.getObject().position.x > pointA.x) {
                //positive extrusion
                extruded.x = extruded.x + 0.5;
                intruded.x = intruded.x - 0.5;
                center.x += cFactor;
              } else {
                //negative extrusion
                extruded.x = extruded.x - 0.5;
                intruded.x = intruded.x + 0.5;
                center.x -= cFactor;
              }
            } else if(pointB.y - pointA.y == 0) {
              if(controls.getObject().position.y > pointA.y) {
                //positive extrusion
                extruded.y = extruded.y + 0.5;
                intruded.y = intruded.y - 0.5;
                center.y += cFactor;
              } else {
                //negative extrusion
                extruded.y = extruded.y - 0.5;
                intruded.y = intruded.y + 0.5;
                center.y -= cFactor;
              }
            } else if(pointB.z - pointA.z == 0) {
              if(controls.getObject().position.z > pointA.z) {
                //positive extrusion
                extruded.z = extruded.z + 0.5;
                intruded.z = intruded.z - 0.5;
                center.z += cFactor;
              } else {
                //negative extrusion
                extruded.z = extruded.z - 0.5;
                intruded.z = intruded.z + 0.5;
                center.z -= cFactor;
              }
            }
            
            //if the center point is invalid (irregular mesh)
            if(!(Math.abs(intruded.x - Math.round(intruded.x)) == 0 && Math.abs(intruded.y - Math.round(intruded.y)) == 0 && Math.abs(intruded.z - Math.round(intruded.z)) == 0)) {
              intruded.x = Math.round(intruded.x);
              intruded.y = Math.round(intruded.y);
              intruded.z = Math.round(intruded.z);
              
              center = intruded.clone();
              
              //just make a box
              pointA = new THREE.Vector3(0, 0, 0);
              pointB = new THREE.Vector3(1, 1, 1);
            }
            
            selector.position.set(center.x, center.y, center.z);
            selector.scale.x = pointB.x - pointA.x;
            selector.scale.y = pointB.y - pointA.y;
            selector.scale.z = pointB.z - pointA.z;
            selector.geometry.computeVertexNormals();
            
            selector.visible = true;
            
            blockToDestroyLocation = intruded.clone();
            blockToPlaceLocation = extruded.clone();
            
            var blockID = getBlockID(blockToDestroyLocation);
            if("raycast" in blocks[blockID][2] && !blocks[blockID][2].raycast) {
              selector.visible = false;
              doPlace = false;
              doDestroy = false;
              continue;
            }
            
            break;
          }
        }
      } else {
        selector.visible = false;
        doPlace = false;
        doDestroy = false;
        entitySel = null;
      }
      
      /*if(doDestroy) {
        destroyBlock(blockToDestroyLocation);
        doDestroy = false;
      }*/
      /*var blockID = getBlockID(blockToDestroyLocation);
      var breakable = true;
      if("breakable" in blocks[blockID][2] && !blocks[blockID][2].breakable) {
        breakable = false;
      }*/
      if(selector.visible && isBreaking) { // TODO -  && breakable) {
        var blockID = getBlockID(blockToDestroyLocation);
        var targetBreakTime = getBreakTime(blockID);
        
        breakTime += actionTimeDelta;
        if(breakTime >= targetBreakTime) {
          destroyBlock(blockToDestroyLocation);
          breakTime = 0;
        } else if(targetBreakTime > 50) { //don't show for instant-break blocks
          var tIndex = Math.floor((breakTime / targetBreakTime) * 10);
          tIndex = Math.min(tIndex, 9);
          breaking.material = breakingMaterials[tIndex];
          
          breaking.visible = true;
          breaking.position.set(blockToDestroyLocation.x, blockToDestroyLocation.y, blockToDestroyLocation.z); //TODO: clone?
        }
      } else {
        breakTime = 0;
        breaking.visible = false;
      }
      if(doPlace) {
        var blockID = getBlockID(blockToDestroyLocation);
        /*if("food" in blocks[<item in hand ID>][2]) {
          //do nothing - food is handled elsewhere
        } else */if("interact" in blocks[blockID][2]) {
          //interactable blocks
          blocks[blockID][2].interact(blockToDestroyLocation);
        } else if("xmesh" in blocks[blockID][2] && blocks[blockID][2].xmesh) {
          //do nothing with xmeshes
        } else {
          var placeDir = [Math.ceil(blockToPlaceLocation.x - blockToDestroyLocation.x), Math.ceil(blockToPlaceLocation.y - blockToDestroyLocation.y), Math.ceil(blockToPlaceLocation.z - blockToDestroyLocation.z)];
          
          var nPlaceDir = null;
          for(var i = 0; i < faces.length; i++) {
            if(arrayComp(faces[i], placeDir)) {
              nPlaceDir = i;
              break;
            }
          }
          
          placeBlock(blockToPlaceLocation, nPlaceDir);
          if(!checkCollision()) {
            destroyBlock(blockToPlaceLocation); //FIXME
          }
        }
        doPlace = false;
      }
      
      if(doDestroy && entitySel != null) {
        var damage = 1;
        if(hotbarSelectorPosition < inventory.length) {
          var item = inventory[hotbarSelectorPosition];
          if(item != null) {
            if("damage" in blocks[item.id][2]) {
              damage = blocks[item.id][2].damage;
            }
          }
        }
        
        var didDamage = damageEntity(entitySel, damage);
        if(didDamage && hotbarSelectorPosition < inventory.length) {
          var item = inventory[hotbarSelectorPosition];
          if(item != null) {
            if("toolType" in blocks[item.id][2]) {
              toolType = blocks[item.id][2].toolType;
              if(toolType > 0) {
                inventory[hotbarSelectorPosition].life -= 2;
                if(inventory[hotbarSelectorPosition].life <= 0) {
                  inventory[hotbarSelectorPosition] = null;
                }
                updateInventoryUI();
              }
            }
          }
        }
      }
      doDestroy = false;
      
      if(isEating) {
        if(hotbarSelectorPosition < inventory.length) {
          var item = inventory[hotbarSelectorPosition];
          if(item != null) {
            if("food" in blocks[item.id][2]) {
              var targetEatTime = 1000;
              
              eatTime += actionTimeDelta;
              if(eatTime >= targetEatTime) {
                eatTime = 0;
                
                eatBlock(item.id);
                takeBlock(item.id);
              }
              
            } else { eatTime = 0; }
          } else { eatTime = 0; }
        } else { eatTime = 0; }
      } else { eatTime = 0; }
    }
    
    //keyboardctl
    var movedKeyboardX = false;
    var movedKeyboardZ = false;
    
    var newX = controls.getObject().position.x; //for use in shift key section; FIXME - rename
    var newZ = controls.getObject().position.z;
    
    var prevCanMove = checkCollision();
    controls.getObject().translateX(motionDir.x * timeDelta);
    controls.getObject().translateZ(motionDir.z * timeDelta);
    var canMove = checkCollision();
    
    if(!canMove && prevCanMove) {
      var prevX = controls.getObject().position.x;
      var prevZ = controls.getObject().position.z;
      controls.getObject().translateX(-(motionDir.x * timeDelta));
      controls.getObject().translateZ(-(motionDir.z * timeDelta));
      
      //just x
      controls.getObject().position.x = prevX;
      var canMove = checkCollision();
      if(canMove) {
        movedKeyboardX = true;
      } else {
        controls.getObject().position.x = newX;
        
        //just z
        controls.getObject().position.z = prevZ;
        var canMove = checkCollision();
        if(canMove) {
          movedKeyboardZ = true;
        } else {
          controls.getObject().position.z = newZ;
        }
      }
    } else {
      movedKeyboardX = true;
      movedKeyboardZ = true;
    }
    
    //gravity
    var canJump = jumpTime <= FLAG_MAX_JUMP_TIME || swimming || FLAG_INFINITE_JUMP; //TODO: jumping out of water
    if(canJump) { jumpTime += actionTimeDelta; }
    if(motionDir.y > 0 && canJump) {
      zSpeed = Math.min(zSpeed + (timeDelta / 3), 2);
    } else {
      zSpeed = Math.max(zSpeed - (timeDelta / 3), -4);
    }
    
    if(canJump && !(jumpTime <= FLAG_MAX_JUMP_TIME || FLAG_INFINITE_JUMP) && !FLAG_REPEAT_JUMP) {
      //just crossed the limit
      keysPressed[5] = false;
      processKeys();
    }
    
    prevCanMove = checkCollision();
    controls.getObject().translateY(zSpeed);
    
    canMove = checkCollision();
    
    if(!canMove && prevCanMove) {
      controls.getObject().translateY(-zSpeed);
      zSpeed = 0;
      
      jumpTime = 0;
      //keysPressed[5] = false;
      //processKeys();
      if(!onGround) {
        jumpTime = FLAG_MAX_JUMP_TIME + 1;
      }
      
      var fallDistance = Math.round(fallStartZ - controls.getObject().position.y);
      if(fallDistance > 3 && !swimming) {
        giveHealth(-(fallDistance - 3));
      }
      
      fallStartZ = controls.getObject().position.y;
    } else if(canMove && motionDir.y < 0) { //can fall + shift key
      //prevent motion
      if(movedKeyboardX) { controls.getObject().position.x = newX; }
      if(movedKeyboardZ) { controls.getObject().position.z = newZ; }
      controls.getObject().translateY(-zSpeed);
      zSpeed = 0;
    }/* else {
      if(zSpeed > 0) {
        fallStartZ = controls.getObject().position.y;
      }
    }*/
    
    //falling out of the world
    if(controls.getObject().position.y < -100) {
      giveHealth(-FLAG_MAX_HEALTH);
    }
    
    camera.updateProjectionMatrix();
    
    //swimming tint
    checkCollision();
    if(headSwimming) {
      tint.style.backgroundColor = "rgba(0, 0, 255, 0.3)";
    } else {
      tint.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }
    
    //TODO: circle instead of square
    var chunkX = Math.floor(controls.getObject().position.x / chunkSize.x);
    var chunkY = Math.floor(controls.getObject().position.z / chunkSize.y);
    
    //load new chunks
    var count = 0;
    var maxCount = FLAG_CHUNK_LOAD_SPEED;
    for(var x = chunkX - chunkDistance; x <= chunkX + chunkDistance && count < maxCount; x++) {
      for(var y = chunkY - chunkDistance; y <= chunkY + chunkDistance && count < maxCount; y++) {
        if(!chunkLoaded(x, y)) {
          loadChunk(x, y);
          count++;
        }
      }
    }
    
    //unload old ones
    var count = 0;
    var maxCount = FLAG_CHUNK_UNLOAD_SPEED;
    for(var i = 0; i < chunkMap.length; i++) {
      if(chunkMap[i][0] < chunkX - chunkDistance || chunkMap[i][0] > chunkX + chunkDistance ||
         chunkMap[i][1] < chunkY - chunkDistance || chunkMap[i][1] > chunkY + chunkDistance) {
        if(chunkLoaded(chunkMap[i][0], chunkMap[i][1])) {
          unloadChunk(chunkMap[i][0], chunkMap[i][1]);
          count++;
          if(count >= maxCount) {
            break;
          }
        }
      }
    }
    
    //move sky sphere
    sky.position.set(controls.getObject().position.x, controls.getObject().position.y, controls.getObject().position.z);
    
    //entities
    renderEntities(oTimeDelta);
    
    renderer.render(scene, camera);
  }
  
  frameCount++;
}

function loadTextures() {
  textures = THREE.ImageUtils.loadTexture("textures.png");
  textures.minFilter = THREE.NearestFilter;
  textures.magFilter = THREE.NearestFilter;
  
  for(var blockID = 0; blockID < blocks.length; blockID++) {
    var t = [];
    
    if(blocks[blockID][1] == null) {
      //TODO
    } else if("all" in blocks[blockID][1]) {
      for(var n = 0; n < 6; n++) {
        t.push(blocks[blockID][1].all);
      }
    } else if("top" in blocks[blockID][1] && "sides" in blocks[blockID][1] && "bottom" in blocks[blockID][1]) {
      //top
      t.push(blocks[blockID][1].top);
      
      //bottom
      t.push(blocks[blockID][1].bottom);
      
      //sides
      for(var n = 0; n < 4; n++) {
        t.push(blocks[blockID][1].sides);
      }
    } else if("top" in blocks[blockID][1] && "sideX" in blocks[blockID][1] && "sideY" in blocks[blockID][1] && "bottom" in blocks[blockID][1]) {
      //top
      t.push(blocks[blockID][1].top);
      
      //bottom
      t.push(blocks[blockID][1].bottom);
      
      //x sides
      for(var n = 0; n < 2; n++) {
        t.push(blocks[blockID][1].sideX);
      }
      
      //y sides
      for(var n = 0; n < 2; n++) {
        t.push(blocks[blockID][1].sideY);
      }
    } else if("top" in blocks[blockID][1] && "bottom" in blocks[blockID][1] && "left" in blocks[blockID][1] && "right" in blocks[blockID][1] && "front" in blocks[blockID][1] && "back" in blocks[blockID][1]) {
      //top
      t.push(blocks[blockID][1].top);
      
      //bottom
      t.push(blocks[blockID][1].bottom);
      
      //left
      t.push(blocks[blockID][1].left);
      
      //right
      t.push(blocks[blockID][1].right);
      
      //front
      t.push(blocks[blockID][1].front);
      
      //back
      t.push(blocks[blockID][1].back);
    } else {
      //TODO
    }
    
    textureMap.push(t);
  }
  
  //TODO: better code
  blockTextures.chest = THREE.ImageUtils.loadTexture("entity/chest/normal.png");
  blockTextures.chest.minFilter = THREE.NearestFilter;
  blockTextures.chest.magFilter = THREE.NearestFilter;
  
  blockTextures.torch = THREE.ImageUtils.loadTexture("blocks/torch_on.png");
  blockTextures.torch.minFilter = THREE.NearestFilter;
  blockTextures.torch.magFilter = THREE.NearestFilter;
  
  blockTextures.cactus = THREE.ImageUtils.loadTexture("cactus.png");
  blockTextures.cactus.minFilter = THREE.NearestFilter;
  blockTextures.cactus.magFilter = THREE.NearestFilter;
  
  for(var i = 0; i < 10; i++) {
    var t = THREE.ImageUtils.loadTexture("blocks/destroy_stage_" + i + ".png");
    t.minFilter = THREE.NearestFilter;
    t.magFilter = THREE.NearestFilter;
    breakingTextures.push(t);
  }
}

document.addEventListener("DOMContentLoaded", init);
