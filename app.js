const teachers = [
  {
    name: "布丁",
    id: "amber",
    image: "resume/amber_head.jpg",
    gender: "女",
    area: "請洽專人",
    price: "請洽專人",
    time: "請洽專人",
    specialty: ["幼兒舞蹈", "MV", "Jazz"],
    availability: [],
  },
  {
    name: "茵淇教練",
    id: "inch",
    image: "resume/inch_head.jpg",
    gender: "女",
    area: "請洽專人",
    price: "請洽專人",
    time: "請洽專人",
    specialty: ["競技拳擊", "48 公斤級"],
    availability: [],
  },
  {
    name: "念慈老師",
    id: "neitzu",
    image: "resume/neitzu_head.jpg",
    gender: "女",
    area: "請洽專人",
    price: "請洽專人",
    time: "請洽專人",
    specialty: ["彩球拉拉", "爵士"],
    availability: [],
  },
];

const coursePageMeta = {
  "dance-mv.html": ["DANCE WITH PURPOSE.", "流行舞蹈", ["零基礎友善", "指定歌曲", "彈性安排"]],
  "dance-jazz.html": ["MOVE WITH ELEGANCE.", "爵士舞蹈", ["線條訓練", "情感表現", "舞台技巧"]],
  "dance-kids.html": ["GROW WITH RHYTHM.", "幼兒舞蹈", ["兒童友善", "律動遊戲", "安全學習"]],
  "dance-hiphop.html": ["FEEL THE BEAT.", "街舞課程", ["零基礎友善", "律動基礎", "風格培養"]],
  "dance-cheerleading.html": ["SHINE TOGETHER.", "彩球拉拉", ["團隊訓練", "活力編舞", "舞台表現"]],
  "dance-corporate.html": ["CREATE AS A TEAM.", "企業團班", ["客製編排", "彈性人數", "活動演出"]],
  "boxing-beginner.html": ["BUILD YOUR FOUNDATION.", "拳擊入門", ["零基礎友善", "基礎拳法", "體能建立"]],
  "boxing-advanced.html": ["LEVEL UP YOUR SKILLS.", "進階拳擊", ["技術提升", "攻防節奏", "實戰應用"]],
  "boxing-sparring.html": ["FIGHT WITH PURPOSE.", "實戰拳擊", ["教練評估", "安全對練", "戰術訓練"]],
};

function enhanceCoursePage() {
  const page = window.location.pathname.split("/").pop() || "";
  const meta = coursePageMeta[page];
  const teacherSection = document.querySelector("[data-teachers]")?.closest(".section");
  const hero = document.querySelector(".page-hero");
  if (!meta || !teacherSection || !hero) return;

  document.body.classList.add("course-page");
  const titleNode = hero.querySelector("h1");
  const title = titleNode?.textContent.replace(/^[AB]\.\d\s*/, "") || meta[1];
  if (titleNode) titleNode.textContent = title;
  hero.insertAdjacentHTML("afterbegin", `<div class="course-breadcrumb"><a href="index.html">首頁</a><span>›</span><a href="${page.startsWith("dance") ? "dance.html" : "boxing.html"}">探索課程</a><span>›</span><b>${title}</b></div><p class="course-slogan">${meta[0]}</p>`);
  hero.insertAdjacentHTML("beforeend", `<div class="hero-course-tags">${meta[2].map((tag, i) => `<span>${["♙", "☆", "◷"][i]}　${tag}</span>`).join("")}</div><div class="course-side-art"><img src="person/person_1.jpg" alt="${title}課程形象"></div>`);

  const info = document.createElement("section");
  info.className = "course-overview-panel";
  info.innerHTML = `<div class="overview-title"><i></i><h2>這堂課適合你</h2><i></i></div><div class="fit-grid"><div><b>♙</b><strong>零基礎</strong><span>第一次學也可以</span></div><div><b>♫</b><strong>喜歡${page.startsWith("dance") ? "音樂律動" : "運動挑戰"}</strong><span>依照興趣開始</span></div><div><b>✧</b><strong>想提升感受</strong><span>建立技巧與協調</span></div><div><b>♔</b><strong>想專屬學習</strong><span>照自己的進度上課</span></div></div><div class="learn-title"><i></i><h3>這堂課你可以學到</h3><i></i></div><div class="learn-grid"><span>♧<b>基礎律動</b></span><span>♬<b>動作拆解</b></span><span>▣<b>${page.startsWith("dance") ? "舞碼編排" : "攻防技巧"}</b></span><span>☆<b>自信表現</b></span></div>`;
  teacherSection.before(info);

  teacherSection.querySelector("h2").textContent = "選擇你的老師";
  teacherSection.classList.add("course-teachers-section");
  teacherSection.insertAdjacentHTML("beforeend", `<a class="all-teachers-link" href="teachers.html">查看所有老師　→</a>`);

  teacherSection.insertAdjacentHTML("afterend", `<section class="booking-process"><h2>如何開始上課？</h2><div class="process-steps"><span><b>⌕</b><small>STEP 01</small><strong>選擇課程</strong></span><i>→</i><span><b>♙</b><small>STEP 02</small><strong>挑選老師</strong></span><i>→</i><span><b>LINE</b><small>STEP 03</small><strong>加入 LINE</strong></span><i>→</i><span><b>▣</b><small>STEP 04</small><strong>專人確認需求</strong></span><i>→</i><span><b>✓</b><small>STEP 05</small><strong>完成媒合</strong></span></div><a class="course-line-cta line-match-button" href="https://line.me/R/share?text=${encodeURIComponent(`您好，我想詢問${title}課程。`)}" target="_blank" rel="noopener noreferrer"><img src="line-brand-icon/LINE_Brand_icon.png" alt="LINE"><span>加入官方 LINE 開始媒合<small>一對一專屬課程・由專人為你服務</small></span><i>專人服務時間：10:00－21:00　→</i></a></section>`);
}

function renderTeachers() {
  document.querySelectorAll("[data-teachers]").forEach((root) => {
    root.innerHTML = teachers.map((teacher) => `
      <article class="teacher-card">
        <div class="teacher-media">
          <img src="${teacher.image}" alt="${teacher.name} 的頭像">
        </div>
        <div class="teacher-body">
          <h3>${teacher.name}</h3>
          <p>授課地區：${teacher.area}</p>
          <p>授課費用：${teacher.price === "請洽專人" ? teacher.price : `NT$ ${teacher.price} / 小時`}</p>
          <p>老師性別：${teacher.gender}</p>
          <p>可授課時間：${teacher.time}</p>
          <div class="tag-row">
            ${teacher.specialty.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <a class="button secondary" href="teacher.html?id=${teacher.id}">查看詳細資訊</a>
          <button class="button secondary booking-trigger" type="button" data-teacher-name="${teacher.name}">洽詢可預約時段</button>
        </div>
      </article>
    `).join("");
  });
}

function getMonthlySlots(teacher) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const slots = [];

  for (let date = 1; date <= lastDay; date += 1) {
    const current = new Date(year, month, date);
    if (current < new Date(year, month, now.getDate())) continue;
    teacher.availability.forEach((item) => {
      if (current.getDay() === item.day && slots.length < 8) {
        slots.push({ date, time: item.time });
      }
    });
  }
  return { year, month: month + 1, slots };
}

function setupBookingDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "booking-dialog";
  document.body.appendChild(dialog);

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".booking-trigger");
    if (!trigger) return;

    const teacher = teachers.find((item) => item.name === trigger.dataset.teacherName);
    const schedule = getMonthlySlots(teacher);
    const message = encodeURIComponent(`您好，我想詢問 ${teacher.name} ${schedule.year} 年 ${schedule.month} 月的課程預約。`);
    dialog.innerHTML = `
      <div class="booking-dialog-head">
        <div><p>本月預約</p><h2>${teacher.name}｜${schedule.year} 年 ${schedule.month} 月</h2></div>
        <button class="dialog-close" type="button" aria-label="關閉">×</button>
      </div>
      <p class="booking-help">選擇方便的時段，再透過 LINE 與老師確認。</p>
      <div class="booking-slots">
        ${schedule.slots.length
          ? schedule.slots.map((slot) => `<button type="button" class="booking-slot">${schedule.month}/${slot.date}　${slot.time}</button>`).join("")
          : "<p>本月目前沒有可預約時段，歡迎透過 LINE 詢問。</p>"}
      </div>
      <a class="button line-button" href="https://line.me/R/share?text=${message}" target="_blank" rel="noopener noreferrer">用 LINE 詢問</a>
    `;
    dialog.showModal();
  });

  dialog.addEventListener("click", (event) => {
    if (event.target.closest(".dialog-close")) dialog.close();
    if (event.target === dialog) dialog.close();
    const slot = event.target.closest(".booking-slot");
    if (slot) {
      dialog.querySelectorAll(".booking-slot").forEach((item) => item.classList.remove("selected"));
      slot.classList.add("selected");
    }
  });
}

function renderDemoVideos() {
  document.querySelectorAll(".video-placeholder").forEach((root) => {
    if (window.location.protocol === "file:") {
      root.innerHTML = `
        <a class="video-fallback" href="https://youtu.be/Jz-nzweFaag" target="_blank" rel="noopener noreferrer" aria-label="前往 YouTube 播放課程示範影片">
          <img src="https://i.ytimg.com/vi/Jz-nzweFaag/hqdefault.jpg" alt="課程示範影片預覽圖">
          <span class="video-play-button" aria-hidden="true">▶</span>
          <span class="video-fallback-label">在 YouTube 播放</span>
        </a>
      `;
    } else {
      root.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/Jz-nzweFaag"
          title="課程示範影片"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      `;
    }
    root.classList.add("has-video");
  });
}

enhanceCoursePage();
renderTeachers();
renderDemoVideos();
setupBookingDialog();
