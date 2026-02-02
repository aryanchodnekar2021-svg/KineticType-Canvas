const container = document.getElementById('container');
const canvas = document.createElement('canvas');
container.appendChild(canvas);
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('textInput');
const createBtn = document.getElementById('createBtn');
const colorPicker = document.getElementById('colorPicker');
const colorDisplay = document.getElementById('colorDisplay');
const particleCountEl = document.getElementById('particleCount');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];
let currentColor = '#a78bfa';

// Enhanced Mouse Interaction
const mouse = {
    x: null,
    y: null,
    radius: 120
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

// Optimized Particle Class
class Particle {
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1.5;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 20) + 5;
        this.baseColor = color;
        this.color = color;
        this.alpha = Math.random() * 0.3 + 0.7;
    }

    draw(){
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
            this.color = '#ffffff';
            this.alpha = 1;
        } else {
            // Smooth return animation
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx * 0.08;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy * 0.08;
            }
            
            this.color = this.baseColor;
            this.alpha = 0.8;
        }
    }
}

function init(text){
    particleArray = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 140px Inter, Verdana';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(text, canvas.width/2, canvas.height/2);

    const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // OPTIMIZED: Increased step size for fewer particles
    for (let y = 0; y < textCoordinates.height; y += 4) {
        for (let x = 0; x < textCoordinates.width; x += 4) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                particleArray.push(new Particle(x, y, currentColor));
            }
        }
    }
    
    particleCountEl.textContent = particleArray.length;
}

function animate(){
    ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particleArray.length; i++){
        particleArray[i].update();
        particleArray[i].draw();
    }
    
    // OPTIMIZED: Only connect when mouse is active and limit connections
    if (mouse.x !== null && mouse.y !== null) {
        connectNearMouse();
    }
    
    requestAnimationFrame(animate);
}

// OPTIMIZED: Only connect particles near the mouse
function connectNearMouse(){
    const nearbyParticles = [];
    
    // First, find particles near the mouse
    for (let i = 0; i < particleArray.length; i++){
        let dx = mouse.x - particleArray[i].x;
        let dy = mouse.y - particleArray[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius + 50) {
            nearbyParticles.push(particleArray[i]);
        }
    }
    
    // Only connect nearby particles (much fewer calculations)
    for (let a = 0; a < nearbyParticles.length; a++){
        for (let b = a + 1; b < Math.min(a + 5, nearbyParticles.length); b++){
            let dx = nearbyParticles[a].x - nearbyParticles[b].x;
            let dy = nearbyParticles[a].y - nearbyParticles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 30) {
                let opacity = 1 - (distance / 30);
                ctx.strokeStyle = `rgba(167, 139, 250, ${opacity * 0.2})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(nearbyParticles[a].x, nearbyParticles[a].y);
                ctx.lineTo(nearbyParticles[b].x, nearbyParticles[b].y);
                ctx.stroke();
            }
        }
    }
}

// Event Listeners
createBtn.addEventListener('click', () => {
    const val = textInput.value.toUpperCase();
    if(val) {
        init(val);
        createBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            createBtn.style.transform = 'scale(1)';
        }, 100);
    }
});

textInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        createBtn.click();
    }
});

colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    colorDisplay.style.background = `linear-gradient(135deg, ${currentColor} 0%, ${adjustColor(currentColor, -20)} 100%)`;
    init(textInput.value.toUpperCase());
});

function adjustColor(color, amount) {
    const num = parseInt(color.replace("#",""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init(textInput.value.toUpperCase());
});

// Initialize
init('HELLO');
animate();