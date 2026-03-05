import './style.css';
import { ScratchCard } from './scratch.js';
import { createConfetti, clearConfetti } from './confetti.js';

let scratchCard;
let revealUiTimeoutId = null;
const BUTTONS_REVEAL_DELAY_MS = 700;
const FULL_SCRATCH_REVEAL_THRESHOLD = 80;

function init() {
  const canvas = document.getElementById('scratch-canvas');
  const instruction = document.getElementById('instruction');
  const actions = document.getElementById('actions');
  const calendarOptions = document.getElementById('calendar-options');
  const resetBtn = document.getElementById('reset-btn');
  const googleCalendarLink = document.getElementById('google-calendar-link');
  const confettiContainer = document.getElementById('confetti');
  const scratchSettings = getScratchSettings();

  googleCalendarLink.href = buildGoogleCalendarUrl();
  
  scratchCard = new ScratchCard(canvas, {
    brushSize: scratchSettings.brushSize,
    revealThreshold: scratchSettings.revealThreshold,
    onReveal: () => {
      handleReveal(instruction, actions, calendarOptions, confettiContainer);
    },
    onScratch: () => {}
  });
  
  resetBtn.addEventListener('click', () => {
    handleReset(instruction, actions, calendarOptions, confettiContainer);
  });
}

function getScratchSettings() {
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const isPhoneWidth = window.matchMedia('(max-width: 768px)').matches;
  const isPhone = isCoarsePointer && isPhoneWidth;

  return {
    brushSize: isPhone ? 58 : 50,
    revealThreshold: FULL_SCRATCH_REVEAL_THRESHOLD
  };
}

function handleReveal(instruction, actions, calendarOptions, confettiContainer) {
  if (revealUiTimeoutId !== null) {
    clearTimeout(revealUiTimeoutId);
  }

  instruction.classList.add('instruction-hide');

  revealUiTimeoutId = window.setTimeout(() => {
    instruction.style.display = 'none';
    actions.style.display = 'flex';
    calendarOptions.style.display = 'flex';
    createConfetti(confettiContainer);
    revealUiTimeoutId = null;
  }, BUTTONS_REVEAL_DELAY_MS);
}

function handleReset(instruction, actions, calendarOptions, confettiContainer) {
  if (revealUiTimeoutId !== null) {
    clearTimeout(revealUiTimeoutId);
    revealUiTimeoutId = null;
  }

  scratchCard.reset();
  instruction.classList.remove('instruction-hide');
  instruction.style.display = 'block';
  actions.style.display = 'none';
  calendarOptions.style.display = 'none';
  clearConfetti(confettiContainer);
}

function buildGoogleCalendarUrl() {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Cristina & Carmine - Save the Date',
    details: 'Il countdown è iniziato. Matrimonio il 18 Settembre 2026.',
    dates: '20260918/20260919'
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
