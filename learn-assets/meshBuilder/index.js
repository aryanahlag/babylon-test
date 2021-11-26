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

  // <<<<<< SHAPE OR OBJECT MESH BUILDER >>>>>>
  const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
  box.position.y = 1;
  box.material = texture1

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