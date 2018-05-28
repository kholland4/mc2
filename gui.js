var guiOpen = false;

function openGUI() {
  if(controls.enabled) {
    controls.enabled = false;
    document.exitPointerLock();
  }
  
  var gui = document.getElementById("gui");
  gui.style.width = window.innerWidth + "px";
  gui.style.height = window.innerHeight + "px";
  
  while(gui.firstChild) {
    gui.removeChild(gui.firstChild);
  }
  
  //buttons
  gui.appendChild(genGUIButton("Save", saveGame));
  gui.appendChild(genGUIButton("Load", loadGame));
  
  gui.style.display = "block";
  guiOpen = true;
}

function closeGUI() {
  document.getElementById("gui").style.display = "none";
  guiOpen = false;
  
  renderer.domElement.requestPointerLock();
  controls.enabled = true;
}

function genGUIButton(text, action) {
  var button = document.createElement("button");
  button.className = "gui_button";
  button.innerText = text;
  button.onclick = action;
  
  return button;
}
