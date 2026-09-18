(() => {
  const { teachers, courses } = window.teacherCatalog;
  const id = new URLSearchParams(location.search).get('id') || 'amber';
  const teacher = teachers.find(item => item.id === id);
  const root = document.querySelector('[data-teacher-profile]');
  if (!teacher) {
    document.title = '找不到老師｜容耀';
    root.innerHTML = '<h1>找不到這位老師</h1><p>請從老師團隊選擇想了解的老師。</p><a class="button" href="teachers.html">查看全部老師</a>';
    return;
  }
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list = items => `<ul>${items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
  document.body.dataset.teacherKind = teacher.category;
  document.title = `${teacher.name}｜${teacher.role}介紹｜容耀`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', teacher.intro);
  root.innerHTML = `
    <a class="teacher-back" href="teachers.html">← 返回全部老師</a>
    <section class="teacher-profile-hero"><img src="${teacher.image}" alt="${escape(teacher.name)}${teacher.role}" style="object-position:${teacher.imagePosition}"><div><span>${teacher.role}</span><h1>${escape(teacher.name)}</h1><p>${teacher.specialties.map(escape).join('・')}</p><a class="profile-subject-jump" href="#teaching-subjects">查看可教學科目 ↓</a></div></section>
    <section class="teacher-introduction" aria-labelledby="teacher-intro-title"><p class="eyebrow">MEET YOUR INSTRUCTOR</p><h2 id="teacher-intro-title">認識${escape(teacher.name)}</h2><p>${escape(teacher.intro)}</p></section>
    <div class="profile-booking"><button class="button secondary booking-trigger profile-booking-button" type="button" data-teacher-id="${teacher.id}" data-teacher-name="${escape(teacher.name)}">洽詢上課時間</button><p>有開放時段時可查看月曆，實際安排需由專人確認。</p></div>
    <section class="teacher-stats" aria-label="老師經歷摘要">${teacher.stats.map(item => `<div><b>${escape(item[0])}</b><span>${escape(item[1])}</span></div>`).join('')}</section>
    <section class="teacher-subjects" id="teaching-subjects" aria-labelledby="subjects-title"><p class="eyebrow">LEARN WITH ME</p><h2 id="subjects-title">可教學科目</h2><p>${teacher.specialties.map(escape).join('・')}</p><p class="subject-note">${escape(teacher.courseNote)}</p><h3>探索對應課程</h3><div class="profile-course-grid">${teacher.courseIds.map(courseId => {
      const course = courses[courseId];
      return `<a class="profile-course-card" href="${course.href}" data-course-id="${courseId}"><span>${course.category === 'dance' ? 'DANCE' : 'BOXING'}</span><h3>${escape(course.title)}</h3><p>${escape(course.description)}</p><b>了解課程 →</b></a>`;
    }).join('')}</div>${teacher.otherSpecialties.length ? `<div class="profile-other-subjects"><h3>其他專長</h3><p>${teacher.otherSpecialties.map(escape).join('、')}</p><p>可洽詢相關教學安排。</p><a href="#contact" data-contact>洽詢老師專長 →</a></div>` : ''}</section>
    <section class="teacher-profile-content">
      <article>${teacher.education.length ? `<span>EDUCATION</span><h2>學歷</h2>${list(teacher.education)}` : ''}<span>EXPERIENCE</span><h2>教學與專業經歷</h2>${list(teacher.experience)}${teacher.certificates.length ? `<h3>專業證照</h3>${list(teacher.certificates)}` : ''}</article>
      <article><span>ACHIEVEMENTS</span><h2>競賽與獲獎紀錄</h2>${list(teacher.awards.slice(0,6))}${teacher.awards.length > 6 ? `<details class="teacher-more-awards"><summary>查看其餘 ${teacher.awards.length - 6} 項紀錄</summary>${list(teacher.awards.slice(6))}</details>` : ''}</article>
    </section>
    <section class="teacher-contact"><div><span>想和 ${escape(teacher.name)} 一起上課？</span><h2>告訴我們你的學習目標</h2></div><a class="line-match-button" href="#contact" data-contact><img src="line-brand-icon/LINE_Brand_icon.png" alt="LINE">課程洽詢 ↗</a></section>`;
})();
