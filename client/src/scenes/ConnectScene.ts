import NetworkManager from '../managers/networkManager';
/**
 * This Scene will be used for connecting to the server, preloading assets and setting some initial values retrieved.
 */
export default class ConnectScene extends Phaser.Scene {
	private socket: NetworkManager;
	constructor(params) {
		super(params);
		this.socket = new NetworkManager();
	}

	preload() {
		this.load.spritesheet('player', 'assets/images/characters/player.png', {
			frameWidth: 48,
			frameHeight: 32,
		});

		this.load.spritesheet('zombie1', 'assets/images/characters/player.png', {
			frameWidth: 48,
			frameHeight: 32,
		});
		this.load.image('crosshair', 'assets/images/misc/crosshair.svg');
	}

	create() {
		this.add.sprite(400, 300, 'phaserLogo');
		setTimeout(() => {
			this.scene.start('Main', { socket: this.socket });
		}, 300);
	}

	update() {
		//simulate connecting to server for now
	}
}
