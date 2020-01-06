import NetworkManager from '../managers/networkManager';
import PixelatePipeline from '../entities/PixelatePipeline';
/**
 * This Scene will be used for connecting to the server, preloading assets and setting some initial values retrieved.
 */
export default class ConnectScene extends Phaser.Scene {
	public load: any;
	public add: any;
	public scene: any;
	private socket: NetworkManager;
	constructor(params) {
		super(params);
		this.socket = new NetworkManager();
	}

	preload() {
		this.load.spritesheet('player', 'assets/images/characters/player.png',
			{frameWidth: 47, frameHeight: 32, spacing: 1});

		this.load.spritesheet('zombie1', 'assets/images/characters/player.png',
				{frameWidth: 48, frameHeight: 32});

		this.load.image('tilesets', 'assets/images/tilesets/out-extruded.png');
		this.load.image("mask", "https://labs.phaser.io/assets/sprites/mask1.png")
	//	https://labs.phaser.io/assets/sprites/mask1.png
		this.load.tilemapTiledJSON('maps', 'assets/maps/Town1.json');
	}

	create() {
		this.add.sprite(400, 300, 'phaserLogo');
		setTimeout(() => {
			this.scene.start('Main', {socket: this.socket});
		}, 300);

	}

	update() {
		//simulate connecting to server for now

	}
}
