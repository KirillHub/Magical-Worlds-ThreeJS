import { useEffect, useMemo, useRef } from 'react';
import * as Matter from 'matter-js';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';


type Props = {
	position: { x: number; y: number };
	engine: Matter.Engine;
	groundBody: Matter.Body;
};

const Ball = ({ position, engine, groundBody }: Props) => {
	const ref = useRef<THREE.Mesh>();

	useEffect(() => {
		const ballMesh = ref.current!;
		// create Matter.js body
		const ballBody = Matter.Bodies.circle(position.x, position.y, 20, {
			restitution: 0.5,
			friction: 0.1,
			density: 1000, // high density makes the object more solid
		});
		// add Matter.js body to the engine
		Matter.World.add(engine.world, ballBody);

		// keep the Three.js mesh and the Matter.js body in sync
		Matter.Events.on(engine, 'beforeUpdate', (event: Matter.IEventTimestamped<Matter.Engine>) => {
			ballMesh.position.copy(new THREE.Vector3(ballBody.position.x, ballBody.position.y, 0));
			ballMesh.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), ballBody.angle);
		});

		// clean up
		return () => {
			Matter.World.remove(engine.world, ballBody);
		};
	}, [position, engine]);

	return (
		<mesh ref={ref} position={[position.x, position.y, 0]} scale={[12, 12, 12]}>
			<sphereGeometry args={[20, 32, 32]} />
			<meshStandardMaterial color={0xff0000} />
		</mesh>
	);
};

export const Stone = () => {
	const {
		camera,
		gl: renderer,
		scene,
	} = useThree();

	const groundBody = useMemo(
		() => Matter.Bodies.rectangle(0, -100, window.innerWidth, 20, { isStatic: true }),
		[]
	);
	const engine = useMemo(() => Matter.Engine.create(), []);

	useEffect(() => {
		// add the ground to the engine
		Matter.World.add(engine.world, groundBody);

		return () => {
			// remove the ground from the engine
			Matter.World.remove(engine.world, groundBody);
		};
	}, [engine.world, groundBody]);

	useFrame((state, delta) => {
		// update the Matter.js engine
		Matter.Engine.update(engine, delta * 1000);

		// keep the Three.js scene and the Matter.js engine in sync
		scene.traverse((object) => {
			if (object.userData.body) {
				object.position.copy(object.userData.body.position);
				object.quaternion.copy(object.userData.body.quaternion);
			}
		});

		// render the Three.js scene
		renderer.render(scene, camera)
	});

	return (
		<>
			<Ball position={{ x: 0, y: 40 }} engine={engine.current} groundBody={groundBody.current} />
			<mesh position={[0, -100, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ body: groundBody }}>
				<planeBufferGeometry args={[window.innerWidth, 20]} />
				<meshPhongMaterial color={0xaaaaaa} />
			</mesh>
		</>
	);
};


