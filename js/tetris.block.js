window.Tetris = window.Tetris  || {};

Tetris.Utils = {};

Tetris.Utils.cloneVector = function (v) {
  return {x: v.x, y: v.y, z: v.z};
};

Tetris.Block = {};

Tetris.Block.shapes = [
	[
		{x: 0, y: 0, z: 0},
		{x: 1, y: 0, z: 0},
		{x: 1, y: 1, z: 0},
		{x: 1, y: 2, z: 0}
	],
	[
		{x: 0, y: 0, z: 0},
		{x: 0, y: 1, z: 0},
		{x: 0, y: 2, z: 0},
	],
	[
		{x: 0, y: 0, z: 0},
		{x: 0, y: 1, z: 0},
		{x: 1, y: 0, z: 0},
		{x: 1, y: 1, z: 0}
	],
	[
		{x: 0, y: 0, z: 0},
		{x: 0, y: 1, z: 0},
		{x: 0, y: 2, z: 0},
		{x: 1, y: 1, z: 0}
	],
	[
		{x: 0, y: 0, z: 0},
		{x: 0, y: 1, z: 0},
		{x: 1, y: 1, z: 0},
		{x: 1, y: 2, z: 0}
	]
];

Tetris.Block.position = {};

Tetris.Block.generate = function() {
	var geometry, tmpGeometry;
	
	var type = Math.floor(Math.random()*(Tetris.Block.shapes.length));
  this.blockType = type;
	
	Tetris.Block.shape = [];
	for(var i = 0; i < Tetris.Block.shapes[type].length; i++) {
		Tetris.Block.shape[i] = Tetris.Utils.cloneVector(Tetris.Block.shapes[type][i]);
	}
	
	geometry = new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize);
	for(var i = 1 ; i < Tetris.Block.shape.length; i++) {
		tmpGeometry = new THREE.Mesh(new THREE.CubeGeometry(Tetris.blockSize, Tetris.blockSize, Tetris.blockSize));
		tmpGeometry.position.x = Tetris.blockSize * Tetris.Block.shape[i].x;
		tmpGeometry.position.y = Tetris.blockSize * Tetris.Block.shape[i].y;
		THREE.GeometryUtils.merge(geometry, tmpGeometry);
	}

	Tetris.Block.mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [
		new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
		new THREE.MeshBasicMaterial({color: 0xff0000}) 
	]);
	
	// initial position
	Tetris.Block.position = {x: Math.floor(Tetris.boundingBoxConfig.splitX/2)-1, y: Math.floor(Tetris.boundingBoxConfig.splitY/2)-1, z: 15};
	
	Tetris.Block.mesh.position.x = (Tetris.Block.position.x - Tetris.boundingBoxConfig.splitX/2)*Tetris.blockSize/2;
	Tetris.Block.mesh.position.y = (Tetris.Block.position.y - Tetris.boundingBoxConfig.splitY/2)*Tetris.blockSize/2;
	Tetris.Block.mesh.position.z = (Tetris.Block.position.z - Tetris.boundingBoxConfig.splitZ/2)*Tetris.blockSize + Tetris.blockSize/2;
  Tetris.Block.mesh.rotation = {x: 0, y: 0, z: 0};
	Tetris.Block.mesh.overdraw = true;
	
	Tetris.scene.add(Tetris.Block.mesh);
};


Tetris.Block.rotate = function(x,y,z) {
	Tetris.Block.mesh.rotation.x += x * Math.PI / 180;
	Tetris.Block.mesh.rotation.y += y * Math.PI / 180;
	Tetris.Block.mesh.rotation.z += z * Math.PI / 180;
};

Tetris.Block.move = function(x,y,z) {
  Tetris.Block.mesh.position.x += x*Tetris.blockSize;
	Tetris.Block.position.x += x;
  
  Tetris.Block.mesh.position.y += y*Tetris.blockSize;
	Tetris.Block.position.y += y;

  Tetris.Block.mesh.position.z += z*Tetris.blockSize;
	Tetris.Block.position.z += z;
  if(Tetris.Block.position.z == 0) Tetris.Block.hitBottom();
};

/**
* call when hits the floor and should be transformed to static blocks
*/
Tetris.Block.petrify = function() {
	var shape = Tetris.Block.shape;
	for(var i = 0 ; i < shape.length; i++) {
		Tetris.addStaticBlock(Tetris.Block.position.x + shape[i].x, Tetris.Block.position.y + shape[i].y, Tetris.Block.position.z + shape[i].z);
	}
};

Tetris.Block.hitBottom = function() {
	Tetris.Block.petrify();
  Tetris.scene.removeObject(Tetris.Block.mesh);
	Tetris.Block.generate();
};
