const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function () {
  // <<<<<< SCENE >>>>>>
  const scene = new BABYLON.Scene(engine);

  // <<<<<< CAMERA >>>>>>
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    15,
    new BABYLON.Vector3(0, 0, 0)
  );
  camera.attachControl(canvas, true);

  // <<<<<< LIGHT >>>>>>
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  light.intensity = 0.7;

  // <<<<<< SHAPE OR OBJECT SCENE LOADER VIA IMPORT MESH FROM URL >>>>>>

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "https://assets.babylonjs.com/meshes/",
    "both_houses_scene.babylon"
  ).then((result) => {
    const house1 = scene.getMeshByName("detached_house");
    house1.position.x = 3;
    house1.position.y = 0;
    house1.position.z = 0;
    const house2 = result.meshes[2];
    house2.position.x = -2;
    house2.position.y = 2;
    house2.position.y = 0;
  });

  return scene;
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
