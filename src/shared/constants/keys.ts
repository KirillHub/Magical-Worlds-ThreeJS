import { TDirection, TKeyboard } from "../models/Controller";

export const KEYS: TKeyboard<string[]> = {
	W: 'w',
	A: 'a',
	S: 's',
	D: 'd',
	SHIFT: 'shift',
};

export const DIRECTION: TDirection<TKeyboard<string[]>> = {
	DIRECTIONS: [KEYS]
}
