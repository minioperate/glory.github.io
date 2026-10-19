(() => {
 const courses=window.coursePreviewData;
 const picker=document.getElementById('course-picker');
 const el=id=>document.getElementById(id);
 const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 courses.forEach((course,i)=>{const o=document.createElement('option');o.value=i;o.textContent=course.title;picker.append(o)});
 function render(){
  const c=courses[Number(picker.value)];
  document.body.dataset.theme=c.theme;
  for(const key of ['title','description','heading','slogan','lead','note'])el(key).textContent=c[key];
  el('hero-image').src=c.image;el('hero-image').alt=c.title+'課程示意圖片';
  el('original').href=c.file;
  el('back').href=c.theme==='blue'?'dance.html':'boxing.html';
  el('back').textContent=c.theme==='blue'?'課程探索 / DANCE':'課程探索 / BOXING';
  el('category').textContent=c.theme==='blue'?'FIND YOUR RHYTHM.':'BUILD YOUR NEXT MOVE.';
  el('features').innerHTML=c.features.map(([title,description],i)=>`<article class="goal"><span>0${i+1}</span><h3>${escape(title)}</h3><p>${escape(description)}</p></article>`).join('');
  const entry=Object.entries(window.teacherCatalog.courses).find(([,v])=>v.href===c.file);
  const teachers=entry?window.teacherCatalog.teachers.filter(t=>t.courseIds.includes(entry[0])):[];
  el('teacher-grid').innerHTML=teachers.length?teachers.map(t=>`<article class="teacher"><a href="teacher.html?id=${encodeURIComponent(t.id)}"><img class="teacher-photo" src="${escape(t.image)}" alt="${escape(t.name)}" style="object-position:${escape(t.imagePosition)}" loading="lazy"></a><h3>${escape(t.name)}</h3><p>${escape(t.summary)}</p><a class="text-link" href="teacher.html?id=${encodeURIComponent(t.id)}">認識老師與教學風格 ↗</a></article>`).join(''):'<p class="empty-teachers">師資安排待確認，歡迎先了解老師團隊。</p>';
 }
 picker.addEventListener('change',render);render();
})();
