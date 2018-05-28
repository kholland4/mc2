//TODO: better selection of which stack to take from / add to
  //TODO: account for hotbar selector position

var hotbarSelectorPosition = 0;

var inventory = [ {id: 36, stack: 4}, {id: 61, stack: 64} ];
function giveBlock(blockID) {
  //compute max stack height
  var stackHeight = FLAG_DEFAULT_MAX_STACK;
  if("stack" in blocks[blockID][2]) {
    stackHeight = blocks[blockID][2].stack;
  }
  
  //check for existing stacks
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i] != null && inventory[i].id == blockID) {
      if(inventory[i].stack < stackHeight) {
        inventory[i].stack++;
        updateInventoryUI();
        return;
      }
    }
  }
  
  //if none existing (or all are full), fill an empty one or add a new one
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i] == null) {
      inventory[i] = {id: blockID, stack: 1};
      updateInventoryUI();
      return;
    }
  }
  inventory.push({id: blockID, stack: 1});
  
  updateInventoryUI();
}

//TODO: dynamic merge (part merge, part to new or even merge to multiple stacks)
function giveItem(item) {
  item = deepcopy(item);
  
  //compute max stack height
  var stackHeight = FLAG_DEFAULT_MAX_STACK;
  if("stack" in blocks[item.id][2]) {
    stackHeight = blocks[item.id][2].stack;
  }
  
  if(stackHeight > 1) {
    //check for existing stacks
    //FIXME
    for(var i = 0; i < inventory.length; i++) {
      if(inventory[i] != null && inventory[i].id == item.id) {
        if(inventory[i].stack + item.stack <= stackHeight) {
          inventory[i].stack += item.stack;
          updateInventoryUI();
          return;
        }
      }
    }
  }
  
  //if none existing (or all are full), fill an empty one or add a new one
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i] == null) {
      inventory[i] = item;
      updateInventoryUI();
      return;
    }
  }
  inventory.push(item);
  
  updateInventoryUI();
}

function bulkGiveItem(items) {
  for(var i = 0; i < items.length; i++) {
    if(items[i] != null) {
      giveItem(items[i]);
    }
  }
}

function hasBlock(blockID) {
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i] != null && inventory[i].id == blockID) {
      if(inventory[i].stack > 0) {
        return true;
      }
    }
  }
  
  return false;
}

//TODO: take from last stack
function takeBlock(blockID) {
  //check for existing stacks
  for(var i = 0; i < inventory.length; i++) {
    if(inventory[i] != null && inventory[i].id == blockID) {
      if(inventory[i].stack > 0) {
        //remove item
        inventory[i].stack--;
        
        //remove entierly if empty
        if(inventory[i].stack <= 0) {
          //inventory.splice(i, 1);
          inventory[i] = null;
        }
        
        updateInventoryUI();
        return true;
      }
    }
  }
  
  return false;
}

var hotbarItemSize = 60;
var hotbarItemSizeInner = 54; //borders, etc.
var hotbarItemCount = 9;
function updateInventoryUI() {
  var hotbar = document.getElementById("inventory_hotbar");
  hotbar.style.width = (hotbarItemSize * hotbarItemCount) + "px";
  hotbar.style.height = hotbarItemSize + "px";
  
  while(hotbar.firstChild) {
    hotbar.removeChild(hotbar.firstChild);
  }
  
  for(var i = 0; i < hotbarItemCount; i++) {
    var item = document.createElement("div");
    item.style.width = hotbarItemSizeInner + "px";
    item.style.height = hotbarItemSizeInner + "px";
    item.className = "inventory_hotbar_item";
    
    if(i < inventory.length && inventory[i] != null) {
      var icon = document.createElement("img");
      icon.src = blocks[inventory[i].id][2].icon; //FIXME - if icon is missing
      icon.className = "inventory_hotbar_icon";
      
      item.appendChild(icon);
      
      if(inventory[i].stack > 1) {
        var itemCount = document.createElement("div");
        itemCount.innerText = inventory[i].stack;
        itemCount.className = "inventory_hotbar_item_count";
        
        item.appendChild(itemCount);
      }
      
      if("life" in inventory[i]) {
        var life = inventory[i].life;
        var maxLife = blocks[inventory[i].id][2].toolLife; //TODO: if not present
        if(life < maxLife) {
          var itemLife = document.createElement("meter");
          itemLife.className = "inventory_hotbar_item_life";
          itemLife.min = 0;
          itemLife.max = maxLife;
          itemLife.value = life;
          
          item.appendChild(itemLife);
        }
      }
    }
    
    if(hotbarSelectorPosition == i) {
      item.style.border = "3px solid white";
      if(i < inventory.length && inventory[i] != null) {
        blockToPlace = inventory[i].id;
      } else {
        blockToPlace = 0; //air is unplaceable
      }
    }
    
    hotbar.appendChild(item);
  }
}
