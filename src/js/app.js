document.addEventListener("DOMContentLoaded", Start);

let camera, scene, renderer;

let grid;
let controls;

const wheels = [];

function Start() {
  const container = document.getElementById("container");

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.85;
  container.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  //

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(4.25, 1.4, -4.5);

  controls = new THREE.OrbitControls(camera, container);
  controls.target.set(0, 0.5, 0);
  controls.update();

  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xeeeeee);
  scene.environment = pmremGenerator.fromScene(
    new THREE.RoomEnvironment()
  ).texture;
  scene.fog = new THREE.Fog(0xeeeeee, 10, 50);

  grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000);
  grid.material.opacity = 0.1;
  grid.material.depthWrite = false;
  grid.material.transparent = true;
  scene.add(grid);

  // materials

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000,
    metalness: 0.6,
    roughness: 0.4,
    clearcoat: 0.05,
    clearcoatRoughness: 0.05,
  });

  const detailsMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 1.0,
    roughness: 0.5,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.1,
    transmission: 0.9,
    transparent: true,
  });

  // Car

  const shadow = new THREE.TextureLoader().load("models/gltf/ferrari_ao.png");

  const dracoLoader = new THREE.DRACOLoader();
  dracoLoader.setDecoderPath("js/libs/draco/gltf/");

  const loader = new THREE.GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.load("models/gltf/ferrari.glb", function (gltf) {
    const carModel = gltf.scene.children[0];

    carModel.getObjectByName("body").material = bodyMaterial;

    carModel.getObjectByName("rim_fl").material = detailsMaterial;
    carModel.getObjectByName("rim_fr").material = detailsMaterial;
    carModel.getObjectByName("rim_rr").material = detailsMaterial;
    carModel.getObjectByName("rim_rl").material = detailsMaterial;
    carModel.getObjectByName("trim").material = detailsMaterial;

    carModel.getObjectByName("glass").material = glassMaterial;

    wheels.push(
      carModel.getObjectByName("wheel_fl"),
      carModel.getObjectByName("wheel_fr"),
      carModel.getObjectByName("wheel_rl"),
      carModel.getObjectByName("wheel_rr")
    );

    // shadow
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: shadow,
        blending: THREE.MultiplyBlending,
        toneMapped: false,
        transparent: true,
      })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 2;
    carModel.add(mesh);

    scene.add(carModel);
  });
  console.log("asdasdfcasd");
  requestAnimationFrame(render);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  // Aqui temos que codificar o movimento do carro
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}
