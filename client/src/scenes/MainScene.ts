import { NetworkScene } from './NetworkScene';
import { PlayerEntity } from '../entities/PlayerEntity';
import { ZombieEntity } from '../entities/ZombieEntity';

import NetworkManager from '../managers/networkManager';
import PlayerData from '../managers/playerData';

export default class MainScene extends NetworkScene {
	private enemyZombies: any;
	private player: PlayerEntity;
	private socket: NetworkManager;
	private timeStamp: number = 0;
	private crosshair: any;

	constructor() {
		super({
			key: 'Main',
		});
	}

	init(): void {
		this.socket = new NetworkManager();
		this.socket.connectUser();
	}

	preload(): void {
		this.socket.sendName('Siir Raum');
	}

	create(): void {
		this.player = new PlayerEntity(this, 100, 100, 'player', 1);
		this.player.setDisplaySize(48 * 2, 32 * 2).setOrigin(0.5, 0.624);
		this.enemyZombies = this.add.group({
			classType: ZombieEntity as any,
			runChildUpdate: true,
		});
		let zombie = this.enemyZombies.get();
		zombie.Instantiate(new Phaser.Math.Vector2(200, 200), 180, 0);
		zombie.setDisplaySize(48 * 2, 32 * 2).setOrigin(0.2, 0.1);

		console.log(zombie);

		console.log('zombie');
	}

	update(time: number, delta: number) {
		this.player.update(delta);
		//if(time%10==1)
		if (Date.now() > this.timeStamp + 100) {
			this.timeStamp = Date.now();
			if (this.socket.getData() != undefined)
				Object.keys(this.socket.getData()).forEach((id: string) => {
					if (id != this.socket.getId()) {
						this.enemyZombies.getLast(true).x = this.socket.getData()[id].x;
						this.enemyZombies.getLast(true).y = this.socket.getData()[id].y;
						this.enemyZombies.getLast(true).rotation = this.socket.getData()[
							id
						].rotation;
					}
				});
			this.socket.sendData(
				new PlayerData(
					'Raums',
					this.player.x,
					this.player.y,
					this.player.rotation,
				),
			);
			console.log('WOW');
		}
	}
}
