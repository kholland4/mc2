var deathScreen = false;

function die() {
  if(controls.enabled) {
    controls.enabled = false;
    document.exitPointerLock();
  }
  
  var gui = document.getElementById("death");
  gui.style.width = window.innerWidth + "px";
  gui.style.height = window.innerHeight + "px";
  
  while(gui.firstChild) {
    gui.removeChild(gui.firstChild);
  }
  
  //text
  var text = document.createElement("div");
  text.className = "guiLargeText";
  text.innerText = "You have died.";
  text.style.marginTop = "100px";
  text.style.marginBottom = "35px";
  gui.appendChild(text);
  
  //buttons
  gui.appendChild(genGUIButton("Respawn", function() { respawn(); closeDeathScreen(); }));
  gui.appendChild(genGUIButton("Reload", location.reload));
  
  gui.style.display = "block";
  doAnimate = false;
  deathScreen = true;
  uiOpen = true;
}

function closeDeathScreen() {
  document.getElementById("death").style.display = "none";
  deathScreen = false;
  doAnimate = true;
  
  renderer.domElement.requestPointerLock();
  controls.enabled = true;
}

function respawn() {
  keysPressed = [false, false, false, false, false, false];
  motionDir = new THREE.Vector3(0, 0, 0);
  zSpeed = 0;
  fallStartZ = 0;
  breakTime = 0;
  eatTime = 0;
  jumpTime = 0;
  
  controls.getObject().position.set(0, 90, 0);
  
  inventory = [];
  
  playerSaturation = 5;
  playerHunger = FLAG_MAX_HUNGER;
  playerExhaustion = 0;
  
  playerHealth = FLAG_MAX_HEALTH;
  
  updateInventoryUI();
  updateFoodUI();
  updateHealthUI();
}
