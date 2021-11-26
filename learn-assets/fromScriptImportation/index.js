const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

// <<<<<< SCRIPT CODE >>>>>>
var url = "https://cdn.rawgit.com/BabylonJSGuide/oddsNEdnds/4f6408da/axes.js";
var s = document.createElement("script");
s.type = "text/javascript";
s.src = url;
document.head.appendChild(s);

var createScene = function () {
  // <<<<<< SCENE >>>>>>
  const scene = new BABYLON.Scene(engine);

  // <<<<<< CAMERA >>>>>>
  var camera = new BABYLON.ArcRotateCamera(
    "camera1",
    (3 * Math.PI) / 8,
    (3 * Math.PI) / 8,
    15,
    new BABYLON.Vector3(0, 2, 0),
    scene
  );
  camera.attachControl(canvas, true);

  // <<<<<< LIGHT >>>>>>
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  light.intensity = 0.7;

  // <<<<<< SHAPE OR OBJECT >>>>>>
  const abstractElement = BABYLON.MeshBuilder.CreateTorusKnot("tk", {tube: 0.2, radialSegments: 128});
  abstractElement.material = new BABYLON.StandardMaterial("", scene);

  // <<<<<< SHOW THE OBJECT FROM SCRIPT >>>>>>
  s.onload = function () {
    showAxis(6, scene);
  };

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
