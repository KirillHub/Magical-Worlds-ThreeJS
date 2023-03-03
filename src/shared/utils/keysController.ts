export const W = 'w'
export const A = 'a'
export const S = 's'
export const D = 'd'
export const SHIFT = 'shift'
export const DIRECTIONS = [W, A, S, D]

export class KeyDisplay {

	map: Map<string, HTMLDivElement> = new Map()

	constructor() {

		const w: HTMLDivElement = document.createElement("div")
		const a: HTMLDivElement = document.createElement("div")
		const s: HTMLDivElement = document.createElement("div")
		const d: HTMLDivElement = document.createElement("div")
		const shift: HTMLDivElement = document.createElement("div")

		this.map.set(W, w)
		this.map.set(A, a)
		this.map.set(S, s)
		this.map.set(D, d)
		this.map.set(SHIFT, shift)

		this.map.forEach((v, k) => {
			v.style.color = 'blue'
			v.style.fontSize = '50px'
			v.style.fontWeight = '800'
			v.style.position = 'absolute'
			v.textContent = k
		})

		this.updatePosition()

		this.map.forEach((v, _) => {
			document.body.append(v)
		})
	}

	public updatePosition() {
		// const { W, A, S, D, SHIFT } = KEYS;

		this.map.get(W)!.style.top = `${window.innerHeight - 150}px`
		this.map.get(A)!.style.top = `${window.innerHeight - 100}px`
		this.map.get(S)!.style.top = `${window.innerHeight - 100}px`
		this.map.get(D)!.style.top = `${window.innerHeight - 100}px`
		this.map.get(SHIFT)!.style.top = `${window.innerHeight - 100}px`

		this.map.get(W)!.style.left = `${300}px`
		this.map.get(A)!.style.left = `${200}px`
		this.map.get(S)!.style.left = `${300}px`
		this.map.get(D)!.style.left = `${400}px`
		this.map.get(SHIFT)!.style.left = `${50}px`
	}

	public down(key: string) {
		const keyDiv = this.map.get(key.toLowerCase());
		if (keyDiv) {
			keyDiv.style.color = 'green';
			keyDiv.style.background = '4em';
			keyDiv.style.borderRadius = '30em';
			keyDiv.style.minWidth = '5vw';
			keyDiv.style.backgroundColor = 'rgba(212, 30, 30, .7)';
		}
	}

	public up(key: string) {
		const keyDiv = this.map.get(key.toLowerCase());
		if (keyDiv) {
			keyDiv.style.color = 'blue';
			keyDiv.style.backgroundColor = 'transparent';
		}
	}

}
