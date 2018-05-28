//TODO: bounds checking in getBlockID/setBlockID

var blockToPlace = 0;
var blockMeta = [];

function getBlockID(position) {
  var chunkX = Math.floor(position.x / chunkSize.x);
  var chunkY = Math.floor(position.z / chunkSize.y);
  var data = getChunk(chunkX, chunkY);
  
  var x = position.x - (chunkX * chunkSize.x);
  var y = position.z - (chunkY * chunkSize.y);
  var z = position.y;
  return data[x][y][z];
}

function setBlockID(position, val) {
  var chunkX = Math.floor(position.x / chunkSize.x);
  var chunkY = Math.floor(position.z / chunkSize.y);
  var data = getChunk(chunkX, chunkY);
  
  var x = position.x - (chunkX * chunkSize.x);
  var y = position.z - (chunkY * chunkSize.y);
  var z = position.y;
  data[x][y][z] = val;
  
  //reload the chunk
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunkMap[i][0] == chunkX && chunkMap[i][1] == chunkY) {
      chunks[i] = data;
      chunksModded[i] = true;
      break;
    }
  }
  
  if(chunkLoaded(chunkX, chunkY)) {
    loadChunk(chunkX, chunkY);
  }
  
  if(x == 0 && chunkLoaded(chunkX - 1, chunkY)) {
    loadChunk(chunkX - 1, chunkY);
  }
  if(x == chunkSize.x - 1 && chunkLoaded(chunkX + 1, chunkY)) {
    loadChunk(chunkX + 1, chunkY);
  }
  if(y == 0 && chunkLoaded(chunkX, chunkY - 1)) {
    loadChunk(chunkX, chunkY - 1);
  }
  if(y == chunkSize.y - 1 && chunkLoaded(chunkX, chunkY + 1)) {
    loadChunk(chunkX, chunkY + 1);
  }
}

function getBlockMeta(position) {
  for(var i = 0; i < blockMeta.length; i++) {
    if(blockMeta[i].x == position.x && blockMeta[i].y == position.y && blockMeta[i].z == position.z) {
      return blockMeta[i].data;
    }
  }
  return {};
}

function setBlockMeta(position, val) {
  for(var i = 0; i < blockMeta.length; i++) {
    if(blockMeta[i].x == position.x && blockMeta[i].y == position.y && blockMeta[i].z == position.z) {
      blockMeta[i].data = val;
      return;
    }
  }
  
  blockMeta.push({x: position.x, y: position.y, z: position.z, data: val});
}

function removeBlockMeta(position) {
  for(var i = 0; i < blockMeta.length; i++) {
    if(blockMeta[i].x == position.x && blockMeta[i].y == position.y && blockMeta[i].z == position.z) {
      blockMeta.splice(i, 1);
      return;
    }
  }
}

//FIXME - leave block in inventory if can't place - only take if can
function placeBlock(position, facing = null) {
  var blockID = blockToPlace; //blockToPlace may be changed by takeBlock(), so copy it
  
  if("placeable" in blocks[blockID][2]) {
    if(!blocks[blockID][2].placeable) {
      return; //this item can't be placed
    }
  }
  
  if(hasBlock(blockID)) { //take block from inventory; exit if unsuccessful
    if("onPlace" in blocks[blockID][2]) {
      if(!blocks[blockID][2].onPlace(position)) {
        return;
      }
    }
    
    var chunkX = Math.floor(position.x / chunkSize.x);
    var chunkY = Math.floor(position.z / chunkSize.y);
    var data = getChunk(chunkX, chunkY);
    
    var x = position.x - (chunkX * chunkSize.x);
    var y = position.z - (chunkY * chunkSize.y);
    var z = position.y;
    if(z < 0 || z >= chunkSize.z) {
      return;
    }
    data[x][y][z] = blockID;
    takeBlock(blockID);
    
    if("directional" in blocks[blockID][2] && blocks[blockID][2].directional && facing != null) {
      var meta = getBlockMeta(position);
      meta.facing = facing;
      setBlockMeta(position, meta);
    }
    
    for(var i = 0; i < chunkMap.length; i++) {
      if(chunkMap[i][0] == chunkX && chunkMap[i][1] == chunkY) {
        chunks[i] = data;
        chunksModded[i] = true;
        break;
      }
    }
    
    loadChunk(chunkX, chunkY);
  }
}

function destroyBlock(position) {
  var chunkX = Math.floor(position.x / chunkSize.x);
  var chunkY = Math.floor(position.z / chunkSize.y);
  var data = getChunk(chunkX, chunkY);
  
  var x = position.x - (chunkX * chunkSize.x);
  var y = position.z - (chunkY * chunkSize.y);
  var z = position.y;
  if(z < 0 || z >= chunkSize.z) {
    return;
  }
  
  var blockID = data[x][y][z];
  if("breakable" in blocks[blockID][2] && !blocks[blockID][2].breakable) {
    return;
  }
  
  var toolType = 0;
  var toolLevel = 0;
  if(hotbarSelectorPosition < inventory.length) {
    var item = inventory[hotbarSelectorPosition];
    if(item != null) {
      if("toolType" in blocks[item.id][2]) {
        toolType = blocks[item.id][2].toolType;
      }
      if("toolLevel" in blocks[item.id][2]) {
        toolLevel = blocks[item.id][2].toolLevel;
      }
    }
  }
  
  var reqToolType = 0;
  var reqToolLevel = 0;
  if("reqToolType" in blocks[blockID][2]) {
    reqToolType = blocks[blockID][2].reqToolType;
  }
  if("reqToolLevel" in blocks[blockID][2]) {
    reqToolLevel = blocks[blockID][2].reqToolLevel;
  }
  
  /*if(reqToolType != 0 && reqToolLevel > 0) {
    if(toolType != reqToolType) {
      return;
    }
    if(toolLevel < reqToolLevel) {
      return;
    }
  }*/
  
  if("onDestroy" in blocks[blockID][2]) {
    if(!blocks[blockID][2].onDestroy(position)) {
      return;
    }
  }
  
  if(toolType != 0) {
    inventory[hotbarSelectorPosition].life--;
    if(inventory[hotbarSelectorPosition].life <= 0) {
      inventory[hotbarSelectorPosition] = null;
    }
    updateInventoryUI();
  }
  
  if(reqToolLevel == 0 || (toolType == reqToolType && toolLevel >= reqToolLevel)) {
    if("giveWhenBroken" in blocks[blockID][2]) {
      var item = blocks[blockID][2].giveWhenBroken;
      if(item != null) {
        /*for(var i = 0; i < item.stack; i++) { //TODO: better system?
          giveBlock(item.id);
        }*/
        giveItem(item);
      }
    } else {
      giveBlock(data[x][y][z]); //put block in inventory
    }
  }
  data[x][y][z] = 0;
  removeBlockMeta(position);
  
  if(z + 1 < chunkSize.z) {
    var blockID = data[x][y][z + 1];
    if("plant" in blocks[blockID][2] && blocks[blockID][2].plant) {
      destroyBlock(new THREE.Vector3(position.x, position.y + 1, position.z));
    }
  }
  
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunkMap[i][0] == chunkX && chunkMap[i][1] == chunkY) {
      chunks[i] = data;
      chunksModded[i] = true;
      break;
    }
  }
  
  loadChunk(chunkX, chunkY);
  
  if(x == 0) {
    loadChunk(chunkX - 1, chunkY);
  }
  if(x == chunkSize.x - 1) {
    loadChunk(chunkX + 1, chunkY);
  }
  if(y == 0) {
    loadChunk(chunkX, chunkY - 1);
  }
  if(y == chunkSize.y - 1) {
    loadChunk(chunkX, chunkY + 1);
  }
}

//TODO: timing nuances
function getBreakTime(blockID) {
  //https://minecraft.gamepedia.com/Breaking
  
  var hardness = 1;
  if("hardness" in blocks[blockID][2]) {
    hardness = blocks[blockID][2].hardness;
  }
  
  var breakTime = hardness;
  
  var toolType = 0;
  var toolLevel = 0;
  if(hotbarSelectorPosition < inventory.length) {
    var item = inventory[hotbarSelectorPosition];
    if(item != null) {
      if("toolType" in blocks[item.id][2]) {
        toolType = blocks[item.id][2].toolType;
      }
      if("toolLevel" in blocks[item.id][2]) {
        toolLevel = blocks[item.id][2].toolLevel;
      }
    }
  }
  
  var reqToolType = 0;
  var reqToolLevel = 0;
  if("reqToolType" in blocks[blockID][2]) {
    reqToolType = blocks[blockID][2].reqToolType;
  }
  if("reqToolLevel" in blocks[blockID][2]) {
    reqToolLevel = blocks[blockID][2].reqToolLevel;
  }
  
  if(reqToolLevel == 0 || (toolType == reqToolType && toolType > 0)) {
    breakTime *= 1.5;
  } else {
    breakTime *= 5;
  }
  
  if(toolType == reqToolType && toolType > 0) {
    switch(toolLevel) {
      case 1: //wood
        breakTime *= 1/2;
        break;
      case 2: //stone
        breakTime *= 1/4;
        break;
      case 3: //iron
        breakTime *= 1/6;
        break;
      case 4: //diamond
        breakTime *= 1/8;
        break;
      case -1: //gold
        breakTime *= 1/12;
        break;
    }
  }
  
  //breakTime = Math.max(breakTime, 0.05); //FIXME
  
  return Math.floor(breakTime * 1000);
}
