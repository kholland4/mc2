//TODO: shadows
//TODO: transparent blocks (except for water?) in seperate meshes?
  //TODO: lights

var chunks = [];
var chunkMeshes = [];
var chunksModded = [];
var chunkMap = [];
var chunkSize = new THREE.Vector3(16, 16, 128);
var blockSize = 1; //FIXME

//position deltas for each face
var faces = [
  [0, 1, 0], //top
  [0, -1, 0], //bottom
  [-1, 0, 0], //left
  [1, 0, 0], //right
  [0, 0, 1], //front
  [0, 0, -1] //back
];

var faceSquares = [ //FIXME to match UVs
  [-0.5, 0.5, -0.5, //top
   0.5, 0.5, -0.5,
   -0.5, 0.5, 0.5,
   
   0.5, 0.5, -0.5,
   0.5, 0.5, 0.5,
   -0.5, 0.5, 0.5],
   
  [-0.5, -0.5, -0.5, //bottom
   0.5, -0.5, -0.5,
   -0.5, -0.5, 0.5,
   
   0.5, -0.5, -0.5,
   0.5, -0.5, 0.5,
   -0.5, -0.5, 0.5],
   
   [-0.5, 0.5, -0.5, //left
    -0.5, 0.5, 0.5,
    -0.5, -0.5, -0.5,
    
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    -0.5, -0.5, -0.5],
   
   [0.5, 0.5, -0.5, //right
    0.5, 0.5, 0.5,
    0.5, -0.5, -0.5,
    
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    0.5, -0.5, -0.5],
   
   [-0.5, 0.5, 0.5, //front
    0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    
    0.5, 0.5, 0.5,
    0.5, -0.5, 0.5,
    -0.5, -0.5, 0.5],
   
   [-0.5, 0.5, -0.5, //back
    0.5, 0.5, -0.5,
    -0.5, -0.5, -0.5,
    
    0.5, 0.5, -0.5,
    0.5, -0.5, -0.5,
    -0.5, -0.5, -0.5]
];

var facingRotation = [
  [4, 5, 2, 3, 1, 0], //facing: top
  [5, 4, 2, 3, 0, 1], //facing: bottom
  [0, 1, 4, 5, 3, 2], //facing: left
  [0, 1, 5, 4, 2, 3], //facing: right
  [0, 1, 2, 3, 4, 5], //facing: front
  [0, 1, 3, 2, 5, 4] //facing: back
];

var xmeshSquares = [
  [-0.5, 0.5, -0.5, //back left -> front right
   0.5, 0.5, 0.5,
   -0.5, -0.5, -0.5,
   
   0.5, 0.5, 0.5,
   0.5, -0.5, 0.5,
   -0.5, -0.5, -0.5],
  
  [0.5, 0.5, -0.5, //back right -> front left
   -0.5, 0.5, 0.5,
   0.5, -0.5, -0.5,
   
   -0.5, 0.5, 0.5,
   -0.5, -0.5, 0.5,
   0.5, -0.5, -0.5]
];

//lower left is (0, 0)
//1      24
//
//
//36     5
var faceUVs = [
  0.0, 0.125,
  0.125, 0.125,
  0.0, 0.0,
  
  0.125, 0.125,
  0.125, 0.0,
  0.0, 0.0
];

var textureIndexScale = 1 / 128;

var sky;

function start() {
  var hLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  scene.add(hLight);
  
  /*var hLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.3);
  scene.add(hLight);
  
  var dLight = new THREE.DirectionalLight(0xffffbb, 0.6);
  scene.add(dLight);
  
  var aLight = new THREE.AmbientLight(0xffffbb, 0.3);
  scene.add(aLight);*/
  
  //sky - https://stackoverflow.com/a/32233806
  var skyGeo = new THREE.SphereGeometry(1000, 25, 25);
  //TODO: sky shading
  //var skyTexture = THREE.ImageUtils.loadTexture("sky.png");
  var material = new THREE.MeshBasicMaterial({color: 0x7ec0ee}); //, map: skyTexture});
  sky = new THREE.Mesh(skyGeo, material);
  sky.material.side = THREE.BackSide;
  scene.add(sky);
  
  //fog - https://threejs.org/docs/#api/scenes/Fog
  //var fog = new THREE.Fog(0x888888, (chunkDistance * chunkSize.x) - 15, (chunkDistance * chunkSize.x) + 200);
  //scene.add(fog);
  
  updateInventoryUI();
  updateFoodUI();
  updateHealthUI();
  
  worldSeed = Math.floor(Math.random() * 65535) + 1; //this library only supports 65536 different seeds
  noise.seed(worldSeed);
  
  loadChunks();
  
  animate();
}

function getChunk(x, y) {
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunkMap[i][0] == x && chunkMap[i][1] == y) {
      return chunks[i];
    }
  }
  
  //doesn't exist
  var data = genChunk(x, y);
  chunks.push(data);
  chunkMeshes.push(null);
  chunksModded.push(false);
  chunkMap.push([x, y]);
  
  return data;
}

function loadChunks() {
  for(var x = -2; x <= 2; x++) {
    for(var y = -2; y <= 2; y++) {
      loadChunk(x, y);
    }
  }
}

function loadChunk(chunkX, chunkY) {
  var data = getChunk(chunkX, chunkY);
  
  var meshes = [];
  
  //var material = new THREE.MeshLambertMaterial({map: textures, transparent: true});
  var material = new THREE.MeshLambertMaterial({map: textures, transparent: true});
  var geometry = new THREE.BufferGeometry();
  var vertices = [];
  var uvs = [];
  
  var tVertices = [];
  var tUVs = [];
  
  for(var x = 0; x < chunkSize.x; x++) {
    for(var y = 0; y < chunkSize.y; y++) {
      for(var z = 0; z < chunkSize.z; z++) {
        blockID = data[x][y][z];
        if(blockID == 0) {
          continue;
        }
        
        var facing = null;
        
        if("directional" in blocks[blockID][2] && blocks[blockID][2].directional) {
          var position = new THREE.Vector3((chunkX * chunkSize.x) + x, z, (chunkY * chunkSize.y) + y);
          var meta = getBlockMeta(position);
          if("facing" in meta) {
            facing = meta.facing;
          }
        }
        
        //lights
        if("light" in blocks[blockID][2] && blocks[blockID][2].light) {
          var lProps = {color: 0xffffff, intensity: 1, distance: 14, decay: 1};
          if("lightProps" in blocks[blockID][2]) {
            lProps = blocks[blockID][2].lightProps;
          }
          var light = new THREE.PointLight(lProps.color, lProps.intensity, lProps.distance, lProps.decay);
          light.position.x = (chunkX * chunkSize.x) + x;
          light.position.y = z;
          light.position.z = (chunkY * chunkSize.y) + y;
          scene.add(light);
          meshes.push(light);
        }
        
        if("genMesh" in blocks[blockID][2]) {
          var mesh2 = blocks[blockID][2].genMesh(new THREE.Vector3((chunkX * chunkSize.x) + x, z, (chunkY * chunkSize.y) + y), facing);
          
          mesh2.position.set((chunkX * chunkSize.x) + x, z, (chunkY * chunkSize.y) + y);
          
          meshes.push(mesh2);
          scene.add(mesh2);
          
          continue;
        }
        
        if(blockID == 6) { //water
          if(z < chunkSize.z - 1) {
            if(data[x][y][z + 1] == 6) { //also water
              continue;
            }
          }
        }
        
        var transparent = false;
        if("transparent" in blocks[blockID][2] && blocks[blockID][2].transparent) {
          transparent = true;
        }
        
        var xmesh = false;
        if("xmesh" in blocks[blockID][2] && blocks[blockID][2].xmesh) {
          xmesh = true;
        }
        
        //X-shaped meshes
        if(xmesh) {
          for(var i = 0; i < xmeshSquares.length; i++) {
            var square = deepcopy(xmeshSquares[i]);
            for(var n = 0; n < square.length; n += 3) {
              square[n] += x;
              square[n + 1] += z;
              square[n + 2] += y;
            }
            if(transparent) {
              tVertices.push.apply(tVertices, square);
            } else {
              vertices.push.apply(vertices, square);
            }
            
            var uv = deepcopy(faceUVs);
            var delta = textureMap[blockID][i];
            for(var n = 0; n < uv.length; n += 2) {
              uv[n] += delta[0] * textureIndexScale;
              uv[n + 1] += (112 - delta[1]) * textureIndexScale; //FIXME
            }
            if(transparent) {
              tUVs.push.apply(tUVs, uv);
            } else {
              uvs.push.apply(uvs, uv);
            }
          }
          continue;
        }
        
        //Normal cube blocks
        var lTextures = textureMap[blockID];
        if(facing != null) {
          lTextures = [];
          for(var i = 0; i < faces.length; i++) {
            lTextures.push(textureMap[blockID][facingRotation[meta.facing][i]]);
          }
        }
        
        for(var i = 0; i < faces.length; i++) {
          if(blockID == 6 && i != 0) { //water and not the top face; FIXME - non-flat water
            continue; //only draw the water's surface
          }
          if(z == 0 && i == 1 && FLAG_SKIP_BOTTOM) { //don't draw the very bottom surface
            continue;
          }
          
          var nearby = new THREE.Vector3(x + faces[i][0], y + faces[i][2], z + faces[i][1]);
          if(nearby.x >= 0 && nearby.x < chunkSize.x && nearby.y >= 0 && nearby.y < chunkSize.y && nearby.z >= 0 && nearby.z < chunkSize.z) {
            //block is in chunk
            var id = data[nearby.x][nearby.y][nearby.z];
            if("transparent" in blocks[id][2] && blocks[id][2].transparent) {
              //ok
            } else {
              //opaque
              continue;
            }
          } else if(nearby.z >= 0 && nearby.z < chunkSize.z) {
            var id = getBlockID(new THREE.Vector3(nearby.x + (chunkX * chunkSize.x), nearby.z, nearby.y + (chunkY * chunkSize.y)));
            if("transparent" in blocks[id][2] && blocks[id][2].transparent) {
              //ok
            } else {
              //opaque
              continue;
            }
          }
          
          var square = deepcopy(faceSquares[i]);
          for(var n = 0; n < square.length; n += 3) {
            square[n] += x;
            square[n + 1] += z;
            square[n + 2] += y;
          }
          if(transparent) {
            tVertices.push.apply(tVertices, square);
          } else {
            vertices.push.apply(vertices, square);
          }
          
          var uv = deepcopy(faceUVs);
          var delta = lTextures[i];
          for(var n = 0; n < uv.length; n += 2) {
            uv[n] += delta[0] * textureIndexScale;
            uv[n + 1] += (112 - delta[1]) * textureIndexScale; //FIXME
          }
          if(transparent) {
            tUVs.push.apply(tUVs, uv);
          } else {
            uvs.push.apply(uvs, uv);
          }
        }
      }
    }
  }
  
  //add transparent things last so they render last
  //vertices.push.apply(vertices, tVertices);
  //uvs.push.apply(uvs, tUVs);
  for(var i = 0; i < tVertices.length; i++) {
    vertices.push(tVertices[i]);
  }
  for(var i = 0; i < tUVs.length; i++) {
    uvs.push(tUVs[i]);
  }
  
  geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
  geometry.computeVertexNormals();
  
  geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
  
  var face = new THREE.Mesh(geometry, material);
  face.position.x = (chunkX * chunkSize.x);
  face.position.z = (chunkY * chunkSize.y);
  face.position.y = 0;
  
  face.material.side = THREE.DoubleSide; //FIXME
  
  meshes.push(face);
  
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunkMap[i][0] == chunkX && chunkMap[i][1] == chunkY) {
      if(chunkMeshes[i] != null) {
        for(var n = 0; n < chunkMeshes[i].length; n++) {
          scene.remove(chunkMeshes[i][n]);
        }
      }
      chunkMeshes[i] = meshes;
    }
  }
  
  scene.add(face);
}

function unloadChunk(x, y) {
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunkMeshes[i] != null && chunkMap[i][0] == x && chunkMap[i][1] == y) {
      for(var n = 0; n < chunkMeshes[i].length; n++) {
        scene.remove(chunkMeshes[i][n]);
      }
      
      chunkMeshes[i] = null;
      
      if(!chunksModded[i]) {
        chunks.splice(i, 1);
        chunkMeshes.splice(i, 1);
        chunksModded.splice(i, 1);
        chunkMap.splice(i, 1);
      }
      return;
    }
  }
}

function chunkLoaded(x, y) {
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunkMap[i][0] == x && chunkMap[i][1] == y) {
      if(chunkMeshes[i] != null) {
        return true;
      }
      return false;
    }
  }
  return false;
}
