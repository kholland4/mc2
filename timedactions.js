//TODO: only run on loaded chunks
//TODO: dirt -> grass? no meta tagging; just at random
//TODO: leaf degeneration

var tickLen = 250; //ms
var totalTime = 0;
var tickCount = 0;

function timedActions(timeDelta) {
  totalTime += timeDelta;
  var deltaTick = false;
  while(totalTime >= tickCount * tickLen) {
    tickCount++;
    deltaTick = true;
  }
  
  if(!deltaTick) {
    return;
  }
  
  var destroyQueue = [];
  for(var i = 0; i < blockMeta.length; i++) {
    var meta = blockMeta[i].data;
    var position = new THREE.Vector3(blockMeta[i].x, blockMeta[i].y, blockMeta[i].z);
    var blockID = getBlockID(position);
    
    if(blockID == 37) { //sugarcane
      var deltaY = 0; //this block is already verified to exist
      var blockID = getBlockID(new THREE.Vector3(position.x, position.y + deltaY, position.z));
      var c = false;
      while(position.y + deltaY >= 0 && deltaY > -10 && (blockID == 5 || blockID == 37)) { //check if sugarcane/sand below
        if(blockID == 5) {
          if(!blockFunctions.sugarcaneCheckWater(new THREE.Vector3(position.x, position.y + deltaY + 1, position.z))) {
            destroyQueue.push(new THREE.Vector3(position.x, position.y + deltaY + 1, position.z));
            c = true;
          }
          break;
        }
        
        deltaY--;
        if(position.y + deltaY >= 0) {
          blockID = getBlockID(new THREE.Vector3(position.x, position.y + deltaY, position.z));
        }
      }
      if(c) { continue; }
      
      if("startTime" in meta && "growTime" in meta && "height" in meta) {
        if(tickCount >= meta.growTime) {
          delete meta.growTime;
          setBlockMeta(position, meta);
          
          if(meta.height < 3) {
            var nearby = new THREE.Vector3(position.x, position.y + 1, position.z);
            if(nearby.y < chunkSize.y) {
              if(getBlockID(nearby) == 0) {
                setBlockID(nearby, 37); //add sugarcane above
                setBlockMeta(nearby, {startTime: tickCount, growTime: tickCount + FLAG_SUGARCANE_GROW_TIME, height: meta.height + 1});
                removeBlockMeta(position);
              }
            }
          }
        }
      }
    } else if(blockID == 34 || blockID == 35) {
      if("furnace" in meta) {
        if(meta.input != null && ((meta.fuel != null && "fuel" in blocks[meta.fuel.id][2]) || meta.currentFuel > 0) && meta.targetOutput != null) {
          if(meta.output != null && meta.output.id != meta.targetOutput) {
            if(blockID == 35) {
              setBlockID(position, 34); //change to furnace.off
            }
            continue;
          }
          
          if(blockID == 34) {
            setBlockID(position, 35); //change to furnace.on
          }
          
          //is running
          meta.timer--;
          if(meta.timer > 0) {
            setBlockMeta(position, meta);
            continue; //wait longer
          }
          
          //check prepped fuel
          //console.log(meta.currentFuel);
          if(meta.currentFuel <= 0) {
            meta.currentFuel += blocks[meta.fuel.id][2].fuel;
            meta.fuel.stack--;
            if(meta.fuel.stack <= 0) {
              meta.fuel = null;
            }
          }
          
          meta.currentFuel--;
          meta.input.stack--;
          if(meta.input.stack <= 0) {
            meta.input = null;
          }
          
          if(meta.output == null) {
            meta.output = {id: meta.targetOutput, stack: 1};
          } else {
            meta.output.stack++;
          }
          meta.timer = FLAG_FURNACE_SMELT_TIME;
        } else if(blockID == 35) {
          setBlockID(position, 34); //change to furnace.off
        }
        
        setBlockMeta(position, meta);
        if(furnaceOpen && furnacePos.equals(position)) { //FIXME - this causes problems
          /*updateFurnaceMeta();
          processFurnace();
          openFurnace();*/
        }
      }
    }
  }
  
  //destroying a block will splice() it out of the metadata array and (maybe?) break things
  for(var i = 0; i < destroyQueue.length; i++) {
    destroyBlock(destroyQueue[i]);
  }
  
  hungerTimed();
  healthTimed();
}
