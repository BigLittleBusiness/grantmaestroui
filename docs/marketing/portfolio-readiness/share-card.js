const $ = (selector) => document.querySelector(selector);
const card = $('#share-card');
const mode = $('#mode');
const headline = $('#headline');
const supporting = $('#supporting');
const score = $('#score');
const cta = $('#cta');

const scoreLabel = (value) => {
  if (value < 50) return 'High coordination risk';
  if (value < 75) return 'Developing control';
  return 'Strong foundations';
};

function render() {
  const scoreValue = Math.max(0, Math.min(100, Number(score.value) || 0));
  card.className = `share-card ${mode.value}`;
  $('#card-headline').textContent = headline.value.trim() || 'How ready is your grant portfolio?';
  $('#card-supporting').textContent = supporting.value.trim() || 'A practical 3-minute snapshot for council grant teams.';
  $('#card-cta').innerHTML = `${cta.value.trim() || 'Take the free snapshot'} <span aria-hidden="true">→</span>`;
  $('#card-score').textContent = scoreValue;
  $('#score-label').textContent = scoreLabel(scoreValue);
  const scoreColour = scoreValue < 50 ? '#f18791' : scoreValue < 75 ? '#ffd67f' : '#8FDAFA';
  $('#score-visual').style.borderTopColor = scoreColour;
  $('#score-visual').style.borderLeftColor = scoreColour;
}

[mode, headline, supporting, score, cta].forEach((control) => control.addEventListener('input', render));
render();
