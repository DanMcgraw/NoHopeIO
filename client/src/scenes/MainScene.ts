import { NetworkScene } from "./NetworkScene";
import { PlayerEntity } from '../entities/PlayerEntity';
import { ZombieEntity } from '../entities/ZombieEntity';


import NetworkManager from '../managers/networkManager';
import PlayerData from "../managers/playerData";
import PhaserLib from '../lib';
import PixelatePipeline from '../entities/PixelatePipeline';
import BulletEntity from "../entities/BulletEntity";
import Pipelines from '../pipelines';
import { deflateSync } from "zlib";


export default class MainScene extends NetworkScene {
  public game: any;
  public cameras: any;
  public cameraView: Phaser.Cameras.Scene2D.Camera;
  public make: any;
  public physics: any;
  public add: any;
  public tweens: any;
  private enemyZombies: any;
  public player: PlayerEntity;
  private socket: NetworkManager;
  private timeStamp: number = 0;
  private times: number[];
  private angles: number[];
  public map: Phaser.Tilemaps.Tilemap;
  public grayscalePipeline: Pipelines;

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
    //this.cameraView = this.cameras.add(0, 0, 300, 300);
    this.grayscalePipeline = (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('Grayscale', new Pipelines({ game: this.game })) as Pipelines;

    (this.cameras.main as Phaser.Cameras.Scene2D.Camera).setRenderToTexture(this.grayscalePipeline);
    //(this.cameraView as Phaser.Cameras.Scene2D.Camera).setRenderToTexture(this.grayscalePipeline);

    this.map = this.make.tilemap({ key: 'maps' });
    var tileset = this.map.addTilesetImage('cybernoid', 'tilesets');
    var layer = this.map.createStaticLayer("background", tileset, 0, 0); // layer index, tileset, x, y
    var walls = this.map.createStaticLayer("foreground", tileset, 0, 0); // layer index, tileset, x, y
    walls.setCollision(4);
    layer.setScale(1);
    //map.setCollisionBetween(4,4);
    //walls.setCollision(true);
    this.times = new Array();
    this.angles = new Array();

    this.player = new PlayerEntity(this, 100, 100, 'player', 1);
    this.physics.add.collider(this.player, walls);
    var line = new Phaser.Geom.Line(20, 20, 200, 300);
    var graphics = this.add.graphics({ lineStyle: { width: 4, color: 0x33bb77 } });
    graphics.strokeLineShape(line);


    console.log(walls.getTilesWithinShape(line, { isColliding: true }));
    // walls.setTileIndexCallback(4, (bullet,tile) => {
    // 	if(!(bullet instanceof BulletEntity))
    // 	return;
    // 	console.log("Collided");
    // 	//console.log(bullet);
    // 	//layer.shuffle( (tile as Phaser.Tilemaps.Tile).x-1 , (tile as Phaser.Tilemaps.Tile).y-1 , 3 , 3);
    // 	(bullet as BulletEntity).collidesWall();
    // }, this);
    // var wallBullet = this.physics.add.collider(this.player.playerBullets, walls, bullet => {
    // 	console.log("Collided");
    // 	(bullet as BulletEntity).collidesWall();
    // });
    //wallBullet.overlapOnly = true;
    // this.physics.add.overlap(this.player.playerBullets, layer, bullet => {
    // 	console.log("Collided overllap");
    // 	(bullet as BulletEntity).collidesWall();
    // });
    var debugGraphics = this.add.graphics();

    this.map.renderDebug(debugGraphics, {
      tileColor: null, // Non-colliding tiles
      collidingTileColor: null, // Colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges,

    });

    this.cameras.main.startFollow(this.player.offsetLocation, true, 0.03, 0.03, 0, 0);
    //this.cameras.main.alpha=1;
    this.cameras.main.setZoom(0.4);
    var spotlight = this.make.sprite({
      x: 160,
      y: 160,
      key: 'mask',
      add: false
    });
    spotlight.scale = 2.5;
    //let test:(Phaser.Cameras.Scene2D.BaseCamera);
    //this.cameras.main.setMask(new Phaser.Display.Masks.BitmapMask(this, spotlight));

    this.enemyZombies = this.add.group({ classType: ZombieEntity as any, runChildUpdate: true });
    let zombie = this.enemyZombies.get();
    let zombie2 = this.enemyZombies.get();
    zombie.Instantiate(new Phaser.Math.Vector2(200, 200), 180, 0);
    zombie2.Instantiate(new Phaser.Math.Vector2(200, 200), 180, 0);
    zombie.setDisplaySize(48 * 1, 32 * 1).setOrigin(0.2, 0.1).setScale(1);
    zombie2.setDisplaySize(48 * 1, 32 * 1).setOrigin(0.2, 0.1).setScale(1);
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
    this.grayscalePipeline.update(time);
    this.player.update(delta);
    this.enemyZombies.children.getArray()[0].setTarget(this.player.x, this.player.y);

    if (this.enemyZombies.children.getArray()[0].newXY)
      this.enemyZombies.children.getArray()[0].tween = this.tweens.add({
        targets: this.enemyZombies.children.getArray()[0],
        x: this.enemyZombies.children.getArray()[0].newXY.x,
        y: this.enemyZombies.children.getArray()[0].newXY.y,
        ease: 'Power0',
        duration: 180,
        paused: false,
        loop: 0
      });
    // this.enemyZombies.getLast(true).update(time, delta);
    this.cameras.main.setRotation(Math.sin(this.player.y / 200) / 12 + Math.cos(this.player.x / 200) / 12);
    //if(time%10==1)
    if (this.socket.lastUpdate == true) {
      this.socket.lastUpdate = false;
      this.timeStamp = Date.now();
      if (this.socket.getData() != undefined)
        Object.keys(this.socket.getData()).forEach((id: string) => {
          if (id != this.socket.getId()) {
            if (this.socket.prevData != undefined && this.socket.prevData[id] != undefined) {
              if (this.times[id] == undefined || this.angles[id] == undefined) {
                this.times[id] = 0;
                this.angles[id] = 0;
              }
              if (this.socket.getData()[id].rotation != this.socket.prevData[id].rotation) {
                this.enemyZombies.getLast(true).tweenRotation = this.tweens.add({
                  targets: this.enemyZombies.getLast(true),
                  rotation: this.socket.getData()[id].rotation,
                  ease: 'Quad.easeOut',
                  duration: 40,
                  paused: false,
                  loop: 0
                });
              }
              if (this.socket.getData()[id].x != this.socket.prevData[id].x || this.socket.getData()[id].y != this.socket.prevData[id].y) {
                this.times[id]++;
                let predPoint = new Phaser.Math.Vector2(this.socket.getData()[id].x, this.socket.getData()[id].y);

                let angle = Phaser.Math.Angle.Between(this.socket.prevData[id].x, this.socket.prevData[id].y, predPoint.x, predPoint.y);
                if (Math.floor(this.angles[id]) != Math.floor(angle))
                  this.times[id] /= 3;
                this.times[id] = Math.min(15, this.times[id]);
                predPoint = PhaserLib.findNewPoint(predPoint, angle * 180 / Math.PI, Math.min(this.times[id], Phaser.Math.Distance.Squared(predPoint.x, predPoint.y, this.socket.prevData[id].x, this.socket.prevData[id].y)));
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
              } else {
                if (this.times[id] < 5) {
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
              }
            }

            //this.enemyZombies.getLast(true).x=this.socket.getData()[id].x;
            //	this.enemyZombies.getLast(true).y=this.socket.getData()[id].y;
            this.enemyZombies.getLast(true).rotation = this.socket.getData()[id].rotation;
          }
        });
      this.socket.sendData(new PlayerData("Raums", this.player.x, this.player.y, this.player.rotation));
    }
  }
}
