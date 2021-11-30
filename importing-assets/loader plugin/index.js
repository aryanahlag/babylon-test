const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function () {
  // <<<<<< SCENE >>>>>>
  const scene = new BABYLON.Scene(engine);

  // <<<<<< CAMERA >>>>>>
  scene.createDefaultCameraOrLight();

  // Async call
  BABYLON.SceneLoader.Append(
    "https://raw.githubusercontent.com/BabylonJS/Assets/master/meshes/Alien/",
    "Alien.gltf",
    scene,
    function () {
      scene.activeCamera = null;
      scene.createDefaultCameraOrLight(true)
      scene.activeCamera.attachControl(canvas, true);
    }
  );
  // BABYLON.SceneLoader.Append(
  //   "https://www.babylonjs.com/scenes/espilit/",
  //   "espilit.incremental.babylon",
  //   scene,
  //   function () {
  //     scene.activeCamera.attachControl(canvas, true);
  //   }
  // );

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
