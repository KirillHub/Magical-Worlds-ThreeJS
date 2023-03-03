import { OrbitControls, PerspectiveCamera, Environment, Float } from "@react-three/drei";
import {
	EffectComposer, HueSaturation, ChromaticAberration, GodRays,
	DepthOfField, BrightnessContrast
} from "@react-three/postprocessing";
import { Suspense } from "react";
import { AmbientLight, Color, CylinderGeometry, Mesh, MeshBasicMaterial } from "three";
import { BotWithActions } from "../../shared/components/Characters/BotWithActions";
import { Soldier } from "../../shared/components/Characters/Soldier";
import { Vegetation } from "../../shared/components/Ground/Vegetation";
import { Ground } from "../../shared/components/Ground/Ground";
import { Portal } from "../../shared/components/Portal/Portal";
import { PortalParticles } from "../../shared/components/Portal/PortalParticles";
import { Words } from "../../shared/components/Words/Words";
import { Path } from "../../shared/constants/path";
import { PORTAL_POSITION } from "../../shared/utils/portalRectanglePosition";
import { Trees } from "./Trees";
import { PassiveBot } from "../../shared/components/Characters/PassiveBot";
import { Building } from "../../shared/components/Buildings/Building";

let lightColor = new Color(1, 0.2, 0.1);
let mesh = new Mesh(
	new CylinderGeometry(0.3, 0.3, 0.2, 20),
	new MeshBasicMaterial({
		color: lightColor,
		transparent: true,
		opacity: 1,
	})
);
mesh.rotation.x = Math.PI * 0.5;
mesh.position.set(1.17, 10.7, -4.1);
mesh.scale.set(1.5, 1, 1);

export const RealityScene = () => {
	// portal position
	const { posX, posY, posZ } = PORTAL_POSITION;

	//models path
	const models = Path.models_reality;
	const { oldHouse } = models.buildings;

	const { grass, deadGrass, dryGrass,
		tree, treePinus
	} = models.ground;
	const { girl } = models.characters;

	// textures path
	const textures = Path.textures_reality;
	const { forestDiff, forestNor, forestRough } = textures.forestGround;
	const texturesShared = Path.textures_shared;
	const { kloofendal, envmap } = texturesShared.background;

	const modelShared = Path.models_shared;
	const { soldier, ellieBella } = modelShared.characters;
	const { portalMask, portal } = modelShared.portal;


	return (
		<Suspense fallback={null}>
			{/* BACKGROUND */}
			<Environment background={"only"} files={kloofendal} />
			<Environment background={false} files={envmap} />

			<PerspectiveCamera makeDefault fov={50} position={[-1.75, 10.85, 20.35]} />

			<ambientLight intensity={0.25} />
			<directionalLight
				color={0xffffff}
				intensity={0.35}
				position={[-60, 100, -10]}
				castShadow={true}
			/>

			{/* PORTAL */}
			<Float
				speed={0.5}
				rotationIntensity={0.25}
				floatIntensity={0.6}
				position={[posX, posY, posZ]}
				rotation={[0, 0, 0.035]}
			>

				<primitive object={mesh} />
				<spotLight
					penumbra={1}
					distance={200}
					angle={60.65}
					intensity={0.3}
					color={lightColor}
					position={[1.19, 10.85, -4.45]}
					target-position={[0, 0, -1]}
				/>

				<Portal portal={portal} portalMask={portalMask} />
				<Words
					position={{ posX: 3.25, posY: 6.5, posZ: -1.5 }}
					rotation={{ rotX: 0, rotY: -0.67, rotZ: 0 }}
					size={0.3}
					text={'Teleport to the fantasy world'}
				/>
				<PortalParticles />
			</Float>

			<Float
				speed={0}
				rotationIntensity={0}
				floatIntensity={0}>

				{/* GROUND */}
				<Ground
					imagesPath={[forestDiff, forestNor, forestRough]}
					position={{ posX: 0, posY: -0.1, posZ: 0 }}
				/>

				{/* GRASS */}
				<Vegetation
					modelPath={dryGrass}
					grassCount={300}
					koefModelScale={3.5}
					position={{ posX: 0, posY: -0.22, posZ: 0 }}
				/>
				<Vegetation
					modelPath={grass}
					grassCount={150}
					koefModelScale={3.5}
					position={{ posX: 0, posY: -0.22, posZ: 0 }}
				/>
				<Vegetation
					modelPath={deadGrass}
					grassCount={100}
					koefModelScale={0.030}
					position={{ posX: 0, posY: -0.22, posZ: 0 }}
				/>

				{/* TREES */}
				<Vegetation
					modelPath={tree}
					grassCount={15}
					scale={6}
					position={{ posX: 0, posY: 7.5, posZ: 0 }}
				/>
				<Vegetation
					modelPath={treePinus}
					grassCount={15}
					scale={4}
					position={{ posX: 0, posY: 0, posZ: 0 }}
				/>

				{/* CHARACTERS */}
				<Soldier scale={1.5}
					position={{ posX: 0, posY: 0, posZ: 0 }}
					modelPath={soldier}
				/>
				<BotWithActions
					modelSettings={{
						position: { posX: -2, posY: 0, posZ: -51 },
						scale: 34,
						rotation: { rotX: 0, rotY: 0, rotZ: 0 },
						modelPath: girl
					}}
					animationsList={['idle', 'walking']}
				/>
				<PassiveBot
					modelSettings={{
						position: { posX: -10, posY: 0, posZ: -20 },
						scale: 2,
						rotation: { rotX: 0, rotY: 0, rotZ: 0 },
						modelPath: ellieBella
					}}
					animationsList={[
						'Armature|mixamo.com|Layer0', 'Armature.001|mixamo.com|Layer0'
					]}
				/>

				{/* BUILDINGS */}
				< Building
					position={{ posX: -25, posY: 0, posZ: -30 }}
					scale={0.025}
					rotation={{ rotX: 0, rotY: 0, rotZ: 0 }}
					modelPath={oldHouse}
				/>

			</Float>

			<EffectComposer stencilBuffer={true}>
				<HueSaturation hue={0} saturation={-0.15} />
				<BrightnessContrast brightness={0.0} contrast={0.035} />
				<ChromaticAberration radialModulation={true} offset={[0.00175, 0.00175]} />
				<GodRays
					sun={mesh}
					samples={40}
					density={0.97}
					decay={0.97}
					weight={0.6}
					exposure={0.3}
					clampMax={1}
				/>
			</EffectComposer>
		</Suspense>
	)
}