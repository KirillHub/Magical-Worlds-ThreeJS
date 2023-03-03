import { useFrame, useLoader } from '@react-three/fiber';
import {
	useEffect, useRef, useState
} from 'react';
import { AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { KombineMainProps } from '../../models/MainPropsSettings';
import { Animation as animate } from '../../utils/animation';
import { randomNumber } from '../../utils/randGenerator';

interface PassiveBotProps {
	modelSettings: KombineMainProps
	animationsList: string[]
}

export const PassiveBot = ({
	modelSettings, animationsList
}: PassiveBotProps) => {

	const { rotX, rotY, rotZ } = modelSettings.rotation;
	const { posX, posY, posZ } = modelSettings.position;
	const scale = modelSettings.scale;
	const modelPath = modelSettings.modelPath;

	// default rotation
	const [rotation, setRotation] =
		useState<[number, number, number]>([rotX, rotY, rotZ]);
	const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
	const [animationInterval, setAnimationInterval] = useState(null);

	const modelRef = useRef();
	const mixerRef = useRef<AnimationMixer | undefined>();
	const animationActionsRef = useRef<Map<string, any>>(new Map());

	const currentAnimation = animationsList[currentAnimationIndex];
	const fadeDuration = 0.45;

	const gltf = useLoader(GLTFLoader, modelPath);

	useEffect(() => {
		if (!gltf) return

		const model = gltf.scene;
		const animations = gltf.animations || [];
		model.scale.set(scale, scale, scale);
		model.rotation.set(rotX, rotY, rotZ);
		modelRef.current = model;

		animate({ model, animations, animationActionsRef, mixerRef, currentAnimation })
	}, [gltf]);

	useEffect(() => {
		const mixer = mixerRef.current;
		if (mixer) {
			const animationAction = animationActionsRef.current.get(currentAnimation);
			animationAction.reset().fadeIn(fadeDuration).play();
		}
	}, [currentAnimation, currentAnimationIndex]);


	const crossFadeTo = (animation: string) => {
		const nextAnimation = animationActionsRef.current.get(currentAnimation);

		nextAnimation.reset().fadeIn(0.5).play();

		setCurrentAnimationIndex(animationsList.indexOf(animation));
	}

	useEffect(() => {

		const mixer = mixerRef.current;
		if (mixer) {
			const animationAction = animationActionsRef.current.get(currentAnimation);
			animationAction.reset().fadeIn(fadeDuration).play();
		}

	}, [currentAnimation, currentAnimationIndex]);


	useEffect(() => {
		const duration = randomNumber(10, 15);

		const intervalId = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * animationsList.length);
			const nextAnimation = animationsList[randomIndex];
			crossFadeTo(nextAnimation);
		}, duration);

		// return () => clearInterval(intervalId)
	}, [currentAnimationIndex])

	useFrame((_, delta) => {
		mixerRef.current ? mixerRef.current.update(delta) : false
	});

	return (
		<object3D castShadow={true} >
			<primitive position={[posX, posY, posZ]} object={gltf.scene} />
		</object3D>
	)
}
