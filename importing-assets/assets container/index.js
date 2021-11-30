const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var loadPromise = async (root, file, scene) => {
  return new Promise((res, rej) => {
    BABYLON.SceneLoader.LoadAssetContainer(
      root,
      file,
      scene,
      function (container) {
        res(container);
      }
    );
  });
};

var main = async (scene, helper) => {
  // Different objects to cycle through
  var scenes = [
    {
      root: "https://playground.babylonjs.com/scenes/",
      file: "skull.babylon",
    },
    {
      root: "https://www.babylonjs.com/Scenes/Mansion/",
      file: "Mansion.babylon",
    },
    {
      root: "https://cdn.rawgit.com/marshall-hunts/game-assets/master/",
      file: "newalex.gltf",
    },
    {
      root: "https://rawgit.com/saswata26/misc/master/",
      file: "base.stl",
    },
    {
      root: "https://raw.githubusercontent.com/eddicke/kkk/master/",
      file: "robot.obj",
    },
  ];

  // Load all scenes one by one and display the first one
  var assetContainers = [];
  var currentSceneIndex = 1;
  for (var i = 0; i < scenes.length; i++) {
    var assets = await loadPromise(scenes[i].root, scenes[i].file, scene);
    // Add a light if none exists
    if (assets.lights.length == 0) {
      var light = new BABYLON.HemisphericLight(
        "",
        new BABYLON.Vector3(0, 1, 0),
        scene
      );
      scene.removeLight(light);
      assets.lights.push(light);
    }
    // Add camera if none exists
    if (assets.cameras.length == 0) {
      // var camera = new BABYLON.activeCamera.attachControl(canvas, true);
      var camera = new BABYLON.FreeCamera(
        "FreeCamera",
        new BABYLON.Vector3(8, -8, -16),
        scene
      );
      camera.setTarget(new BABYLON.Vector3(10, 8, 0));
      camera.attachControl(canvas, true);
      camera.minZ = 0.45;
      scene.removeCamera(camera);
      assets.cameras.push(camera);
    }

    // if (assets.grounds) {
    //   var ground = BABYLON.Mesh.CreatePlane("ground", 20.0, scene);
    //   ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    //   ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    //   ground.material.backFaceCulling = false;
    //   ground.position = new BABYLON.Vector3(5, -10, -15);
    //   ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

    //   scene.removeGround(ground);
    //   assets.grounds.push(ground);
    // }
    assetContainers.push(assets);
  }
  assetContainers[currentSceneIndex].addAllToScene();

  // Switch to next scene when z is pressed
  document.onkeydown = (e) => {
    if (e.key != "z") {
      return;
    }
    assetContainers[currentSceneIndex].removeAllFromScene();
    currentSceneIndex = ++currentSceneIndex % assetContainers.length;

    // Move active camera to where the scene has a camera
    if (assetContainers[currentSceneIndex].cameras[0]) {
      scene.activeCamera.position.copyFrom(
        assetContainers[currentSceneIndex].cameras[0].position
      );
    }

    assetContainers[currentSceneIndex].addAllToScene();
  };
};

var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  var helper = scene.createDefaultVRExperience();
  main(scene, helper);
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
