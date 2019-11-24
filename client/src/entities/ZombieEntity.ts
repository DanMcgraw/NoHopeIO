import PhaserLib from "../lib";
import BaseEntitySprite from './BaseEntitySprite';
import { EntityDirection } from './stateMembers/EntityDirection';


export class ZombieEntity extends BaseEntitySprite {
  private birthTime;

  constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: number) {
    super(scene, x, y, key, frame);
        // ...
          this.setTexture("zombie1");
<<<<<<< HEAD
          this.tint = 0xcc2345;
          this.blendMode = Phaser.BlendModes.COLOR_BURN;
=======
          this.tint = 0x299611;
          this.blendMode = Phaser.BlendModes.ADD;
>>>>>>> fd984d5c33efca79f30217cd4440d663192a40c0

        this.width=100;
        this.height=100;
        this.setOrigin(0.5);
    }

    public Instantiate(location:Phaser.Math.Vector2, angle:number, velocity:number): void{
      this.x=location.x;
      this.y=location.y;
      this.height = velocity;
      this.rotation=(angle+90)*Math.PI/180;
      var d = new Date();
this.birthTime = d.getTime();
    }

    public update(time:number,delta:number): void{
      delta/=17;

    }

}
