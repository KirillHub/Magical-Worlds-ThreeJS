import * as THREE from 'three';
import { KeyDown } from '../utils/keyDown';


interface CharacterControlsOptions {
	moveSpeed?: number;
	jumpSpeed?: number;
	enableJump?: boolean;
}

export class CharacterControls {
	private object: THREE.Object3D;
	private camera: THREE.Camera;
	private moveSpeed: number;
	private jumpSpeed: number;
	private enableJump: boolean;

	private velocity: THREE.Vector3 = new THREE.Vector3();
	private direction: THREE.Vector3 = new THREE.Vector3();
	private isJumping: boolean = false;

	constructor(object: THREE.Object3D, camera: THREE.Camera, options: CharacterControlsOptions = {}) {
		this.object = object;
		this.camera = camera;

		this.moveSpeed = options.moveSpeed ?? 5;
		this.jumpSpeed = options.jumpSpeed ?? 10;
		this.enableJump = options.enableJump ?? true;

		document.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('keyup', this.handleKeyUp);
	}

	public update(keyboard: { moveForward: boolean, moveBackward: boolean, moveLeft: boolean, moveRight: boolean, jump: boolean }): void {
		const delta = 1 / 60;

		this.direction.z = Number(keyboard.moveForward) - Number(keyboard.moveBackward);
		this.direction.x = Number(keyboard.moveRight) - Number(keyboard.moveLeft);
		this.direction.normalize();

		if (keyboard.jump && this.enableJump && !this.isJumping) {
			this.velocity.y = this.jumpSpeed;
			this.isJumping = true;
		}

		const speed = this.isJumping ? this.moveSpeed * 0.5 : this.moveSpeed;
		this.velocity.x -= this.velocity.x * 10.0 * delta;
		this.velocity.z -= this.velocity.z * 10.0 * delta;
		this.velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if (keyboard.moveForward || keyboard.moveBackward) this.velocity.z -= this.direction.z * speed * delta;
		if (keyboard.moveLeft || keyboard.moveRight) this.velocity.x -= this.direction.x * speed * delta;

		this.object.translateX(this.velocity.x * delta);
		this.object.translateY(this.velocity.y * delta);
		this.object.translateZ(this.velocity.z * delta);

		if (this.object.position.y < 0) {
			this.velocity.y = 0;
			this.object.position.y = 0;
			this.isJumping = false;
		}

		this.camera.position.copy(this.object.position);
		this.camera.position.y += 1.5;
	}

	private handleKeyDown = (event: KeyboardEvent) => {
		if (event.code === 'Space') event.preventDefault();
		KeyDown.setKeyDown(event.code, true);
	}

	private handleKeyUp = (event: KeyboardEvent) => {
		KeyDown.setKeyDown(event.code, false);
	}
}
