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

  // Explanation
  // Using incremental Loading System by babylon.js ---- this assets from https://github.com/BabylonJS/Assets continued with converting the assets to .incremental.babylon format by https://github.com/BabylonJS/Exporters/tree/master/Tools/MakeIncremental ---- and camera forced to stick on canvas

  BABYLON.SceneLoader.Append(
    "https://www.babylonjs.com/scenes/espilit/",
    "espilit.incremental.babylon",
    scene,
    function () {
      scene.activeCamera.attachControl(canvas, true);
    }
  );

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
