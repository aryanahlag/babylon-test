const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function () {
  // <<<<<< SCENE >>>>>>
  const scene = new BABYLON.Scene(engine);

  // <<<<<< CAMERA >>>>>>
  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    -2,
    1.2,
    100,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, false);

  // <<<<<< LIGHT >>>>>>
  var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 20, 100), scene);

  // assets manager plugins
  var assetsManager = new BABYLON.AssetsManager(scene);
  var meshTask = assetsManager.addMeshTask(
    "skull task",
    "",
    "https://raw.githubusercontent.com/BabylonJS/Assets/master/meshes/Skull/",
    "skull.babylon"
  );

  meshTask.onSuccess = function (task) {
    task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
  };

  // Move the light with the camera
  scene.registerBeforeRender(function () {
    light.position = camera.position;
  });

  assetsManager.onFinish = function (tasks) {
    engine.runRenderLoop(function () {
      scene.render();
    });
  };

  assetsManager.load();

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
