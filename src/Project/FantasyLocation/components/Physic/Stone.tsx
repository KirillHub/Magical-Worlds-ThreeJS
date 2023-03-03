import { useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSphere, useBox, usePlane, useCylinder } from '@react-three/cannon';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { useGLTF } from '@react-three/drei';
import { Vector3 } from 'three';
import { Position, PositionProps } from '../../../../shared/models/MainPropsSettings';

//TODO: Куб не всегда чётко касается ground, т.к. он в обёрнут оболочкой физ. тела Box

interface StoneProps {
	position: Position
	modelPath: string
}

export const Stone = ({ position, modelPath }: StoneProps) => {
	const { posX, posY, posZ } = position;
	const scale = 3;
	const [rotation, setRotation] = useState<[number, number, number]>([0, 0, 0]);

	// get actual user camera direction
	const { camera } = useThree();

	const [direction, setDirection] = useState(
		camera.getWorldDirection(new Vector3())
	);

	// resetting the flight time of a stone after a user click
	const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);

	// load model of stone
	const gltf = useGLTF('assets/fantasyLocation/GLTFModels/ground/rock_stone.glb') as GLTF;

	// apply physics
	const [ref, api] = useBox(() => ({
		mass: 1,
		position: [posX, posY, posZ],
		args: [1 * scale, 1 * scale, 1 * scale],
		collisionFilterGroup: 1,
		collisionFilterMask: 1,
		linearDamping: 0.5,
		angularDamping: 0.5,
		velocity: [0, 0, 0],
	}));

	useEffect(() => {
		if (!gltf) return;
		const model = gltf.scene;
		model.scale.set(scale, scale, scale);
	}, [gltf]);

	usePlane(() => ({
		position: [0, 0, 0],
		rotation: [-Math.PI / 2, 0, 0],
		// onCollide: () => console.log('Collided with plane'),
	}));


	useEffect(() => {
		setDirection(camera.getWorldDirection(new Vector3()))
		direction.normalize();
	}, [camera, direction]);

	const throwStone = (direction: { x: number, y: number, z: number }) => {
		api.velocity.set(direction.x * 20, direction.y * 0, direction.z * 20);
		// api.applyImpulse([direction.x * 20, direction.y * 20, direction.z * 20], [0, 0, 0])
	};

	const handleClick = () => {
		const vector = new Vector3();
		camera.getWorldDirection(vector);

		// Calculate the throw direction based on the camera direction and the x and y offsets
		throwStone(direction)

		// set rotation stone around its axis
		const newRotation: [number, number, number] = [
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
			Math.random() * Math.PI * 2,
		];
		setRotation(newRotation);

		if (resetTimeout) {
			clearTimeout(resetTimeout);
		}

		setResetTimeout(setTimeout(() => {
			api.velocity.set(0, 0, 0);
		}, 1000));
	}

	return (
		<mesh
			ref={ref}
			onClick={handleClick}
			rotation={rotation}
		>
			<primitive object={gltf.scene} />
		</mesh>
	);
};
