import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationClip, AnimationMixer, Group, Vector3, Euler } from 'three';
import { useFrame, useLoader } from "@react-three/fiber";
import { KombineMainProps, Position } from "../../../../shared/models/MainPropsSettings";

interface TorchProps {
	pieceCount: number
	pieceSize: number
	distanceBetweenPieces: number
	modelSettings: KombineMainProps
}

export const Torch = ({
	pieceCount,
	pieceSize,
	distanceBetweenPieces,
	modelSettings
}: TorchProps) => {
	const [torch, setTorch] = useState<Group | null>(null);
	const torchRef = useRef<Group>();
	const pieceRefs = useRef<Group[]>([]);
	const mixers = useRef<AnimationMixer[]>([]);

	const { position, rotation, modelPath, scale } = modelSettings;
	const { posX, posY, posZ } = position;
	const { rotX, rotY, rotZ } = rotation;

	const animation = "Burning";

	const gltf = useLoader(GLTFLoader, modelPath);

	useEffect(() => {
		if (gltf && gltf.scene) {
			const newTorch = new Group();

			for (let i = 0; i < pieceCount; i++) {
				const newPiece = gltf.scene.clone();
				newPiece.scale.set(scale, scale, scale);
				newPiece.position.x = i * (pieceSize + distanceBetweenPieces);
				newTorch.add(newPiece);
				pieceRefs.current.push(newPiece);
			}

			setTorch(newTorch);
		}
	}, [gltf, pieceCount, pieceSize, distanceBetweenPieces]);

	useFrame((state, delta) => {
		mixers.current.forEach(mixer => mixer.update(delta));
	});

	useEffect(() => {
		if (torchRef.current && torch) {
			torchRef.current.add(torch);

			if (pieceRefs.current.length > 0) {
				pieceRefs.current.forEach((piece, i) => {
					mixers.current[i] = new AnimationMixer(piece.children[0]);
					const animationClip = AnimationClip.findByName(gltf.animations, animation);
					if (animationClip) {
						const action = mixers.current[i].clipAction(animationClip);
						action.play();
					}
				});
			}
		}
	}, [torchRef.current, torch, pieceRefs.current, gltf]);

	return (
		<mesh rotation={new Euler(rotX, rotY, rotZ, "XYZ")}>
			<group
				ref={torchRef}
				position={new Vector3(posX, posY, posZ)}
			/>
		</mesh>
	);
};