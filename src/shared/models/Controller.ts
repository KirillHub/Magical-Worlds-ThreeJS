export declare type TKeyboard<T extends string[]> = {
	W: string
	A: string
	S: string
	D: string
	SHIFT: string
}

export declare type TDirection<T extends TKeyboard<string[]>> = {
	DIRECTIONS: T[] 
}