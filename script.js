document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector('.js-svg');
  const mask = document.querySelector('#mask');
  const wrapper = document.querySelector('.js-wrapper');
  const cursor = document.querySelector('.js-cursor');
  const word = document.querySelector('.js-word');

  if (!svg || !wrapper || !cursor) {
    console.warn('Mask/cursor elements not found'); 
    return;
  }

  const mouse = { x: 0, y: 0, smoothX: 0, smoothY: 0, diff: 0 };
  const viewport = { width: window.innerWidth, height: window.innerHeight };

  function onMouseMove(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
  }
  window.addEventListener('mousemove', onMouseMove);

  function onResize() {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    svg.style.width = viewport.width + 'px';
    svg.style.height = viewport.height + 'px';
    if (word) {
      const maxScale = viewport.height / (word.clientHeight * 0.75);
      word.style.setProperty('--max-scale', maxScale);
    }
  }
  window.addEventListener('resize', onResize);
  onResize();

  function emitParticle() {
    // only emit when moving, optional:
    // if (mouse.diff < 0.01) return;

    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('cx', mouse.smoothX);
    particle.setAttribute('cy', mouse.smoothY);
    particle.setAttribute('r', 40);
    particle.setAttribute('fill', '#fff'); // white = visible area in mask
    wrapper.prepend(particle);

    gsap.to(particle, {
      attr: { r: 0 },
      duration: 1,
      ease: 'power2.out',
      onComplete: () => particle.remove(),
    });
  }

  function render() {
    mouse.smoothX += (mouse.x - mouse.smoothX) * 0.1;
    mouse.smoothY += (mouse.y - mouse.smoothY) * 0.1;
    mouse.diff = Math.hypot(mouse.x - mouse.smoothX, mouse.y - mouse.smoothY);

    emitParticle();

    cursor.style.setProperty('--x', mouse.smoothX + 'px');
    cursor.style.setProperty('--y', mouse.smoothY + 'px');

    requestAnimationFrame(render);
  }

  render();
});


// Selectors
const svg = document.querySelector('.js-svg')
const mask = document.querySelector('#mask')
const wrapper = document.querySelector('.js-wrapper')
const cursor = document.querySelector('.js-cursor')
const word = document.querySelector('.js-word')

const mouse = {
  x: 0,
  y: 0,
  smoothX: 0,
  smoothY: 0,
  diff: 0
}
const viewport = {
  width: window.innerWidth,
  height: window.innerHeight
}
const particles = []
let particleCnt = 0

// Mouse move
function onMouseMove (e) {
  mouse.vx += mouse.x - e.pageX
  mouse.vy += mouse.y - e.pageY
  
  mouse.x = e.pageX
  mouse.y = e.pageY
}
window.addEventListener('mousemove', onMouseMove)

// Resize
function onResize () {
  viewport.width = window.innerWidth
  viewport.height = window.innerHeight
  
  svg.style.width = viewport.width + 'px'
  svg.style.height = viewport.height + 'px'
  
  const wordHeight = word.clientHeight
  const maxScale = viewport.height / (word.clientHeight * 0.75)
  word.style.setProperty('--max-scale', maxScale)
}
window.addEventListener('resize', onResize)
onResize()

// Emitter
function emitParticle () {
  let x = 0
  let y = 0
  let size = 0
  
  if (mouse.diff > 0.01) {
    x = mouse.smoothX
    y = mouse.smoothY
    size = mouse.diff * 0.2
  }

  const particle = new Particle(x, y, size)
  particleCnt += 5

  particles.push(particle)
  wrapper.prepend(particle.el)
}

// Render
function render (time) {
  // Smooth mouse
  mouse.smoothX += (mouse.x - mouse.smoothX) * 0.1
  mouse.smoothY += (mouse.y - mouse.smoothY) * 0.1
  
  mouse.diff = Math.hypot(mouse.x - mouse.smoothX, mouse.y - mouse.smoothY)
  
  emitParticle()
  
  // Cursor
  cursor.style.setProperty('--x', mouse.smoothX + 'px')
  cursor.style.setProperty('--y', mouse.smoothY + 'px')
  
  // Render particles
  particles.forEach(particle => {
    particle.render(time)
  })
  
  // raf
  requestAnimationFrame(render)
}

window.addEventListener('load', render)

/**
 * Particle
 */
class Particle {
  // Constructor
  constructor (x, y, size) {
    this.size = size
    this.x = x
    this.y = y
    this.seed = Math.random() * 1000
    this.freq = (0.5 + Math.random() * 1) * 0.01
    this.amplitude = (1 - Math.random() * 2) * 0.5

    this.color = '#fff'

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    this.el.setAttribute('cx', this.x)
    this.el.setAttribute('cy', this.y)
    this.el.setAttribute('r', this.size)
    this.el.setAttribute('fill', this.color)
    
    // Lifetime
    const tl = gsap.timeline()
    tl.to(
      this,
      {
        size: this.size * 2,
        ease: 'power1.inOut',
        duration: 2
      }
    )
    
    tl.to(
      this,
      {
        size: 0,
        ease: 'power4.in',
        duration: 4
      },
      3
    )
    
    tl.call(this.kill.bind(this))
  }
  
  // Kill
  kill () {
    const self = this

    particles.forEach((particle, index) => {
      if (particle === self) {
        particles.splice(index, 1)
      }
    })
 
    self.el.remove()
  }
  
  // Render
  render (time) {
    // this.x += Math.cos((time + this.seed) * this.freq) * this.amplitude + this.vx
    // this.y += Math.sin((time + this.seed) * this.freq) * this.amplitude + this.vy

    this.el.setAttribute('cy', this.y)
    this.el.setAttribute('cx', this.x)
    this.el.setAttribute('r', this.size)
  }
}

document.querySelector('.js-burger').addEventListener('click', function() {
  window.location.href = 'about.html';
});
