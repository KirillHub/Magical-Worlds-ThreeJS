import { useFrame, useLoader } from '@react-three/fiber';
import {
	useEffect, useRef, useState, useCallback,
} from 'react';
import { MathUtils } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { KombineMainProps } from '../../models/MainPropsSettings';
import { randomNumber } from '../../utils/randGenerator';
import { Animation as animate } from '../../utils/animation';

interface BotWithActionsProps {
	modelSettings: KombineMainProps
	animationsList: string[]
}

interface ModelPositionProps {
	startModelPos: number;
	currentModelPos: number;
	direction: number;
}

interface ModelProps {
	startModelPos: number;
	currentModelPos: number;
	rotAngle: number;
	speed: number;
	distance: number;
}

// Set only idle or walking animation! 
// This component toggling animation of bot (idle || walking)
// By default first element of array is standing pose (idle)

export const BotWithActions = ({
	modelSettings, animationsList
}: BotWithActionsProps) => {

	const distance = 2.5;
	const fadeDuration = 0.4;
	const direction = 1;
	const rotationAngle = 90;
	const modelSpeed = 0.019;

	const { rotX, rotY, rotZ } = modelSettings.rotation;
	const { posX, posY, posZ } = modelSettings.position;
	const scale = modelSettings.scale;
	const modelPath = modelSettings.modelPath;

	const modelRef = useRef();
	const mixerRef = useRef();
	const animationActionsRef = useRef<Map<string, any>>(new Map());

	const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);

	// default rotation
	const [rotation, setRotation] =
		useState<[number, number, number]>([rotX, rotY, rotZ]);
	const [isRotating, setIsRotating] = useState(false);
	const [isModelMoving, setIsModelMoving] = useState(false);
	const [countModelInStartPos, setCountModelInStartPos] = useState(1);

	const currentAnimation = animationsList[currentAnimationIndex];

	const gltf = useLoader(GLTFLoader, modelPath);

	const rotateModel = useCallback((angle: number, direction = 1) => {
		const newRotation = [...rotation];
		newRotation[1] += MathUtils.degToRad(angle * direction);
		setRotation([newRotation[0], newRotation[1], newRotation[2]]);
		modelRef.current.rotateY(MathUtils.degToRad(angle * direction));
	}, [])

	const toggleModelDirection = useCallback(() => {
		if (currentAnimationIndex !== 1) {
			const direction = Math.random() < 0.5 ? -1 : 1;
			rotateModel(rotationAngle, direction);
			setIsModelMoving(true)
		}
	}, [currentAnimationIndex, direction])


	useEffect(() => {
		if (!gltf) return

		const model = gltf.scene;
		const animations = gltf.animations || [];

		model.scale.set(scale, scale, scale);
		// model.rotation.set(rotX, rotY, rotZ);
		modelRef.current = model;

		animate({ model, animations, animationActionsRef, mixerRef, currentAnimation })
	}, [gltf, isModelMoving]);

	useEffect(() => {
		const duration = randomNumber(2, 5);
		setTimeout(() => {
			toggleModelDirection()
			setIsRotating(true)
			setCurrentAnimationIndex(1);
		}, duration)
	}, [currentAnimationIndex]);


	useEffect(() => {
		const mixer = mixerRef.current;
		if (mixer) {
			const animationAction = animationActionsRef.current.get(currentAnimation);
			animationAction.reset().fadeIn(fadeDuration).play();
		}

	}, [currentAnimation, isModelMoving, currentAnimationIndex]);

	const modelReturnedToStartPosition = (
		{ startModelPos, currentModelPos, direction }: ModelPositionProps) => {

		if (startModelPos === currentModelPos) {
			setCountModelInStartPos(prev => prev + 1)

			if (countModelInStartPos % 2 !== 0) {
				setIsModelMoving(false)
				rotateModel(90, direction)
				setCurrentAnimationIndex(0)
			} else setIsModelMoving(true)

		}
	};

	const checkModelPosition = (
		{ startModelPos, currentModelPos,
			rotAngle, speed, distance }: ModelProps) => {

		const angle = 180;
		const movingOnLeftDirection = 1;
		const movingOnRightDirection = -1;

		if (rotAngle < 0) {
			if (startModelPos - distance >= currentModelPos) {
				rotateModel(angle, movingOnLeftDirection)
			} else {
				modelReturnedToStartPosition({
					startModelPos, currentModelPos, direction: movingOnLeftDirection
				})
				modelRef.current.position.x -= speed;
			}
		} else {
			if (startModelPos + distance <= currentModelPos) {
				rotateModel(angle, movingOnRightDirection)
			} else {
				modelReturnedToStartPosition({
					startModelPos, currentModelPos, direction: movingOnRightDirection
				})
				modelRef.current.position.x += speed;
			}
		}
	};

	function movementController() {
		const getStartPosition = posX;

		if (isRotating) {
			checkModelPosition({
				startModelPos: getStartPosition,
				currentModelPos: modelRef.current.position.x,
				rotAngle: rotation[1],
				speed: modelSpeed,
				distance
			})
		}
	}

	useFrame((_, delta) => {
		mixerRef.current ? mixerRef.current.update(delta) : false

		isModelMoving ? movementController() : false
	});

	return (
		<object3D castShadow={true} rotation={[rotX, rotY, rotZ]}>
			<primitive position={[posX, posY, posZ]} object={gltf.scene} />
		</object3D>
	);
}
