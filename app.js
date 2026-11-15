const teacherCatalog = window.teacherCatalog || { teachers: [], courses: {} };
const teachers = Array.isArray(teacherCatalog.teachers) ? teacherCatalog.teachers : [];

const coursePageMeta = {
  "boxing-kids.html": ["SMALL STEPS. BIG CONFIDENCE.", "兒童拳擊", ["兒童課程", "依年齡安排", "需求評估"]],
  "dance-mv.html": ["DANCE WITH PURPOSE.", "流行舞蹈", ["零基礎友善", "指定歌曲", "彈性安排"]],
  "dance-jazz.html": ["MOVE WITH ELEGANCE.", "爵士舞蹈", ["線條訓練", "情感表現", "舞台技巧"]],
  "dance-kids.html": ["GROW WITH RHYTHM.", "幼兒舞蹈", ["兒童友善", "律動遊戲", "安全學習"]],
  "dance-hiphop.html": ["FEEL THE BEAT.", "街舞課程", ["零基礎友善", "律動基礎", "風格培養"]],
  "dance-cheerleading.html": ["SHINE TOGETHER.", "彩球啦啦", ["團隊訓練", "活力編舞", "舞台表現"]],
  "boxing-beginner.html": ["BUILD YOUR FOUNDATION.", "拳擊入門", ["零基礎友善", "基礎拳法", "體能建立"]],
  "boxing-advanced.html": ["LEVEL UP YOUR SKILLS.", "進階拳擊", ["技術提升", "攻防節奏", "實戰應用"]],
  "boxing-sparring.html": ["FIGHT WITH PURPOSE.", "實戰拳擊", ["教練評估", "安全對練", "戰術訓練"]]
};

function getCurrentPage() {
  const segment = window.location.pathname.split("/").filter(Boolean).pop() || "index.html";
  return segment.includes(".") ? segment : `${segment}.html`;
}

function enhanceCoursePage() {
  const page = getCurrentPage();
  const meta = coursePageMeta[page];
  const hero = document.querySelector(".page-hero");
  if (!meta || !hero) return;

  // Older pages may omit this section. Re-create it so recommendations are
  // always generated from the shared resume-based catalog.
  let teacherSection = document.querySelector("[data-teachers]")?.closest(".section");
  if (!teacherSection) {
    teacherSection = document.createElement("section");
    teacherSection.className = "section";
    teacherSection.innerHTML = '<h2>老師推薦</h2><div class="teachers" data-teachers></div>';
    document.querySelector("main")?.append(teacherSection);
  }
  if (!teacherSection) return;

  document.body.classList.add("course-page");
  const titleNode = hero.querySelector("h1");
  const title = titleNode?.textContent.trim() || meta[1];
  if (titleNode) titleNode.textContent = title;
  if (!hero.querySelector(".course-breadcrumb")) {
    hero.insertAdjacentHTML("afterbegin", `<div class="course-breadcrumb"><a href="index.html">首頁</a><span>›</span><a href="${page.startsWith("dance") ? "dance.html" : "boxing.html"}">探索課程</a><span>›</span><b>${title}</b></div><p class="course-slogan">${meta[0]}</p>`);
    hero.insertAdjacentHTML("beforeend", `<div class="hero-course-tags">${meta[2].map(tag => `<span>${tag}</span>`).join("")}</div>`);
  }

  if (!document.querySelector(".course-overview-panel")) {
    const suitability = {
      "boxing-beginner.html": ["零基礎入門", "從站姿、拳法與步伐開始"],
      "boxing-advanced.html": ["已有拳擊基礎", "進一步練習組合與攻防節奏"],
      "boxing-sparring.html": ["已有對練經驗", "需經教練評估後安排"],
      "boxing-kids.html": ["想探索拳擊的孩子", "依年齡、經驗與需求確認安排"],
      "dance-mv.html": ["喜歡流行舞碼", "跟著喜歡的歌曲開始練習"],
      "dance-jazz.html": ["想探索爵士風格", "練習線條、控制與表現"],
      "dance-kids.html": ["喜歡音樂與活動的孩子", "透過律動探索身體協調"],
      "dance-hiphop.html": ["對街舞有興趣", "從節奏與律動認識街舞"],
      "dance-cheerleading.html": ["喜歡團隊與舞台", "探索彩球技巧與團隊默契"]
    }[page];
    const info = document.createElement("section");
    info.className = "course-overview-panel";
    info.innerHTML = `<p class="eyebrow">IS THIS YOUR NEXT MOVE?</p><h2>這堂課適合你嗎？</h2><div class="fit-grid"><div><strong>${suitability[0]}</strong><span>${suitability[1]}</span></div><div><strong>依照目標安排</strong><span>先確認程度、時間、地點與費用，再開始課程。</span></div></div>`;
    teacherSection.before(info);
  }

  const teacherHeading = teacherSection.querySelector("h2");
  if (teacherHeading) teacherHeading.textContent = "選擇你的老師";
  teacherSection.classList.add("course-teachers-section");
  if (!teacherSection.querySelector(".all-teachers-link")) teacherSection.insertAdjacentHTML("beforeend", `<a class="all-teachers-link" href="teachers.html">查看所有老師　→</a>`);
  if (!document.querySelector(".booking-process")) teacherSection.insertAdjacentHTML("afterend", `<section class="booking-process"><h2>如何開始上課？</h2><div class="process-steps"><span><b>⌕</b><small>STEP 01</small><strong>選擇課程</strong></span><i>→</i><span><b>♙</b><small>STEP 02</small><strong>挑選老師</strong></span><i>→</i><span><b>LINE</b><small>STEP 03</small><strong>洽詢課程</strong></span><i>→</i><span><b>▣</b><small>STEP 04</small><strong>專人確認需求</strong></span><i>→</i><span><b>✓</b><small>STEP 05</small><strong>完成媒合</strong></span></div><a class="course-line-cta line-match-button" href="#contact" data-contact><img src="line-brand-icon/LINE_Brand_icon.png" alt="LINE"><span>洽詢這堂課<small>一對一專屬課程・由專人為你服務</small></span><i>先聊聊你的學習目標　→</i></a></section>`);
}

function getTeachersForCourse(page) {
  const entry = Object.entries(teacherCatalog.courses).find(([, course]) => course.href === page);
  return entry ? teachers.filter(teacher => teacher.courseIds.includes(entry[0])) : [];
}

function renderTeachers() {
  const page = getCurrentPage();
  const matchingTeachers = getTeachersForCourse(page);
  document.querySelectorAll("[data-teachers]").forEach((root) => {
    if (!matchingTeachers.length) {
      root.innerHTML = `<p class="teacher-empty">此課程的師資安排待確認。你可以先了解老師團隊，待洽詢開放後討論合適人選。</p>`;
      return;
    }
    root.innerHTML = matchingTeachers.map((teacher) => `
      <article class="teacher-card" data-teacher-id="${teacher.id}">
        <div class="teacher-media"><a href="teacher.html?id=${teacher.id}"><img src="${teacher.image}" alt="${teacher.name} 的頭像" loading="lazy" style="object-position:${teacher.imagePosition}"></a></div>
        <div class="teacher-body"><h3>${teacher.name}</h3><p>${teacher.summary}</p><div class="tag-row">${teacher.courseIds.map(id => teacherCatalog.courses[id]).filter(Boolean).map(course => `<a class="tag" href="${course.href}">${course.title} ↗</a>`).join("")}</div><a class="button secondary" href="teacher.html?id=${teacher.id}">查看詳細資訊</a><button class="button secondary booking-trigger" type="button" data-teacher-id="${teacher.id}" data-teacher-name="${teacher.name}">洽詢可預約時段</button></div>
      </article>`).join("");
  });
}

enhanceCoursePage();
renderTeachers();
