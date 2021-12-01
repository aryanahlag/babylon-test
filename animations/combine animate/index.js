const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function() {
  var scene = new BABYLON.Scene(engine);

  var camera = new BABYLON.ArcRotateCamera("Camera", - Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), scene);

  camera.attachControl(canvas, true);

var light1 = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, 1), scene);
  var light2 = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, 1, 0), scene);   
  light1.intensity =0.75;
  light2.intensity =0.5;

  var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
  box.position.x = 2;

  var frameRate = 10;

  //Position Animation
  var xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  
  var keyFramesP = []; 

  keyFramesP.push({
      frame: 0,
      value: 2
  });

  keyFramesP.push({
      frame: frameRate,
      value: -2
  });

  keyFramesP.push({
      frame: 2 * frameRate,
      value: 2
  });


  xSlide.setKeys(keyFramesP);

  //Rotation Animation
  var yRot = new BABYLON.Animation("yRot", "rotation.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  var keyFramesR = []; 

  keyFramesR.push({
      frame: 0,
      value: 0
  });

  keyFramesR.push({
      frame: 2.5 * frameRate,
      value: 2 * Math.PI
  });

  keyFramesR.push({
      frame: 5 * frameRate,
      value: 4 * Math.PI
  });


  yRot.setKeys(keyFramesR);


  var nextAnimation = function() {
      scene.beginDirectAnimation(box, [xSlide], 0, 2 * frameRate, true);

  }

  scene.beginDirectAnimation(box, [yRot], 0, 2 * frameRate, false, 1, nextAnimation);

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
