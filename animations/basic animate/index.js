const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function () {
  // <<<<<< SCENE >>>>>>
  const scene = new BABYLON.Scene(engine);

  // <<<<<< CAMERA >>>>>>
  const camera = new BABYLON.ArcRotateCamera("Camera", - Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

  // <<<<<< LIGHT >>>>>>
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  light.intensity = 0.7;

  // <<<<<< SHAPE OR OBJECT SCENE LOADER VIA IMPORT MESH FROM URL >>>>>>
  const box = BABYLON.MeshBuilder.CreateBox("box", {});
  box.position.x = 2;

  const frameRate = 60;

  const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  const keyFrames = []; 

  keyFrames.push({
      frame: 0,
      value: 4
  });

  keyFrames.push({
      frame: frameRate,
      value: -4
  });

  keyFrames.push({
      frame: 2 * frameRate,
      value: 4
  });

  xSlide.setKeys(keyFrames);

  box.animations.push(xSlide);

  scene.beginAnimation(box, 0, 2 * frameRate, true);

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
