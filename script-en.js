const header=document.querySelector('.site-header');
const menuButton=document.querySelector('.menu-button');
const navLinks=document.querySelector('.nav-links');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>10));
menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}));

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('.accordion-item button').forEach(button=>button.addEventListener('click',()=>{
  const item=button.closest('.accordion-item'); const open=item.classList.toggle('open');
  button.setAttribute('aria-expanded',String(open)); button.querySelector('i').textContent=open?'−':'＋';
}));

const range=document.querySelector('#emg-range');
const emgValue=document.querySelector('#emg-value');
const gripValue=document.querySelector('#grip-value');
const gripCopy=document.querySelector('#grip-copy');
const gripRing=document.querySelector('.grip-ring');
const emgLine=document.querySelector('#emg-line');
function updateSignal(){
  const value=Number(range.value); emgValue.value=`${value}%`;
  const points=[]; for(let x=0;x<=500;x+=25){const amp=7+value*.45;const y=78+(Math.random()-.5)*amp;points.push(`${x},${y.toFixed(1)}`)} emgLine.setAttribute('points',points.join(' '));
  const active=value>=45; gripRing.classList.toggle('active',active); gripValue.textContent=active?'Grip':'Idle'; gripCopy.textContent=active?'Signal above threshold; the motor is active':'Signal below threshold';
}
range.addEventListener('input',updateSignal); updateSignal();

const questions=[
  {q:'What does a myoelectric prosthesis mainly detect?',options:['Complete thoughts in the brain','Electrical signals produced by residual muscle activity','Wireless signals from objects','Movement of the unaffected arm'],answer:1,why:'Surface electrodes measure voltage changes produced by muscle activation. Software then decodes the pattern into a movement command; it does not read thoughts directly.'},
  {q:'What best shows whether a prosthesis suits its user?',options:['It has as many joints and grips as possible','It looks as natural as possible','It fits personal goals, remains comfortable, and has long-term support','It is as expensive as possible'],answer:2,why:'Specifications are only one part of the decision. Comfort, tasks, reliability, training, repair services, and personal preference together determine practical value.'},
  {q:'Which statement about neural sensory feedback is most accurate?',options:['It fully restores natural touch for every user','Experiments show that sensory feedback has no value','Some participants can use feedback, but long-term stability, risk, and cost still limit access','Accurate sensors automatically create natural perception'],answer:2,why:'Research provides important proof of concept, but small studies do not equal universal clinical benefit. Sensing, encoding, human perception, and long-term support all matter.'}
];
let current=0,score=0,answered=false; const quizContent=document.querySelector('#quiz-content');
function renderQuiz(){
  const item=questions[current]; answered=false; document.querySelector('#quiz-progress').textContent=`Question ${current+1} / ${questions.length}`; document.querySelector('#quiz-score').textContent=`Score ${score}`; document.querySelector('#progress-fill').style.width=`${(current+1)/questions.length*100}%`;
  quizContent.innerHTML=`<h3 class="quiz-question">${item.q}</h3><div class="quiz-options">${item.options.map((o,i)=>`<button class="quiz-option" data-index="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div><div id="quiz-feedback"></div>`;
  quizContent.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',chooseAnswer));
}
function chooseAnswer(e){
  if(answered)return; answered=true; const picked=Number(e.currentTarget.dataset.index),item=questions[current]; if(picked===item.answer)score++;
  quizContent.querySelectorAll('.quiz-option').forEach((btn,i)=>{btn.disabled=true;if(i===item.answer)btn.classList.add('correct');else if(i===picked)btn.classList.add('wrong')});
  document.querySelector('#quiz-score').textContent=`Score ${score}`; const last=current===questions.length-1; document.querySelector('#quiz-feedback').innerHTML=`<div class="quiz-explanation"><strong>${picked===item.answer?'Correct':'Think again'}</strong> ${item.why}</div><button class="button primary quiz-next">${last?'See result':'Next question →'}</button>`; document.querySelector('.quiz-next').addEventListener('click',()=>{if(last)renderResult();else{current++;renderQuiz()}});
}
function renderResult(){quizContent.innerHTML=`<h3 class="quiz-question">Finished! You answered ${score} / ${questions.length} correctly.</h3><p>${score===3?'You understand the key relationship between prosthetic technology and user needs.':'Review Technology and People & Rehab. The goal is not memorising terms, but understanding how technology enters real life.'}</p><button class="button primary quiz-next">Try again</button>`;document.querySelector('.quiz-next').addEventListener('click',()=>{current=0;score=0;renderQuiz()})}
renderQuiz();

const search=document.querySelector('#term-search'); search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();document.querySelectorAll('#term-grid article').forEach(card=>card.classList.toggle('hidden',!card.dataset.term.toLowerCase().includes(term)))});
const textarea=document.querySelector('#question'); textarea.addEventListener('input',()=>document.querySelector('#char-count').textContent=textarea.value.length);
document.querySelector('#interest-form').addEventListener('submit',e=>{
  e.preventDefault(); const data=new FormData(e.currentTarget),interest=data.get('interest'),question=textarea.value.trim(); const payload={topic:interest,question:question||'Not provided',created:new Date().toLocaleDateString('zh-CN')}; localStorage.setItem('limblab-anonymous-feedback',JSON.stringify(payload));
  const result=document.querySelector('#form-result');result.hidden=false;result.innerHTML=`<strong>Anonymous feedback created locally</strong><br>Topic: ${interest}<br>${question?`Question: ${question.replace(/[<>]/g,'')}`:'No additional question.'}<br><small>This prototype does not upload data. Before public collection, connect a reviewed anonymous form and publish a privacy notice.</small>`;
});
