import * as THREE from "https://cdn.skypack.dev/three";

import { car } from "./car.js";
import { moon } from "./moon.js";
import { ground } from "./ground.js";
import { road } from "./road.js";
import { clouds } from "./clouds.js";
import { trafficLight } from "./trafficLight.js";
import { math } from "./math.js";

import { RoomEnvironment } from "https://cdn.skypack.dev/three/examples/jsm/environments/RoomEnvironment.js";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { Clock } from "../../node_modules/three/build/three.module.js";

const SEPARATION_DISTANCE = 15;

class CarRacingGame {
	constructor() {
		this.cameraMode = 1;
		this.lights = [];
		this.unused = [];
		this.separationDistance_ = SEPARATION_DISTANCE;

		this.initialize();
		this.initInput();
	}

	initialize() {
		this.clock = new Clock();

		const container = document.getElementById("container");
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 0.85;

		this.renderer.setAnimationLoop(() => {
			this.lights.forEach((tl) => {
				tl.tick(this.clock.getDelta());
			});
			this.renderer.render(this.scene, this.mainCamera);
		});

		container.appendChild(this.renderer.domElement);

		window.addEventListener(
			"resize",
			() => {
				this.onWindowResize();
			},
			false
		);

		this.initCameras();

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0x1668a6);
		this.scene.fog = new THREE.Fog(0x000000, 500, 10000);

		// Adiciona todos os objetos necessários à cena
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

		/* this.tl = new trafficLight.TrafficLight({
			scene: this.scene,
		}); */

		// raf == RequestAnimationFrame
		// Esta função define como a aplicação se vai comportar a cada frame
		this.raf();
		this.onWindowResize();
	}

	LastLightPosition() {
		if (this.lights.length == 0) {
			return this.car.position.z - SEPARATION_DISTANCE;
		}

		return this.lights[this.lights.length - 1].tlModel.position.z;
	}

	SpawnLight(last) {
		let obj = null;

		if (this.unused.length > 0) {
			obj = this.unused.pop();
			obj.tlModel.visible = true;
		} else {
			obj = new trafficLight.TrafficLight({
				scene: this.scene,
			});
		}

		obj.tlModel.position.z =
			last - math.rand_range(SEPARATION_DISTANCE, SEPARATION_DISTANCE * 3);

		this.lights.push(obj);
	}

	UpdateLights() {
		const invisible = [];
		const visible = [];

		for (let obj of this.lights) {
			let difPos = obj.tlModel.position.z - this.car.position.z;

			let redLight = obj.tlModel.getObjectByName("redLight", true);

			let currentColor = redLight.material.color;

			if (
				difPos < 0.5 &&
				difPos > 0 &&
				currentColor.equals(new THREE.Color(0xff0000))
			) {
				console.log("Lost");
			} else if (difPos > 15) {
				invisible.push(obj);
				obj.tlModel.visible = false;
			} else {
				visible.push(obj);
			}
		}

		this.lights = visible;
		this.unused.push(...invisible);
	}
	MaybeSpawn() {
		let last = this.LastLightPosition();

		if (this.lights.length < 7) {
			if (Math.abs(last - this.car.position.z) < this.separationDistance_) {
				this.separationDistance_ = math.rand_range(
					SEPARATION_DISTANCE,
					SEPARATION_DISTANCE * 2
				);
				this.SpawnLight(last);
			}
		}
	}

	onWindowResize() {
		this.mainCamera.aspect = window.innerWidth / window.innerHeight;
		this.mainCamera.updateProjectionMatrix();

		this.OrthographicCamera.aspect = window.innerWidth / window.innerHeight;
		this.OrthographicCamera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Inicializa as câmeras e define as suas posições e para onde devem olhar
	initCameras() {
		this.PerspectiveCamera = new THREE.PerspectiveCamera(
			40,
			window.innerWidth / window.innerHeight,
			0.1,
			400
		);
		this.PerspectiveCamera.position.set(12, 3, 3);
		this.PerspectiveCamera.lookAt(-10, 0, -7);

		const size = 1;
		const near = 0;
		const far = 10000;

		// Foi multiplicado o 2 nas componentes esquerda e direita, uma vez que o carro estava a parecer um pouco esticado na horintal
		this.OrthographicCamera = new THREE.OrthographicCamera(
			-size * 2,
			size * 2,
			size,
			-size,
			near,
			far
		);

		this.OrthographicCamera.zoom = 0.05;
		this.OrthographicCamera.position.set(0, 20, 0);
		this.OrthographicCamera.lookAt(0, 0, -7);

		if (this.cameraMode === 0) {
			this.mainCamera = this.PerspectiveCamera;
		} else {
			this.mainCamera = this.OrthographicCamera;
		}

		// this.controls = new OrbitControls(
		//   this.mainCamera,
		//   this.renderer.domElement
		// );
	}

	func() {
		this.MaybeSpawn();
		this.UpdateLights();
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
			this.func();

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
				console.log("Perspetiva");
				this.mainCamera = this.PerspectiveCamera;

				break;
		}
	}

	cameraUpdate() {
		// Nesta função vamos ter que atualizar as duas câmeras, de modo a que quando o utilizador der switch entre as câmeras
		// A transição seja suave

		// Deslocação da câmera Perspetiva
		// creating an offset position for camera with respect to the car
		var offset = new THREE.Vector3(
			this.car.position.x + 12,
			this.car.position.y + 3,
			this.car.position.z
		);
		//tried to create delay position value for enable smooth transition for camera
		this.PerspectiveCamera.position.lerp(offset, 0.5);
		//updating lookat alway look at the car
		this.PerspectiveCamera.lookAt(
			this.car.position.x - 10,
			this.car.position.y,
			this.car.position.z - 7
		);

		// Deslocação da câmera Ortográfica

		var offset = new THREE.Vector3(
			this.car.position.x,
			this.car.position.y + 20,
			this.car.position.z
		);
		//tried to create delay position value for enable smooth transition for camera
		this.OrthographicCamera.position.lerp(offset, 0.5);
		//updating lookat alway look at the car
		this.OrthographicCamera.lookAt(
			this.car.position.x,
			this.car.position.y,
			this.car.position.z - 7
		);
		// this.controls.update();
	}
}

let _APP = null;

window.addEventListener("DOMContentLoaded", () => {
	_APP = new CarRacingGame();
});
