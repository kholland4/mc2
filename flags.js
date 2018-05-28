var FLAG_COMPAT_VER = 1;

var FLAG_CHUNK_DISTANCE = 8; //load chunks up to n units away from player
var FLAG_CHUNK_LOAD_SPEED = 1; //load n chunks per frame
var FLAG_CHUNK_UNLOAD_SPEED = 1; //unload n chunks per frame
var FLAG_SKIP_BOTTOM = true; //don't render the bottom faces of the z = 0 layer (for efficiency)

var FLAG_BASE_HEIGHT = 2;
var FLAG_WATER_LEVEL = 8;
var FLAG_WATER_MARGIN = 2;

var FLAG_RAYCAST_FREQ = 2; //raycast every 1 in n frames
var FLAG_SPEED_MULTIPLIER = 1; //multiplier for player speed

var FLAG_SUGARCANE_GROW_TIME = 1920; //ticks
var FLAG_FURNACE_SMELT_TIME = 40; //ticks

var FLAG_DEFAULT_MAX_STACK = 64;

var FLAG_MAX_JUMP_TIME = 150; //ms
var FLAG_INFINITE_JUMP = false;
var FLAG_ONE_TAP_JUMP = false;
var FLAG_REPEAT_JUMP = true;

var FLAG_MAX_HUNGER = 20;
var FLAG_MAX_HEALTH = 20;

if(FLAG_COMPAT_VER >= 2) {
  FLAG_BASE_HEIGHT = 20;
  FLAG_WATER_LEVEL = 26;
}
