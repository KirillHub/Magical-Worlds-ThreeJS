import { Float, Text3D } from "@react-three/drei";
import { Position, Rotation } from "../../models/MainPropsSettings";

interface WordsProps {
	position: Position
	rotation: Rotation
	size: number
	text: string
}

export function Words({ position, rotation, size, text }: WordsProps) {
	const { rotX, rotY, rotZ } = rotation;
	const { posX, posY, posZ } = position;

	return (
		<>

			<Float position={[posX, posY, posZ]}
				rotation={[rotX, rotY, rotZ]}
				rotationIntensity={0.35} floatIntensity={0.5}>
				<Text3D
					font={"assets/shared/fonts/Roboto_Regular.json"}
					size={size}
					height={0.065}
					curveSegments={12}
				>
					{text}
					<meshStandardMaterial color={[1, 0.15, 0.1]} emissive={[1, 0.1, 0]} />
				</Text3D>
			</Float>
		</>
	);
}

