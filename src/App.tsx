import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Physics } from '@react-three/cannon'
import { SceneDefault } from "./Project/FantasyLocation/components/SceneDefault"
import { getLocation, setNewLocation } from './store/locationSlice/slice';
import { RealityScene } from './Project/RealityLocation/SceneReality';


function App() {
	const location = useSelector(getLocation)

	return (
		<>
			{
				location === 'default' && <Canvas shadows={true}>
					<Physics>
						<SceneDefault />
					</Physics>
				</Canvas>
			}

			{
				location === 'reality' && <Canvas>
					<RealityScene />
				</Canvas>
			}
			{/* 
			<Canvas>
				<RealityScene />
			</Canvas> */}
		</>
	)
}

export default App;
