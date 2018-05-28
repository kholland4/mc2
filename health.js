var playerHealth = FLAG_MAX_HEALTH;
var playerHealthQ = 0;

function giveHealth(delta) {
  //playerHealthQ += delta;
  playerHealth = Math.min(playerHealth + delta, FLAG_MAX_HEALTH);
  if(playerHealth <= 0) {
    playerHealth = 0;
    die();
  }
  updateHealthUI();
}

function healthTimed() {
  
}

function updateHealthUI() {
  var health = document.getElementById("health");
  while(health.firstChild) {
    health.removeChild(health.firstChild);
  }
  
  for(var i = 0; i < FLAG_MAX_HEALTH; i += 2) {
    var icon = "";
    
    if(playerHealth <= i) {
      icon = "heart_empty.png";
    } else if(playerHealth <= i + 1) {
      icon = "heart_half.png";
    } else if(playerHealth >= i + 2) {
      icon = "heart_full.png";
    }
    
    var img = document.createElement("img");
    img.className = "health_icon";
    img.src = icon;
    
    health.appendChild(img);
  }
}
