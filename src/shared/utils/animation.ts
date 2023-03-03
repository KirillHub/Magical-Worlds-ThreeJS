import { MutableRefObject } from 'react';
import {
	AnimationClip, AnimationMixer, Group
} from 'three';

interface AnimationProps {
	model: Group
	animations: AnimationClip[]
	currentAnimation: string
	animationActionsRef: MutableRefObject<Map<string, any>>
	mixerRef: MutableRefObject<AnimationMixer | undefined>
}

export const Animation = ({
	model, animations, currentAnimation, animationActionsRef, mixerRef
}: AnimationProps) => {
	// const animations = gltf.animations || [];
	mixerRef.current = new AnimationMixer(model);

	animations.forEach((animation) => {
		const action = mixerRef.current!.clipAction(animation);
		animationActionsRef.current.set(animation.name, action);
	});

	const animationClip = AnimationClip.findByName(animations, currentAnimation);
	if (animationClip) {
		const animationAction =
			animationActionsRef.current.get(currentAnimation);
		animationAction.play();
	}
};