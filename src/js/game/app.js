import * as THREE from "https://cdn.skypack.dev/three";

import { car } from "./car.js";
import { moon } from "./moon.js";
import { ground } from "./ground.js";
import { road } from "./road.js";
import { clouds } from "./clouds.js";

import { RoomEnvironment } from "https://cdn.skypack.dev/three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

class CarRacingGame {
  constructor() {
    this.cameraMode = 0;

    this.initialize();
    this.initInput();
  }

  initialize() {
    const container = document.getElementById("container");
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.85;
    container.appendChild(this.renderer.domElement);

    window.addEventListener(
      "resize",
      () => {
        this.onWindowResize();
      },
      false
    );

    this.PerspectiveCamera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.PerspectiveCamera.position.set(4.25, 1.4, -4.5);

    const size = 1;
    const near = 0;
    const far = 10000;
    this.OrthographicCamera = new THREE.OrthographicCamera(
      -size,
      size,
      size,
      -size,
      near,
      far
    );

    this.OrthographicCamera.zoom = 0.1;
    this.OrthographicCamera.position.set(0, 0, 50);

    if (this.cameraMode === 0) {
      this.mainCamera = this.PerspectiveCamera;
    } else {
      this.mainCamera = this.OrthographicCamera;
    }

    // new OrbitControls(this.mainCamera, this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c1445);
    this.scene.fog = new THREE.Fog(0x000000, 500, 10000);

    this.moon = new moon.Moon({
      scene: this.scene,
    });

    this.ground = new ground.Ground({ scene: this.scene });

    this.road = new road.Road({
      scene: this.scene,
    });

    this.clouds = new clouds.Clouds({
      scene: this.scene,
      camera: this.mainCamera,
    });

    this.car = new car.Car({
      scene: this.scene,
    });

    this.raf();
    this.onWindowResize();
  }

  onWindowResize() {
    this.mainCamera.aspect = window.innerWidth / window.innerHeight;
    this.mainCamera.updateProjectionMatrix();

    this.OrthographicCamera.aspect = window.innerWidth / window.innerHeight;
    this.OrthographicCamera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  raf() {
    requestAnimationFrame((t) => {
      if (this.previousRaf === null) {
        this.previousRAF_ = t;
      }

      this.raf();
      this.step((t - this.previousRaf) / 1000.0);
      this.renderer.render(this.scene, this.mainCamera);
      this.cameraUpdate();

      this.previousRaf = t;
    });
  }

  step(timeElapsed) {
    this.car.update(timeElapsed);
    this.clouds.animate();
  }
  initInput() {
    document.addEventListener("keypress", (e) => this.onKeyPress(e), false);
  }

  onKeyPress(event) {
    switch (event.code) {
      // O utilizador quer mudar para a projeccção ortográfica
      case "KeyO":
        console.log("ortográfica");
        this.mainCamera = this.OrthographicCamera;

        break;

      // O utilizador quer mudar para a projeccção em perspetiva
      case "KeyP":
        console.log("perspetiva");
        this.mainCamera = this.PerspectiveCamera;

        break;
    }
  }

  cameraUpdate() {
    //creating an offset position for camera with respect to the car
    var offset = new THREE.Vector3(
      this.car.position.x + 12,
      this.car.position.y + 3,
      this.car.position.z
    );
    //tried to create delay position value for enable smooth transition for camera
    this.mainCamera.position.lerp(offset, 0.5);
    //updating lookat alway look at the car
    this.mainCamera.lookAt(
      this.car.position.x - 10,
      this.car.position.y,
      this.car.position.z - 7
    );
  }
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
  _APP = new CarRacingGame();
});
