import asap from "asap";

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

//arc
ctx.beginPath();
ctx.arc(250,250, 30, 0, Math.PI*2, true);
ctx.strokeStyle = 'blue';
ctx.stroke();
ctx.closePath();


ctx.beginPath();
ctx.strokeStyle = "RED";
ctx.lineWidth = 50;
ctx.moveTo(100,100)
ctx.lineTo(101,101);
ctx.stroke();
ctx.closePath();

var mouse = {
    x: undefined,
    y: undefined
}



window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function(event){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    
    init();
});

var particleArray = [];
var maxRadius = 40;
var minRadius = 2;
var colorArray = [
    '#ffee55',
    '#ff1155',
    '#1fee44',
    '#f5ee24',
    '#ef6e00',
];

var friction = 0.9;
var gravity = 1;
function genrateRandomColor(){
    var letters = '0123456789ABCDEF';
    var color = '#';
    for(var i =0 ; i < 6; i++){
        color += letters[Math.floor(Math.random()*16)];
    }
    return color;
}

function getDistance(x1,y1,x2,y2){
    let xDistance = x2-x1;
    let yDistance = y2-y1;
    return Math.sqrt(xDistance*xDistance + yDistance*yDistance);
}

function Particle(x,y,dx,dy,radius, minRadius) {
    this.xcirc = x;
    this.ycirc = y;
    this.velocity = 0.05;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
    this.minRadius = minRadius;

    this.x = x;
    this.y = y;
    this.radians = Math.random()* Math.PI * 2;
    this.motionRadius = 100 + 20* Math.random();

    this.draw = function(lastPoint){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.radius;
        ctx.moveTo(lastPoint.x,lastPoint.y)
        ctx.lineTo(this.xcirc,this.ycirc);
        ctx.stroke();
        // ctx.arc(this.xcirc,this.ycirc, this.radius, 0, Math.PI*2, false);
        // ctx.strokeStyle = genrateRandomColor();
        // ctx.stroke();
        // ctx.fillStyle = this.color;
        // ctx.fill();
        ctx.closePath();
    }

    this.update = function(){

        
        // if(this.xcirc < this.radius ){
        //     this.xcirc = this.radius;
        // }
    
        // if(this.ycirc < this.radius){
        //     this.ycirc = this.radius;
        // }
        // if((this.xcirc + this.radius ) > window.innerWidth || (this.xcirc - this.radius  ) <= 0 ){
        //     this.dx = -this.dx;
        // }
    
        // if((this.ycirc - this.radius  ) <= 0 ){
        //     // hits the top - reverse the velocity
        //     this.dy = -this.dy;
        // }else if ((this.ycirc + this.radius ) > window.innerHeight ){
        //     this.dy =  -this.dy 
        //     // hits the bottom - decrease the velocity for x & y due tot friction.
        //     // this.dy =  -this.dy * friction;
        //     // this.dx = this.dx * friction;
        // } else {
        //     // falling down - increase the velocity
        //     // this.dy += gravity;
        // }

        // this.xcirc+=this.dx;
        // this.ycirc+=this.dy;
        
        // if((mouse.x - this.xcirc < 40 && (mouse.x - this.xcirc) > -40 )
        //   && (mouse.y - this.ycirc < 40 && (mouse.y - this.ycirc) > -40)){            
        //     if(this.radius < maxRadius){
        //         this.radius += 1;
        //         // this.radius %= 50;
        //     }
        // } else if ( this.radius > minRadius) {
        //     this.radius -=1;
        // }

        const lastPoint = {x: this.xcirc, y: this.ycirc};
        this.xcirc = this.x  + this.motionRadius *  Math.cos(this.radians);
        this.ycirc = this.y  + this.motionRadius * Math.sin(this.radians);
        
        this.radians += this.velocity;
        this.radians %= 2 * Math.PI;

        // console.log(this.xcirc + " ," + this.ycirc +" ("+this.radians+")");
        this.draw(lastPoint);
        
    }
}


function init (){
    particleArray = [];
    for(var i = 0; i< 10; i++){
        var xcirc = Math.random() + window.innerWidth/2;
        var ycirc = Math.random() + window.innerHeight/2;
        var radius = Math.random() * 3 + 5;
        var dx = 0;
        var dy = 0;
        var circle  = new Particle(xcirc,ycirc,dx,dy,radius,radius);
        particleArray.push(circle);
    }
}
var count = 0;
function animate(){
    count += 1;

    
        count = 0;
        // ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        for(var i = 0 ;i < particleArray.length; i++){
            particleArray[i].update();
        }
    
    requestAnimationFrame(animate);    
}


init();
animate();