import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KombineMainProps } from "../../models/MainPropsSettings";

export const Building = ({
	position, rotation, scale, modelPath
}: KombineMainProps) => {
	const { rotX, rotY, rotZ } = rotation;
	const { posX, posY, posZ } = position;

	const gltf = useLoader(
		GLTFLoader, modelPath
	);

	return (
		<>
			<object3D
				rotation={[rotX, rotY, rotZ]}
				position={[posX, posY, posZ]}
				scale={[scale, scale, scale]}>
				<primitive object={gltf.scene} />
			</object3D>
		</>
	);
};





