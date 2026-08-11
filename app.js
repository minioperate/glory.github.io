const teachers = [
  {
    name: "老師 A",
    gender: "女",
    area: "台北",
    price: "1200-1800",
    time: "週一 / 週三 晚間、週六 下午",
    specialty: ["舞蹈基礎", "舞台表現"],
    availability: [{ day: 1, time: "19:00" }, { day: 3, time: "19:30" }, { day: 6, time: "14:00" }],
  },
  {
    name: "老師 B",
    gender: "男",
    area: "新北",
    price: "1000-1500",
    time: "週二 / 週四 晚間、週日 上午",
    specialty: ["競技訓練", "體能規劃"],
    availability: [{ day: 2, time: "19:00" }, { day: 4, time: "20:00" }, { day: 0, time: "10:30" }],
  },
  {
    name: "老師 C",
    gender: "不限",
    area: "桃園",
    price: "1500-2200",
    time: "平日晚間、假日可約",
    specialty: ["團體課", "客製課程"],
    availability: [{ day: 1, time: "20:00" }, { day: 5, time: "19:30" }, { day: 6, time: "16:00" }],
  },
];

function renderTeachers() {
  document.querySelectorAll("[data-teachers]").forEach((root) => {
    root.innerHTML = teachers.map((teacher) => `
      <article class="teacher-card">
        <div class="teacher-media">
          <img src="person/person_1.jpg" alt="${teacher.name} 的頭像">
        </div>
        <div class="teacher-body">
          <h3>${teacher.name}</h3>
          <p>授課地區：${teacher.area}</p>
          <p>授課薪水：NT$ ${teacher.price} / 小時</p>
          <p>老師性別：${teacher.gender}</p>
          <p>可授課時間：${teacher.time}</p>
          <div class="tag-row">
            ${teacher.specialty.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <button class="button secondary booking-trigger" type="button" data-teacher-name="${teacher.name}">查看本月預約</button>
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

renderTeachers();
renderDemoVideos();
setupBookingDialog();
