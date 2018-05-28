//TODO: caves
//TODO: biomes

var treeDensity = 0.01;
var tree = [
  [[0, 0, 0], [0, 0, 0], [0, 0, 0], [9, 9, 9], [9, 9, 9], [9, 9, 9]],
  [[0, 8, 0], [0, 8, 0], [0, 8, 0], [9, 8, 9], [9, 8, 9], [9, 9, 9]],
  [[0, 0, 0], [0, 0, 0], [0, 0, 0], [9, 9, 9], [9, 9, 9], [9, 9, 9]]
];

var cactusDensity = 0.003;

/*var heightChunkMap = [];
var heightChunks = [];*/
var noiseScale = 100;
var worldSeed = 0;

function randint(a, b) {
  return Math.floor(Math.random() * (b - a)) + a;
}

function genHeightChunk(chunkX, chunkY) {
  var h = 10;
  
  var data = [];
  for(var x = 0; x < chunkSize.x; x++) {
    var xArr = [];
    for(var y = 0; y < chunkSize.y; y++) {
      //xArr.push(0);
      var sNoise = noise.simplex2(((chunkX * chunkSize.x) + x) / noiseScale, ((chunkY * chunkSize.y) + y) / noiseScale);
      var sNoise2 = noise.simplex2(((chunkX * chunkSize.x) + x) / (noiseScale * 30), ((chunkY * chunkSize.y) + y) / (noiseScale * 30)) * 2;
      var pNoise = noise.perlin2(((chunkX * chunkSize.x) + x) / noiseScale, ((chunkY * chunkSize.y) + y) / noiseScale);
      var val = (sNoise + sNoise2 + pNoise + 1) * 6;
      
      val += 3;
      val = Math.max(val, 0); //negative vals break Math.pow()
      
      val = Math.round(Math.pow(val, 1.3)); //exponent to exaggerate peaks and valleys
      
      val = Math.max(val, 0); //avoid negatives
      val += FLAG_BASE_HEIGHT; //minimum height
      xArr.push(val);
    }
    data.push(xArr);
  }
  
  //data[0][0] = randint(0, h);
  //data[chunkSize.x - 1][0] = randint(0, h);
  //data[0][chunkSize.y - 1] = randint(0, h);
  //data[chunkSize.x - 1][chunkSize.y - 1] = randint(0, h);
  
  //data = dSquare(data, 0, chunkSize.x - 1, 0, chunkSize.y - 1, h - 1);
  //data = dSquare(data, 0, 15, 0, 15, h - 1);
  
  return data;
}

/*function getHeightChunk(x, y) {
  for(var i = 0; i < heightChunkMap.length; i++) {
    if(heightChunkMap[i][0] == x && heightChunkMap[i][1] == y) {
      return heightChunks[i];
    }
  }
  
  //doesn't exist
  var data = genHeightChunk(x, y);
  heightChunks.push(data);
  heightChunkMap.push([x, y]);
  
  return data;
}*/

function sNoise2(position, scale) {
  var n = noise.simplex2(position.x / scale, position.y / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function sNoise3(position, scale) {
  var n = noise.simplex3(position.x / scale, position.y / scale, position.z / scale);
  //convert to the 0 - 1 range and invert
  n = (n + 1) / 2;
  n = 1 - n;
  return n;
}

function getOre(x, y, z) {
  //https://minecraft.gamepedia.com/Ore
  
  var position = new THREE.Vector3(x, y, z);
  
  if(z < 5) {
    return 1; //stone
  }
  
  //TODO: better height biases
  if(sNoise3(position, 15) < 0.06 && z < 130) {
    return 14; //coal ore
  } else if(sNoise3(position, 10) < 0.025 && z < 65) {
    return 18; //iron ore
  } else if(sNoise3(position, 7) > 0.97 && z < 13) {
    return 20; //redstone ore
  } else if(sNoise3(position, 8) < 0.021 && z < 30) {
    return 17; //gold ore
  } else if(sNoise3(position, 5) < 0.02 && z > 13 && z < 30) {
    return 19; //lapis ore
  } else if(sNoise3(position, 10) > 0.982 && z < 14) {
    return 15; //diamond ore
  } else if(sNoise3(position, 5) > 0.984 && z < 30) {
    return 5; //emerald ore
  } else {
    return 1; //stone
  }
}

var BIOME_NORMAL = 0;
var BIOME_DESERT = 1;
function biomeNoise(x, y) {
  var n = sNoise2(new THREE.Vector2(x, y), 500);
  var ln = noise.simplex2(x / (noiseScale * 30), y / (noiseScale * 30));
  if(n < 0.7 || ln < 0.2) {
    return BIOME_NORMAL;
  } else {
    return BIOME_DESERT;
  }
}

//world generator
function genChunk(chunkX, chunkY) {
  data = [];
  
  //fill array
  for(var x = 0; x < chunkSize.x; x++) {
    xArr = [];
    for(var y = 0; y < chunkSize.y; y++) {
      yArr = [];
      for(var z = 0; z < chunkSize.z; z++) {
        yArr.push(0);
      }
      xArr.push(yArr);
    }
    data.push(xArr);
  }
  
  var heightMap = genHeightChunk(chunkX, chunkY);
  var trees = [];
  var sugarcane = [];
  var cacti = [];
  
  for(var x = 0; x < chunkSize.x; x++) {
    for(var y = 0; y < chunkSize.y; y++) {
      for(var z = 0; z < chunkSize.z; z++) {
        var biome = biomeNoise((chunkX * chunkSize.x) + x, (chunkY * chunkSize.y) + y);
        if(biome == BIOME_NORMAL) {
          
          //BIOME: NORMAL
          
          if(heightMap[x][y] <= FLAG_WATER_LEVEL + FLAG_WATER_MARGIN) {
            //low - water
            if(z < heightMap[x][y] - 2) {
              data[x][y][z] = getOre((chunkX * chunkSize.x) + x, (chunkY * chunkSize.y) + y, z); //stone or ore
            } else if(z < heightMap[x][y]) {
              data[x][y][z] = 5; //sand
              if(z == FLAG_WATER_LEVEL) { //at water level
                sugarcane.push(new THREE.Vector3(x, y, z));
              } else if(z < FLAG_WATER_LEVEL) { //below water level
                var nScale = 15;
                var n = noise.simplex3(((chunkX * chunkSize.x) + x) / nScale, ((chunkY * chunkSize.y) + y) / nScale, z / nScale);
                if(n > 0.6) {
                  data[x][y][z] = 58; //clay block
                }
              }
            } else if(z <= FLAG_WATER_LEVEL) {
              data[x][y][z] = 6; //water
            }
          } else {
            //high - normal
            if(z < heightMap[x][y] - 4) {
              data[x][y][z] = getOre((chunkX * chunkSize.x) + x, (chunkY * chunkSize.y) + y, z); //stone or ore
            } else if(z < heightMap[x][y] - 1) {
              data[x][y][z] = 3; //dirt
            } else if(z < heightMap[x][y]) {
              data[x][y][z] = 2; //grass
              if(Math.random() < treeDensity) {
                if(x >= 1 && x < chunkSize.x - 1 && y >= 1 && y < chunkSize.y - 1 && z < chunkSize.z - 7) {
                  trees.push(new THREE.Vector3(x, y, z));
                }
              }
            } else if(z == heightMap[x][y]) {
              if(Math.random() < 0.01) {
                data[x][y][z] = 13; //rose
              } else if(Math.random() < 0.01) {
                data[x][y][z] = 33; //grass plant
              }
            }
          }
          
          //end BIOME: NORMAL
          
        } else if(biome == BIOME_DESERT) {
          
          //BIOME: DESERT
          
          if(z < heightMap[x][y] - 4) {
            data[x][y][z] = getOre((chunkX * chunkSize.x) + x, (chunkY * chunkSize.y) + y, z); //stone or ore
          } else if(z < heightMap[x][y] - 1) {
            data[x][y][z] = 5; //sand
          } else if(z < heightMap[x][y]) {
            data[x][y][z] = 5; //sand
            if(Math.random() < cactusDensity) {
              if(z < chunkSize.z - 4) {
                cacti.push(new THREE.Vector3(x, y, z));
              }
            }
          }
          
          //end BIOME: DESERT
          
        }
      }
    }
  }
  
  for(var i = 0; i < trees.length; i++) {
    for(var x = 0; x < 3; x++) {
      for(var y = 0; y < 3; y++) {
        for(var z = 0; z < 6; z++) {
          var blockID = tree[x][z][y];
          if(blockID != 0) {
            var dest = new THREE.Vector3(trees[i].x - 1 + x, trees[i].y - 1 + y, trees[i].z + 1 + z);
            if(data[dest.x][dest.y][dest.z] != 8) { //leave other oak logs alone - better merging
              data[dest.x][dest.y][dest.z] = blockID;
            }
          }
        }
      }
    }
  }
  
  for(var i = 0; i < sugarcane.length; i++) {
    var sc = sugarcane[i];
    /*if(!blockFunctions.sugarcaneCheckWater(new THREE.Vector3(sc.x + (chunkX * chunkSize.x), sc.z + 1, sc.y * (chunkY + chunkSize.y)))) {
      continue;
    }*/
    var ok = false;
    for(var n = 2; n < 6; n++) {
      var pos = new THREE.Vector3(sc.x + faces[n][0], sc.y + faces[n][2], sc.z);
      if(pos.x >= 0 && pos.x < chunkSize.x && pos.y >= 0 && pos.y < chunkSize.y) {
        if(data[pos.x][pos.y][pos.z] == 6) { //water
          ok = true;
        }
      }
    }
    
    if(!ok) { continue; }
    
    if(Math.random() < 0.025) { //2.5% chance on any given suitable spot
      //https://minecraft.gamepedia.com/Sugar_Canes
      if(sc.z + 1 < chunkSize.z) {
        
        data[sc.x][sc.y][sc.z + 1] = 37; //sugarcane
        if(sc.z + 2 < chunkSize.z) {
          data[sc.x][sc.y][sc.z + 2] = 37; //sugarcane
          if(sc.z + 3 < chunkSize.z && Math.random() < 7 / 18) {
            data[sc.x][sc.y][sc.z + 3] = 37; //sugarcane
            if(sc.z + 4 < chunkSize.z && Math.random() < 2 / 18) {
              data[sc.x][sc.y][sc.z + 4] = 37; //sugarcane
              var position = new THREE.Vector3(sc.x + (chunkX * chunkSize.x), sc.z + 4, sc.y + (chunkY * chunkSize.y));
              setBlockMeta(position, {startTime: tickCount, growTime: tickCount + FLAG_SUGARCANE_GROW_TIME, height: 4});
            } else {
              var position = new THREE.Vector3(sc.x + (chunkX * chunkSize.x), sc.z + 3, sc.y + (chunkY * chunkSize.y));
              setBlockMeta(position, {startTime: tickCount, growTime: tickCount + FLAG_SUGARCANE_GROW_TIME, height: 3});
            }
          } else {
            var position = new THREE.Vector3(sc.x + (chunkX * chunkSize.x), sc.z + 2, sc.y + (chunkY * chunkSize.y));
            setBlockMeta(position, {startTime: tickCount, growTime: tickCount + FLAG_SUGARCANE_GROW_TIME, height: 2});
          }
        }
      }
    }
  }
  
  for(var i = 0; i < cacti.length; i++) {
    for(var z = 0; z < 3; z++) {
      var dest = new THREE.Vector3(cacti[i].x, cacti[i].y, cacti[i].z + 1 + z);
      data[dest.x][dest.y][dest.z] = 70; //cactus
    }
  }
  
  return data;
}
