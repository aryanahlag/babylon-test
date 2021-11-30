const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var createScene = function () {
  // Create an empty scene.
  const scene = new BABYLON.Scene(engine);

  loadAsset(scene);

  // Create default camera for initial rendering.
  scene.createDefaultCamera();

  return scene;
};

function loadAsset(scene) {
  // The index of the next LOD to load.
  let lodNext = null;

  // Disable the loading screen since the UI text will show progress.
  BABYLON.SceneLoader.ShowLoadingScreen = false;

  // Register for loader 
  BABYLON.SceneLoader.OnPluginActivatedObservable.addOnce(function (loader) {
      // This is just a precaution as this isn't strictly necessary since
      // the only loader in use is the glTF one.
      if (loader.name !== "gltf") return;

      // See what the loader is doing in the console.
      loader.loggingEnabled = true;

      // Use HTTP range requests to load the glTF binary (GLB) in parts.
      loader.useRangeRequests = true;

      // Register for when extension are loaded.
      loader.onExtensionLoadedObservable.add(function (extension) {
          // Ignore extensions except MSFT_lod.
          if (extension.name !== "MSFT_lod") return;

          // Extensions are loaded after glTF has been parsed and
          // thus it is now loading the first LOD.
          lodNext = 0;

          // Update the status text and next LOD index when each set
          // of LODs are loaded.
          extension.onMaterialLODsLoadedObservable.add(function (index) {
              lodNext = index + 1;
          });
      });

      // Update the status text when loading is complete, i.e. when
      // all the LODs are loaded.
      loader.onCompleteObservable.add(function () {
        console.log('loading complete')
          setTimeout(function () {
              console.log('done')
          }, 3000);
      });
  });

  // GLB asset with MSFT_lod, EXT_image_based_lighting, and range request support.
  // Asset created by https://twitter.com/VladimirStudio from Adobe.
  const url = "https://cdn.cp.adobe.io/content/2/content/93f19c5b-5587-4f4f-95bd-99295214aade/version/1";
  BABYLON.SceneLoader.AppendAsync(url, undefined, scene, function (event) {
      // Compute the percentage for each stage unless the length is not computable.
      // The lengthComputable is often false when serving content that is gzipped.
      const percentage = event.lengthComputable ? " " + Math.floor(event.loaded / event.total * 100) + "%" : "";

      // Check if an LOD is loading yet.
      if (lodNext === null) {
          // Ignore GLB header progress.
          if (event.total === 20) return;
      }
  }, ".glb").then(function (scene) {
      // Create a default camera that can view the whole model.
      scene.createDefaultCamera(true, true, true);

      // Adjust the camera to face the front of the model.
      scene.activeCamera.alpha += Math.PI;

      // Adjust the camera to view the model from the top slightly.
      scene.activeCamera.beta -= Math.PI / 15;

      // Zoom in on the model.
      scene.activeCamera.radius *= 1.5;

      // Auto rotate the camera.
      scene.activeCamera.useAutoRotationBehavior = true;
  });
}

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
