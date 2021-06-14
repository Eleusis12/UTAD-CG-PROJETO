import * as THREE from "https://cdn.skypack.dev/three";
import { carHeadLight } from "./carHeadLight.js";

import { GLTFLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/DRACOLoader.js";

export const car = (() => {
	class Car {
		constructor(params) {
			this.position = new THREE.Vector3(0, 0, 0);
			this.velocity = 0.0;
			this.wheels = [];

			// Máxima velocidade que o carro pode atingir
			this.maxSpeed = 0.3;

			// O carro desloca-se em sentido negativo, daí considerarmos que a aceleração tem que ser negativa
			this.acceleration = -0.01;
			this.desacceleration = 0.005;
			this.currentAcceleration = 0;

			this.params = params;

			this.loadModel();
			this.initInput();
		}
		loadModel() {
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

			const shadow = new THREE.TextureLoader().load(
				"resources/ferrari/ferrari_ao.png"
			);

			const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath("js/libs/draco/gltf/");

			const loader = new GLTFLoader();
			loader.setDRACOLoader(dracoLoader);

			var self = this;
			loader.load("resources/ferrari/ferrari.glb", function (gltf) {
				self.carModel = gltf.scene.children[0];
				console.log(gltf.scene.children[0]);

				self.carModel.getObjectByName("body").material = bodyMaterial;

				self.carModel.getObjectByName("rim_fl").material = detailsMaterial;
				self.carModel.getObjectByName("rim_fr").material = detailsMaterial;
				self.carModel.getObjectByName("rim_rr").material = detailsMaterial;
				self.carModel.getObjectByName("rim_rl").material = detailsMaterial;
				self.carModel.getObjectByName("trim").material = detailsMaterial;

				self.carModel.getObjectByName("glass").material = glassMaterial;

				self.wheels.push(
					self.carModel.getObjectByName("wheel_fl"),
					self.carModel.getObjectByName("wheel_fr"),
					self.carModel.getObjectByName("wheel_rl"),
					self.carModel.getObjectByName("wheel_rr")
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
				self.carModel.add(mesh);
				self.carModel.name = "carModel1";
				self.params.scene.add(self.carModel);

				console.log(self.carModel);
				// Adicionar os faróis
				self.carLeftHeadLight = new carHeadLight.HeadLight({
					car: self.carModel,
					shift: -0.65,
				});
				self.carRightHeadLight = new carHeadLight.HeadLight({
					car: self.carModel,
					shift: 0.65,
				});
			});
		}

		initInput() {
			this.keys = {
				spacebar: false,
			};
			this.oldKeys = { ...this.keys };

			document.addEventListener("keydown", (e) => this.onKeyDown(e), false);
			document.addEventListener("keyup", (e) => this.onKeyUp(e), false);
			document.addEventListener("keypress", (e) => this.onKeyPress(e), false);
		}

		onKeyDown(event) {
			switch (event.keyCode) {
				case 87:
					this.keys.w = true;
					this.keys.s = false;

					break;
				case 83:
					this.keys.s = true;
					this.keys.w = false;

					break;
			}
		}

		onKeyUp(event) {
			switch (event.keyCode) {
				case 87:
					this.keys.w = false;
					break;
				case 83:
					this.keys.s = false;
					break;
			}
		}

		onKeyPress(event) {
			switch (event.code) {
				// Desliga ou liga as luzes
				case "KeyL":
					this.carLeftHeadLight.light.intensity =
						this.carLeftHeadLight.light.intensity === 0 ? 10 : 0;

					this.carRightHeadLight.light.intensity =
						this.carRightHeadLight.light.intensity === 0 ? 10 : 0;
					break;
			}
		}
		update(timeElapsed) {
			// Se timeElapsed é um NaN, então definimos o timeElapsed como 0
			timeElapsed = timeElapsed || 0;

			if (this.keys.w == true) {
				this.currentAcceleration = this.acceleration;
			} else if (this.keys.s == true) {
				this.currentAcceleration = this.desacceleration;

				// Travar, de relembrar que velocidade negativa significa ir em frente
				if (this.velocity < 0) {
					this.currentAcceleration *= 3;
				}
			} else if (this.velocity !== 0) {
				// Decaimento de velocidade quando não se carrega no pedal
				this.currentAcceleration = this.velocity > 0 ? -0.0045 : 0.0045;
			} else {
				this.currentAcceleration = 0;
			}

			this.velocity = this.velocity + this.currentAcceleration;
			this.velocityDirection = this.velocity ? (this.velocity < 0 ? -1 : 1) : 0;

			this.velocity =
				this.velocityDirection *
				Math.min(Math.abs(this.velocity), this.maxSpeed);

			if (Math.abs(this.velocity) < 0.005) this.velocity = 0;
			this.position.z += this.velocity;

			if (this.carModel) {
				this.carModel.position.copy(this.position);
				// console.log(this.carModel);
			}

			// Rotação das rodas
			for (let i = 0; i < this.wheels.length; i++) {
				this.wheels[i].rotation.x += (this.velocity * Math.PI) / 30;
			}
		}
	}

	return {
		Car: Car,
	};
})();
