import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { MutableRefObject, useEffect, useRef, useLayoutEffect, useState } from 'react';
import { AnimationClip, AnimationMixer, Mesh } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { CharacterControls } from '../../modules/characterControls';
import { OrbitControls as Orbit } from 'three/examples/jsm/controls/OrbitControls'
import { OrbitControls } from "@react-three/drei";  // PerspectiveCamera
import { KeyDisplay } from '../../utils/keysController';
import { MainProps, Position } from '../../models/MainPropsSettings';
import { getLocation, setNewLocation } from '../../../store/locationSlice/slice';
import { useDispatch, useSelector } from 'react-redux';
import { RECTANLGE_SIDE_MAX_X, RECTANLGE_SIDE_MAX_Z, RECTANLGE_SIDE_MIN_X, RECTANLGE_SIDE_MIN_Z } from '../../utils/portalRectanglePosition';


export const Soldier = ({
	position, scale, modelPath
}: MainProps<Position>) => {
	const { posX, posY, posZ } = position;

	const dispatch = useDispatch();
	const [location, setLocation] = useState(useSelector(getLocation));

	const characterControlsRef = useRef<CharacterControls>();
	const orbitRef = useRef<MutableRefObject<typeof OrbitControls>>(null);

	const {
		camera: camera,
		gl: webGLRenderer,
		scene: scene
	} = useThree();


	var characterControls: CharacterControls

	const gltf = useLoader(GLTFLoader, modelPath);

	useLayoutEffect(() => {
		if (!gltf) return;

		let mesh = gltf.scene.children[0];

		mesh.traverse(function (object: any) {
			if (object.isMesh) object.castShadow = true;
		});

		const model = gltf.scene;
		model.traverse(function (object: any) {
			if (object.isMesh) object.castShadow = true;
		});

		model.scale.set(scale, scale, scale)

		const gltfAnimations: AnimationClip[] = gltf.animations;
		const mixer = new AnimationMixer(model);
		const animationsMap: Map<string, THREE.AnimationAction> = new Map()
		gltfAnimations.filter(a => a.name != 'TPose').forEach((a: THREE.AnimationClip) => {
			animationsMap.set(a.name, mixer.clipAction(a))
		})

		setTimeout(() => {
			characterControlsRef.current =
				new CharacterControls(
					model, mixer, animationsMap, orbitRef.current, camera, 'Idle'
				)
		}, 4000)

	}, [gltf]);

	// CONTROL KEYS
	const keysPressedRef = useRef<{ [key: string]: boolean }>({});
	const keyDisplayQueueRef = useRef<KeyDisplay>(new KeyDisplay());

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			keyDisplayQueueRef.current.down(event.key);
			if (event.shiftKey && characterControls) {
				characterControls.switchRunToggle();
			} else {
				(keysPressedRef.current as any)[event.key.toLowerCase()] = true;
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			keyDisplayQueueRef.current.up(event.key);
			(keysPressedRef.current as any)[event.key.toLowerCase()] = false;
		};

		document.addEventListener("keydown", handleKeyDown, false);
		document.addEventListener("keyup", handleKeyUp, false);

		return () => {
			document.removeEventListener("keydown", handleKeyDown, false);
			document.removeEventListener("keyup", handleKeyUp, false);
		};
	}, []);

	/*============================================================================================================*/
	/*
	'Для корректной работы камеры нужно что то вписать в компоненте Soldier в консоли. 
	*/
	// TODO: почему камера при инициализации компонента не корректно отрабатывает?
	useEffect(() => {
		// setTimeout(() => 'd', 3000)
		setTimeout(() => confirm('После инициализации сцены напиши к консоли компонента Soldier! Тогда камера будет корректно отрабатывать'), 3000)
		console.log(`Something here: 123`);
	}, [])
	/*============================================================================================================*/

	useLayoutEffect(() => {
		if (characterControlsRef.current && camera) {
			characterControlsRef.current.camera = camera;
		}
	}, [camera, characterControlsRef.current]);

	useFrame((state, delta) => {
		let mixerUpdateDelta = delta;
		let pos = characterControlsRef.current?.getPosition()
		let x = pos?.x
		let z = pos?.z

		if (characterControlsRef.current) {
			characterControlsRef.current.update(mixerUpdateDelta, keysPressedRef.current);

			if (x! >= RECTANLGE_SIDE_MIN_X &&
				x! <= RECTANLGE_SIDE_MAX_X &&
				z! >= RECTANLGE_SIDE_MIN_Z &&
				z! <= RECTANLGE_SIDE_MAX_Z) {

				location === 'default' ?
					dispatch(setNewLocation('reality')) :
					dispatch(setNewLocation('default'))
			}
		}

		state.gl.render(state.scene, state.camera)
	});

	return (
		<>
			<OrbitControls
				ref={orbitRef}
				maxPolarAngle={(Math.PI / 2) - 0.016}
				target={[1, 5, 0]}
				minDistance={7} maxDistance={15}
			/>
			<object3D castShadow={true}>
				<primitive position={[posX, posY, posZ]} object={gltf.scene} />
			</object3D>
		</>
	);
}