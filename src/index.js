import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshBasicMaterial,
  MeshPhongMaterial,
  DoubleSide,
  // BackSide,
  Mesh,
  Color,
  PlaneGeometry,
  SphereBufferGeometry,
  // HemisphereLight,
  DirectionalLight,
  TextureLoader
} from "three";
import OrbitControls from "three-orbitcontrols";

let container;
let scene;
let camera;
let renderer;
let controls;
let mesh;
let clouds;

function init() {
  container = document.querySelector("#container");
  scene = new Scene();
  scene.background = new Color("black");

  createLights();
  createCamera();
  createRenderer();
  createPlanet();

  createControls();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
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
  materials.map = new TextureLoader().load(`textures/Map_Altiplano2.jpg`);
  // console.log(materials)
  materials.specularMap = new TextureLoader().load(
    `textures/specular-altiplano.png`
  );
  materials.specular = new Color("#333333");
  // materials.bumpMap = new TextureLoader().load(`textures/AmbientOcclusionMap.png`);
  // materials.bumpScale = 0.002;
  mesh = new Mesh(sphere, materials);

  const cloudGeometry = new SphereBufferGeometry(1.01, 32, 32);
  const cloudMaterial = new MeshPhongMaterial({
    side: DoubleSide,
    opacity: 0.8,
    transparent: true,
    depthWrite: true
  });
  cloudMaterial.map = new TextureLoader().load(`textures/clouds-trans.png`);
  clouds = new Mesh(cloudGeometry, cloudMaterial);
  mesh.add(clouds);
  const starGeometry = new PlaneGeometry(15, 6.5);
  const starTexture = new TextureLoader().load( 'textures/starfield_alpha.png' );
  const starFieldMaterial = new MeshBasicMaterial( { map: starTexture } );
  const starMesh = new Mesh(starGeometry, starFieldMaterial);
  starMesh.position.z = -5;
  scene.add(starMesh);
  scene.add(mesh);
}

function createControls() {
  controls = new OrbitControls(camera, renderer.domElement);
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
