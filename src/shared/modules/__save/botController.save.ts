import {
	Group,
	AnimationMixer,
	AnimationAction,
	Vector3,
	Quaternion
} from 'three'


export class BotControler {

	model: Group
	mixer: AnimationMixer
	animationsMap: Map<string, AnimationAction> = new Map() // Walk, Run, Idle

	// animaton list
	animationsList: string[]

	// state
	isToggleAnimation: boolean = false
	currentAction: string

	// temporary data
	walkDirection = new Vector3()
	rotateAngle = new Vector3(0, 1, 0)
	rotateQuarternion: Quaternion = new Quaternion()
	cameraTarget = new Vector3()

	// constants
	fadeDuration: number = 0.2
	velocity: number = 3

	constructor(model: Group,
		mixer: AnimationMixer,
		animationsMap: Map<string, AnimationAction>,
		currentAction: string, animationsList: string[]) {
		this.model = model
		this.mixer = mixer
		this.animationsMap = animationsMap
		this.currentAction = currentAction
		this.animationsList = animationsList

		this.animationsMap.forEach((value, key) => {
			// set by default 'stand' animation for model
			if (key === animationsList[0]) value.play()
		})

		/*
			this.animationsMap.forEach((value, key) => {
			console.log(key);
			if (key == currentAction) {
				value.play()
			}
		})
		*/
	}

	public switchActionToggle() {
		this.isToggleAnimation = !this.isToggleAnimation
	}

	public getPosition() {
		return this.model.position
	}

	public update(delta: number) {
		// direction random (left or right)

		var play = '';

		// we used only two types of animation;
		this.currentAction === 'stand' ?
			play = this.animationsList[0] :
			play = this.animationsList[1]


			if (this.currentAction === 'stand'){
				console.log('hi stand!!');
			}

		/*
		if (this.currentAction !== play) {
			const toPlay = this.animationsMap.get(play)
			const current = this.animationsMap.get(this.currentAction)

			current.fadeOut(this.fadeDuration)
			toPlay.reset().fadeIn(this.fadeDuration).play();

			this.currentAction = play
		}
		*/

		this.mixer.update(delta)

		if (this.currentAction === 'walk') {
			console.log('hi  walk');

			// diagonal movement angle offset
			var directionOffset = this.directionOffset()

			// rotate model

			// this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, directionOffset)
			// this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

			this.walkDirection.y = 0
			this.walkDirection.normalize()
			this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset)


			// move model & camera
			const moveX = this.walkDirection.x * this.velocity * delta
			const moveZ = this.walkDirection.z * this.velocity * delta
			this.model.position.x += moveX
			this.model.position.z += moveZ
		}
	}


	private directionOffset() {
		var directionOffset = 0 // w

		const randomNum = Math.round(Math.random());

		randomNum === 0 ?
			directionOffset = Math.PI / 2 :
			directionOffset = Math.PI;

		// Left (A direction Math.PI / 2) 	// a
		// Right (D direction -Math.PI / 2) // d 
		return directionOffset
	}
}