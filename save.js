function saveGame() {
  var sChunkMap = [];
  var sChunks = [];
  for(var i = 0; i < chunkMap.length; i++) {
    if(chunksModded[i]) {
      sChunkMap.push(chunkMap[i]);
      sChunks.push(chunks[i]);
    }
  }
  
  var pos = [];
  pos.push(controls.getObject().position.x);
  pos.push(controls.getObject().position.y);
  pos.push(controls.getObject().position.z);
  
  var data = {chunkMap: sChunkMap, chunks: sChunks, seed: worldSeed, pos: pos, inventory: inventory, blockMeta: blockMeta, tickCount: tickCount, totalTime: totalTime, entities: serializeEntities(entities), playerSaturation: playerSaturation, playerHunger: playerHunger, playerExhaustion: playerExhaustion, playerHealth: playerHealth};
  var sData = JSON.stringify(data);
  
  var a = document.createElement("a");
  a.download = "world.json";
  a.href = "data:text/json;base64," + btoa(sData);
  a.style.display = "none";
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function loadGame() {
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.onchange = loadGameFile;
  fileInput.style.display = "none";
  
  document.body.appendChild(fileInput);
  fileInput.click();
  document.body.removeChild(fileInput);
}

function loadGameFile(e) {
  var files = e.target.files;
  if(files.length) {
    var file = files[0];
    var reader = new FileReader();
    
    reader.onloadend = function(e) {
      if(e.target.readyState == FileReader.DONE) {
        var sData = e.target.result;
        var data = JSON.parse(sData);
        
        blockMeta = data.blockMeta;
        tickCount = data.tickCount;
        totalTime = data.totalTime;
        
        var oChunkMap = deepcopy(chunkMap);
        for(var i = 0; i < oChunkMap.length; i++) {
          unloadChunk(oChunkMap[i][0], oChunkMap[i][1]);
        }
        
        chunkMap = data.chunkMap;
        chunks = data.chunks;
        worldSeed = data.seed;
        noise.seed(worldSeed);
        
        chunkMeshes = [];
        chunksModded = [];
        for(var i = 0; i < chunkMap.length; i++) {
          chunkMeshes.push(null);
          chunksModded.push(true);
          //loadChunk(chunkMap[i][0], chunkMap[i][1]);
        }
        loadChunks();
        
        controls.getObject().position.x = data.pos[0];
        controls.getObject().position.y = data.pos[1];
        controls.getObject().position.z = data.pos[2];
        
        inventory = data.inventory;
        updateInventoryUI();
        
        for(var i = 0; i < entities.length; i++) {
          if(entities[i] != null) {
            scene.remove(entities[i].model);
          }
        }
        entities = deserializeEntities(data.entities);
        for(var i = 0; i < entities.length; i++) {
          if(entities[i] != null) {
            scene.add(entities[i].model);
          }
        }
        
        playerSaturation = data.playerSaturation;
        playerHunger = data.playerHunger;
        playerExhaustion = data.playerExhaustion;
        updateFoodUI();
        
        playerHealth = data.playerHealth;
        updateHealthUI();
        
        if(guiOpen) {
          closeGUI();
        }
      }
    };

    reader.readAsText(file);
  }
}
