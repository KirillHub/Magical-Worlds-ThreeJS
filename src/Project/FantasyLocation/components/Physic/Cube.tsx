import { useBox } from "@react-three/cannon";
import { Position } from "../../../../shared/models/MainPropsSettings";


function Cube({ position }: any) {
	const [ref, api] = useBox(() => ({
		mass: 0.85,
		args: [1, 1, 1],
		position: position
	}));

	return (
		<mesh ref={ref}>
			<boxGeometry args={[1.5, 1.5, 1.5]} />
			<meshStandardMaterial color="#00ff00" />
		</mesh>
	);
}

export function Cubes() {
	return (
		<>
			<Cube position={[23, 2, 0]} />
			<Cube position={[23, 2, 0]} />
			<Cube position={[21, 2, 2]} />
			<Cube position={[21, 2, -2]} />
		</>
	);
}
