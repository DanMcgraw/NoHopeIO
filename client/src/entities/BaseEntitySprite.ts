import {EntityDirection} from './stateMembers/EntityDirection';
import PhaserLib from '../lib';

export default class BaseEntitySprite extends Phaser.GameObjects.Sprite {
	public setOrigin: any;
	public anims: any;
	public body: any;
	public displayOriginX: any;
	private currentScene: Phaser.Scene;
	private vx: number;
	private vy: number;
	private orgX: number = 24;
	private orgY: number = 20;
	private readonly spriteKey: string;
	private entityDirection: EntityDirection = EntityDirection.none;

	constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: number) {
		super(scene, x, y, key, frame);

		this.spriteKey = key;
		this.currentScene = scene;
		this.initializeSprite();
		this.currentScene.add.existing(this);
	}

	private initializeSprite(): void {
		this.setOrigin(0);
	}

	protected getCurrentScene(): Phaser.Scene {
		return this.currentScene;
	}

	protected setEntityDirection(): void {
		if (this.vx === 0 && this.vy === 0) {
			this.entityDirection = EntityDirection.none;
		} else if (this.vx === 0 && this.vy < 0) {
			this.entityDirection = EntityDirection.up;
		} else if (this.vx === 0 && this.vy > 0) {
			this.entityDirection = EntityDirection.down;
		} else if (this.vx < 0 && this.vy === 0) {
			this.entityDirection = EntityDirection.left;
		} else if (this.vx > 0 && this.vy === 0) {
			this.entityDirection = EntityDirection.right;
		} else if (this.vx < 0 && this.vy < 0) {
			this.entityDirection = EntityDirection.upLeft;
		} else if (this.vx > 0 && this.vy < 0) {
			this.entityDirection = EntityDirection.upRight;
		} else if (this.vx < 0 && this.vy > 0) {
			this.entityDirection = EntityDirection.downLeft;
		} else if (this.vx > 0 && this.vy > 0) {
			this.entityDirection = EntityDirection.downRight;
		}
	}

	protected setDirectionalAnimation(): void {
		if (this.entityDirection != EntityDirection.none) {
			this.anims.play('walk', true);
		}
	}

	public getEntityDirection(): EntityDirection {
		return this.entityDirection;
	}

	public setVelocityX(newVX: number): void {
		this.vx = newVX;
	}

	public setVelocityY(newVY: number): void {
		this.vy = newVY;
	}

	public updatePosition(delta: number): void {
		if(this.vx!=0&&this.vy!=0)
		{
			this.vx*=2/3;
			this.vy*=2/3;
		}
		(this.body as Phaser.Physics.Arcade.Body).setVelocityX(this.vx *800);
		(this.body as Phaser.Physics.Arcade.Body).setVelocityY(this.vy *800);
		if(this.displayOriginX!=this.orgX)
		this.displayOriginX=(this.displayOriginX-this.orgX)*(1-0.15*delta/17)+this.orgX;
		this.getCurrentScene().cameras.main.setZoom((this.displayOriginX-this.orgX)*0.008+0.85);

	}

	public kickBack(angle: number, force: number): void {
		//this.displayOriginX+=force*0.05;
		//this.displayOriginX=Math.max(this.displayOriginX,this.orgX+force*0.2);
		// let knockCoord = new Phaser.Math.Vector2();
		// knockCoord = PhaserLib.findNewPoint(new Phaser.Math.Vector2(0,0),angle,-force/12);
		// (this.body as Phaser.Physics.Arcade.Body).setVelocityX(knockCoord.x*80);
		// (this.body as Phaser.Physics.Arcade.Body).setVelocityY(knockCoord.y *80);
		//this.getCurrentScene().cameras.main.flashEffect.start(30,200,150,120,true);
	}

	public setAnimation(config: Phaser.Types.Animations.Animation, start: number, end:number): void {
		config.frames = this.currentScene.anims.generateFrameNumbers(this.spriteKey, {start, end});
		this.currentScene.anims.create(config);
	}
}
