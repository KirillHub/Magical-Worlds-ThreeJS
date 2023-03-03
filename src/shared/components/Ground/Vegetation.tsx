import { useRef, useEffect } from "react";
import { Mesh, Vector3, Group } from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LENGTH, WIDTH } from "../../constants/ground";
import { Position } from "../../models/MainPropsSettings";

interface VegetationProps {
	grassCount: number
	koefModelScale?: number
	scale?: number
	position: Position
	modelPath: string
}

export const Vegetation = ({
	grassCount, position, scale, koefModelScale, modelPath
}: VegetationProps) => {
	const grassModelRef = useRef<Group>();
	const groupRef = useRef<Group>();
	const { posX, posY, posZ } = position;

	useEffect(() => {
		const loader = new GLTFLoader();
		loader.load(modelPath, (gltf) => {
			grassModelRef.current = gltf.scene;
			grassModelRef.current.traverse((child) => {
				if (child instanceof Mesh) {
					child.castShadow = true;
				}
			});

			let i = 0
			while (i < grassCount) {
				const clonedGrass = grassModelRef.current.clone();

				if (koefModelScale !== undefined) {
					const scale = Math.random() * koefModelScale;
					clonedGrass.scale.set(scale, scale, scale);
				}

				if (scale !== undefined) {
					clonedGrass.scale.set(scale, scale, scale)
				}

				const rand_x = posX + (Math.random() - 0.5) * 500;
				const rand_z = posZ + (Math.random() - 0.5) * 500;

				if (posX < -WIDTH / 2 || posX > WIDTH / 2 || posZ < -LENGTH / 2 || posZ > LENGTH / 2) {
					continue;
				} else {
					i++;

					clonedGrass.position.set(rand_x, posY, rand_z);

					const angle = Math.random() * Math.PI * 2;
					clonedGrass.setRotationFromAxisAngle(new Vector3(0, 1, 0), angle);

					groupRef.current?.add(clonedGrass);
				}
			}

		});
	}, [grassCount, position]);

	return <group ref={groupRef} />;
};