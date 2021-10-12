import {Calculate, PlanetGroup, Planet} from "./app_planet.js"
import {LandScape} from "./app_landscape.js"

class App {
    constructor(){
        this.canvas = document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
    
        this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    
        this.sunx = 0;
        this.suny = 0;
        this.spaceRadius = this.canvas.width*2;
        this.planetGroup = new PlanetGroup();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        this.landScape = new LandScape(this.canvas);

        window.addEventListener("mousemove", (e) => {
            this.sunx = e.clientX;
            this.suny = e.clientY;
        });
        window.addEventListener("click", (e) => {
            //PlanetGroup에 푸싱
            let planet = new Planet(this.canvas,e,this.spaceRadius,100,this.sunx,this.suny,this.canvas.width,this.canvas.height);
            this.planetGroup.pushing(planet);
        });

        this.planetGroup.pushing(  {spaceZ : 0, genSun : 1} );

        window.requestAnimationFrame(this.animate.bind(this));

    }

    resize(){
        console.log("resize");
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
    
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
        for(var i=0;i<this.planetGroup.array.length;i++){
            if(this.planetGroup.array[i].genSun){}
            else
            this.planetGroup.array[i].resize();
        }
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0,0,this.stageWidth,this.stageHeight);

        //플래닛 그룹 안에 객체를 순서대로 랜더링 호출
        //PlanetGroup.array[i].renderingPlanet(sunx,suny,stageWidth,stageHeight);
        this.landScape.genStar();
        //this.landScape.genSun(this.sunx,this.suny,100);

        for(var i=0;i<this.planetGroup.array.length;i++){
            if(this.planetGroup.array[i].genSun){
                this.landScape.genSun(this.sunx,this.suny,100);
            }
            else
            this.planetGroup.array[i].renderingPlanet(this.sunx,this.suny,this.canvas.width,this.canvas.height);
        }
    }    
}


window.onload = () => {
    new App();
}