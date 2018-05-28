var chestOpen = false;

var chestPos = null;

function openChest(position = chestPos) {
  if(controls.enabled) {
    controls.enabled = false;
    document.exitPointerLock();
  }
  
  chestPos = position;
  var chestMeta = getBlockMeta(chestPos);
  if(!("items" in chestMeta)) {
    chestMeta.items = [];
    setBlockMeta(chestPos, chestMeta);
  }
  
  var container = document.getElementById("crafting");
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  //w and h are required for the auto-centering
  container.style.width = Math.round(window.innerWidth * 0.66) + "px";
  container.style.height = Math.round(window.innerHeight * 0.75) + "px";
  
  var chestGrid = document.createElement("div");
  for(var i = 0; i < 9 * 3; i++) {
    if(i < chestMeta.items.length && chestMeta.items[i] != null) {
      chestGrid.appendChild(genCraftingItem(chestMeta.items[i], i - 150, i - 150));
    } else {
      chestGrid.appendChild(genCraftingItem(null, null, i - 150));
    }
    
    if((i + 1) % 9 == 0) {
      chestGrid.appendChild(document.createElement("br"));
    }
  }
  container.appendChild(chestGrid);
  
  container.appendChild(document.createElement("br"));
  
  var inventoryGrid = document.createElement("div");
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
  
  chestOpen = true;
  
  updateInventoryUI();
}

function closeChest() {
  document.getElementById("crafting").style.display = "none";
  chestOpen = false;
  
  renderer.domElement.requestPointerLock();
  controls.enabled = true;
}
