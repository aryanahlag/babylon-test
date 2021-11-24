const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function () {
  // <<<<<< SCENE >>>>>>
  const scene = new BABYLON.Scene(engine);

  // <<<<<< CAMERA >>>>>>
    const camera = new BABYLON.FreeCamera(
      "camera",
      new BABYLON.Vector3(-10, 3, -15),
      scene
    );
//   const camera = new BABYLON.ArcRotateCamera(
//     "camera",
//     -Math.PI / 2,
//     Math.PI / 2.5,
//     15,
//     new BABYLON.Vector3(0, 0, 0)
//   );
//   camera.attachControl(canvas, true);
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  // <<<<<< LIGHT >>>>>>
  // const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  light.intensity = 0.7;

  // <<<<<< TEXTURE AND COLOR >>>>>>
  const texture1 = new BABYLON.StandardMaterial("roofMat");
  texture1.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/roof.jpg"
  );
  const texture2 = new BABYLON.StandardMaterial("boxMat");
  texture2.diffuseTexture = new BABYLON.Texture(
    "https://www.babylonjs-playground.com/textures/floor.png"
  );
  const teal = new BABYLON.Color3.Teal();

  // <<<<<< SHAPE OR OBJECT >>>>>>
  // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
  // const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
  // sphere.position.y = 1;
  // box.position.y = 1;

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://assets.babylonjs.com/meshes/",
    "both_houses_scene.babylon"
  ).then((result) => {
    const house1 = scene.getMeshByName("detached_house");
    house1.position.x = -3;
    house1.position.y = 0;
    house1.position.z = 0;
    const house2 = result.meshes[2];
    house2.position.x = -2;
    house2.position.y = 2;
    house2.position.y = 0;
  });

  const box1 = BABYLON.MeshBuilder.CreateBox("box", {
    width: 5,
    height: 1,
    depth: 2,
  });
  box1.position.x = 2;
  box1.position.y = 0;
  box1.position.z = 0;

  const tower = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1,
    height: 1,
    tessellation: 8,
  });
  tower.scaling.x = 1;
  tower.position.y = 1;
  tower.material = texture2;
  //   tower.rotation.z = Math.PI / 4;

  const tower2 = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1,
    height: 1,
    tessellation: 8,
  });
  tower2.scaling.x = 1;
  tower2.position.x = 4;
  tower2.position.y = 1;
  tower2.material = texture2;

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.2,
    height: 1.5,
    tessellation: 3,
  });
  roof.scaling.x = 1;
  roof.position.y = 1.75;
  roof.rotation.z = Math.PI / 2;
  roof.material = texture1;

  const pipe = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.2,
    height: 4,
    tessellation: 8,
  });
  pipe.scaling.x = 1;
  pipe.position.x = 2;
  pipe.position.y = 1;
  pipe.rotation.z = Math.PI / 2;
  //   pipe.diffuseColor = teal
  pipe.material = texture2;

  const home = buildHome();
  const roofHome = buildRoof();

  buildDwellings();

  // <<<<<< SOUND >>>>>><<<<<<
  //   const sound = new BABYLON.Sound(
  //     "cello",
  //     "sounds/cellolong.wav",
  //     scene,
  //     null,
  //     { loop: true, autoplay: true }
  //   );
  //   const sound = new BABYLON.Sound("bounce", "sounds/bounce.wav", scene);
  //   setInterval(() => sound.play(), 3000);

  // <<<<<< GROUND >>>>>>
  // const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

  return scene;
};

// <<<< SMALL VILLAGE AND CASTLE >>>>
const buildHome = () => {
  //texture
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  boxMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/cubehouse.png"
  );

  //options parameter to set different images on each side
  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
  faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
  faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
  faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
  // top 4 and bottom 5 not seen so not set

  /**** World Objects *****/
  const box = BABYLON.MeshBuilder.CreateBox("box", {
    faceUV: faceUV,
    wrap: true,
  });
  box.material = boxMat;
  box.rotation.y = -20;
  box.position.x = 4;
  box.position.y = 0.5;
  box.position.z = -4;

  return box;
};

const buildRoof = () => {
  //texture
  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/roof.jpg"
  );

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.rotation.z = Math.PI / 2;
  roof.rotation.y = -20;
  roof.position.x = 4;
  roof.position.y = 1.22;
  roof.position.z = -4;

  return roof;
};

// <<<< LARGE VILLAGE >>>>
const buildDwellings = () => {
  const ground = buildGround();

  const detached_house = buildHouse(1);
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -18;
//   detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;

  const semi_house = buildHouse(2);
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -16.5;
//   semi_house.position.x = -4.5;
  semi_house.position.z = 3;

  const places = []; //each entry is an array [house type, rotation, x, z]
  places.push([1, -Math.PI / 16, -13.8, 2.5]);
  places.push([2, -Math.PI / 16, -10.5, 3]);
  places.push([2, (15 * Math.PI) / 16, -14.4, -1.5]);
  places.push([1, (15 * Math.PI) / 16, -12.1, -1]);
  places.push([2, (15 * Math.PI) / 16, -10.1, -0.5]);
  places.push([1, (5 * Math.PI) / 4, -8, -1]);
  places.push([1, Math.PI + Math.PI / 2.5, -6.5, -3]);
  places.push([2, Math.PI + Math.PI / 2.1, -7.5, -5]);

  //Create instances from the first two that were built
  const houses = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
      houses[i] = detached_house.createInstance("house" + i);
    } else {
      houses[i] = semi_house.createInstance("house" + i);
    }
    houses[i].rotation.y = places[i][1];
    houses[i].position.x = places[i][2];
    houses[i].position.z = places[i][3];
  }
};

const buildGround = () => {
  //color
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3(0, 2, 1);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", {
    width: 15,
    height: 16,
  });
  ground.position.x = -13
  ground.material = groundMat;
};

const buildHouse = (width) => {
  const box = buildBox(width);
  const roof = buildRoofTop(width);

  return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
};

const buildBox = (width) => {
  //texture
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  if (width == 2) {
    boxMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/semihouse.png"
    );
  } else {
    boxMat.diffuseTexture = new BABYLON.Texture(
      "https://assets.babylonjs.com/environments/cubehouse.png"
    );
  }

  //options parameter to set different images on each side
  const faceUV = [];
  if (width == 2) {
    faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
  } else {
    faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0); //left side
  }
  // top 4 and bottom 5 not seen so not set

  /**** World Objects *****/
  const box = BABYLON.MeshBuilder.CreateBox("box", {
    width: width,
    faceUV: faceUV,
    wrap: true,
  });
  box.material = boxMat;
  box.position.y = 0.5;

  return box;
};

const buildRoofTop = (width) => {
  //texture
  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture(
    "https://assets.babylonjs.com/environments/roof.jpg"
  );

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
};

var scene = createScene();
// run the render loop
engine.runRenderLoop(function () {
  scene.render();
});
// the canvas resize event handler
window.addEventListener("resize", function () {
  engine.resize();
});

console.log("start");
