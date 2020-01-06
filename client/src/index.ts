import config from './Config';

import BootScene from './scenes/BootScene';
import ConnectScene from './scenes/ConnectScene';
import MainScene from './scenes/MainScene';
import PixelatePipeline from './entities/PixelatePipeline';
import Pipelines from './pipelines';

class Game extends Phaser.Game {
	public scene: any;
	public grayscalePipeline: Phaser.Renderer.WebGL.WebGLPipeline;

	constructor(conf) {
		super(conf);

		Phaser.Renderer.WebGL.WebGLRenderer.prototype.postRenderCamera = function(camera){var TextureTintPipeline = this.pipelines.TextureTintPipeline;
var Utils = Phaser.Renderer.WebGL.Utils;
        camera.flashEffect.postRenderWebGL(TextureTintPipeline, Utils.getTintFromFloats);
        camera.fadeEffect.postRenderWebGL(TextureTintPipeline, Utils.getTintFromFloats);

        camera.dirty = false;

        this.popScissor();

        if (camera.renderToTexture)
        {
            TextureTintPipeline.flush();

            this.setFramebuffer(null);

          //  camera.emit(CameraEvents.POST_RENDER, camera);

            TextureTintPipeline.projOrtho(0, TextureTintPipeline.width, TextureTintPipeline.height, 0, -1000.0, 1000.0);

            var getTint = Utils.getTintAppendFloatAlpha;

            var pipeline = (camera.pipeline) ? camera.pipeline : TextureTintPipeline;

            pipeline.batchTexture(
                camera,
                camera.glTexture,
                camera.width, camera.height,
                camera.x, camera.y,
                camera.width, camera.height,
                1, 1,
                0,
                camera.flipX, !camera.flipY,
                1, 1,
                0, 0,
                0, 0, camera.width, camera.height,
                0,
                0,
                0,
                0,
                false,
                0, 0,
                this.defaultCamera,
                null
            );

            //  Force clear the current texture so that items next in the batch (like Graphics) don't try and use it
            this.setBlankTexture(true);
        }

        if (camera.mask)
        {
            this.currentCameraMask.mask = null;

          //  camera.mask.postRenderWebGL(this, camera._maskCamera);
        }}

	//	this.grayscalePipeline = (this.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline('Grayscale', new Pipelines.GrayscalePipeline(this));
		this.scene.add('Boot', BootScene);
		this.scene.add('Connect', ConnectScene);
		this.scene.add('Main', MainScene);
		this.scene.start('Boot');
		//Phaser.Display.Canvas.CanvasInterpolation.setCrisp(this.canvas)
	}
}

window.addEventListener("load", () => {
	var game = new Game(config);

});
