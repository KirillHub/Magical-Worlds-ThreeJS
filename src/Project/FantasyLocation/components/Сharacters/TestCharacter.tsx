import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function TestCharacter({ modelPath }) {
	const gltf = useLoader(GLTFLoader, modelPath);

	useEffect(() => {
		if (!gltf) return;

		console.log(gltf.animations);
		let mesh = gltf.scene.children[0];
		// mesh.material.envMapIntensity = 2.5;
	}, [gltf]);

	return (
		<primitive object={gltf.scene} />
	)
}