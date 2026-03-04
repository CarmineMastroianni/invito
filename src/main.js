import './style.css';
import { ScratchCard } from './scratch.js';
import { createConfetti, clearConfetti } from './confetti.js';

let scratchCard;

function init() {
  const canvas = document.getElementById('scratch-canvas');
  const instruction = document.getElementById('instruction');
  const actions = document.getElementById('actions');
  const resetBtn = document.getElementById('reset-btn');
  const shareBtn = document.getElementById('share-btn');
  const confettiContainer = document.getElementById('confetti');
  const scratchSettings = getScratchSettings();
  
  scratchCard = new ScratchCard(canvas, {
    brushSize: scratchSettings.brushSize,
    revealThreshold: scratchSettings.revealThreshold,
    onReveal: () => {
      handleReveal(instruction, actions, confettiContainer);
    },
    onScratch: () => {}
  });
  
  resetBtn.addEventListener('click', () => {
    handleReset(instruction, actions, confettiContainer);
  });
  
  shareBtn.addEventListener('click', handleShare);
}

function getScratchSettings() {
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isPhoneWidth = window.matchMedia('(max-width: 768px)').matches;
  const isPhone = isCoarsePointer && isPhoneWidth;

  if (isPhone) {
    return {
      brushSize: 62,
      revealThreshold: 15
    };
  }

  return {
    brushSize: 50,
    revealThreshold: 30
  };
}

function handleReveal(instruction, actions, confettiContainer) {
  instruction.style.display = 'none';
  actions.style.display = 'flex';
  createConfetti(confettiContainer);
}

function handleReset(instruction, actions, confettiContainer) {
  scratchCard.reset();
  instruction.style.display = 'block';
  actions.style.display = 'none';
  clearConfetti(confettiContainer);
}

async function handleShare() {
  const shareData = {
    title: 'Cristina & Carmine - Save the Date',
    text: 'Sei invitato al nostro matrimonio! 💍\n18 Settembre 2026',
    url: window.location.href
  };
  
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        fallbackShare();
      }
    }
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  const url = window.location.href;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url)
      .then(() => showNotification('Link copiato! 📋'))
      .catch(() => showNotification('Impossibile copiare il link'));
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showNotification('Link copiato! 📋');
    } catch (err) {
      showNotification('Impossibile copiare il link');
    }
    
    document.body.removeChild(textArea);
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #2C2C2C;
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    font-family: var(--font-body);
    font-size: 14px;
    z-index: 10000;
    animation: slideDown 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideUp 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }
`;
document.head.appendChild(style);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
