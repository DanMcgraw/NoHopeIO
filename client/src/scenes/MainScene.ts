import {NetworkScene} from "./NetworkScene";
import {PlayerEntity} from '../entities/PlayerEntity';
import {ZombieEntity} from '../entities/ZombieEntity';


import NetworkManager from '../managers/networkManager';
import PlayerData from "../managers/playerData";
import PhaserLib from '../lib';
import PixelatePipeline from '../entities/PixelatePipeline';


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
		var map = this.make.tilemap({ key: 'maps'});
	 var tileset = map.addTilesetImage('cybernoid','tilesets');
	 var layer = map.createStaticLayer(0, tileset, 0, 0); // layer index, tileset, x, y
layer.setScale(1);
map.setCollisionBetween(4,4);
		this.times = new Array();
		this.angles = new Array();

		this.player = new PlayerEntity(this, 100, 100, 'player', 1);
		this.physics.add.collider(this.player, layer);
		this.physics.add.collider(this.player.playerBullets, layer);
		var debugGraphics = this.add.graphics();

		map.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });

	this.cameras.main.startFollow(this.player.offsetLocation,true,0.03,0.03,0,0);
	this.cameras.main.alpha=1;
//	this.cameras.main.setZoom(0.4);
	var spotlight = this.make.sprite({
        x: 160,
        y: 160,
        key: 'mask',
        add: false
    });
		spotlight.scale = 2.5;
		let test:(Phaser.Cameras.Scene2D.BaseCamera);
		this.cameras.main.setMask(new Phaser.Display.Masks.BitmapMask(this, spotlight));

this.enemyZombies = this.add.group({ classType: ZombieEntity as any, runChildUpdate: true });
		let zombie = this.enemyZombies.get();
zombie.Instantiate(new Phaser.Math.Vector2(200,200),180,0);
zombie.setDisplaySize(48*1,32*1).setOrigin(0.2,0.1).setScale(1);
this.tweens.add({
        targets: this.player,
        scale: 1.05,
        ease: 'Quad.easeInOut',
        duration: 500,
        paused: false,
				loop: -1,
				yoyo: true
    });
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
		this.cameras.main.setRotation(Math.sin(this.player.y/200)/12+Math.cos(this.player.x/200)/12);
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
					if(this.socket.getData()[id].rotation!=this.socket.prevData[id].rotation){
						this.enemyZombies.getLast(true).tweenRotation = this.tweens.add({
						        targets: this.enemyZombies.getLast(true),
						        rotation: this.socket.getData()[id].rotation,
						        ease: 'Quad.easeOut',
						        duration: 40,
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
						        duration: 150,
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
