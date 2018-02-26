console.log('hello');

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

// //rect
// ctx.fillStyle = 'rgba(255,0,0,0.2)';
// ctx.fillRect(300,100,100,100);

// //line
// ctx.beginPath();
// ctx.moveTo(50,50);
// ctx.lineTo(100,100);
// ctx.lineTo(400,300);
// ctx.strokeStyle = "#FF2299";
// ctx.stroke();
// ctx.closePath();

//arc
ctx.beginPath();
ctx.arc(250,250, 30, 0, Math.PI*2, true);
ctx.strokeStyle = 'blue';
ctx.stroke();
ctx.closePath();


// for(var i =0 ;i<100; i++){
//     var x = Math.random() * window.innerWidth;
//     var y = Math.random() * window.innerHeight;
//     ctx.beginPath();
//     ctx.arc(x,y, 30, 0, Math.PI*2, true);
//     ctx.strokeStyle = genrateRandomColor();
//     ctx.stroke();
// }



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

var circleArray = [];
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

function Circle(x,y,dx,dy,radius, minRadius) {
    this.xcirc = x;
    this.ycirc = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
    this.minRadius = minRadius;

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.xcirc,this.ycirc, this.radius, 0, Math.PI*2, false);
        // ctx.strokeStyle = genrateRandomColor();
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    this.update = function(){
        if(this.xcirc < this.radius ){
            this.xcirc = this.radius;
        }
    
        if(this.ycirc < this.radius){
            this.ycirc = this.radius;
        }
        if((this.xcirc + this.radius ) > window.innerWidth || (this.xcirc - this.radius  ) <= 0 ){
            this.dx = -this.dx;
        }
    
        if((this.ycirc - this.radius  ) <= 0 ){
            // hits the top - reverse the velocity
            this.dy = -this.dy;
        }else if ((this.ycirc + this.radius ) > window.innerHeight ){
            this.dy =  -this.dy 
            // hits the bottom - decrease the velocity for x & y due tot friction.
            // this.dy =  -this.dy * friction;
            // this.dx = this.dx * friction;
        } else {
            // falling down - increase the velocity
            // this.dy += gravity;
        }

        this.xcirc+=this.dx;
        this.ycirc+=this.dy;
        

       
        // let collisionColor = this.color;
        // for(var i = 0; i< circleArray.length;i++){
        //     if(getDistance(this.xcirc,this.ycirc,circleArray[i].xcirc,circleArray[i].ycirc) <
        //     this.radius+circleArray[i].radius &&
        //     this.radius > circleArray[i].radius ){
        //         circleArray[i].color = collisionColor;
        //     }
        // }
        
       
        if((mouse.x - this.xcirc < 40 && (mouse.x - this.xcirc) > -40 )
          && (mouse.y - this.ycirc < 40 && (mouse.y - this.ycirc) > -40)){            
            if(this.radius < maxRadius){
                this.radius += 1;
                // this.radius %= 50;
            }
        } else if ( this.radius > minRadius) {
            this.radius -=1;
        }

        this.draw();
        
    }
}


function init (){
    circleArray = [];
    for(var i = 0; i< 10; i++){
        var xcirc = Math.random() * window.innerWidth;
        var ycirc = Math.random() * window.innerHeight;
        var radius = Math.random() * 30 + 20;
        var dx = (Math.random() - 0.5) * 8;
        var dy = (Math.random() - 0.5) * 8;
        var circle  = new Circle(xcirc,ycirc,dx,dy,radius,radius);
        circleArray.push(circle);
    }
}

function animate(){
    ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
    for(var i = 0 ;i < circleArray.length; i++){
        circleArray[i].update();
    }
    requestAnimationFrame(animate);    
}


init();
animate();