//TODO: fix reqToolLevels for ores
//TODO: more tools
//TODO: saplings; dirt -> grass
  //TODO: probability-based item dropping: coal/gem ores, tree leaves, etc.
//TODO: TNT
//TODO: fully featured chests
//TODO: buckets (using onPlace and inventory manipulation)
//TODO: consumables
//TODO: signs
//TODO: growable food
//TODO: sticks (+other stuff?) as fuel

var blockFunctions = {
  flowerOnPlace: function(position) {
    var nearby = new THREE.Vector3(position.x, position.y - 1, position.z);
    if(nearby.y < 0) {
      return false;
    }
    var nBlockID = getBlockID(nearby);
    if(nBlockID == 2 || nBlockID == 3) { //grass or dirt
      return true;
    } else {
      return false;
    }
  },
  sugarcaneOnPlace: function(position) {
    var nearby = new THREE.Vector3(position.x, position.y - 1, position.z);
    if(nearby.y < 0) {
      return false;
    }
    var nBlockID = getBlockID(nearby);
    if(nBlockID == 2 || nBlockID == 3 || nBlockID == 5) { //grass, dirt, or sand
      if(!blockFunctions.sugarcaneCheckWater(position)) {
        return false;
      }
      
      setBlockMeta(position, {startTime: tickCount, growTime: tickCount + FLAG_SUGARCANE_GROW_TIME, height: 1});
      return true;
    } else {
      return false;
    }
  },
  sugarcaneOnDestroy: function(position) {
    var above = new THREE.Vector3(position.x, position.y + 1, position.z);
    if(above.y < chunkSize.y) {
      if(getBlockID(above) == 37) {
        return true;
      }
    }
    
    var below = new THREE.Vector3(position.x, position.y - 1, position.z);
    if(below.y < 0) {
      return true;
    }
    
    var heightDelta = -1;
    do {
      if(getBlockID(below) == 37) {
        var meta = getBlockMeta(position);
        meta.height += heightDelta;
        if(meta.height < 1) { meta.height = 1 }; //this should never happen
        meta.growTime = tickCount + FLAG_SUGARCANE_GROW_TIME;
        setBlockMeta(below, meta); //transfer metadata
        return true;
      }
      below = new THREE.Vector3(below.x, below.y - 1, below.z);
      heightDelta--;
    } while(below.y >= 0 && (getBlockID(below) == 0 || getBlockID(below) == 37))
    
    return true;
  },
  sugarcaneCheckWater: function(position) {
    var below = new THREE.Vector3(position.x, position.y - 1, position.z);
    if(below.y < 0) {
      return false;
    }
    
    for(var i = 2; i < 6; i++) {
      var pos = new THREE.Vector3(below.x + faces[i][0], below.y + faces[i][1], below.z + faces[i][2]);
      if(getBlockID(pos) == 6) {
        return true;
      }
    }
    
    return false;
  },
  chestGenMesh: function(position, facing) {
    //TODO: latch
    //TODO: proper positions on texture? (for other texture packs)
    var material = new THREE.MeshLambertMaterial({map: blockTextures.chest});
    var geometry = new THREE.BufferGeometry();
    //7/16 = 0.4375
    //6/16 = 0.375
    //3/16 = 0.1875
    //1/16 = 0.0625
    var vertices = [
      //top
      -0.4375, 0.375, -0.4375,
      0.4375, 0.375, -0.4375,
      -0.4375, 0.375, 0.4375,
      0.4375, 0.375, -0.4375,
      0.4375, 0.375, 0.4375,
      -0.4375, 0.375, 0.4375,
      
      //bottom
      -0.4375, -0.5, -0.4375,
      0.4375, -0.5, -0.4375,
      -0.4375, -0.5, 0.4375,
      0.4375, -0.5, -0.4375,
      0.4375, -0.5, 0.4375,
      -0.4375, -0.5, 0.4375,
      
      //left upper
      -0.4375, 0.375, -0.4375,
      -0.4375, 0.375, 0.4375,
      -0.4375, 0.0625, 0.4375,
      -0.4375, 0.375, -0.4375,
      -0.4375, 0.0625, -0.4375,
      -0.4375, 0.0625, 0.4375,
      
      //left lower
      -0.4375, 0.0625, -0.4375,
      -0.4375, 0.0625, 0.4375,
      -0.4375, -0.5, 0.4375,
      -0.4375, 0.0625, -0.4375,
      -0.4375, -0.5, -0.4375,
      -0.4375, -0.5, 0.4375,
      
      //right upper
      0.4375, 0.375, -0.4375,
      0.4375, 0.375, 0.4375,
      0.4375, 0.0625, 0.4375,
      0.4375, 0.375, -0.4375,
      0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, 0.4375,
      
      //right lower
      0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, 0.4375,
      0.4375, -0.5, 0.4375,
      0.4375, 0.0625, -0.4375,
      0.4375, -0.5, -0.4375,
      0.4375, -0.5, 0.4375,
      
      //front upper
      -0.4375, 0.375, 0.4375,
      0.4375, 0.375, 0.4375,
      0.4375, 0.0625, 0.4375,
      -0.4375, 0.375, 0.4375,
      -0.4375, 0.0625, 0.4375,
      0.4375, 0.0625, 0.4375,
      
      //front lower
      -0.4375, 0.0625, 0.4375,
      0.4375, 0.0625, 0.4375,
      0.4375, -0.5, 0.4375,
      -0.4375, 0.0625, 0.4375,
      -0.4375, -0.5, 0.4375,
      0.4375, -0.5, 0.4375,
      
      //back upper
      -0.4375, 0.375, -0.4375,
      0.4375, 0.375, -0.4375,
      0.4375, 0.0625, -0.4375,
      -0.4375, 0.375, -0.4375,
      -0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, -0.4375,
      
      //back lower
      -0.4375, 0.0625, -0.4375,
      0.4375, 0.0625, -0.4375,
      0.4375, -0.5, -0.4375,
      -0.4375, 0.0625, -0.4375,
      -0.4375, -0.5, -0.4375,
      0.4375, -0.5, -0.4375,
      
      //latch front - (7, 5) relative to upper left (-1, -3) relative to center
      -0.0625, 0.1875, 0.5,
      0.0625, 0.1875, 0.5,
      0.0625, -0.0625, 0.5,
      -0.0625, 0.1875, 0.5,
      -0.0625, -0.0625, 0.5,
      0.0625, -0.0625, 0.5,
      
      //latch top
      -0.0625, 0.1875, 0.4375,
      0.0625, 0.1875, 0.4375,
      0.0625, 0.1875, 0.5,
      -0.0625, 0.1875, 0.4375,
      -0.0625, 0.1875, 0.5,
      0.0625, 0.1875, 0.5,
      
      //latch bottom
      -0.0625, -0.0625, 0.4375,
      0.0625, -0.0625, 0.4375,
      0.0625, -0.0625, 0.5,
      -0.0625, -0.0625, 0.4375,
      -0.0625, -0.0625, 0.5,
      0.0625, -0.0625, 0.5,
      
      //latch left
      -0.0625, 0.1875, 0.4375,
      -0.0625, 0.1875, 0.5,
      -0.0625, -0.0625, 0.5,
      -0.0625, 0.1875, 0.4375,
      -0.0625, -0.0625, 0.4375,
      -0.0625, -0.0625, 0.5,
      
      //latch right
      0.0625, 0.1875, 0.4375,
      0.0625, 0.1875, 0.5,
      0.0625, -0.0625, 0.5,
      0.0625, 0.1875, 0.4375,
      0.0625, -0.0625, 0.4375,
      0.0625, -0.0625, 0.5
    ];
    var uvs = [
      //top
      14/64, 1 - 0,
      28/64, 1 - 0,
      14/64, 1 - 14/64,
      28/64, 1 - 0,
      28/64, 1 - 14/64,
      14/64, 1 - 14/64,
      
      //bottom
      14/64, 1 - 0,
      28/64, 1 - 0,
      14/64, 1 - 14/64,
      28/64, 1 - 0,
      28/64, 1 - 14/64,
      14/64, 1 - 14/64,
      
      //left upper
      0, 1 - 14/64,
      14/64, 1 - 14/64,
      14/64, 1 - 19/64,
      0, 1 - 14/64,
      0, 1 - 19/64,
      14/64, 1 - 19/64,
      
      //left lower
      0, 1 - 33/64,
      14/64, 1 - 33/64,
      14/64, 1 - 43/64,
      0, 1 - 33/64,
      0, 1 - 43/64,
      14/64, 1 - 43/64,
      
      //right upper
      0, 1 - 14/64,
      14/64, 1 - 14/64,
      14/64, 1 - 19/64,
      0, 1 - 14/64,
      0, 1 - 19/64,
      14/64, 1 - 19/64,
      
      //right lower
      0, 1 - 33/64,
      14/64, 1 - 33/64,
      14/64, 1 - 43/64,
      0, 1 - 33/64,
      0, 1 - 43/64,
      14/64, 1 - 43/64,
      
      //front upper
      14/64, 1 - 14/64,
      28/64, 1 - 14/64,
      28/64, 1 - 19/64,
      14/64, 1 - 14/64,
      14/64, 1 - 19/64,
      28/64, 1 - 19/64,
      
      //front lower
      14/64, 1 - 33/64,
      28/64, 1 - 33/64,
      28/64, 1 - 43/64,
      14/64, 1 - 33/64,
      14/64, 1 - 43/64,
      28/64, 1 - 43/64,
      
      //back upper
      0, 1 - 14/64,
      14/64, 1 - 14/64,
      14/64, 1 - 19/64,
      0, 1 - 14/64,
      0, 1 - 19/64,
      14/64, 1 - 19/64,
      
      //back lower
      0, 1 - 33/64,
      14/64, 1 - 33/64,
      14/64, 1 - 43/64,
      0, 1 - 33/64,
      0, 1 - 43/64,
      14/64, 1 - 43/64,
      
      //latch front
      1/64, 1 - 1/64,
      3/64, 1 - 1/64,
      3/64, 1 - 5/64,
      1/64, 1 - 1/64,
      1/64, 1 - 5/64,
      3/64, 1 - 5/64,
      
      //latch top
      1/64, 1 - 0,
      3/64, 1 - 0,
      3/64, 1 - 1/64,
      1/64, 1 - 0,
      1/64, 1 - 1/64,
      3/64, 1 - 1/64,
      
      //latch bottom
      1/64, 1 - 0,
      3/64, 1 - 0,
      3/64, 1 - 1/64,
      1/64, 1 - 0,
      1/64, 1 - 1/64,
      3/64, 1 - 1/64,
      
      //latch left
      0, 1 - 1/64,
      1/64, 1 - 1/64,
      1/64, 1 - 5/64,
      0, 1 - 1/64,
      0, 1 - 5/64,
      1/64, 1 - 5/64,
      
      //latch right
      0, 1 - 1/64,
      1/64, 1 - 1/64,
      1/64, 1 - 5/64,
      0, 1 - 1/64,
      0, 1 - 5/64,
      1/64, 1 - 5/64
    ];
    
    geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    
    geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    
    var mesh = new THREE.Mesh(geometry, material);
    mesh.material.side = THREE.DoubleSide; //FIXME
    
    if(facing != null) {
      switch(facing) {
        case 2: //left
          mesh.rotateY(Math.PI * 1.5);
          break;
        case 3: //right
          mesh.rotateY(Math.PI * 0.5);
          break;
        case 4: //front
          break;
        case 5: //back
          mesh.rotateY(Math.PI);
          break;
      }
    }
    
    return mesh;
  },
  torchGenMesh: function(position, facing) {
    var material = new THREE.MeshLambertMaterial({map: blockTextures.torch});
    var geometry = new THREE.BufferGeometry();
    
    //2x10
    //2/16 = 0.125
    //1/16 = 0.0625
    var vertices = [
      //front
      -0.0625, 0.125, 0.0625,
      0.0625, 0.125, 0.0625,
      0.0625, -0.5, 0.0625,
      -0.0625, 0.125, 0.0625,
      -0.0625, -0.5, 0.0625,
      0.0625, -0.5, 0.0625,
      
      
      //back
      -0.0625, 0.125, -0.0625,
      0.0625, 0.125, -0.0625,
      0.0625, -0.5, -0.0625,
      -0.0625, 0.125, -0.0625,
      -0.0625, -0.5, -0.0625,
      0.0625, -0.5, -0.0625,
      
      //left
      -0.0625, 0.125, -0.0625,
      -0.0625, 0.125, 0.0625,
      -0.0625, -0.5, 0.0625,
      -0.0625, 0.125, -0.0625,
      -0.0625, -0.5, -0.0625,
      -0.0625, -0.5, 0.0625,
      
      //right
      0.0625, 0.125, -0.0625,
      0.0625, 0.125, 0.0625,
      0.0625, -0.5, 0.0625,
      0.0625, 0.125, -0.0625,
      0.0625, -0.5, -0.0625,
      0.0625, -0.5, 0.0625,
      
      //top
      -0.0625, 0.125, -0.0625,
      0.0625, 0.125, -0.0625,
      0.0625, 0.125, 0.0625,
      -0.0625, 0.125, -0.0625,
      -0.0625, 0.125, 0.0625,
      0.0625, 0.125, 0.0625
      //TODO: bottom
    ];
    var uvs = [
      //front
      7/16, 10/16,
      9/16, 10/16,
      9/16, 0,
      7/16, 10/16,
      7/16, 0,
      9/16, 0,
      
      //back
      9/16, 10/16,
      7/16, 10/16,
      7/16, 0,
      9/16, 10/16,
      9/16, 0,
      7/16, 0,
      
      //left
      7/16, 10/16,
      9/16, 10/16,
      9/16, 0,
      7/16, 10/16,
      7/16, 0,
      9/16, 0,
      
      //right
      9/16, 10/16,
      7/16, 10/16,
      7/16, 0,
      9/16, 10/16,
      9/16, 0,
      7/16, 0,
      
      //top
      7/16, 10/16,
      9/16, 10/16,
      9/16, 8/16,
      7/16, 10/16,
      7/16, 8/16,
      9/16, 8/16
    ];
    
    geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    
    geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    
    var mesh = new THREE.Mesh(geometry, material);
    mesh.material.side = THREE.DoubleSide; //FIXME
    
    return mesh;
  },
  chestOnDestroy: function(position) {
    var meta = getBlockMeta(position);
    if("items" in meta) {
      bulkGiveItem(meta.items);
    }
    return true;
  },
  cactusGenMesh: function(position, facing) {
    var material = new THREE.MeshLambertMaterial({map: blockTextures.cactus, transparent: true});
    var geometry = new THREE.BufferGeometry();
    
    var vertices = [
      //top
      -0.4375, 0.5, -0.4375,
      0.4375, 0.5, -0.4375,
      0.4375, 0.5, 0.4375,
      -0.4375, 0.5, -0.4375,
      -0.4375, 0.5, 0.4375,
      0.4375, 0.5, 0.4375,
      
      //bottom
      -0.4375, -0.5, -0.4375,
      0.4375, -0.5, -0.4375,
      0.4375, -0.5, 0.4375,
      -0.4375, -0.5, -0.4375,
      -0.4375, -0.5, 0.4375,
      0.4375, -0.5, 0.4375,
      
      //left
      -0.4375, 0.5, -0.5,
      -0.4375, 0.5, 0.5,
      -0.4375, -0.5, 0.5,
      -0.4375, 0.5, -0.5,
      -0.4375, -0.5, -0.5,
      -0.4375, -0.5, 0.5,
      
      //right
      0.4375, 0.5, -0.5,
      0.4375, 0.5, 0.5,
      0.4375, -0.5, 0.5,
      0.4375, 0.5, -0.5,
      0.4375, -0.5, -0.5,
      0.4375, -0.5, 0.5,
      
      //front
      -0.5, 0.5, 0.4375,
      0.5, 0.5, 0.4375,
      0.5, -0.5, 0.4375,
      -0.5, 0.5, 0.4375,
      -0.5, -0.5, 0.4375,
      0.5, -0.5, 0.4375,
      
      //back
      -0.5, 0.5, -0.4375,
      0.5, 0.5, -0.4375,
      0.5, -0.5, -0.4375,
      -0.5, 0.5, -0.4375,
      -0.5, -0.5, -0.4375,
      0.5, -0.5, -0.4375
    ];
    
    var uvs = [
      //top
      1/32, 31/32,
      15/32, 31/32,
      15/32, 17/32,
      1/32, 31/32,
      1/32, 17/32,
      15/32, 17/32,
      
      //bottom
      1/32, 15/32,
      15/32, 15/32,
      15/32, 1/32,
      1/32, 15/32,
      1/32, 1/32,
      15/32, 1/32,
      
      //left
      0.5, 1,
      1, 1,
      1, 0.5,
      0.5, 1,
      0.5, 0.5,
      1, 0.5,
      
      //right
      0.5, 1,
      1, 1,
      1, 0.5,
      0.5, 1,
      0.5, 0.5,
      1, 0.5,
      
      //front
      0.5, 1,
      1, 1,
      1, 0.5,
      0.5, 1,
      0.5, 0.5,
      1, 0.5,
      
      //back
      0.5, 1,
      1, 1,
      1, 0.5,
      0.5, 1,
      0.5, 0.5,
      1, 0.5
    ];
    
    geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.computeVertexNormals();
    
    geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvs), 2));
    
    var mesh = new THREE.Mesh(geometry, material);
    mesh.material.side = THREE.DoubleSide; //FIXME
    
    return mesh;
  }
};

//name, texture(s), properties
//textures: obj with properties "all" OR "top", "sides", and "bottom"
//properties:
//  transparent (bool default false),
//  walkable (bool default false),
//  breakable (bool default true),
//  placeable (bool default true),
//  icon (string),
//  stack (int default 64),
//  giveWhenBroken (inventory object),
//  interact (function),
//  raycast (bool default true),
//  xmesh (bool default false),
//  plant (bool default false),
//  tool (bool default false),
//    toolType (int default 0),
//    toolLevel (int default 0),
//    toolLife (int default 60),
//  reqToolType (int default 0),
//  reqToolLevel (int default 0),
//  fuel (int default 0; minimum 1),
//  light (bool default false),
//  damage (int default 1), //TODO
//  hardness (int default 1),
//  lightProps (object default {color: 0xffffff, intensity: 1, distance: 14, decay: 1}),
//  directional (bool defaut false),
//  damage (int default 1)

//TODO: shears
//TODO: hoes
//tool types: 0 none, 1 pickaxe, 2 shovel, 3 axe, 4 sword, 5 hoe
//tool levels: -1 gold, 0 none, 1 wood, 2 stone, 3 iron, 4 diamond

var blocks = [
  /*  0 */ ["air", null, {transparent: true, walkable: true, breakable: false, placeable: false}],
  /*  1 */ ["stone", {all: [16, 0]}, {icon: "blocks/stone.png", giveWhenBroken: {id: 10, stack: 1}, reqToolType: 1, reqToolLevel: 1, hardness: 1.5}],
  /*  2 */ ["grass", {top: [32, 0], sides: [48, 0], bottom: [64, 0]}, {icon: "grass_side.png", giveWhenBroken: {id: 3, stack: 1}, reqToolType: 2, hardness: 0.6}],
  /*  3 */ ["dirt", {all: [64, 0]}, {icon: "blocks/dirt.png", reqToolType: 2, hardness: 0.5}],
  /*  4 */ ["planks.oak", {all: [80, 0]}, {icon: "blocks/planks_oak.png", fuel: 1, reqToolType: 3, hardness: 2}],
  /*  5 */ ["sand", {all: [96, 0]}, {icon: "blocks/sand.png", reqToolType: 2, hardness: 0.5}],
  /*  6 */ ["water", {all: [112, 0]}, {transparent: true, walkable: true, breakable: false, raycast: false}],
  /*  7 */ ["glass", {all: [0, 16]}, {transparent: true, icon: "blocks/glass.png", giveWhenBroken: null, hardness: 0.3}],
  /*  8 */ ["log.oak", {top: [16, 16], sides: [32, 16], bottom: [16, 16]}, {icon: "blocks/log_oak.png", fuel: 4, reqToolType: 3, hardness: 2}],
  /*  9 */ ["leaves.oak", {all: [48, 16]}, {transparent: true, icon: "leaves_oak_color.png", hardness: 0.2, giveWhenBroken: null, onDestroy: function() { if(Math.random() < 0.2) { giveBlock(64); } return true; }}],
  /* 10 */ ["cobblestone", {all: [64, 16]}, {icon: "blocks/cobblestone.png", reqToolType: 1, reqToolLevel: 1, hardness: 2}],
  /* 11 */ ["stick", null, {placeable: false, icon: "items/stick.png"}],
  /* 12 */ ["crafting_table", {top: [80, 16], sideX: [96, 16], sideY: [112, 16], bottom: [80, 16]}, {stack: 1, icon: "blocks/crafting_table_front.png", interact: function(position) { openInventory(9); }, reqToolType: 3, hardness: 2.5}],
  /* 13 */ ["flower.rose", {all: [0, 32]}, {xmesh: true, transparent: true, walkable: true, icon: "blocks/flower_rose.png", plant: true, raycast: false, onPlace: blockFunctions.flowerOnPlace, hardness: 0}],
  /* 14 */ ["ore.coal", {all: [16, 32]}, {icon: "blocks/coal_ore.png", giveWhenBroken: {id: 21, stack: 2}, reqToolType: 1, reqToolLevel: 1, hardness: 3}], //TODO: random amount
  /* 15 */ ["ore.diamond", {all: [32, 32]}, {icon: "blocks/diamond_ore.png", giveWhenBroken: {id: 22, stack: 2}, reqToolType: 1, reqToolLevel: 3, hardness: 3}],
  /* 16 */ ["ore.emerald", {all: [48, 32]}, {icon: "blocks/emerald_ore.png", giveWhenBroken: {id: 23, stack: 2}, reqToolType: 1, reqToolLevel: 3, hardness: 3}],
  /* 17 */ ["ore.gold", {all: [64, 32]}, {icon: "blocks/gold_ore.png", reqToolType: 1, reqToolLevel: 3, hardness: 3}],
  /* 18 */ ["ore.iron", {all: [80, 32]}, {icon: "blocks/iron_ore.png", reqToolType: 1, reqToolLevel: 2, hardness: 3}],
  /* 19 */ ["ore.lapis", {all: [96, 32]}, {icon: "blocks/lapis_ore.png", giveWhenBroken: {id: 26, stack: 2}, reqToolType: 1, reqToolLevel: 2, hardness: 3}],
  /* 20 */ ["ore.redstone", {all: [112, 32]}, {icon: "blocks/redstone_ore.png", giveWhenBroken: {id: 27, stack: 2}, reqToolType: 1, reqToolLevel: 3, hardness: 3}],
  /* 21 */ ["coal", {}, {placeable: false, icon: "items/coal.png", fuel: 8}],
  /* 22 */ ["diamond", {}, {placeable: false, icon: "items/diamond.png"}],
  /* 23 */ ["emerald", {}, {placeable: false, icon: "items/emerald.png"}],
  /* 24 */ ["ingot.gold", {}, {placeable: false, icon: "items/gold_ingot.png"}],
  /* 25 */ ["ingot.iron", {}, {placeable: false, icon: "items/iron_ingot.png"}],
  /* 26 */ ["lapis", {}, {placeable: false, icon: "items/dye_powder_blue.png"}],
  /* 27 */ ["redstone", {}, {placeable: false, icon: "items/redstone_dust.png"}], //TODO
  /* 28 */ ["pickaxe.wood", {}, {placeable: false, stack: 1, tool: true, toolType: 1, toolLevel: 1, toolLife: 60, icon: "items/wood_pickaxe.png", damage: 2}], //TODO: fix tool lives
  /* 29 */ ["pickaxe.stone", {}, {placeable: false, stack: 1, tool: true, toolType: 1, toolLevel: 2, toolLife: 132, icon: "items/stone_pickaxe.png", damage: 3}],
  /* 30 */ ["pickaxe.iron", {}, {placeable: false, stack: 1, tool: true, toolType: 1, toolLevel: 3, toolLife: 251, icon: "items/iron_pickaxe.png", damage: 4}],
  /* 31 */ ["pickaxe.diamond", {}, {placeable: false, stack: 1, tool: true, toolType: 1, toolLevel: 4, toolLife: 1562, icon: "items/diamond_pickaxe.png", damage: 5}],
  /* 32 */ ["pickaxe.gold", {}, {placeable: false, stack: 1, tool: true, toolType: 1, toolLevel: -1, toolLife: 33, icon: "items/gold_pickaxe.png", damage: 2}],
  /* 33 */ ["grass_plant", {all: [0, 48]}, {xmesh: true, transparent: true, walkable: true, icon: "double_plant_grass_top_color.png", plant: true, raycast: false, onPlace: blockFunctions.flowerOnPlace, hardness: 0}],
  /* 34 */ ["furnace.off", {top: [64, 48], bottom: [64, 48], left: [48, 48], right: [48, 48], front: [16, 48], back: [48, 48]}, {icon: "blocks/furnace_front_off.png", reqToolType: 1, reqToolLevel: 1, hardness: 3.5, interact: openFurnace, directional: true}],
  /* 35 */ ["furnace.on", {top: [64, 48], bottom: [64, 48], left: [48, 48], right: [48, 48], front: [32, 48], back: [48, 48]}, {icon: "blocks/furnace_front_on.png", reqToolType: 1, reqToolLevel: 1, hardness: 3.5, interact: openFurnace, giveWhenBroken: {id: 34, stack: 1}, directional: true}],
  /* 36 */ ["torch", {}, {stack: 16, genMesh: blockFunctions.torchGenMesh, transparent: true, walkable: true, icon: "blocks/torch_on.png", plant: true, light: true, hardness: 0}],
  /* 37 */ ["sugarcane", {all: [96, 48]}, {xmesh: true, transparent: true, walkable: true, icon: "items/reeds.png", plant: true, onPlace: blockFunctions.sugarcaneOnPlace, onDestroy: blockFunctions.sugarcaneOnDestroy, hardness: 0}],
  /* 38 */ ["sugar", {}, {placeable: false, icon: "items/sugar.png", food: 1}],
  /* 39 */ ["paper", {}, {placeable: false, icon: "items/paper.png"}],
  /* 40 */ ["chest", {}, {transparent: true, icon: "icon_chest.png", interact: openChest, genMesh: blockFunctions.chestGenMesh, reqToolType: 3, hardness: 2.5, onDestroy: blockFunctions.chestOnDestroy, directional: true}],
  /* 41 */ ["shovel.wood", {}, {placeable: false, stack: 1, tool: true, toolType: 2, toolLevel: 1, toolLife: 60, icon: "items/wood_shovel.png", damage: 2.5}],
  /* 42 */ ["shovel.stone", {}, {placeable: false, stack: 1, tool: true, toolType: 2, toolLevel: 2, toolLife: 132, icon: "items/stone_shovel.png", damage: 3.5}],
  /* 43 */ ["shovel.iron", {}, {placeable: false, stack: 1, tool: true, toolType: 2, toolLevel: 3, toolLife: 251, icon: "items/iron_shovel.png", damage: 4.5}],
  /* 44 */ ["shovel.diamond", {}, {placeable: false, stack: 1, tool: true, toolType: 2, toolLevel: 4, toolLife: 1562, icon: "items/diamond_shovel.png", damage: 5.5}],
  /* 45 */ ["shovel.gold", {}, {placeable: false, stack: 1, tool: true, toolType: 2, toolLevel: -1, toolLife: 33, icon: "items/gold_shovel.png", damate: 2.5}],
  /* 46 */ ["axe.wood", {}, {placeable: false, stack: 1, tool: true, toolType: 3, toolLevel: 1, toolLife: 60, icon: "items/wood_axe.png", damage: 7}],
  /* 47 */ ["axe.stone", {}, {placeable: false, stack: 1, tool: true, toolType: 3, toolLevel: 2, toolLife: 132, icon: "items/stone_axe.png", damage: 9}],
  /* 48 */ ["axe.iron", {}, {placeable: false, stack: 1, tool: true, toolType: 3, toolLevel: 3, toolLife: 251, icon: "items/iron_axe.png", damage: 9}],
  /* 49 */ ["axe.diamond", {}, {placeable: false, stack: 1, tool: true, toolType: 3, toolLevel: 4, toolLife: 1562, icon: "items/diamond_axe.png", damage: 9}],
  /* 50 */ ["axe.gold", {}, {placeable: false, stack: 1, tool: true, toolType: 3, toolLevel: -1, toolLife: 33, icon: "items/gold_axe.png", damage: 7}],
  /* 51 */ ["sword.wood", {}, {placeable: false, stack: 1, tool: true, toolType: 4, toolLevel: 1, toolLife: 60, icon: "items/wood_sword.png", damage: 4}],
  /* 52 */ ["sword.stone", {}, {placeable: false, stack: 1, tool: true, toolType: 4, toolLevel: 2, toolLife: 132, icon: "items/stone_sword.png", damage: 5}],
  /* 53 */ ["sword.iron", {}, {placeable: false, stack: 1, tool: true, toolType: 4, toolLevel: 3, toolLife: 251, icon: "items/iron_sword.png", damage: 6}],
  /* 54 */ ["sword.diamond", {}, {placeable: false, stack: 1, tool: true, toolType: 4, toolLevel: 4, toolLife: 1562, icon: "items/diamond_sword.png", damage: 7}],
  /* 55 */ ["sword.gold", {}, {placeable: false, stack: 1, tool: true, toolType: 4, toolLevel: -1, toolLife: 33, icon: "items/gold_sword.png", damage: 4}],
  /* 56 */ ["brick", {all: [80, 48]}, {icon: "blocks/brick.png", reqToolType: 1, reqToolLevel: 1, hardness: 2}],
  /* 57 */ ["torchPro", {}, {stack: 16, genMesh: blockFunctions.torchGenMesh, transparent: true, walkable: true, icon: "blocks/torch_on.png", plant: true, light: true, lightProps: {color: 0xffffff, intensity: 0.5, distance: 80, decay: 2}, hardness: 0}],
  /* 58 */ ["clay_block", {all: [112, 48]}, {icon: "blocks/clay.png", reqToolType: 2, hardness: 0.6, giveWhenBroken: {id: 59, stack: 4}}],
  /* 59 */ ["clay", {}, {placeable: false, icon: "items/clay_ball.png"}],
  /* 60 */ ["brick", {}, {placeable: false, icon: "items/brick.png"}],
  /* 61 */ ["spawn.0", {}, {onPlace: function(position) { spawnEntity(0, position.clone().add(new THREE.Vector3(0, 0.6, 0))); takeBlock(61); return false; }, icon: "spawn_red.png"}],
  /* 62 */ ["porkchop.raw", {}, {placeable: false, icon: "items/porkchop_raw.png", food: 3, foodSat: 1.8}],
  /* 63 */ ["porkchop.cooked", {}, {placeable: false, icon: "items/porkchop_cooked.png", food: 8, foodSat: 12.8}],
  /* 64 */ ["apple", {}, {placeable: false, icon: "items/apple.png", food: 4, foodSat: 2.4}],
  /* 65 */ ["chicken.raw", {}, {placeable: false, icon: "items/chicken_raw.png", food: 2, foodSat: 1.2}],
  /* 66 */ ["chicken.cooked", {}, {placeable: false, icon: "items/chicken_cooked.png", food: 6, foodSat: 7.2}],
  /* 67 */ ["spawn.1", {}, {onPlace: function(position) { spawnEntity(1, position.clone().add(new THREE.Vector3(0, 0.3, 0))); takeBlock(67); return false; }, icon: "spawn_purple.png"}],
  /* 68 */ ["carrot", {}, {placeable: false, icon: "items/carrot.png", food: 3, foodSat: 3.6}],
  /* 69 */ ["spawn.2", {}, {onPlace: function(position) { spawnEntity(2, position.clone().add(new THREE.Vector3(0, 1.1, 0))); takeBlock(69); return false; }, icon: "spawn_blue.png"}],
  /* 70 */ ["cactus", {}, {transparent: true, icon: "blocks/cactus_side.png", genMesh: blockFunctions.cactusGenMesh, hardness: 0.4, plant: true}],
  /* 71 */ ["charcoal", {}, {placeable: false, icon: "items/charcoal.png", fuel: 8}]
];
/*
WISHLIST:
-clay

*/
