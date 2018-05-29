var playerSaturation = FLAG_MAX_HUNGER; //was 5
var playerHunger = FLAG_MAX_HUNGER;
var playerExhaustion = 0; //TODO: use this - see https://minecraft.gamepedia.com/Hunger

var playerHungerQ = 0;
var playerSaturationQ = 0;

function hungerTimed() {
  if(tickCount % 8 == 0) {
    playerExhaustion += 0.1;
  }
  
  if(playerExhaustion >= 4) {
    playerExhaustion -= 4;
    
    playerSaturation--;
    if(playerSaturation <= 0) {
      playerSaturation = 0;
      playerHunger--;
      //TODO: bounds checking, death, etc.
    }
    
    updateFoodUI();
  }
  
  //refilling hunger bar
  /*if(playerHungerQ > 0 || playerSaturationQ > 0) {
    if(playerHungerQ > 0) {
      playerHungerQ--;
      playerHunger = Math.min(playerHunger + 1, FLAG_MAX_HUNGER);
    }
    
    if(playerSaturationQ > 0) {
      playerSaturationQ--;
      playerSaturationQ = Math.min(playerSaturationQ + 1, playerHunger);
    }
    
    updateFoodUI();
  }*/
  
  //regeneration
  if(playerHunger == FLAG_MAX_HUNGER && playerSaturation > 0 && playerHealth < FLAG_MAX_HEALTH) {
    if(tickCount % 2 == 0) {
      giveHealth(1);
      playerExhaustion += 6;
    }
  } else if(playerHunger >= FLAG_MAX_HUNGER - 2 && playerSaturation == 0 && playerHealth < FLAG_MAX_HEALTH) {
    if(tickCount % 16 == 0) {
      giveHealth(1);
      playerExhaustion += 6;
    }
  } else if(playerHunger == 0) {
    if(tickCount % 16 == 0) {
      giveHealth(-1);
    }
  }
}

function eatBlock(id) {
  if("food" in blocks[id][2]) {
    playerHunger = Math.min(playerHunger + blocks[id][2].food, FLAG_MAX_HUNGER);
    //playerHungerQ += blocks[id][2].food;
  }
  
  if("foodSat" in blocks[id][2]) {
    playerSaturation = Math.min(playerSaturation + blocks[id][2].foodSat, playerHunger);
    //playerSaturationQ += blocks[id][2].foodSat;
  }
  
  updateFoodUI();
}

function updateFoodUI() {
  var hunger = document.getElementById("hunger");
  while(hunger.firstChild) {
    hunger.removeChild(hunger.firstChild);
  }
  
  for(var i = 0; i < FLAG_MAX_HUNGER; i += 2) {
    var icon = "";
    
    if(playerHunger <= i) {
      icon = "hunger_empty.png";
    } else if(playerHunger <= i + 1) {
      icon = "hunger_half.png";
    } else if(playerHunger >= i + 2) {
      icon = "hunger_full.png";
    }
    
    var img = document.createElement("img");
    img.className = "hunger_icon";
    img.src = icon;
    
    hunger.appendChild(img);
  }
}
