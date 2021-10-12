export class Calculate{
    constructor(){}

    static distanceLineToPoint(x3,y3,z3,x_polar,y_polar,z_polar){
            //벡터와 한 점의 최단거리 (외적을 통한 계산)  
    let expo_x = (y_polar*z3) - (z_polar*y3);
    let expo_y = (x_polar*z3) - (z_polar*x3);
    let expo_z = (x_polar*y3) - (y_polar*x3);
    
    let numer = Math.pow(expo_x,2)+Math.pow(expo_y,2)+Math.pow(expo_z,2);
    let denom = Math.pow(x_polar,2)+Math.pow(y_polar,2)+Math.pow(z_polar,2);
    let d = Math.sqrt(numer/denom);

    return d;
    }

    static distancePointToPoint(x1,y1,z1,x2,y2,z2){
        let d = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)+Math.pow(z1-z2,2));
        return d;
    }

    static directionVectorPlanetToSun(vx,vy,vz,windowRadius,sunx,suny){
        //구의 중심(vx,vy,vz)에서 항성계 중심(0,0,0)을 이었을때, 방향 벡터 반환
        //window 중심을 중심으로
        //var x1 = (-1)vx;
        //var y1 = (-1)*vy;
        //var z1 = (-1)*vz;
        //var x1 = canvas.width/2-vx;
        let x1 = sunx-vx;
        //var y1 = canvas.height/2-vy;
        let y1 = suny-vy;
        let z1 = -1*vz;
    
        let squrt = Math.sqrt(Math.pow(x1,2)+Math.pow(y1,2)+Math.pow(z1,2));
        
        let xp = x1/squrt*windowRadius;
        let yp = y1/squrt*windowRadius;
        let zp = z1/squrt*windowRadius;
        //console.log("xp:"+xp +"  yp:"+ yp + "  zp:" + zp + "   r:"+ windowRadius);

        return{
            x :xp,
            y :yp,
            z :zp
        };
    
    }
}

export class PlanetGroup{
    constructor(){
        this.array = [];
    }

    pushing(planet){
        this.array.push(planet);
        this.sorting(this.array);
    }

    sorting(array){
        array.sort(function(a,b){
            return a.spaceZ - b.spaceZ;
        });
    }
}

export class Planet {
    constructor(canvas,event,spaceRadius,planetR,sunx,suny,stageWidth,stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.planetR = planetR;
        this.event = event;
        this.canvas = canvas;

        this.portionX = this.event.clientX/this.canvas.width;
        this.portionY = this.event.clientY/this.canvas.height;

        this.ctx = this.canvas.getContext('2d');
        this.spaceX = 0;
        this.spaceY = 0;
        this.spaceZ = 0;
        this.spaceRadius = spaceRadius;
        this.colorRed = 0;
        this.colorGreen = 0;
        this.colorBlue = 0;
        this.polarX = 0;
        this.polarY = 0;
        this.polarZ = 0;
        
        this.shadePolor = 0;
        
        this.sunx = sunx;
        this.suny = suny;
        
        this.spacePosition(this.event.clientX,this.event.clientY);

        this.windowRadius = (this.spaceRadius*2 + this.spaceZ)/(this.spaceRadius*4)*this.planetR;

        this.generatePolar();
        this.colorSet();

        //window_r = (space_r*2 + space_pos.z)/(space_r*4)*r;
        this.windowX = this.spaceX;
        this.windowY = this.spaceY;

    }

    resize(){
        this.spaceX = this.canvas.width * this.portionX;
        this.spaceY = this.canvas.height * this.portionY;
        this.windowX = this.spaceX;
        this.windowY = this.spaceY;
    }

    generatePolar(){      
    //반지름 r내부에 랜덤 극점 point 생성
    let polar_r =  this.windowRadius*Math.random();
    let radian = Math.PI*2*Math.random();
    this.polarX = Math.round(polar_r*Math.cos(radian));
    this.polarY = Math.round(polar_r*Math.sin(radian));
        //해당 정사영에서 구 위의 Z point 계산 
    this.polarZ = Math.sqrt(Math.pow(this.windowRadius,2)-Math.pow(this.polarX,2)-Math.pow(this.polarY,2));
    console.log(this.polarX +"  "+ this.polarY +"  "+this.polarZ);
    }

    colorSet(){

        this.colorRed = Math.random() < 0.5 ?  2*Math.random()+0.1: -2*Math.random()+0.1;
        this.colorGreen = Math.random() < 0.5 ?  2*Math.random()+0.1: -2*Math.random()+0.1;
    
        if(Math.sign(this.colorRed)*Math.sign(this.colorGreen)==-1){
            this.colorBlue = Math.random() < 0.5 ?  2*Math.random()+0.1: -2*Math.random()+0.1;
        }
        else{
            this.colorBlue = Math.sign(this.colorRed) < 0 ? 2*Math.random()+0.1: -2*Math.random()+0.1;
        }
        
    }

    spacePosition(clientX,clientY){
        let radian = 2*Math.PI*Math.random();
        // 뒤에 space 텀은 window 좌표 더해주기
        this.spaceX = clientX;
        this.spaceY = clientY;
        //this.spaceX = Math.round(Math.random()*(this.stageWidth/2)*Math.cos(radian))+this.stageWidth/2;
        //this.spaceY = Math.round(Math.random()*this.spaceRadius*Math.sin(radian))+this.stageHeight/2;
    
        //일단은 반달 잘 나오는지 확인하기 위해 고도는 낮게
        this.spaceZ = (this.spaceRadius*2)*Math.random()-this.spaceRadius;
        console.log(this.spaceX +" "+ this.spaceY+"  "+this.spaceZ);


    }
    
    renderingPlanet(sunx,suny,stageWidth,stageHeight){

        this.sunx = sunx;
        this.suny = suny;
        this.shadePolor = Calculate.directionVectorPlanetToSun(this.spaceX,this.spaceY,this.spaceZ,this.windowRadius,this.sunx,this.suny);

        for(var i=(this.windowX-this.windowRadius);i<=(this.windowX+this.windowRadius);i++){
            for(var j=(this.windowY-this.windowRadius);j<=(this.windowY+this.windowRadius);j++){
                
                let pos = Math.pow(i-this.windowX,2)+Math.pow(j-this.windowY,2);
                let circle = Math.pow(this.windowRadius,2);
    
                //원 안에있는지 확인
                if(pos<=circle) {
                    
                    var x3 = i-this.windowX;
                    var y3 = j-this.windowY;
                    //3차원 구 위의 z좌표 추가 space 공간상에서는 -좌표까지 고려해야 함 광원에서 반대인 부분의 구를 스캔예정
                    //if(z1>0){
                    var z3 = Math.sqrt(Math.pow(this.windowRadius,2)-Math.pow(x3,2)-Math.pow(y3,2));
                    //}
                    //else{
                       //var z3 = -1*Math.round(Math.sqrt(Math.pow(r_win,2)-Math.pow(x3,2)-Math.pow(y3,2)));
                    //}
                    
                    //극점과 화면을 스캔하는 점의 거리는 반대 반구일 경우 루트2*반지름 보다 멀다 해당 사실을 가지고 조건문
                    let decisionHalfSphere = Calculate.distancePointToPoint(this.shadePolor.x,this.shadePolor.y,this.shadePolor.z,x3,y3,z3);
                    var d = Calculate.distanceLineToPoint(x3,y3,Math.abs(z3),this.polarX,this.polarY,this.polarZ);
    
                    if(decisionHalfSphere>=Math.sqrt(2)*this.windowRadius){
    
                        //해당 구 위 점에서 극점 법선벡터(선분)와의 거리 계산(외적사용) |v(x3,y3,z3)*polar_v(x,y,z)| / |polar_v(x,y,z)|       d의 범위 : 0 ~ r
    
                        var d_shade = Calculate.distanceLineToPoint(x3,y3,z3,this.shadePolor.x,this.shadePolor.y,this.shadePolor.z);
    
                        //같은 거리의 집합을 같은색으로 칠할 경우 구와 면이 접하여 생성된 원과 같음 단, 북반구/남반구가 색 대칭
    
                        if(this.colorRed>0){
                            var r_c = Math.round((d/(this.colorRed*this.windowRadius)*255));
                        }
                        else
                        {
                            var r_c = Math.round(255+(d/(this.colorRed*this.windowRadius)*255));
                        }
    
                        if(this.colorGreen>0){
                            var g_c = Math.round((d/(this.colorGreen*this.windowRadius)*255));
                        }
                        else
                        {
                            var g_c = Math.round(255+(d/(this.colorGreen*this.windowRadius)*255));
                        }
    
                        if(this.colorBlue>0){
                            var b_c = Math.round((d/(this.colorBlue*this.windowRadius)*255));
                        }
                        else
                        {
                            var b_c = Math.round(255+(d/(this.colorBlue*this.windowRadius)*255));
                        }
                        
                        //shade algorithm
                        var shadow_radian = Math.PI*2/30;
                        var boundryD = this.windowRadius*Math.cos(shadow_radian)
                        if(d_shade<boundryD){
                            r_c = 0;
                            g_c = 0;
                            b_c = 0;
                        }
                        else{
                            var maxmax = Math.max(r_c,g_c,b_c);
                            var minmin = Math.min(r_c,g_c,b_c);
                            
                            let ratio_shade = (d_shade-boundryD)/(this.windowRadius-boundryD);
                            r_c = r_c*(ratio_shade);
                            g_c = g_c*(ratio_shade);
                            b_c = b_c*(ratio_shade);
                            
                            
                        }
    
                        this.ctx.clearRect(i,j,1,1);
                        this.ctx.fillStyle = "rgb(" +r_c+ "," +g_c+ "," +b_c+ ")";
                        this.ctx.fillRect(i,j,1,1);
    
                    }
                    else{
    
                        if(this.colorRed>0){
                            var r_c = Math.round((d/(this.colorRed*this.windowRadius)*255));
                        }
                        else
                        {
                            var r_c = Math.round(255+(d/(this.colorRed*this.windowRadius)*255));
                        }
    
                        if(this.colorGreen>0){
                            var g_c = Math.round((d/(this.colorGreen*this.windowRadius)*255));
                        }
                        else
                        {
                            var g_c = Math.round(255+(d/(this.colorGreen*this.windowRadius)*255));
                        }
    
                        if(this.colorBlue>0){
                            var b_c = Math.round((d/(this.colorBlue*this.windowRadius)*255));
                        }
                        else
                        {
                            var b_c = Math.round(255+(d/(this.colorBlue*this.windowRadius)*255));
                        }
                        
                        
                        this.ctx.clearRect(i,j,1,1);
                        this.ctx.fillStyle = "rgb(" +r_c+ "," +g_c+ "," +b_c+ ")";
                        //this.ctx.fillStyle = "rgb(" +0+ "," +0+ "," +0+ ")";
                        this.ctx.fillRect(i,j,1,1);
                        
                    }
                }
            }
        }
    }

    genOrbit(){
        this.orbitDirectionVector = { x:0, y:0, z:0 };
        
    }
}
