const canvas = document.getElementById('canvas');

const engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

var createScene = function () {
  const scene = new BABYLON.Scene(engine);

  const camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 5, -5), scene);
  // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
  //   camera.attachControl(canvas, true);

  camera.setTarget(BABYLON.Vector3.Zero());

  camera.attachControl(canvas, true);

  // const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

  light.intensity = 0.7;

  // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
  // const box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
  BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "both_houses_scene.babylon").then((result) => {
        const house1 = scene.getMeshByName("detached_house");
        house1.position.y = 0;
        const house2 = result.meshes[2];
        house2.position.y = 0;
    });

  // sphere.position.y = 1;
  // box.position.y = 1;

  // const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

  return scene;
};

var scene = createScene();
// run the render loop
engine.runRenderLoop(function(){
    scene.render();
});
// the canvas/window resize event handler
window.addEventListener('resize', function(){
    engine.resize();
});

console.log('start')