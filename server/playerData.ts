export default class PlayerData {
	public x: number;
	public y: number;
	public name: string;
	public rotation: number;
	constructor(name, x, y, rotation) {
		// ...
		this.name = name;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
	}

	static getRandomPlayerName() {}
}
