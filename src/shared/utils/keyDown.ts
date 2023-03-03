export const KeyDown = {
	keys: {} as { [key: string]: boolean },
	isKeyDown: function (keyCode: string): boolean {
	  return this.keys[keyCode] ?? false;
	},
	setKeyDown: function (keyCode: string, isDown: boolean): void {
	  this.keys[keyCode] = isDown;
	}
 };

