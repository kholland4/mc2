//TODO: more recipies
//TODO: don't let items stay on crafting grid
//TODO: shift (or whatever) to auto-transfer
//TODO: ctrl (or whatever) to take half stack

var craftingRecipies = [
  [{id: 8, stack: 1}, {id: 4, stack: 4}], //1 oak log -> 4 oak planks
  [{id: 4, stack: 1}, null, {id: 4, stack: 1}, null, {id: 11, stack: 4}], //2 oak planks -> 4 sticks
  [{id: 4, stack: 1}, {id: 4, stack: 1}, {id: 4, stack: 1}, {id: 4, stack: 1}, {id: 12, stack: 1}], //4 oak planks -> 1 crafting table
  [{id: 10, stack: 1}, {id: 10, stack: 1}, {id: 10, stack: 1}, {id: 10, stack: 1}, null, {id: 10, stack: 1}, {id: 10, stack: 1}, {id: 10, stack: 1}, {id: 10, stack: 1}, {id: 34, stack: 1}], //furnace
  [{id: 1, stack: 1}, {id: 1, stack: 1}, {id: 1, stack: 1}, {id: 1, stack: 1}, null, {id: 1, stack: 1}, {id: 1, stack: 1}, {id: 1, stack: 1}, {id: 1, stack: 1}, {id: 34, stack: 1}], //furnace
  [{id: 21, stack: 1}, null, {id: 11, stack: 1}, null, {id: 36, stack: 4}], //torch
  [{id: 71, stack: 1}, null, {id: 11, stack: 1}, null, {id: 36, stack: 4}], //torch
  [{id: 37, stack: 1}, {id: 38, stack: 1}], //sugarcane -> sugar
  [null, null, null, {id: 37, stack: 1}, {id: 37, stack: 1}, {id: 37, stack: 1}, null, null, null, {id: 39, stack: 3}], //paper
  [{id: 4, stack: 1}, {id: 4, stack: 1}, {id: 4, stack: 1}, {id: 4, stack: 1}, null, {id: 4, stack: 1}, {id: 4, stack: 1}, {id: 4, stack: 1}, {id: 4, stack: 1}, {id: 40, stack: 1}], //chest
  
  //--PICKAXES---
  [{id: 4, stack: 1}, {id: 4, stack: 1}, {id: 4, stack: 1}, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 28, stack: 1, life: 60}], //wood pickaxe
  [{id: 10, stack: 1}, {id: 10, stack: 1}, {id: 10, stack: 1}, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 29, stack: 1, life: 132}], //stone pickaxe
  [{id: 1, stack: 1}, {id: 1, stack: 1}, {id: 1, stack: 1}, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 29, stack: 1, life: 132}], //stone pickaxe
  [{id: 25, stack: 1}, {id: 25, stack: 1}, {id: 25, stack: 1}, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 30, stack: 1, life: 251}], //iron pickaxe
  [{id: 22, stack: 1}, {id: 22, stack: 1}, {id: 22, stack: 1}, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 31, stack: 1, life: 1562}], //diamond pickaxe
  [{id: 24, stack: 1}, {id: 24, stack: 1}, {id: 24, stack: 1}, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 32, stack: 1, life: 33}], //gold pickaxe
  
  //---SHOVELS---
  [null, {id: 4, stack: 1}, null, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 41, stack: 1, life: 60}], //wood shovel
  [null, {id: 10, stack: 1}, null, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 42, stack: 1, life: 132}], //stone shovel
  [null, {id: 1, stack: 1}, null, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 42, stack: 1, life: 132}], //stone shovel
  [null, {id: 25, stack: 1}, null, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 43, stack: 1, life: 251}], //iron shovel
  [null, {id: 22, stack: 1}, null, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 44, stack: 1, life: 1562}], //diamond shovel
  [null, {id: 24, stack: 1}, null, null, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 45, stack: 1, life: 33}], //gold shovel
  
  //---AXES---
  [{id: 4, stack: 1}, {id: 4, stack: 1}, null, {id: 4, stack: 1}, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 46, stack: 1, life: 60}], //wood axe
  [{id: 10, stack: 1}, {id: 10, stack: 1}, null, {id: 10, stack: 1}, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 47, stack: 1, life: 132}], //stone axe
  [{id: 1, stack: 1}, {id: 1, stack: 1}, null, {id: 1, stack: 1}, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 47, stack: 1, life: 132}], //stone axe
  [{id: 25, stack: 1}, {id: 25, stack: 1}, null, {id: 25, stack: 1}, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 48, stack: 1, life: 251}], //iron axe
  [{id: 22, stack: 1}, {id: 22, stack: 1}, null, {id: 22, stack: 1}, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 49, stack: 1, life: 1562}], //diamond axe
  [{id: 24, stack: 1}, {id: 24, stack: 1}, null, {id: 24, stack: 1}, {id: 11, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 50, stack: 1, life: 33}], //gold axe
  
  //---SWORDS---
  [null, {id: 4, stack: 1}, null, null, {id: 4, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 51, stack: 1, life: 60}], //wood sword
  [null, {id: 10, stack: 1}, null, null, {id: 10, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 52, stack: 1, life: 132}], //stone sword
  [null, {id: 1, stack: 1}, null, null, {id: 1, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 52, stack: 1, life: 132}], //stone sword
  [null, {id: 25, stack: 1}, null, null, {id: 25, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 53, stack: 1, life: 251}], //iron sword
  [null, {id: 22, stack: 1}, null, null, {id: 22, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 54, stack: 1, life: 1562}], //diamond sword
  [null, {id: 24, stack: 1}, null, null, {id: 24, stack: 1}, null, null, {id: 11, stack: 1}, null, {id: 55, stack: 1, life: 33}], //gold sword
  
  [{id: 60, stack: 1}, {id: 60, stack: 1}, {id: 60, stack: 1}, {id: 60, stack: 1}, {id: 56, stack: 1}], //bricks -> brick block
  [{id: 59, stack: 1}, {id: 59, stack: 1}, {id: 59, stack: 1}, {id: 59, stack: 1}, {id: 58, stack: 1}] //clay -> clay block
];

var craftingGridContent = [null, null, null, null, null, null, null, null, null];
var craftingOutput = null;
var inventoryOpen = false;
var inventoryGridSize = 9; //only 2x2 and 3x3 are currently fully supported
var inventoryOther = [null, null, null, null, [2, 1], null, null, null, null, [3, 5]];
var inventoryItemInHand = null;

function openInventory(gridSize = inventoryGridSize) {
  if(controls.enabled) {
    controls.enabled = false;
    document.exitPointerLock();
  }
  
  inventoryGridSize = gridSize;
  
  var container = document.getElementById("crafting");
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  //w and h are required for the auto-centering
  container.style.width = Math.round(window.innerWidth * 0.66) + "px";
  container.style.height = Math.round(window.innerHeight * 0.75) + "px";
  
  var grid = document.createElement("div");
  //grid.style.width = "198px"; //FIXME - dynamic
  //grid.style.height = "198px";
  grid.style.marginBottom = "40px";
  for(var i = 0; i < inventoryGridSize; i++) {
    grid.appendChild(genCraftingItem(craftingGridContent[i], i - 10, i - 10));
    
    if(i == inventoryOther[inventoryGridSize][1]) {
      var item = genCraftingItem(craftingOutput, -200, -200);
      item.marginLeft = "80px";
      grid.appendChild(item);
    }
    
    if((i + 1) % inventoryOther[inventoryGridSize][0] == 0) {
      grid.appendChild(document.createElement("br"));
    }
  }
  container.appendChild(grid);
  
  var inventoryGrid = document.createElement("div");
  //inventoryGrid.style.width = "594px"; //FIXME - dynamic
  //inventoryGrid.style.height = "264px";
  for(var i = 0; i < 9 * 4; i++) {
    if(i < inventory.length && inventory[i] != null) {
      inventoryGrid.appendChild(genCraftingItem(inventory[i], i, i));
    } else {
      inventoryGrid.appendChild(genCraftingItem(null, null, i));
    }
    
    if((i + 1) % 9 == 0) {
      inventoryGrid.appendChild(document.createElement("br"));
    }
  }
  container.appendChild(inventoryGrid);
  
  container.style.display = "block";
  
  inventoryOpen = true;
  
  updateInventoryUI();
}

function closeInventory() {
  document.getElementById("crafting").style.display = "none";
  inventoryOpen = false;
  
  renderer.domElement.requestPointerLock();
  controls.enabled = true;
}

function genCraftingItem(data, itemIndex, boxIndex) {
  var itemOuter = document.createElement("div");
  itemOuter.className = "crafting_item_box_outer";
  itemOuter.dataset.id = boxIndex;
  itemOuter.onclick = function(e) {
    craftingClickItem(parseInt(this.dataset.id), e.which);
  };
  itemOuter.oncontextmenu = function(e) {
    e.preventDefault();
    craftingClickItem(parseInt(this.dataset.id), 3);
    return false;
  };
  
  if(data != null) {
    var item = document.createElement("div");
    item.className = "crafting_item_box_inner";
    
    var icon = document.createElement("img");
    icon.src = blocks[data.id][2].icon; //FIXME - if icon is missing
    icon.className = "crafting_icon";
    
    item.appendChild(icon);
    
    if(data.stack > 1) {
      var itemCount = document.createElement("div");
      itemCount.innerText = data.stack;
      itemCount.className = "crafting_item_count";
      
      item.appendChild(itemCount);
    }
      
    if("life" in data) {
      var life = data.life;
      var maxLife = blocks[data.id][2].toolLife; //TODO: if not present
      if(life < maxLife) {
        var itemLife = document.createElement("meter");
        itemLife.className = "inventory_hotbar_item_life";
        itemLife.min = 0;
        itemLife.max = maxLife;
        itemLife.value = life;
        
        item.appendChild(itemLife);
      }
    }
    
    itemOuter.appendChild(item);
  }
  
  return itemOuter;
}

function craftingCanMerge(itemA, itemB) {
  if(itemA.id == itemB.id) {
    var maxStack = FLAG_DEFAULT_MAX_STACK;
    if("stack" in blocks[itemA.id][2]) {
      maxStack = blocks[itemA.id][2].stack;
    }
    if(itemA.stack + itemB.stack <= maxStack) {
      return {id: itemA.id, stack: itemA.stack + itemB.stack};
    } else {
      //TODO
    }
  }
  
  return null;
}

//Number space allocation: -201 is furnace output, -200 is crafting output, -150 to -50 is chest, -12 is furnace fuel, -11 is furnace input, -10 thru -1 is grid, 0+ is inventory
function craftingGetItem(boxID) {
  if(boxID == -201) {
    return furnaceOutput;
  } else if(boxID == -12) {
    return furnaceFuel;
  } else if(boxID == -11) {
    return furnaceInput;
  } else if(boxID == -200) {
    return craftingOutput;
  } else if(boxID >= -150 && boxID < -50) {
    boxID += 150;
    var chestMeta = getBlockMeta(chestPos);
    if(boxID < chestMeta.items.length) {
      return chestMeta.items[boxID];
    } else {
      return null;
    }
  } else if(boxID < 0) {
    boxID += 10;
    return craftingGridContent[boxID];
  } else {
    if(boxID < inventory.length) {
      return inventory[boxID];
    } else {
      return null;
    }
  }
}

function craftingSetItem(boxID, item) {
  if(boxID == -201) {
    furnaceOutput = item;
    var furnaceMeta = getBlockMeta(furnacePos);
    furnaceMeta.output = furnaceOutput;
    setBlockMeta(furnacePos, furnaceMeta);
  } else if(boxID == -12) {
    furnaceFuel = item;
  } else if(boxID == -11) {
    furnaceInput = item;
  } else if(boxID == -200) {
    if(item == null) {
      craft();
    }/* else if(item.id == craftingOutput.id) { //sanity check
      sDiff = craftingOutput.stack - item.stack;
      //TODO
    }*/
  } else if(boxID >= -150 && boxID < -50) {
    boxID += 150;
    var chestMeta = getBlockMeta(chestPos);
    while(boxID >= chestMeta.items.length) {
      chestMeta.items.push(null);
    }
    chestMeta.items[boxID] = item;
    setBlockMeta(chestPos, chestMeta);
  } else if(boxID < 0) {
    boxID += 10;
    craftingGridContent[boxID] = item;
  } else {
    while(boxID >= inventory.length) {
      inventory.push(null);
    }
    
    inventory[boxID] = item;
  }
}

function craftingClickItem(destID, button) {
  //TODO: shift on crafting output
  //TODO: shift+click for instant transfer
  
  var itemDest = craftingGetItem(destID);
  if(itemDest == null && inventoryItemInHand == null) {
    return;
  }
    
  if(inventoryItemInHand != null && itemDest == null) {
    if(destID == -200 || destID == -201) {
      return;
    }
    //craftingSetItem(destID, inventoryItemInHand);
    //inventoryItemInHand = null;
    if(button == 1 || inventoryItemInHand.stack == 1) {
      craftingSetItem(destID, inventoryItemInHand);
      inventoryItemInHand = null;
    } else if(button == 3) {
      itemDest = deepcopy(inventoryItemInHand);
      itemDest.stack = 1;
      inventoryItemInHand.stack--;
      craftingSetItem(destID, itemDest);
    }
  } else if(inventoryItemInHand == null && itemDest != null) {
    if(button == 1) {
      inventoryItemInHand = itemDest;
      craftingSetItem(destID, null);
    } else if(button == 3) {
      //TODO: split stack
    }
  } else if(destID != -200 && destID != -201) {
    if(inventoryItemInHand.id == itemDest.id) {
      //merge
      if(button == 1) {
        var merged = craftingCanMerge(inventoryItemInHand, itemDest);
        if(merged != null) {
          craftingSetItem(destID, merged);
          inventoryItemInHand = null;
        } else {
          //TODO
        }
      } else if(button == 3) {
        var maxStack = FLAG_DEFAULT_MAX_STACK;
        if("stack" in blocks[itemDest.id][2]) {
          maxStack = blocks[itemDest.id][2].stack;
        }
        
        if(itemDest.stack + 1 <= maxStack) {
          inventoryItemInHand.stack--;
          if(inventoryItemInHand.stack == 0) {
            inventoryItemInHand = null;
          }
          itemDest.stack++;
          craftingSetItem(destID, itemDest);
        } else {
          //TODO
        }
      }
    } else {
      if(button == 1) {
        //can't merge - swap
        craftingSetItem(destID, inventoryItemInHand);
        inventoryItemInHand = itemDest;
      }
    }
  } else if(destID == -200 || destID == -201) {
    if(inventoryItemInHand.id == itemDest.id) {
      var merged = craftingCanMerge(inventoryItemInHand, itemDest);
      if(merged != null) {
        craftingSetItem(destID, null);
        inventoryItemInHand = merged;
      } else {
        //TODO
      }
    }
  }
  
  if(inventoryOpen) {
    processCraftingGrid();
    openInventory();
  } else if(furnaceOpen) {
    processFurnace();
    openFurnace();
  } else if(chestOpen) {
    openChest();
  }
  showInventoryItemInHand();
  
  return;
}

function processCraftingGrid() {
  var grid = craftingGridContent;
  for(var i = 0; i < craftingRecipies.length; i++) {
    var ok = true;
    var recipieSize = Math.sqrt(craftingRecipies[i].length - 1); //should always be an int
    var gridSize = Math.sqrt(inventoryGridSize); //should always be an int
    if(recipieSize <= gridSize) {
      for(var x = 0; x < recipieSize; x++) {
        for(var y = 0; y < recipieSize; y++) {
          var gridIndex = (y * gridSize) + x;
          var recipieIndex = (y * recipieSize) + x;
          if(grid[gridIndex] == null || craftingRecipies[i][recipieIndex] == null) {
            if(grid[gridIndex] != craftingRecipies[i][recipieIndex]) {
              ok = false;
              break;
            }
          } else if(grid[gridIndex].id != craftingRecipies[i][recipieIndex].id) {
            ok = false;
            break;
          } else if(grid[gridIndex].stack < craftingRecipies[i][recipieIndex].stack) {
            ok = false;
            break;
          }
        }
      }
    } else {
      ok = false;
    }
    
    if(ok) {
      var n = craftingRecipies[i].length - 1;
      /*craftingOutput = {id: craftingRecipies[i][n].id, stack: craftingRecipies[i][n].stack}; //deep copy
      if("life" in craftingRecipies[i][n]) {
        craftingOutput.life = craftingRecipies[i][n].life;
      }*/
      craftingOutput = deepcopy(craftingRecipies[i][n]);
      return;
    }
  }
  craftingOutput = null;
}

function craft() {
  var grid = craftingGridContent;
  for(var i = 0; i < craftingRecipies.length; i++) {
    var ok = true;
    
    var recipieSize = Math.sqrt(craftingRecipies[i].length - 1); //should always be an int
    var gridSize = Math.sqrt(inventoryGridSize); //should always be an int
    
    if(recipieSize <= gridSize) {
      for(var x = 0; x < recipieSize; x++) {
        for(var y = 0; y < recipieSize; y++) {
          var gridIndex = (y * gridSize) + x;
          var recipieIndex = (y * recipieSize) + x;
          
          if(grid[gridIndex] == null || craftingRecipies[i][recipieIndex] == null) {
            if(grid[gridIndex] != craftingRecipies[i][recipieIndex]) {
              ok = false;
              break;
            }
          } else if(grid[gridIndex].id != craftingRecipies[i][recipieIndex].id) {
            ok = false;
            break;
          } else if(grid[gridIndex].stack < craftingRecipies[i][recipieIndex].stack) {
            ok = false;
            break;
          }
        }
      }
    } else {
      ok = false;
    }
    
    if(ok) {
      for(var x = 0; x < recipieSize; x++) {
        for(var y = 0; y < recipieSize; y++) {
          var gridIndex = (y * gridSize) + x;
          var recipieIndex = (y * recipieSize) + x;
          
          if(grid[gridIndex] != null) {
            grid[gridIndex].stack -= craftingRecipies[i][recipieIndex].stack;
            if(grid[gridIndex].stack <= 0) {
              grid[gridIndex] = null;
            }
          }
        }
      }
      return;
    }
  }
}

var mousePos = new THREE.Vector2(0, 0);
function showInventoryItemInHand(event = {clientX: mousePos.x, clientY: mousePos.y}) {
  mousePos.x = event.clientX;
  mousePos.y = event.clientY;
  
  while(document.getElementById("hand").firstChild) {
    document.getElementById("hand").removeChild(document.getElementById("hand").firstChild);
  }
  
  if(!inventoryOpen && !furnaceOpen && !chestOpen) {
    return;
  }
  
  if(inventoryItemInHand == null) {
    return;
  }
  
  var item = document.createElement("div");
  item.className = "crafting_item_box_inner";
  
  var icon = document.createElement("img");
  icon.src = blocks[inventoryItemInHand.id][2].icon; //FIXME - if icon is missing
  icon.className = "crafting_icon";
  
  item.appendChild(icon);
  
  if(inventoryItemInHand.stack > 1) {
    var itemCount = document.createElement("div");
    itemCount.innerText = inventoryItemInHand.stack;
    itemCount.className = "crafting_item_count";
    
    item.appendChild(itemCount);
  }
      
  if("life" in inventoryItemInHand) {
    var life = inventoryItemInHand.life;
    var maxLife = blocks[inventoryItemInHand.id][2].toolLife; //TODO: if not present
    if(life < maxLife) {
      var itemLife = document.createElement("meter");
      itemLife.className = "inventory_hotbar_item_life";
      itemLife.min = 0;
      itemLife.max = maxLife;
      itemLife.value = life;
      
      item.appendChild(itemLife);
    }
  }
  
  document.getElementById("hand").appendChild(item);
  document.getElementById("hand").style.left = event.clientX + "px";
  document.getElementById("hand").style.top = event.clientY + "px";
}
