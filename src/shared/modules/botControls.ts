import {
	Group,
	AnimationMixer,
	AnimationAction,
	Vector3,
	Quaternion
} from 'three'


export class BotControler {
	model: Group;
	mixer: AnimationMixer;
	animationsMap: Map<string, AnimationAction> = new Map();
	animationsList: string[];
	isToggleAnimation = false;
	currentAction = "idle";
	fadeDuration = 0.2;
	velocity = 3;
	timeUntilNextAction = 0;
 
	walkDirection = new Vector3();
	rotateAngle = new Vector3(0, 1, 0);
	rotateQuaternion: Quaternion = new Quaternion();
	cameraTarget = new Vector3();
 
	constructor(
	  model: Group,
	  mixer: AnimationMixer,
	  animationsMap: Map<string, AnimationAction>,
	  currentAction: string,
	  animationsList: string[]
	) {
	  this.model = model;
	  this.mixer = mixer;
	  this.animationsMap = animationsMap;
	  this.currentAction = currentAction;
	  this.animationsList = animationsList;
 
	  this.animationsMap.forEach((value, key) => {
		 if (key === this.animationsList[0]) {
			value.play();
		 }
	  });
	}
 
	public switchActionToggle() {
	  this.isToggleAnimation = !this.isToggleAnimation;
	}
 
	public getPosition() {
	  return this.model.position;
	}
 
	public update(delta: number) {
	  this.timeUntilNextAction -= delta;
	  if (this.timeUntilNextAction <= 0) {
		 this.timeUntilNextAction = Math.random() * 8 + 2;
		 this.toggleAnimation();
	  }
 
	  const current = this.animationsMap.get(this.currentAction);
	  if (current.time === current.getClip().duration) {
		 this.toggleAnimation();
	  }
 
	  if (this.currentAction === "walk") {
		 const directionOffset = this.directionOffset();
		 this.rotateQuaternion.setFromAxisAngle(
			this.rotateAngle,
			directionOffset
		 );
		 this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2);
 
		 this.walkDirection.y = 0;
		 this.walkDirection.normalize();
		 this.walkDirection.applyAxisAngle(
			this.rotateAngle,
			directionOffset + Math.PI / 2
		 );
 
		 const moveX = this.walkDirection.x * this.velocity * delta;
		 const moveZ = this.walkDirection.z * this.velocity * delta;
		 this.model.position.x += moveX;
		 this.model.position.z += moveZ;
	  }
 
	  this.mixer.update(delta);
	}
 
	private toggleAnimation() {
	  if (this.currentAction === this.animationsList[0]) {
		 this.currentAction = this.animationsList[1];
		 this.animationsMap.get(this.animationsList[1]).reset().fadeIn(this.fadeDuration).play();
	  } else {
		 this.currentAction = this.animationsList[0];
		 this.animationsMap.get(this.animationsList[0]).reset().fadeIn(this.fadeDuration).play();
	  }
	}
 
	private directionOffset() {
	  return (Math.round(Math.random()) === 0 ? -1 : 1) * Math.PI / 2;
	}
 }
 