import * as THREE from "https://cdn.skypack.dev/three";

import { car } from "./car.js";
import { background } from "./background.js";
import { lua } from "./lua.js";

import { RoomEnvironment } from "https://cdn.skypack.dev/three/examples/jsm/environments/RoomEnvironment.js";

class CarRacingGame {
  constructor() {
    console.log("estou 123");
    this.initialize();
  }

  initialize() {
    console.log("estou aqui");
    const container = document.getElementById("container");
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.85;
    container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize);

    //

    this.camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(4.25, 1.4, -4.5);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);
    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment()
    ).texture;
    this.scene.fog = new THREE.Fog(0xeeeeee, 10, 50);

    this.scene.background = new THREE.Color(0x808080);
    this.scene.fog = new THREE.FogExp2(0x89b2eb, 0.00125);

    this.lua = new lua.Lua({
      scene: this.scene,
    });
    // Inicialização do ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20000, 20000, 10, 10),
      new THREE.MeshStandardMaterial({
        color: 0xf6f47f,
      })
    );
    ground.castShadow = false;
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

    this.car = new car.Car({
      scene: this.scene,
    });

    this.background = new background.Background({ scene: this.scene });

    this.raf();
    this.onWindowResize();
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  raf() {
    requestAnimationFrame((t) => {
      if (this.previousRaf === null) {
        this.previousRAF_ = t;
      }

      this.raf();
      this.step((t - this.previousRaf) / 1000.0);
      this.renderer.render(this.scene, this.camera);
      this.cameraUpdate();

      this.previousRaf = t;
    });
  }

  cameraUpdate() {
    //creating an offset position for camera with respect to the car
    var offset = new THREE.Vector3(
      this.car.position.x + 10,
      this.car.position.y + 3,
      this.car.position.z
    );
    //tried to create delay position value for enable smooth transition for camera
    this.camera.position.lerp(offset, 0.2);
    //updating lookat alway look at the car
    this.camera.lookAt(
      this.car.position.x,
      this.car.position.y,
      this.car.position.z
    );
  }
  step(timeElapsed) {
    this.car.update(timeElapsed);
    this.background.update(timeElapsed);
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new CarRacingGame();
});
