export class ScratchCard {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.isDrawing = false;
    this.isRevealed = false;
    this.dpr = window.devicePixelRatio || 1;
    this.width = 0;
    this.height = 0;
    this.resizeObserver = null;
    
    // Options
    this.brushSize = options.brushSize || 40;
    this.revealThreshold = options.revealThreshold || 70;
    this.onReveal = options.onReveal || (() => {});
    this.onScratch = options.onScratch || (() => {});
    this.handleResize = this.handleResize.bind(this);
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.handleResize();
    
    // Resize handler
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', this.handleResize);

    // Keep canvas synced with layout changes on mobile (dynamic viewport, font/CSS updates)
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.canvas.parentElement);
    }

    // Re-sync once all resources are loaded
    window.addEventListener('load', this.handleResize, { once: true });
  }

  handleResize() {
    const changed = this.setCanvasSize();
    if (!changed) return;

    if (!this.isRevealed) {
      this.ctx.globalAlpha = 1;
      this.ctx.globalCompositeOperation = 'source-over';
      this.drawScratchLayer();
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
  
  setCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    if (width === this.width && height === this.height && dpr === this.dpr) {
      return false;
    }

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    
    // Set canvas size to match container
    this.canvas.width = Math.max(1, Math.round(width * dpr));
    this.canvas.height = Math.max(1, Math.round(height * dpr));
    
    // Reset transform before applying scale to avoid cumulative zoom on resize
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    return true;
  }
  
  drawScratchLayer() {
    const width = this.width;
    const height = this.height;

    // Create gradient background (bianco e verde)
    const gradient = this.ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#4A7C59');
    gradient.addColorStop(0.5, '#FFFFFF');
    gradient.addColorStop(1, '#6B9D7A');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add texture pattern
    this.addWhiteGreenTexture();

    // Add text overlay
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.font = 'italic 26px Georgia';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('Gratta qui', width / 2, height / 2);
  }
  
  addWhiteGreenTexture() {
    const width = this.width;
    const height = this.height;

    // Add random sparkle effect in white and light green
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 3;
      // Alternate between white and light green sparkles
      this.ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.4)' : 'rgba(107, 157, 122, 0.3)';
      this.ctx.fillRect(x, y, size, size);
    }
  }
  
  bindEvents() {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleStart.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleEnd.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleEnd.bind(this));
    
    // Touch events
    this.canvas.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleEnd.bind(this), { passive: false });
    this.canvas.addEventListener('touchcancel', this.handleEnd.bind(this), { passive: false });
  }
  
  handleStart(e) {
    e.preventDefault();
    this.isDrawing = true;
    const pos = this.getPosition(e);
    this.scratch(pos.x, pos.y);
  }
  
  handleMove(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    const pos = this.getPosition(e);
    this.scratch(pos.x, pos.y);
  }
  
  handleEnd(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    this.isDrawing = false;
    this.checkRevealPercentage();
  }
  
  getPosition(e) {
    const rect = this.canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  
  scratch(x, y) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.onScratch();
  }
  
  checkRevealPercentage() {
    if (this.isRevealed) return;
    
    const imageData = this.ctx.getImageData(
      0, 
      0, 
      this.canvas.width, 
      this.canvas.height
    );
    
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    // Check alpha channel (every 4th value)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) {
        transparentPixels++;
      }
    }
    
    const totalPixels = pixels.length / 4;
    const percentage = (transparentPixels / totalPixels) * 100;
    
    if (percentage > this.revealThreshold) {
      this.revealAll();
    }
  }
  
  revealAll() {
    if (this.isRevealed) return;

    this.isRevealed = true;

    // Faster fade out animation
    let alpha = 1;
    const fadeInterval = setInterval(() => {
      alpha -= 0.15;

      if (alpha <= 0) {
        clearInterval(fadeInterval);
        this.ctx.clearRect(
          0,
          0,
          this.width,
          this.height
        );
        this.canvas.style.pointerEvents = 'none';
        this.onReveal();
      } else {
        this.ctx.globalAlpha = alpha;
        this.ctx.globalCompositeOperation = 'source-over';
        this.drawScratchLayer();
      }
    }, 30);
  }
  
  reset() {
    this.isRevealed = false;
    this.isDrawing = false;
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = 'source-over';
    this.canvas.style.pointerEvents = 'auto';
    this.setCanvasSize();
    this.drawScratchLayer();
  }
}
