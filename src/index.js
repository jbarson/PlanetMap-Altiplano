import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshBasicMaterial,
  PlaneGeometry,
  DoubleSide,
  // BackSide,
  MeshPhongMaterial,
  Mesh,
  Color,
  SphereBufferGeometry,
  // HemisphereLight,
  DirectionalLight,
  TextureLoader
} from "three";
// import OrbitControls from "three-orbitcontrols";

let container;
let scene;
let camera;
let renderer;
// let controls;
let mesh;
let clouds;

async function init() {
  container = document.querySelector("#container");
  scene = new Scene();
  scene.background = new Color("black");

  createLights();
  createCamera();
  createRenderer();
  await createPlanet();

  // createControls();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function createCamera() {
  camera = new PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);
}

function createLights() {
  const directionalLight = new DirectionalLight(0xffffcc, 5);
  directionalLight.position.set(50, 0, 50);

  // const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
  scene.add(directionalLight);
}

async function createPlanet() {
  const sphere = new SphereBufferGeometry(1, 32, 32);
  const materials = new MeshPhongMaterial();
  materials.map = await loadTexture(`src/textures/Map_Altiplano2.jpg`);
  materials.specularMap = await loadTexture(
    `src/textures/specular-altiplano.png`
  );
  materials.specular = new Color("#333333");
  materials.bumpMap = await loadTexture(`src/textures/AmbientOcclusionMap.png`);
  materials.bumpScale = 0.002;
  mesh = new Mesh(sphere, materials);

  const cloudGeometry = new SphereBufferGeometry(1.01, 32, 32);
  const cloudMaterial = new MeshPhongMaterial({
    side: DoubleSide,
    opacity: 0.8,
    transparent: true,
    depthWrite: true
  });
  cloudMaterial.map = await loadTexture(`src/textures/clouds-trans.png`);
  clouds = new Mesh(cloudGeometry, cloudMaterial);
  mesh.add(clouds);
  // // create the geometry sphere
  const starGeometry = new PlaneGeometry(15, 6.5);
  // // // create the material, using a texture of startfield
  const starFieldMaterial = new MeshBasicMaterial();
  starFieldMaterial.map = await loadTexture("src/textures/starfield_alpha.png");
  // starFieldMaterial.side = BackSide;
  // // // create the mesh based on geometry and material
  const starMesh = new Mesh(starGeometry, starFieldMaterial);
  starMesh.position.z = -5;
  scene.add(starMesh);
  scene.add(mesh);
}

// function createControls() {
//   controls = new OrbitControls(camera, renderer.domElement);
// }

function loadTexture(url) {
  const loader = new TextureLoader();
  return new Promise((resolve) => loader.load(url, resolve));
}

function update() {
  mesh.rotation.y += 0.001;
  clouds.rotation.y += 0.0001;
}

function render() {
  renderer.render(scene, camera);
}

init();
// update()

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);
