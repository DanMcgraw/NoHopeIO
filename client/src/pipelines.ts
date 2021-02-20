export default class Pipelines extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {

  constructor(config: any) {


    config.renderer = (config.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer);
    config.fragShader = `
    precision mediump float;
                  vec2  resolution = vec2(300,300);
                  float tx = 0.5;
                  float ty = 0.5;
                  float r = 0.1;
                  uniform sampler2D uMainSampler;
                  varying vec2 outTexCoord;
                  vec3 makeCircle(vec2 st,vec2 center, vec3 col){
                      float d = distance(st,center);
                      float pct = smoothstep(r,r+0.5,d);
                      return vec3(1.0-pct)*col;
                  }
                  void main(void) {

                      vec2 st = vec2(gl_FragCoord.x/resolution.x,gl_FragCoord.y/resolution.y);
                      vec4 color = texture2D(uMainSampler, outTexCoord);
                      vec3 gray = vec3(dot(vec3(0.1126,0.7152,0.0722), color.rgb));
                      vec4 color2 = vec4((color.rgb + (gray - color.rgb) * 0.4)-0.15,color.a);
                      gl_FragColor = color2*vec4(makeCircle(st,vec2(tx,ty),vec3(1.0)),1.0);
                  }
            `
    super(config);


    //this.setFloat2("pixelSize", 1, 1);
    // this.setFloat2._width = 0; // width wo resolution
    // this._height = 0; // height wo resolution
    // this._pixelWidth = 0; // width of pixel wo resolution
    // this._pixelHeight = 0; // height of pixel wo resolution

  }

  public update(time: number): void {
    var condition = Math.min(1, Math.sin(time / 150) * 4 + 2);
    //console.log(-condition + 2)
    this.setFloat1('time', time);

    //this.setFloat2("texSize", 200 * (condition+2)+100, 200 * (condition+2)+100);
    //this.setFloat1("radius", (-condition+2));
  }
}
