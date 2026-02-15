export function createConfetti(container) {
  const flowers = ['🤍', '🤍', '🤍', '💚', '💚', '🌿', '🌿', '🍃', '🍃', '☘️', '💐', '🌸', '🌼', '🌻'];
  const flowerCount = 100;

  for (let i = 0; i < flowerCount; i++) {
    setTimeout(() => {
      const flower = document.createElement('div');
      flower.className = 'confetti';

      // Random properties
      const left = Math.random() * 100;
      const size = Math.random() * 20 + 20; // Larger size for flowers
      const duration = Math.random() * 2 + 3; // Slower fall
      const delay = Math.random() * 0.5;
      const flowerEmoji = flowers[Math.floor(Math.random() * flowers.length)];

      flower.textContent = flowerEmoji;
      flower.style.left = `${left}%`;
      flower.style.fontSize = `${size}px`;
      flower.style.animationDuration = `${duration}s`;
      flower.style.animationDelay = `${delay}s`;

      container.appendChild(flower);

      // Remove after animation
      setTimeout(() => {
        flower.remove();
      }, (duration + delay) * 1000);
    }, i * 30);
  }
}

export function clearConfetti(container) {
  container.innerHTML = '';
}
