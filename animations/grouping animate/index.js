const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  var light = new BABYLON.PointLight(
    "Omni",
    new BABYLON.Vector3(0, 100, 100),
    scene
  );
  var camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    0.8,
    100,
    new BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  //Boxes
  var box1 = BABYLON.Mesh.CreateBox("Box1", 10.0, scene);
  box1.position.x = -20;
  var box2 = BABYLON.Mesh.CreateBox("Box2", 10.0, scene);

  var materialBox = new BABYLON.StandardMaterial("texture1", scene);
  materialBox.diffuseColor = new BABYLON.Color3(0, 1, 0); //Green
  var materialBox2 = new BABYLON.StandardMaterial("texture2", scene);

  //Applying materials
  box1.material = materialBox;
  box2.material = materialBox2;

  //Positioning box
  box2.position.x = 20;

  //Create a scaling animation
  var animation1 = new BABYLON.Animation(
    "tutoAnimation",
    "scaling.z",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  // Animation keys
  var keys = [];
  //At the animation key 0, the value of scaling is "1"
  keys.push({
    frame: 0,
    value: 1,
  });

  //At the animation key 20, the value of scaling is "0.2"
  keys.push({
    frame: 20,
    value: 0.2,
  });

  //At the animation key 100, the value of scaling is "1"
  keys.push({
    frame: 100,
    value: 1,
  });

  //Adding keys to the animation object
  animation1.setKeys(keys);

  //Create a second rotation animation with different timeline
  var animation2 = new BABYLON.Animation(
    "tutoAnimation",
    "rotation.y",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
  );

  // Animation keys
  keys = [];
  keys.push({
    frame: 0,
    value: 0,
  });

  keys.push({
    frame: 40,
    value: Math.PI,
  });

  keys.push({
    frame: 80,
    value: 0,
  });

  //Adding keys to the animation object
  animation2.setKeys(keys);

  // Create the animation group
  var animationGroup = new BABYLON.AnimationGroup("my group");
  animationGroup.addTargetedAnimation(animation1, box1);
  animationGroup.addTargetedAnimation(animation2, box2);

  // Make sure to normalize animations to the same timeline
  animationGroup.normalize(0, 100);
  animationGroup.speedRatio = 5;

  setTimeout(() => {
    animationGroup.play(true);
  }, 1000);

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
