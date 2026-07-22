const teachers = [
  {
    name: "老師 A",
    gender: "女",
    area: "台北",
    price: "1200-1800",
    time: "週一 / 週三 晚間、週六 下午",
    specialty: ["舞蹈基礎", "舞台表現"],
  },
  {
    name: "老師 B",
    gender: "男",
    area: "新北",
    price: "1000-1500",
    time: "週二 / 週四 晚間、週日 上午",
    specialty: ["競技訓練", "體能規劃"],
  },
  {
    name: "老師 C",
    gender: "不限",
    area: "桃園",
    price: "1500-2200",
    time: "平日晚間、假日可約",
    specialty: ["團體課", "客製課程"],
  },
];

function renderTeachers() {
  document.querySelectorAll("[data-teachers]").forEach((root) => {
    root.innerHTML = teachers.map((teacher) => `
      <article class="teacher-card">
        <div class="teacher-media">個人介紹影片預留</div>
        <div class="teacher-body">
          <h3>${teacher.name}</h3>
          <p>授課地區：${teacher.area}</p>
          <p>授課薪水：NT$ ${teacher.price} / 小時</p>
          <p>老師性別：${teacher.gender}</p>
          <p>可授課時間：${teacher.time}</p>
          <div class="tag-row">
            ${teacher.specialty.map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
          <a class="button secondary" href="#">預約欄位預留</a>
        </div>
      </article>
    `).join("");
  });
}

renderTeachers();
