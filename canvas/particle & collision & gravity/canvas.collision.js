console.log('hello');

var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

//arc



var mouse = {
    x: undefined,
    y: undefined
}

var velocity = {
    dx: undefined,
    dy: undefined
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
    '#ff5555',
    '#000055',
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

function Circle(x,y,givendx,givendy,radius, minRadius) {
    this.xcirc = x;
    this.ycirc = y;
    this.velocity = {
        dx : givendx,
        dy : givendy
    }
    this.radius = radius;
    this.color = colorArray[Math.floor(Math.random()*colorArray.length)];
    this.minRadius = minRadius;
    this.opacity = 0.2;
    this.mass = 1;
    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.xcirc,this.ycirc, this.radius, 0, Math.PI*2, false);
        ctx.strokeStyle = this.color;
        ctx.stroke();
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
        ctx.closePath();
    }

    this.update = function(){
        if(this.xcirc < this.radius ){
            this.xcirc = this.radius;
        }
    
        if(this.ycirc < this.radius){
            this.ycirc = this.radius;
        }

        // bounce on the horizontal walls of the screen
        if((this.xcirc + this.radius ) > window.innerWidth || (this.xcirc - this.radius  ) <= 0 ){
            this.velocity.dx = -this.velocity.dx;
        }
    
        // bounce on the vertical walls of the screen
        if((this.ycirc - this.radius  ) <= 0 ){
            // hits the top - reverse the velocity
            this.velocity.dy = -this.velocity.dy;
        }else if ((this.ycirc + this.radius ) > window.innerHeight ){
            // hits the bottom - decrease the velocity for x & y due tot friction.
            this.velocity.dy =  -this.velocity.dy ;
        }

        this.xcirc+=this.velocity.dx;
        this.ycirc+=this.velocity.dy;
        
        // check for Collision.
        for(var i = 0; i< circleArray.length;i++){
            if(this === circleArray[i]) continue;
            if(getDistance(this.xcirc,this.ycirc,circleArray[i].xcirc,circleArray[i].ycirc) <
            this.radius+circleArray[i].radius ){
                resolveCollision(this,circleArray[i]);                
            }
        }
        
       
        if((mouse.x - this.xcirc < 140 && (mouse.x - this.xcirc) > -140 )
          && (mouse.y - this.ycirc < 140 && (mouse.y - this.ycirc) > -140)){            
            if(this.radius < maxRadius){
                this.radius += 1;
                this.opacity += 0.1;
            }
        } else if ( this.radius > minRadius) {
            this.radius -=1;
            this.opacity -=0.1;
        }

        this.draw();
        
    }
}


/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity, angle) {
    const rotatedVelocities = {
        dx: velocity.dx * Math.cos(angle) - velocity.dy * Math.sin(angle),
        dy: velocity.dx * Math.sin(angle) + velocity.dy * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.dx - otherParticle.velocity.dx;
    const yVelocityDiff = particle.velocity.dy - otherParticle.velocity.dy;

    const xDist = otherParticle.xcirc - particle.xcirc;
    const yDist = otherParticle.ycirc - particle.ycirc;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.ycirc - particle.ycirc, otherParticle.xcirc - particle.xcirc);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { dx: u1.dx * (m1 - m2) / (m1 + m2) + u2.dx * 2 * m2 / (m1 + m2), dy: u1.dy };
        const v2 = { dx: u2.dx * (m1 - m2) / (m1 + m2) + u1.dx * 2 * m2 / (m1 + m2), dy: u2.dy };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.dx = vFinal1.dx;
        particle.velocity.dy = vFinal1.dy;

        otherParticle.velocity.dx = vFinal2.dx;
        otherParticle.velocity.dy = vFinal2.dy;
    }
}


function init (){
    circleArray = [];
    for(var i = 0; i< 100; i++){
        var xcirc = Math.random() * window.innerWidth;
        var ycirc = Math.random() * window.innerHeight;
        var radius = Math.random() * 3 + 30;
        var dx = (Math.random() - 0.5) * 8;
        var dy = (Math.random() - 0.5) * 8;
        var circle  = new Circle(xcirc,ycirc,dx,dy,radius,radius);
        
        for(var j = 0 ; j< circleArray.length; j++){
            if(getDistance(circle.xcirc, circle.ycirc,circleArray[j].xcirc, circleArray[j].ycirc) - (circle.radius +circleArray[j].radius) <0){
                circle.xcirc = Math.random() * window.innerWidth;
                circle.ycirc = Math.random() * window.innerHeight;
                j = -1;
            }
        }

        
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