//**keys & types */

export type Position = {
	posX: number, posY: number, posZ: number
}
export type Rotation = {
	rotX: number, rotY: number, rotZ: number
}

export type RotationProps<R extends Rotation> = {
	rotation: R
}
export type PositionProps<P extends Position> = {
	position: P
}


export type MainProps<T extends Position> = {
	position: T
	scale: number
	modelPath: string
}

export interface KombineMainProps {
	position: Position
	rotation: Rotation
	scale: number
	modelPath: string
}