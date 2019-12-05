import {NetworkScene} from "./NetworkScene";
import {PlayerEntity} from '../entities/PlayerEntity';
import {ZombieEntity} from '../entities/ZombieEntity';


import NetworkManager from '../managers/networkManager';
import PlayerData from "../managers/playerData";
import PhaserLib from '../lib';


export default class MainScene extends NetworkScene {
private enemyZombies: any;
	private player: PlayerEntity;
	private socket: NetworkManager;
	private timeStamp: number = 0;
	private times: number[];
	private angles: number[];

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
		this.socket.sendName("Siir Raum");

	}

	create(): void {
		this.times = new Array();
		this.angles = new Array();

		this.player = new PlayerEntity(this, 100, 100, 'player', 1);
		this.player.setDisplaySize(48*2,32*2).setOrigin(0.5,0.624);
this.enemyZombies = this.add.group({ classType: ZombieEntity as any, runChildUpdate: true });
		let zombie = this.enemyZombies.get();
zombie.Instantiate(new Phaser.Math.Vector2(200,200),180,0);
zombie.setDisplaySize(48*2,32*2).setOrigin(0.2,0.1);
// zombie.tween = this.tweens.add({
//         targets: zombie,
//         x: zombie.x,
//         y: zombie.y,
//         ease: 'Sine.easeIn',
//         duration: 200,
//         paused: false,
// 				loop: 0
//     });


console.log(zombie)

console.log("zombie")

	}

	update(time: number, delta: number) {
		this.player.update(delta);
		//if(time%10==1)
		if(this.socket.lastUpdate==true){
			this.socket.lastUpdate=false;
			this.timeStamp=Date.now();
			if(this.socket.getData()!=undefined)
			Object.keys(this.socket.getData()).forEach((id: string)=>{
				if(id!=this.socket.getId()){
					if(this.socket.prevData!=undefined&&this.socket.prevData[id]!=undefined){
						if(this.times[id]==undefined||this.angles[id]==undefined){
						this.times[id] = 0;
						this.angles[id] = 0;
					}
					console.log(this.socket.getData()[id].rotation+" "+this.socket.prevData[id].rotation)
					if(this.socket.getData()[id].rotation!=this.socket.prevData[id].rotation){
						this.enemyZombies.getLast(true).tweenRotation = this.tweens.add({
						        targets: this.enemyZombies.getLast(true),
						        rotation: this.socket.getData()[id].rotation,
						        ease: 'Power1',
						        duration: 60,
						        paused: false,
										loop: 0
						    });
					}
					if(this.socket.getData()[id].x!=this.socket.prevData[id].x||this.socket.getData()[id].y!=this.socket.prevData[id].y){
						this.times[id]++;
						let predPoint = new Phaser.Math.Vector2(this.socket.getData()[id].x,this.socket.getData()[id].y);

						let angle = Phaser.Math.Angle.Between(this.socket.prevData[id].x,this.socket.prevData[id].y,predPoint.x,predPoint.y);
						if(Math.floor(this.angles[id])!=Math.floor(angle))
						this.times[id] /= 3;
						this.times[id] = Math.min(15,this.times[id]);
						predPoint = PhaserLib.findNewPoint(predPoint,angle*180/Math.PI,Math.min(this.times[id],Phaser.Math.Distance.Squared(predPoint.x,predPoint.y,this.socket.prevData[id].x,this.socket.prevData[id].y)));
						this.enemyZombies.getLast(true).tween = this.tweens.add({
						        targets: this.enemyZombies.getLast(true),
						        x: predPoint.x,
						        y: predPoint.y,
						        ease: 'Power0',
						        duration: 100,
						        paused: false,
										loop: 0
						    });
					// this.enemyZombies.getLast(true).tween.updateTo('x', this.socket.getData()[id].x, true);
					// this.enemyZombies.getLast(true).tween.updateTo('y', this.socket.getData()[id].y, true);
					// this.enemyZombies.getLast(true).tween.play();
					this.angles[id] = angle;
				}else{
					if(this.times[id]<5){
						this.enemyZombies.getLast(true).tween = this.tweens.add({
						        targets: this.enemyZombies.getLast(true),
						        x: this.socket.getData()[id].x,
						        y: this.socket.getData()[id].y,
						        ease: 'Power0',
						        duration: 75,
						        paused: false,
										loop: 0
						    });
					}
					this.times[id] = 0;
				}}

				//this.enemyZombies.getLast(true).x=this.socket.getData()[id].x;
			//	this.enemyZombies.getLast(true).y=this.socket.getData()[id].y;
				this.enemyZombies.getLast(true).rotation=this.socket.getData()[id].rotation;
			}
			});
		this.socket.sendData(new PlayerData("Raums",this.player.x,this.player.y, this.player.rotation));
	}
	}
}
