(() => {
  const { teachers, courses } = window.teacherCatalog;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const courseLinks = teacher => teacher.courseIds.map(id => `<a class="subject-link" href="${courses[id].href}">${escape(courses[id].title)} ↗</a>`).join('');
  const directory = document.querySelector('[data-teacher-directory]');
  if (directory) {
    const select = document.querySelector('#teacher-course-filter');
    select.innerHTML = '<option value="all">全部教學科目</option>' + Object.entries(courses).map(([id, course]) => `<option value="${id}">${escape(course.title)}</option>`).join('');
    const initial = new URLSearchParams(location.search).get('course');
    select.value = courses[initial] ? initial : 'all';
    const render = () => {
      const matching = teachers.filter(teacher => select.value === 'all' || teacher.courseIds.includes(select.value));
      directory.innerHTML = matching.map(teacher => `<article class="teacher-summary" data-teacher-id="${teacher.id}">
        <a class="teacher-photo-link" href="teacher.html?id=${teacher.id}" aria-label="查看${escape(teacher.name)}的介紹"><img src="${teacher.image}" alt="${escape(teacher.name)}${escape(teacher.role)}" loading="lazy" style="object-position:${teacher.imagePosition}"></a>
        <div><span>${teacher.role}</span><h2><a href="teacher.html?id=${teacher.id}">${escape(teacher.name)}</a></h2>
        <p>${escape(teacher.summary)}</p><h3 class="subject-heading">可教學科目</h3><div class="subject-links">${courseLinks(teacher)}</div>
        ${teacher.otherSpecialties.length ? `<p class="other-subjects">其他專長：${teacher.otherSpecialties.map(escape).join('、')}</p>` : ''}
        <a class="teacher-detail-link" href="teacher.html?id=${teacher.id}">查看老師介紹 →</a></div></article>`).join('');
      document.querySelector('[data-teacher-count]').textContent = `共 ${matching.length} 位老師`;
    };
    select.addEventListener('change', render);
    render();
  }
  const featured = document.querySelector('[data-featured-teachers]');
  if (featured) {
    featured.innerHTML = ['amber','inch','neitzu'].map(id => {
      const teacher = teachers.find(item => item.id === id);
      return `<article><img src="${teacher.image}" style="object-position:${teacher.imagePosition}" alt="${escape(teacher.name)}${teacher.role}" loading="lazy"><span>${teacher.role}</span><h3>${escape(teacher.name)}</h3><p>${teacher.specialties.map(escape).join('・')}</p><a href="teacher.html?id=${id}">查看老師 →</a></article>`;
    }).join('');
  }
})();
