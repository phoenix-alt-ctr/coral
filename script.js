window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('heart');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  
  class Particle {
    constructor(x, y, targetX, targetY) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.targetX = targetX;
      this.targetY = targetY;
      this.speed = Math.random() * 0.4 + 0.1;
      this.alpha = 0;
      this.va = Math.random() * 0.05 + 0.02; 
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.2 - 0.1;
      this.smokeEffect = Math.random() > 0.9;
      this.smokeDrift = {
        x: Math.random() * 4 - 2,
        y: Math.random() * 2 - 4
      };
    }

    update() {
      if (this.alpha < 1) this.alpha += this.va;

      if (this.smokeEffect) {
        this.x += this.smokeDrift.x;
        this.y += this.smokeDrift.y;
        this.alpha -= 0.02;
        if (this.alpha <= 0) this.reset();
      } else {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 1) {
          this.x = this.targetX;
          this.y = this.targetY;
        } else {
          this.x += dx * this.speed * 0.02;
          this.y += dy * this.speed * 0.02;
        }

        this.angle += this.spin;
      }
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.alpha = 0;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = `hsl(350, 100%, ${this.smokeEffect ? '80%' : '50%'})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  
  function createHeart(t, scale = 20) {
    return {
      x: canvas.width/2 + scale * 16 * Math.pow(Math.sin(t), 3),
      y: canvas.height/2 - scale * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t))
    };
  }

  
  const particles = [];
  const numParticles = 2000;
  const points = [];
  
  
  for (let i = 0; i < numParticles; i++) {
    const t = (i / numParticles) * Math.PI * 2;
    const point = createHeart(t, 15);
    points.push(point);
    particles.push(new Particle(0, 0, point.x, point.y));
  }

  let frameCount = 0;
  const textDisplayDelayFrames = 480; 
  let textAlpha = 0;
  const textFadeInSpeed = 0.02;

  
  function animate() {
   
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    frameCount++;

    
    if (frameCount > textDisplayDelayFrames) {
      
      if (textAlpha < 1) {
        textAlpha += textFadeInSpeed;
        if (textAlpha > 1) textAlpha = 1; 
      }

     
      ctx.save(); 
      ctx.globalAlpha = textAlpha; 
      ctx.font = 'bold 48px "Segoe UI", Arial, sans-serif'; 
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.restore(); 
    }

    requestAnimationFrame(animate);
  }

 
  animate();
}); 

