import { useLoader } from '@react-three/fiber';
import { useEffect } from "react";
import {
	RepeatWrapping,
	TextureLoader,
	LinearEncoding
} from 'three';
import { LENGTH, POSITION, WIDTH } from '../../constants/ground';
import { Position } from '../../models/MainPropsSettings';


interface GroundProps {
	imagesPath: string[]
	position: Position
}

export function Ground({
	imagesPath, position
}: GroundProps) {

	const { posX, posY, posZ } = position;

	const [sandBaseColor,
		sandNormalMap, sandHeightMap,] = useLoader(TextureLoader,
			[...imagesPath]);

	useEffect(() => {
		[sandBaseColor,
			sandNormalMap, sandHeightMap,
		].forEach((t) => {
			t.wrapS = RepeatWrapping;
			t.wrapT = RepeatWrapping;
			t.repeat.set(10, 10);
			t.offset.set(0, 0);
		});

		sandNormalMap.encoding = LinearEncoding;
	}, [sandBaseColor,
		sandNormalMap, sandHeightMap,
	]);

	return (
		<mesh
			rotation-x={-Math.PI * 0.5}
			castShadow
			receiveShadow
			position={[posX, posY, posZ]}>
			<planeGeometry args={[WIDTH, LENGTH, 512, 512]} />

			<meshStandardMaterial
				map={sandBaseColor}
				normalMap={sandNormalMap}
				displacementMap={sandHeightMap}
				displacementScale={0.1}
			/>
		</mesh>
	)
}