import 'phaser';
import Config = Phaser.Core.Config;

export default new Config({
  type: Phaser.WEBGL,
  disableContextMenu: true,
  autoFocus: true,
  scale: {
    width: 320,
    height: 320,
    parent: "game",
    fullscreenTarget: "game",
    // zoom: 1,
    // resolution: 1,
    // parent: null,
    mode: Phaser.Scale.FIT,
    // expandParent: true,
    // autoRound: false,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    // resizeInterval: 500,
    // fullscreenTarget: null,
    // min: {
    //   width: 0,
    //   height: 0
    // },
    // max: {
    //   width: 0,
    //   height: 0
    // }
  },
  render: {

    antialias: false,
    pixelArt: true,
    roundPixels: true,
    transparent: true,
    clearBeforeRender: true,
    premultipliedAlpha: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: "default",
    batchSize: 2000,
    maxLights: 10
  },
  backgroundColor: "#111111",
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  parent: "game"
})
