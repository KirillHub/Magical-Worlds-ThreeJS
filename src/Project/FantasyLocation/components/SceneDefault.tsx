import { PerspectiveCamera, Environment, Float } from "@react-three/drei";
import {
	EffectComposer, HueSaturation, ChromaticAberration, GodRays,
	DepthOfField, BrightnessContrast
} from "@react-three/postprocessing";
import { Suspense, useRef } from "react";
import { Color, CylinderGeometry, Mesh, MeshBasicMaterial } from "three";
import { Portal } from "../../../shared/components/Portal/Portal";
import { Ground } from "../../../shared/components/Ground/Ground";
import { Soldier } from "../../../shared/components/Characters/Soldier";
import { Vegetation } from "../../../shared/components/Ground/Vegetation";
import { Road } from "./Ground/Road";
import { Torch } from "./Ground/Torch";
import { Physics } from "@react-three/cannon";
import { Stone } from "./Physic/Stone";
import { Cubes } from "./Physic/Cube";
import { Words } from "../../../shared/components/Words/Words";
import { BotWithActions } from "../../../shared/components/Characters/BotWithActions";
import { PassiveBot } from "../../../shared/components/Characters/PassiveBot";
import { Path } from "../../../shared/constants/path";
import { TestCharacter } from "./Сharacters/TestCharacter";
import { PortalParticles } from "../../../shared/components/Portal/PortalParticles";
import { Building } from "../../../shared/components/Buildings/Building";
import { PORTAL_POSITION } from "../../../shared/utils/portalRectanglePosition";


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


export const SceneDefault = () => {
	// portal pos
	const { posX, posY, posZ } = PORTAL_POSITION;

	//models path
	const models = Path.models_fancy;
	const { azri, majd } = models.characters;
	const { house } = models.buildings;
	const { chineseFountainGrass, road, rockStone, torch } = models.ground;

	// textures path
	const textures = Path.textures_fancy;
	const { grassDiff, grassNor, grassRough } = textures.dirtGround;
	const texturesShared = Path.textures_shared;
	const { kloofendal, envmap } = texturesShared.background;


	const modelShared = Path.models_shared;
	const { soldier, ellieBella } = modelShared.characters;
	const { portalMask, portal } = modelShared.portal;


	return (
		<Suspense fallback={null}>
			<Environment background={"only"} files={kloofendal} />
			<Environment background={false} files={envmap} />

			<PerspectiveCamera makeDefault fov={50} position={[-1.75, 10.85, 20.35]} />

			{/* LIGHT */}
			<ambientLight intensity={0.45} />
			<directionalLight
				color={0xffffff}
				intensity={0.35}
				position={[-60, 100, -10]}
				castShadow={true}
			/>

			{/* PORTAL */}
			<Float
				speed={0}
				rotationIntensity={0}
				floatIntensity={0}
				position={[posX, posY, posZ]}
				rotation={[0, 0, 0.035]}
			>
				<primitive object={mesh} />
				<spotLight
					penumbra={1}
					distance={500}
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
					text={'Teleport to the real world'}
				/>
				<PortalParticles />

			</Float>

			<Float
				speed={0}
				rotationIntensity={0}
				floatIntensity={0}>

				{/* GROUND */}
				<Ground
					imagesPath={[grassDiff, grassNor, grassRough]}
					position={{ posX: 0, posY: -0.1, posZ: 0 }}
				/>
				{/* GRASS */}
				<Vegetation
					modelPath={chineseFountainGrass}
					grassCount={350}
					koefModelScale={6}
					position={{ posX: 0, posY: -0.22, posZ: 0 }}
				/>
				<Road
					position={{ posX: 6, posY: -11.1, posZ: -16 }}
					rotation={{ rotX: 0.02, rotY: 0, rotZ: 0.037 }}
					scale={1}
					modelPath={road} />
				{/* LEFT SIDE TORCHES */}
				<Torch
					pieceCount={5}
					pieceSize={1}
					distanceBetweenPieces={10}
					modelSettings={{
						scale: 0.25,
						position: { posX: 3, posY: -0.89, posZ: -8 },
						rotation: { rotX: 0, rotY: 1.57, rotZ: 0 },
						modelPath: torch
					}}
				/>
				{/* RIGHT SIDE TORCHES */}
				<Torch
					pieceCount={5}
					pieceSize={1}
					distanceBetweenPieces={10}
					modelSettings={{
						scale: 0.25,
						position: { posX: 3, posY: -0.89, posZ: 10 },
						rotation: { rotX: 0, rotY: 1.57, rotZ: 0 },
						modelPath: torch
					}}
				/>

				{/* CHARACTERS */}
				<Soldier scale={1.5}
					position={{ posX: 0, posY: 0, posZ: 0 }}
					modelPath={soldier}
				/>

				<BotWithActions
					modelSettings={{
						position: { posX: -2, posY: 0, posZ: -51 },
						scale: 2.5,
						rotation: { rotX: 0, rotY: 0, rotZ: 0 },
						modelPath: majd
					}}
					animationsList={['Idel', 'Walk']}
				/>
				<BotWithActions
					modelSettings={{
						position: { posX: 15, posY: 0, posZ: -10 },
						scale: 2,
						rotation: { rotX: 0, rotY: 0, rotZ: 0 },
						modelPath: azri
					}}
					animationsList={['Idle', 'Walking']}
				/>
				<PassiveBot
					modelSettings={{
						position: { posX: -4, posY: 0, posZ: 20 },
						scale: 2,
						rotation: { rotX: 0, rotY: 3.14, rotZ: 0 },
						modelPath: ellieBella
					}}
					animationsList={[
						'Armature|mixamo.com|Layer0', 'Armature.001|mixamo.com|Layer0'
					]}
				/>

				{/* <SoldierPhysics position={[10, 0, 10]} rotation={[0, 0, 0]} scale={1.5} /> */}

				{/* BUILDINGS */}
				< Building
					position={{ posX: 4, posY: 11.1, posZ: 30 }}
					scale={12}
					rotation={{ rotX: 0, rotY: 3.14, rotZ: 0 }}
					modelPath={house}
				/>

				{/* PHYSIC COMP. */}
				<Cubes />
				<Stone
					position={{ posX: 15, posY: 0, posZ: -20 }}
					modelPath={rockStone}
				/>

				{/* WORDS */}
				<Words
					position={{ posX: 13.5, posY: 4, posZ: -16 }}
					rotation={{ rotX: 0, rotY: -0.5, rotZ: -0.05 }}
					size={0.57}
					text={'Playground'}
				/>
				<Words
					position={{ posX: 13.75, posY: 3.5, posZ: -16.75 }}
					rotation={{ rotX: 0, rotY: -1.35, rotZ: -0.05 }}
					size={0.26}
					text={'HIT THE STONE'}
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