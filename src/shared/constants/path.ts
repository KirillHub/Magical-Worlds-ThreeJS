import { getPath as get } from "../utils/getPath";


export namespace Path {

	const TEXTURES = {
		FANCY: 'assets/fantasyLocation/textures/',
		REALITY: 'assets/realityLocation/textures/',
		SHARED: 'assets/shared/textures/'
	};

	const MODELS = {
		FANCY: 'assets/fantasyLocation/GLTFModels/',
		REALITY: 'assets/realityLocation/GLTFModels/',
		SHARED: 'assets/shared/GLTFModels/',
	};


	const MF = MODELS.FANCY;
	export const models_fancy = {
		buildings: {
			house: get(MF, 'buildings', 'house.glb'),
		},
		characters: {
			azri: get(MF, 'characters', 'azri.glb'),
			majd: get(MF, 'characters', 'majd.glb')
		},
		ground: {
			chineseFountainGrass: get(MF, 'ground', 'chinese_fountain_grass.glb'),
			road: get(MF, 'ground', 'road.glb'),
			rockStone: get(MF, 'ground', 'rock_stone.glb'),
			torch: get(MF, 'ground', 'torch.glb'),
		},
	}

	const MR = MODELS.REALITY;
	export const models_reality = {
		buildings: {
			oldHouse: get(MR, 'buildings', 'old_house.glb'),
		},
		characters: {
			girl: get(MR, 'characters', 'girl.glb'),
		},
		ground: {
			grass: get(MR, 'ground', 'grass.glb'),
			deadGrass: get(MR, 'ground', 'dead_grass.glb'),
			dryGrass: get(MR, 'ground', 'dry_grass.glb'),

			tree: get(MR, 'ground', 'tree.glb'),
			treePinus: get(MR, 'ground', 'tree_pinus.glb'),
		},

	};

	const MS = MODELS.SHARED;
	export const models_shared = {
		characters: {
			soldier: get(MS, 'characters', 'soldier.glb'),
			ellieBella: get(MS, 'characters', 'ellie_bella.glb'),
		},
		portal: {
			portalMask: get(MS, 'portal', 'portal_mask.glb'),
			portal: get(MS, 'portal', 'portal.glb'),
		}

	};

	const TF = TEXTURES.FANCY;
	export const textures_fancy = {
		background: {

		},
		dirtGround: {
			grassDiff: get(TF, 'dirtGround', 'grass_path_diff.jpg'),
			grassNor: get(TF, 'dirtGround', 'grass_path_nor.jpg'),
			grassRough: get(TF, 'dirtGround', 'grass_path_rough.jpg'),
		},
		portal: {
			portalMinecraft: get(TF, 'portal', 'portal_minecraft.jpg'),
		}
	};

	const TR = TEXTURES.REALITY;
	export const textures_reality = {
		background: {},
		forestGround: {
			forestDiff: get(TR, 'forestGround', 'forest_ground_diff.jpg'),
			forestNor: get(TR, 'forestGround', 'forest_ground_nor.jpg'),
			forestRough: get(TR, 'forestGround', 'forest_ground_rough.jpg'),
		},
		portal: {
			// portalMinecraft: get(TF, 'portal', 'portal_minecraft.jpg'),
		}
	};

	const TS = TEXTURES.SHARED;
	export const textures_shared = {
		background: {
			envmap: get(TS, 'background', 'envmap.hdr'),
			kloofendal: get(TS, 'background', 'kloofendal.hdr'),
		},

	};



};

