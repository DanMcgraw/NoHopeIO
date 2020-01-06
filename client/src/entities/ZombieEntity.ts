import PhaserLib from "../lib";
import BaseEntitySprite from './BaseEntitySprite';
import { EntityDirection } from './stateMembers/EntityDirection';


export class ZombieEntity extends BaseEntitySprite {
	public setTexture: any;
	public tint: any;
	public width: any;
	public height: any;
	public x: any;
	public y: any;
	public rotation: any;
  private birthTime;
  public tween;
  public tweenRotation;

  constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: number) {
    super(scene, x, y, key, frame);
        // ...
          this.setTexture("zombie1");


          this.tint = 0x299611;
          //this.blendMode = Phaser.BlendModes.ADD;


        this.width=100;
        this.height=100;
        //this.setOrigin(0.0);
    }

    public Instantiate(location:Phaser.Math.Vector2, angle:number, velocity:number): void{
      this.x=location.x;
      this.y=location.y;
      //this.height = velocity;
      this.rotation=(angle+90)*Math.PI/180;
      var d = new Date();
this.birthTime = d.getTime();
    }

    public update(time:number,delta?:number): void{
      delta/=17;

    }

}
