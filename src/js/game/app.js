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
import { jerryCan } from "./jerryCan.js";

const LIGHT_SEPARATION_DISTANCE = 15;
const JERRY_SEPARATION_DISTANCE = 30;

class CarRacingGame {
	constructor() {
		this.cameraMode = 0;
		this.lights = [];
		this.unusedLights = [];
		this.jerrys = [];
		this.unusedJerrys = [];
		this.lightSeparationDistance_ = LIGHT_SEPARATION_DISTANCE;
		this.jerrySeparationDistance_ = JERRY_SEPARATION_DISTANCE;

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
			this.jerrys.forEach((j) => {
				j.tick(this.clock.getDelta());
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

		// Esta função define como a aplicação se vai comportar a cada frame
		this.raf();
		this.onWindowResize();
	}

	LastLightPosition() {
		if (this.lights.length == 0) {
			return this.car.position.z - LIGHT_SEPARATION_DISTANCE;
		}

		return this.lights[this.lights.length - 1].tlModel.position.z;
	}

	LastJerryPosition() {
		if (this.jerrys.length == 0) {
			return this.car.position.z - JERRY_SEPARATION_DISTANCE;
		}

		return this.jerrys[this.jerrys.length - 1].jerryCanModel.position.z;
	}

	SpawnJerryCan(last) {
		let obj = null;

		let nextPos =
			last -
			math.rand_range(
				JERRY_SEPARATION_DISTANCE * 8,
				JERRY_SEPARATION_DISTANCE * 11
			);

		if (this.unusedJerrys.length > 0) {
			obj = this.unusedJerrys.pop();
			obj.jerryCanModel.visible = true;
			obj.updateKFTrack();
		} else {
			obj = new jerryCan.JerryCan({
				scene: this.scene,
				pos: nextPos,
			});
		}

		obj.jerryCanModel.position.z = nextPos;

		this.jerrys.push(obj);
	}

	SpawnLight(last) {
		let obj = null;

		if (this.unusedLights.length > 0) {
			obj = this.unusedLights.pop();
			obj.tlModel.visible = true;
		} else {
			obj = new trafficLight.TrafficLight({
				scene: this.scene,
			});
		}

		obj.tlModel.position.z =
			last -
			math.rand_range(
				LIGHT_SEPARATION_DISTANCE * 8,
				LIGHT_SEPARATION_DISTANCE * 11
			);

		this.lights.push(obj);
	}

	UpdateObjs() {
		const invisibleLights = [];
		const visibleLights = [];

		for (let obj of this.lights) {
			let difPos = obj.tlModel.position.z - this.car.position.z;

			let redLight = obj.tlModel.getObjectByName("redLight", true);

			let currentColor = redLight.material.color;

			if (
				difPos < 0.5 &&
				difPos > 0 &&
				currentColor.equals(new THREE.Color(0xff0000))
			) {
				alert("Game lost");
			} else if (difPos > 15) {
				invisibleLights.push(obj);
				obj.tlModel.visible = false;
			} else {
				visibleLights.push(obj);
			}
		}

		this.lights = visibleLights;
		this.unusedLights.push(...invisibleLights);

		const invisibleJerrys = [];
		const visibleJerrys = [];

		for (let obj of this.jerrys) {
			let difPos = obj.jerryCanModel.position.z - this.car.position.z;

			if (difPos > 15 || (difPos < 0.5 && difPos > 0)) {
				invisibleJerrys.push(obj);
				obj.jerryCanModel.visible = false;
				alert("Fuel++");
			} else {
				visibleJerrys.push(obj);
			}
		}

		this.jerrys = visibleJerrys;
		this.unusedJerrys.push(...invisibleJerrys);
	}

	MaybeSpawn() {
		let lastLight = this.LastLightPosition();
		let lastJerry = this.LastJerryPosition();

		if (this.lights.length < 4) {
			if (
				Math.abs(lastLight - this.car.position.z) <
				this.lightSeparationDistance_
			) {
				this.lightSeparationDistance_ = math.rand_range(
					LIGHT_SEPARATION_DISTANCE,
					LIGHT_SEPARATION_DISTANCE * 2
				);
				this.SpawnLight(lastLight);
			}
		}

		if (this.jerrys.length < 4) {
			if (
				Math.abs(lastJerry - this.car.position.z) <
				this.jerrySeparationDistance_
			) {
				this.jerrySeparationDistance_ = math.rand_range(
					JERRY_SEPARATION_DISTANCE,
					JERRY_SEPARATION_DISTANCE * 2
				);
				this.SpawnJerryCan(lastJerry);
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
			100,
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
		this.UpdateObjs();
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

			var val = document.getElementById("dayNightSwitch").innerHTML;

			if (val === "Day") {
				this.scene.getObjectByName("dirLight").color.setHSL(0.1, 1, 0.95);
			} else {
				this.scene.getObjectByName("dirLight").color.setHSL(0, 0, 0);
			}

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
