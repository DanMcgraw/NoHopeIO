import PhaserLib from "../lib";
import MainScene from "../scenes/MainScene";
import BaseEntitySprite from './BaseEntitySprite';
import { PlayerEntity } from "./PlayerEntity";
import { EntityDirection } from './stateMembers/EntityDirection';


export class ZombieEntity extends BaseEntitySprite {
  public setTexture: any;
  public tint: any;
  public width: any;
  public height: any;
  public x: any;
  public y: any;
  public newXY: Phaser.Math.Vector2;
  public targetX: any;
  public targetY: any;
  public rotation: any;
  public speed: any;
  public lastUpdate: any;
  private birthTime;
  public tween;
  public tweenRotation;

  constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: number) {
    super(scene, x, y, key, frame);
    // ...
    this.setTexture("zombie1");
    this.setOrigin(0.5, 0.624);



    this.tint = 0x299611;
    //this.blendMode = Phaser.BlendModes.ADD;

    this.speed = 35;
    this.width = 100;
    this.height = 100;
    //this.setOrigin(0.0);
  }

  public Instantiate(location: Phaser.Math.Vector2, angle: number, velocity: number): void {
    this.x = location.x;
    this.y = location.y;
    //this.height = velocity;
    this.rotation = (angle + 90) * Math.PI / 180;
    var d = new Date();
    this.birthTime = d.getTime();
  }

  public update(time: number, delta?: number): void {
    var truth = false;
    if (typeof this.lastUpdate == "undefined")
      this.lastUpdate = time;

    if (time - this.lastUpdate > 200)
      truth = true;
    if (truth) {
      this.lastUpdate = time;
      var line = new Phaser.Geom.Line(this.x, this.y, this.targetX, this.targetY);
      var angle = PhaserLib.lineAngle(line);
      var distance = PhaserLib.lineLength(line);
      var adjustedSpeed = PhaserLib.minMax((this.speed / (Math.abs(distance - 70) / 20)), 5, 20) + 5;
      this.newXY = PhaserLib.findNewPoint(new Phaser.Math.Vector2(this.x, this.y), angle * 180 / 3.14159, adjustedSpeed);
      console.log(adjustedSpeed);
      this.angle = angle * 180 / 3.14159;
      if (distance > 15) {
        //this.setX(newXY.x);
        //this.setY(newXY.y);
      }
    };
  }

  public setTarget(targetX: number, targetY: number): void {
    this.targetX = targetX;
    this.targetY = targetY;
  }

}
