import BaseEntitySprite from './BaseEntitySprite';
import { EntityDirection } from './stateMembers/EntityDirection';
import BulletEntity from './BulletEntity';
import PhaserLib from '../lib';

export class PlayerEntity extends BaseEntitySprite {
	private readonly PLAYER_UPDATE_RATE: number = 8;
	private playerBullets: any;
	private readonly PLAYER_DEFAULT_SPEED: number = 0.1475;
	private isShooting: boolean = false;
	private updateIteration: number = 30;
	private randomSync;
	private positionIncrement: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
	private previousAngle: number = 0;
	private crosshair: any;

	private cursors = {
		up: this.getCurrentScene().input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.W,
		),
		down: this.getCurrentScene().input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.S,
		),
		left: this.getCurrentScene().input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.A,
		),
		right: this.getCurrentScene().input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.D,
		),
	};

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		key: string,
		frame: number,
	) {
		super(scene, x, y, key, frame);
		this.createAnimations();
		this.playerBullets = this.getCurrentScene().add.group({
			classType: BulletEntity as any,
			runChildUpdate: true,
		});
		this.randomSync = new PhaserLib.Random(123);
		//this.bulletTest = new Phaser.GameObjects.Rectangle(this.getCurrentScene(),300,300,100,100,0xFF0000,255);
		//this.getCurrentScene().add.existing(this.bulletTest);
		//this.bulletTest.setActive(true);
		this.setupShoot();
		this.setupCrosshair();
		//this.setupKeyboard();
		//this.setupLook();
	}

	private createAnimations(): void {
		this.setAnimation(
			{
				key: 'walk',
				frameRate: this.PLAYER_UPDATE_RATE,
				repeat: -1,
			},
			0,
			10,
		);
	}

	private setupCrosshair() {
		const currScene = this.getCurrentScene();
		this.crosshair = currScene.add.sprite(
			currScene.input.x,
			currScene.input.y,
			'crosshair',
		);
		this.crosshair.setDisplaySize(32, 32);
		document.addEventListener('mousemove', (e) => {
			this.updateCrosshairPosition(e, this);
		});
	}

	// private setupKeyboard(): void {
	//   this.cursors = this.getCurrentScene().input.keyboard.createCursorKeys();
	// }

	private setupShoot(): void {
		this.getCurrentScene().input.on(
			'pointerdown',
			function(pointer) {
				this.isShooting = true;
				this.getCurrentScene().game.input.mouse.requestPointerLock();
				console.log(this.randomSync.nextNumber() + 1);
			},
			this,
		);
		this.getCurrentScene().input.on(
			'pointerup',
			function(pointer) {
				this.isShooting = false;
			},
			this,
		);
		this.getCurrentScene().input.on(
			'pointermove',
			function(pointer) {
				//this.updateIteration--;
				if (
					Phaser.Math.Distance.Squared(
						0,
						0,
						this.positionIncrement.x + pointer.movementX,
						this.positionIncrement.y + pointer.movementY,
					) < 2000
				) {
					this.positionIncrement.x += pointer.movementX;
					this.positionIncrement.y += pointer.movementY;
				} else {
					this.positionIncrement = PhaserLib.findNewPoint(
						this.positionIncrement,
						(Phaser.Math.Angle.Between(
							0,
							0,
							this.positionIncrement.x,
							this.positionIncrement.y,
						) /
							Math.PI) *
							180,
						-4,
					);
				}
				// this.rotation = Phaser.Math.Angle.Between(
				// 	0,
				// 	0,
				// 	this.positionIncrement.x,
				// 	this.positionIncrement.y,
				// );

				const angle = PhaserLib.toDegree(
					Math.atan2(this.crosshair.y - this.y, this.crosshair.x - this.x),
				);
				this.angle = angle;
				// if(this.updateIteration<0){
				//       //if (!this.getCurrentScene().game.input.mouse.locked)
				//       {
				//
				//           let angle = Phaser.Math.Angle.Between(0, 0, this.positionIncrement.x, this.positionIncrement.y);
				//           this.positionIncrement.x=0;
				//           this.positionIncrement.y=0;
				//           //this.angle=angle/Math.PI*180
				//           console.log((angle/Math.PI*180-this.previousAngle/Math.PI*180))
				//           if(((angle/Math.PI*180-this.previousAngle/Math.PI*180)<180&&(angle/Math.PI*180-this.previousAngle/Math.PI*180)>-180))
				//           this.angle = (this.previousAngle/Math.PI*180+angle/Math.PI*180)/2;
				//           else
				//           this.angle = -((360-this.previousAngle/Math.PI*180-angle/Math.PI*180)/2+this.previousAngle/Math.PI*180)+180;
				//
				//           this.previousAngle=angle;
				//       }
				//       this.updateIteration = 10;
				//     }
			},
			this,
		);
	}
	private updateCrosshairPosition(e, self) {
		self.crosshair.x += e.movementX;
		self.crosshair.y += e.movementY;
		// console.log(self);
	}

	private fireBullet(): void {
		if (
			this.playerBullets.getLast(true) != null &&
			(this.playerBullets.getLast(true).height > 24 ||
				this.playerBullets.getLast(true).height == 6)
		)
			return;
		let location: Phaser.Math.Vector2 = new Phaser.Math.Vector2(this.x, this.y);
		let velocity = 29;
		let angle = (this.rotation * 180) / Math.PI;

		let bullet = this.playerBullets.get();
		bullet.setActive(true).setVisible(true);
		location = PhaserLib.findNewPoint(location, angle, 35);
		angle = PhaserLib.spreadChange(angle, 15);
		this.kickBack(0, velocity);
		bullet.Instantiate(location, angle, velocity);
		//bullet.fire(this,this.getCurrentScene().input.mousePointer);
	}

	private updateLook(): void {
		let cursor = this.getCurrentScene().input.mousePointer;
		let angle =
			(Phaser.Math.Angle.Between(this.x, this.y, cursor.x, cursor.y) /
				Math.PI) *
			180;
		//this.angle = angle;
	}

	private updatePlayerVelocity(delta: number): void {
		var velocity = this.PLAYER_DEFAULT_SPEED;
		if (this.playerBullets.getLast(true) != null)
			velocity *= 12 / this.playerBullets.getLast(true).height;
		if (this.cursors.left.isDown) {
			this.setVelocityX(-velocity);
		} else if (this.cursors.right.isDown) {
			this.setVelocityX(velocity);
		} else {
			this.setVelocityX(0);
		}

		if (this.cursors.up.isDown) {
			this.setVelocityY(-velocity);
		} else if (this.cursors.down.isDown) {
			this.setVelocityY(velocity);
		} else {
			this.setVelocityY(0);
		}
	}

	private updateAnimation(): void {
		if (this.getEntityDirection() !== EntityDirection.none) {
			this.setDirectionalAnimation();
		} else {
			this.setFrame(7);
		}
	}

	public update(delta: number): void {
		if (this.isShooting) {
			this.fireBullet();
		}
		this.updateLook();
		this.updatePlayerVelocity(delta);
		this.setEntityDirection();
		this.updateAnimation();
		this.updatePosition(delta);
	}
}
