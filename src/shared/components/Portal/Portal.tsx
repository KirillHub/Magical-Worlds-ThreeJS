import { Float } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import {
	Scene, WebGLRenderTarget, TextureLoader, EquirectangularReflectionMapping,
	AlwaysStencilFunc, ReplaceStencilOp, DoubleSide, LinearEncoding, Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Path } from "../../constants/path";
import { FillQuad } from "./FillQuad";

// textures path
const textures = Path.textures_fancy;
const portalMinecraft = textures.portal.portalMinecraft;

const scene = new Scene();
scene.background = new TextureLoader().load(
	// process.env.PUBLIC_URL
	portalMinecraft,
	(texture) => {
		texture.encoding = LinearEncoding;
	}
);

const target = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
	stencilBuffer: false,
});

window.addEventListener("resize", () => {
	target.setSize(window.innerWidth, window.innerHeight);
});

interface PortalProps {
	portal: string
	portalMask: string
}

export const Portal = ({ portal, portalMask }: PortalProps) => {

	const {
		camera: camera,
	} = useThree();

	const model = useLoader(
		GLTFLoader,
		portal
	);
	const mask = useLoader(
		GLTFLoader,
		portalMask
	);

	useFrame((state) => {
		state.gl.setRenderTarget(target);
		state.gl.render(scene, state.camera);
		state.gl.setRenderTarget(null);
	});

	useEffect(() => {
		if (!model) return;

		let mesh = model.scene.children[0];
		mesh.material.envMapIntensity = 3.5;

		let maskMesh = mask.scene.children[0];
		maskMesh.material.transparent = false;
		maskMesh.material.side = DoubleSide;
		maskMesh.material.stencilFunc = AlwaysStencilFunc;
		maskMesh.material.stencilWrite = true;
		maskMesh.material.stencilRef = 1;
		maskMesh.material.stencilZPass = ReplaceStencilOp;
	}, [model, mask]);

	return (
		<>
			<Suspense>
				<primitive object={model.scene} />
				<primitive object={mask.scene} />
				<FillQuad map={target.texture} maskId={1} />
			</Suspense>
		</>
	);
}
