import PhaserLib from "../lib";
import MainScene from "../scenes/MainScene";


export default class BulletEntity extends Phaser.GameObjects.Graphics {
	public scene: any;
	public setActive: any;
	public destroy: any;
	public setVisible: any;
	public setDepth: any;
	public x: any;
	public y: any;
	public clear: any;
	public lineStyle: any;
	public strokeLineShape: any;
  private owner;
  private line: Phaser.Geom.Line;
  private rayLine: Phaser.Geom.Line;
  private progress;
  private endProgress = 1;

    constructor(scene, options) {
        super(scene, options);
        // ...

    }

    public Instantiate(location:Phaser.Math.Vector2, angle:number, velocity:number): void{
      let scene: MainScene = (this.scene as MainScene);
      var tile = scene.map.getTileAtWorldXY( location.x, location.y, true, scene.cameras.main, "foreground");
      if(tile.collides){
this.setActive(false);
      this.destroy();
return;
    }
    scene.cameras.main.shakeEffect.start(60,0.012,true);


      let rotation=(angle+90)*Math.PI/180;
      let end = PhaserLib.findNewPoint(location,angle,velocity*10);
      this.progress = 0;
      this.line = new Phaser.Geom.Line(location.x,location.y,end.x,end.y);
      this.rayLine = this.line;
      // this.lineStyle(3,0xCCAA00,0.7);
      let tileCoord: Phaser.Math.Vector2 = PhaserLib.closest(location.x,location.y,scene.map.getTilesWithinShape(this.line,{isColliding:true}));
      if(tileCoord){
        this.endProgress = (Phaser.Math.Distance.Between(location.x,location.y,tileCoord.x,tileCoord.y)/(velocity*10));

        let temp = PhaserLib.findNewPoint(new Phaser.Math.Vector2(location.x,location.y),PhaserLib.lineAngle(this.line)*180/Math.PI,this.endProgress*PhaserLib.lineLength(this.line));
        this.rayLine.x2=temp.x;
        this.rayLine.y2=temp.y;

    }
      // this.strokeLineShape(this.line);
      this.setVisible(true);
      // this.x=location.x;
      // this.y=location.y;
      this.setDepth(2);
    }

    public update(time:number,delta?:number): void{
      delta/=17;
      let scene: MainScene = (this.scene as MainScene);

      var tile = scene.map.getTileAtWorldXY( this.x, this.y, true, scene.cameras.main, "foreground");

      //console.log(delta);
      var start: Phaser.Math.Vector2;
      var end: Phaser.Math.Vector2;

      start = PhaserLib.findNewPoint(new Phaser.Math.Vector2(this.line.x1,this.line.y1),PhaserLib.lineAngle(this.line)*180/Math.PI,this.progress*PhaserLib.lineLength(this.line));
      end = PhaserLib.findNewPoint(new Phaser.Math.Vector2(this.line.x1,this.line.y1),PhaserLib.lineAngle(this.line)*180/Math.PI,Math.min((this.progress+0.15),this.endProgress+0.1)*PhaserLib.lineLength(this.line));
      this.progress+=0.05;
      this.progress/=1.04;
      this.clear();
      this.lineStyle(1,0x111111,0.3);
      this.strokeLineShape(new Phaser.Geom.Line(start.x,start.y,this.rayLine.x2,this.rayLine.y2));
      this.lineStyle(2,0xCCAA00,0.5);
      this.strokeLineShape(new Phaser.Geom.Line(start.x,start.y,end.x,end.y));
      this.lineStyle(1,0xFF672B,0.7);
      this.strokeLineShape(new Phaser.Geom.Line(start.x,start.y,end.x,end.y));
      //newLoc = PhaserLib.findNewPoint(new Phaser.Math.Vector2(0,0),this.rotation*180/Math.PI-90,this.height*28);
      // this.x=newLoc.x;
      // // this.y=newLoc.y;
      if(this.progress>this.endProgress)
      this.destroy();
    }

}
