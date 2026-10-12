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
  const active=value>=45; gripRing.classList.toggle('active',active); gripValue.textContent=active?'抓握':'待机'; gripCopy.textContent=active?'信号超过阈值，电机开始动作':'信号低于控制阈值';
}
range.addEventListener('input',updateSignal); updateSignal();

const questions=[
  {q:'肌电假肢主要读取什么？',options:['大脑中的完整思想','残余肌肉活动产生的电信号','物体发出的无线信号','健康一侧手臂的运动'],answer:1,why:'表面电极读取的是肌肉激活产生的电位变化。系统再把信号模式解码为动作命令，并不是直接读取思想。'},
  {q:'以下哪一项最能判断一只假肢是否适合使用者？',options:['关节和抓握模式越多越好','外观越接近自然肢体越好','是否符合个人目标、舒适且能获得长期支持','价格越高越好'],answer:2,why:'技术参数只是决策的一部分。舒适度、任务需要、可靠性、训练、维修服务和个人偏好共同决定实际价值。'},
  {q:'关于神经感觉反馈，哪一种说法更准确？',options:['已能为所有使用者完全恢复自然触觉','实验已证明感觉反馈没有意义','部分研究参与者能利用反馈，但普及仍受长期稳定性、风险和成本限制','只要传感器精度高，人就一定能自然感知'],answer:2,why:'实验研究提供了重要概念验证，但小样本结果不能直接等同于普遍临床效果。传感、编码、人体感知与长期服务缺一不可。'}
];
let current=0,score=0,answered=false; const quizContent=document.querySelector('#quiz-content');
function renderQuiz(){
  const item=questions[current]; answered=false; document.querySelector('#quiz-progress').textContent=`问题 ${current+1} / ${questions.length}`; document.querySelector('#quiz-score').textContent=`得分 ${score}`; document.querySelector('#progress-fill').style.width=`${(current+1)/questions.length*100}%`;
  quizContent.innerHTML=`<h3 class="quiz-question">${item.q}</h3><div class="quiz-options">${item.options.map((o,i)=>`<button class="quiz-option" data-index="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div><div id="quiz-feedback"></div>`;
  quizContent.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',chooseAnswer));
}
function chooseAnswer(e){
  if(answered)return; answered=true; const picked=Number(e.currentTarget.dataset.index),item=questions[current]; if(picked===item.answer)score++;
  quizContent.querySelectorAll('.quiz-option').forEach((btn,i)=>{btn.disabled=true;if(i===item.answer)btn.classList.add('correct');else if(i===picked)btn.classList.add('wrong')});
  document.querySelector('#quiz-score').textContent=`得分 ${score}`; const last=current===questions.length-1; document.querySelector('#quiz-feedback').innerHTML=`<div class="quiz-explanation"><strong>${picked===item.answer?'回答正确':'再想一步'}</strong> ${item.why}</div><button class="button primary quiz-next">${last?'查看结果':'下一题 →'}</button>`; document.querySelector('.quiz-next').addEventListener('click',()=>{if(last)renderResult();else{current++;renderQuiz()}});
}
function renderResult(){quizContent.innerHTML=`<h3 class="quiz-question">完成！你答对了 ${score} / ${questions.length} 题。</h3><p>${score===3?'你已经掌握了假肢技术与使用者需求之间的关键关系。':'可以回看“技术原理”和“人与康复”，重点不是记术语，而是理解技术如何进入真实生活。'}</p><button class="button primary quiz-next">重新测试</button>`;document.querySelector('.quiz-next').addEventListener('click',()=>{current=0;score=0;renderQuiz()})}
renderQuiz();

const search=document.querySelector('#term-search'); search.addEventListener('input',()=>{const term=search.value.trim().toLowerCase();document.querySelectorAll('#term-grid article').forEach(card=>card.classList.toggle('hidden',!card.dataset.term.toLowerCase().includes(term)))});
const textarea=document.querySelector('#question'); textarea.addEventListener('input',()=>document.querySelector('#char-count').textContent=textarea.value.length);
document.querySelector('#interest-form').addEventListener('submit',e=>{
  e.preventDefault(); const data=new FormData(e.currentTarget),interest=data.get('interest'),question=textarea.value.trim(); const payload={topic:interest,question:question||'未填写',created:new Date().toLocaleDateString('zh-CN')}; localStorage.setItem('limblab-anonymous-feedback',JSON.stringify(payload));
  const result=document.querySelector('#form-result');result.hidden=false;result.innerHTML=`<strong>匿名反馈已在本机生成</strong><br>关注主题：${interest}<br>${question?`问题：${question.replace(/[<>]/g,'')}`:'没有补充问题。'}<br><small>当前演示版不会自动上传数据。正式公开收集前，应接入经审查的匿名表单并发布隐私说明。</small>`;
});
