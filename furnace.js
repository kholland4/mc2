//TODO: stacks w/ height > 1
var furnaceRecipies = [
  [5, 7], //sand -> glass
  [17, 24], //gold ore -> gold
  [18, 25], //iron ore -> iron
  [10, 1], //cobblestone -> stone
  [59, 60], //clay -> brick
  [62, 63], //raw porkchop -> cooked porkchop
  [65, 66], //raw chicken -> cooked chicken
  [8, 71] //log -> charcoal
];

var furnaceOpen = false;

var furnaceInput = null;
var furnaceFuel = null;
var furnaceOutput = null;

var furnacePos = null;

function openFurnace(position = furnacePos) {
  if(controls.enabled) {
    controls.enabled = false;
    document.exitPointerLock();
  }
  
  furnacePos = position;
  updateFurnaceMeta();
  
  var container = document.getElementById("crafting");
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  
  //w and h are required for the auto-centering
  container.style.width = Math.round(window.innerWidth * 0.66) + "px";
  container.style.height = Math.round(window.innerHeight * 0.75) + "px";
  
  var grid = document.createElement("div");
  grid.style.marginBottom = "40px";
  
  grid.appendChild(genCraftingItem(furnaceInput, -11, -11));
  grid.appendChild(genCraftingItem(furnaceOutput, -201, -201));
  grid.appendChild(document.createElement("br"));
  grid.appendChild(genCraftingItem(furnaceFuel, -12, -12));
  
  container.appendChild(grid);
  
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
  
  furnaceOpen = true;
  
  updateInventoryUI();
}

function closeFurnace() {
  document.getElementById("crafting").style.display = "none";
  furnaceOpen = false;
  
  renderer.domElement.requestPointerLock();
  controls.enabled = true;
}

function updateFurnaceMeta() {
  var furnaceMeta = getBlockMeta(furnacePos);
  if(!("furnace" in furnaceMeta)) {
    furnaceMeta.furnace = true;
    furnaceMeta.fuel = null;
    furnaceMeta.currentFuel = 0;
    furnaceMeta.input = null;
    furnaceMeta.output = null;
    furnaceMeta.targetOutput = null;
    furnaceMeta.timer = FLAG_FURNACE_SMELT_TIME;
    setBlockMeta(furnacePos, furnaceMeta);
  }// else {
    furnaceInput = furnaceMeta.input;
    furnaceFuel = furnaceMeta.fuel;
    furnaceOutput = furnaceMeta.output;
  //}
}

function processFurnace() {
  var furnaceMeta = getBlockMeta(furnacePos);
  furnaceMeta.targetOutput = null;
  if(furnaceInput != null) {
    for(var i = 0; i < furnaceRecipies.length; i++) {
      if(furnaceInput.id == furnaceRecipies[i][0]) {
        var furnaceMeta = getBlockMeta(furnacePos);
        furnaceMeta.targetOutput = furnaceRecipies[i][1];
        
        break;
      }
    }
  }
  
  furnaceMeta.input = furnaceInput;
  
  furnaceMeta.fuel = furnaceFuel;
  /*if(furnaceFuel != null) {
    if(!("fuel" in blocks[furnaceFuel.id][2])) {
      furnaceMeta.fuel = null;
    }
  }*/
    
  furnaceOutput = furnaceMeta.output;
  setBlockMeta(furnacePos, furnaceMeta);
}
