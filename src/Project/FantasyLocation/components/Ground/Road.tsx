import { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { KombineMainProps } from '../../../../shared/models/MainPropsSettings';


export const Road = ({
	position, rotation, scale, modelPath
}: KombineMainProps) => {

	const { posX, posY, posZ } = position;
	const { rotX, rotY, rotZ } = rotation;

	const modelRef = useRef<THREE.Group>();

	const roadGLTF = useLoader(GLTFLoader, modelPath);

	return (
		<>
			<object3D
				position={[posX, posY, posZ]}
				rotation={[rotX, rotY, rotZ]}
				castShadow={true}>
				<primitive
					ref={modelRef}
					scale={[scale, scale, scale]}
					object={roadGLTF.scene} />
			</object3D>
		</>
	)
};

