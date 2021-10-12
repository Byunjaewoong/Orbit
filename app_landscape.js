export class LandScape{
    constructor(canvas){
        this.canvas = canvas;
        //this.canvas.width
        //this.canvas.height
        this.ctx = this.canvas.getContext("2d");
        this.stargroup = [];
        this.density = 0.002;
        this.size = 1;
        this.starLux = 255;
        this.getStar();
        console.log(this.stargroup.length);
    }

    getStar(){

        for(var i=0;i<this.canvas.width;i++){
            for(var j=0;j<this.canvas.height;j++){
                if(Math.random()<this.density){
                    this.stargroup.push([i/this.canvas.width,j/this.canvas.height,this.size*Math.random(),this.starLux*Math.random()]);
                }
            }
        }
        
    }

    genStar(){

        for(var i=0;i<this.stargroup.length;i++){
        
            this.ctx.fillStyle = "rgb(" +this.stargroup[i][3]+ "," +this.stargroup[i][3]+ "," +this.stargroup[i][3]+ ")";
            this.ctx.beginPath();
            this.ctx.arc(
                this.stargroup[i][0]*this.canvas.width, //* ratio_w,
                this.stargroup[i][1]*this.canvas.height, //* ratio_h,
                this.stargroup[i][2], //*Lux
                0 * 2/8 * Math.PI, 8 * 2/8 * Math.PI
            );
            this.ctx.fill();
        }
    }

    genSun(sunX,sunY,lightRadius){
        this.genSunCore(sunX,sunY);
        this.genLighting(sunX,sunY,lightRadius);

    }

    genSunCore(sunX,sunY){
        let core = this.ctx.createRadialGradient(sunX,sunY,30,sunX,sunY,150);
        core.addColorStop(0,"rgba(255,255,255,1)");
        core.addColorStop(1,"rgba(5,5,5,0)");
        this.ctx.fillStyle = core;
        this.ctx.arc(sunX,sunY,150,0,2*Math.PI,false);
        this.ctx.fill();

    }

    genLighting(sunX,sunY,lightRadius){
        this.radianDiv = 90;
        for(var i=0;i<this.radianDiv;i++){
            if(Math.random()<0.03){
            let lightbuffer = lightRadius*Math.random();
            let luxbuffer = 255;
            //this.lightEndX = lightRadius*Math.cos(2*Math.PI/this.radianDiv*i)+sunX; 
            this.lightEndX = lightbuffer*Math.cos(2*Math.PI/this.radianDiv*i)+sunX; 

            //this.lightEndY = lightRadius*Math.sin(2*Math.PI/this.radianDiv*i)+sunY;
            this.lightEndY = lightbuffer*Math.sin(2*Math.PI/this.radianDiv*i)+sunY;

            this.ctx.beginPath();
            this.ctx.moveTo(sunX,sunY);
            this.ctx.lineTo(this.lightEndX,this.lightEndY);
            //this.ctx.strokeStyle = "rgb(" +255*Math.random()+ "," +255*Math.random()+ "," +255*Math.random()+ ")";
            this.ctx.strokeStyle = "rgb(" +luxbuffer+ "," +luxbuffer+ "," +luxbuffer+ ")";
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            }
        }
    }
}