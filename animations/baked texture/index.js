const canvas = document.getElementById("canvas");

const engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true,
});

var url = "https://raw.githack.com/RaggarDK/Baby/baby/tinyexr.js";
var s = document.createElement("script");
s.src = url;
document.head.appendChild(s);

var createScene = function () {
  // This creates a basic Babylon Scene object (non-mesh)
  var scene = new BABYLON.Scene(engine);

  // This creates and positions a free camera (non-mesh)
  var camera = new BABYLON.FreeCamera(
    "camera1",
    new BABYLON.Vector3(0, 85, -600),
    scene
  );

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  s.onload = function (params) {
    load(scene, Module);
  };

  return scene;
};

function load(scene, Module) {
  var animations = [
    { start: 9.0, end: 39.0, offset: 0.0, speed: 30.0 },
    { start: 44.0, end: 84.0, offset: 0.0, speed: 30.0 },
    { start: 89, end: 109, offset: 0, speed: 30 },
    { start: 114, end: 187, offset: 0, speed: 30 },
    { start: 195, end: 215, offset: 0, speed: 30 },
    { start: 220, end: 245, offset: 0, speed: 30 },
  ];

  var pos, mesh;
  var offset = 0;

  var bbox_max = 4030.46875;
  var bbox_min = -4892.22753906;
  var method = 2;
  var totalFrames = 248;

  var mainTexture = new BABYLON.Texture(
    "https://raw.githubusercontent.com/RaggarDK/Baby/baby/LizardMule.jpg"
  );

  var assetsManager = new BABYLON.AssetsManager(scene);

  var binaryTask = assetsManager.addBinaryFileTask(
    "texture task",
    "https://raw.githubusercontent.com/RaggarDK/Baby/baby/monster.exr"
  );

  var meshTask = assetsManager.addMeshTask(
    "mesh task",
    "",
    "",
    "https://raw.githubusercontent.com/RaggarDK/Baby/baby/monster.babylon"
  );

  meshTask.onSuccess = function (task) {
    mesh = task.loadedMeshes[0];
    mesh.registerInstancedBuffer("animation", 4);
    mesh.instancedBuffers.animation = new BABYLON.Color4(
      Math.random(),
      Math.random(),
      Math.random(),
      1
    );
    mesh.setEnabled(false);
    mesh.scaling.set(0.005, 0.005, 0.005);
  };

  binaryTask.onSuccess = function (task) {
    var int8View = new Uint8Array(task.data);
    pos = int8View;
  };

  assetsManager.onFinish = function (tasks) {
    BABYLON.Effect.ShadersStore.vatVertexShader = `
                precision highp float;
                attribute vec3 position;
                attribute vec2 uv;
                uniform mat4 worldViewProjection;
                varying vec3 vPosition;
                attribute vec2 uv2;
                varying vec3 vColor;
                
                attribute vec4 world0;
                attribute vec4 world1;
                attribute vec4 world2;
                attribute vec4 world3;
                
                uniform mat4 viewProjection;
                uniform float totalFrames;
                attribute vec4 animation;
                
                uniform float bbox_max;
                uniform float bbox_min;
               
                uniform float offset;
             
                uniform float time;
                
                uniform sampler2D posTex;
                uniform sampler2D mainTexture;
                
             
                
                void main() {
                
                    float range1 = animation.x;
                    float range2 = animation.y;
                    float _numOfFrames = range2 - range1;
                    float timeInFrames = ((ceil(fract(time * animation.w / _numOfFrames) * _numOfFrames))/ totalFrames) + (1.0/ totalFrames);
                    timeInFrames += range1 / totalFrames;
                    vec4 texturePos = texture2D(posTex,vec2(uv2.x, (timeInFrames + uv2.y)));
                    float expand = bbox_max - bbox_min;
                    texturePos.xyz *= expand;
                    texturePos.xyz += bbox_min;
                    vec3 p = position;
                    p += texturePos.xyz;  //swizzle y and z because textures are exported with z-up
                    vColor = texture2D(mainTexture,uv).rgb;
                  
                    gl_Position = viewProjection * mat4(world0, world1, world2, world3) * vec4(p, 1.0);
   
                   
            }`;

    BABYLON.Effect.ShadersStore.vatPixelShader = `
                precision highp float;
                varying vec3 vPosition;
                varying vec3 vColor;
                varying vec2 vUv;
            
            
                void main(void) {
                   gl_FragColor = vec4(vColor, 1.0);
                }`;

    var shader = new BABYLON.ShaderMaterial("shaderGradient", scene, "vat", {
      attributes: [
        "position",
        "normal",
        "uv",
        "uv2",
        "world0",
        "world1",
        "world2",
        "world3",
        "animation",
      ],
      defines: ["#define INSTANCES"],
      uniforms: [
        "worldViewProjection",
        "time",
        "bbox_max",
        "bbox_min",
        "posTex",
        "mainTexture",
        "offset",
        "totalFrames",
        "viewProjection",
      ],
    });

    //shader.backFaceCulling = false;

    let exrPos = new Module.EXRLoader(pos);

    // Cache image data to this variables to avoid call
    // to this member functions in the render for loop
    const exrPosBytes = exrPos.getBytes();

    const texWidth = exrPos.width();
    const texHeight = exrPos.height();

    var posTexture = BABYLON.RawTexture.CreateRGBATexture(
      exrPosBytes,
      texWidth,
      texHeight,
      scene,
      false,
      false,
      BABYLON.Texture.NEAREST_SAMPLINGMODE,
      1
    );

    posTexture.wrapU = BABYLON.Texture.WRAP_ADDRESSMODE;
    posTexture.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;

    exrPos.delete();

    shader.setTexture("posTex", posTexture);
    shader.setFloat("bbox_max", bbox_max);
    shader.setFloat("bbox_min", bbox_min);
    shader.setTexture("posTex", posTexture);
    shader.setTexture("mainTexture", mainTexture);

    var time = 0;
    scene.registerBeforeRender(function () {
      if (!mesh) return;
      time += 0.016;
      shader.setFloat("time", time);
      shader.setFloat("totalFrames", totalFrames);
    });

    mesh.material = shader;

    for (let i = 0; i < 1000; i++) {
      let instance = mesh.createInstance("m2");
      const animation =
        animations[randomIntFromInterval(0, animations.length - 1)];
      setAnimation(
        instance,
        animation.start,
        animation.end,
        animation.offset,
        animation.speed
      );
      instance.position.x = Math.random() * 2000 - 1000;
      instance.position.z = Math.random() * 2000 - 1000;
    }
  };

  function setAnimation(mesh, start, end, offset, speed) {
    mesh.instancedBuffers.animation = new BABYLON.Color4(
      start,
      end,
      offset,
      speed
    );
  }

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  assetsManager.load();
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
