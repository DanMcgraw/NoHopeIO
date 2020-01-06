/**
 * The basic preload Scene. Keep this Scene lightweight and only preload what is needed for a loading screen.
 */
export default class BootScene extends Phaser.Scene {
	public load: any;
	public scene: any;

	constructor(params) {
		super(params);
	}

	preload() {
		this.load.image('phaserLogo', 'assets/images/phaser.png');
	}

	create() {
		this.scene.start('Connect');
	}
}