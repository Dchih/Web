// 雨滴效果（非原创）
// 参考 https://segmentfault.com/a/1190000004699623
var draw=document.getElementById("canvas-paint"),
    ctx=draw.getContext("2d"),  //getContext("2d")
    clearColor='rgba(0, 0, 0, 0.1)';
    drops=[],
    w=draw.width=window.innerWidth,
    h=draw.height=window.innerHeight;

// 两数之间的随机数
function random(max, min){
    return Math.random()*(max - min) + min;
};

// 重新确定视窗大小
function resize(){
    w=draw.width=window.innerWidth;
    h=draw.height=window.innerHeight;
};

// 雨滴对象
function raindrop(){}   
// 原型模式定义的是方法和共享属性
raindrop.prototype={
    init : function(){
        this.x=random(0,w);
        this.y=0;   
        // 常量
        this.color='hsl(180,100%,50%)';    
        // 下落速度,常量
        this.speed=random(2,4);       
        // 随机滴落在下方80pre~90pre之间
        this.dropDistance=random(h*0.9,h*0.8);  
        //长方形的宽度，常量
        this.size=2;    
        this.doDrawCircle=false;
    },

    // 画一个矩形
    drawRect : function(){
        if(this.y<this.dropDistance){
            ctx.fillStyle="#a1c4fd";
            ctx.fillRect(this.x,this.y,this.size,this.size*5);
        }
        this.update();    
    },

    // 更新矩形位置
    update : function(){
        if(this.y<this.dropDistance){
            this.y+=this.speed;
        }else{
            this.init();
            this.doDrawCircle=true;
        }
    },
};


// 涟漪效果需要确定的值：
// this.cx  确定圆心的位置
// this.cy   判断雨滴位置，雨滴滴落到“地面”的时候泛起涟漪
// this.r
// this.speed   确定圆的大小
// this.dropDistance 确定圆心的位置
function dropcircle(){};

dropcircle.prototype=new raindrop(); 

dropcircle.prototype.initCircle=function(){
    this.rSpeed=this.speed;
    this.maxR=30*this.rSpeed;
    this.maxr=20*this.rSpeed;
    this.LR=0;
    this.sr=0;
    this.a=1;
    this.cx=this.x;
    this.cy=this.dropDistance;
}

dropcircle.prototype.drawCircle = function(){
    ctx.beginPath();
    ctx.strokeStyle="rgba(161,196,254," + this.a + ")";

    // 由于ellipse方法很多浏览器不支持，需要用到bezierCurveTo(...)
    // 三次bezier曲线绘制椭圆，控制点连接起来应该为矩形
    // ctx.arc(this.cx,this.cy,this.r,0,2*Math.PI);
    ctx.moveTo(this.cx-this.LR,this.cy);
    ctx.bezierCurveTo(this.cx-this.LR,this.cy-this.sr,
                        this.cx+this.LR,this.cy-this.sr,
                        this.cx+this.LR,this.cy );
    ctx.moveTo(this.cx-this.LR,this.cy);
    ctx.bezierCurveTo(this.cx-this.LR,this.cy+this.sr,
                        this.cx+this.LR,this.cy+this.sr,
                        this.cx+this.LR,this.cy );
    ctx.stroke();
    ctx.closePath();
    this.updateCircle();
}

dropcircle.prototype.updateCircle = function(){
    if(this.maxR>=this.LR){
        this.LR+=this.rSpeed/4;   
        this.sr+=this.rSpeed/6;
        this.a*=.96;  
    }else{
        this.initCircle();
        this.doDrawCircle=false;
    }
}

// 建立雨滴对象数组
for(let i=0;i<20; i++){
    drops[i]=new dropcircle();
    drops[i].init();
    drops[i].initCircle();
}
function anim(){
    ctx.fillStyle=clearColor;
    ctx.fillRect(0,0,w,h);
    for(var i in drops){   
        drops[i].drawRect();
        if(drops[i].doDrawCircle){
            drops[i].drawCircle();
        }
    }
    requestAnimationFrame(anim);
};

window.addEventListener("resize",resize);
anim();