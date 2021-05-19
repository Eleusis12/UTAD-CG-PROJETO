import * as THREE from "https://cdn.skypack.dev/three";

import { car } from "./car.js";

import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "https://cdn.skypack.dev/three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

let wheels = [];

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

    this.controls = new OrbitControls(this.camera, container);
    this.controls.target.set(0, 0.5, 0);
    this.controls.update();

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);
    this.scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment()
    ).texture;
    this.scene.fog = new THREE.Fog(0xeeeeee, 10, 50);

    this.grid = new THREE.GridHelper(100, 40, 0x000000, 0x000000);
    this.grid.material.opacity = 0.1;
    this.grid.material.depthWrite = false;
    this.grid.material.transparent = true;
    this.scene.add(this.grid);

    this.car = new car.Car({
      scene: this.scene,
    });

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
      this.previousRaf = t;
    });
  }
  step(timeElapsed) {
    this.car.Update(timeElapsed);
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new CarRacingGame();
});
