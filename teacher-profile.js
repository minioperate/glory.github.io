const teacherProfiles = {
  amber: {
    name: "布丁", role: "舞蹈老師", image: "resume/amber_head.jpg",
    specialty: "幼兒舞蹈・MV・Jazz", education: ["馬偕醫護管理專科學校｜幼兒保育科 畢業", "國立臺北護理健康大學｜幼兒保育系 在讀"],
    highlights: ["舞齡 10 年", "幼兒專業教育經驗超過 5 年", "馬偕舞蹈研究社｜社師", "聖心女子中學熱舞社｜社師", "動手動腳舞蹈教室｜師資"],
    awards: ["114年 全國啦啦隊錦標賽雙人嘻哈｜冠軍", "111年 全國中等學校熱舞大賽｜冠軍", "111年 HERO 4 WHO 熱血高校盃｜冠軍", "111年 新光盃熱門街舞大賽｜亞軍", "111年 捷運盃街舞大賽｜季軍", "111年 桃園青工盃勁舞大賽｜季軍", "111年 新生代女力排舞｜季軍", "110年 HERO 4 WHO 熱血高校盃｜冠軍", "110年 新北市自由杯熱舞大賽｜冠軍", "110年 漱口盃街舞大賽｜冠軍", "110年 五分埔街舞衣術節｜亞軍", "110年 中正盃全國舞蹈街舞錦標賽｜亞軍", "110年 雄爭舞鬥街舞大賽｜季軍", "110年 新光盃熱門街舞大賽｜季軍", "109年 五分埔街舞衣術節｜冠軍"],
    certificates: ["幼兒體能遊戲指導員（C級）", "說故事技巧檢定"], stats: [["10 年", "舞齡"], ["5+ 年", "幼兒教育經驗"], ["3 類", "教授科目"], ["尚無", "教學評分"]]
  },
  inch: {
    name: "茵淇教練", role: "拳擊教練", image: "resume/inch_head.jpg", specialty: "競技拳擊・48 公斤級",
    education: ["履歷未提供"], highlights: ["2024 亞洲青年拳擊錦標賽 48 公斤｜亞軍", "114 總統盃拳擊錦標賽高女 48 公斤｜冠軍", "112、113、114 臺北市教育盃｜冠軍", "114、115 全中運高女｜亞軍", "2024 臺北城市盃邀請賽｜亞軍"],
    awards: [], certificates: [], stats: [["48 kg", "競賽量級"], ["冠軍", "總統盃成績"], ["亞軍", "亞洲青年錦標賽"], ["尚無", "教學評分"]]
  },
  neitzu: {
    name: "念慈老師", role: "舞蹈老師", image: "resume/neitzu_head.jpg", specialty: "彩球拉拉・爵士・國家代表隊",
    education: ["履歷未提供"], highlights: ["現為中華民國啦啦隊國家代表隊國手", "教授科目：彩球拉拉"],
    awards: ["2026 台灣盃全國啦啦隊錦標賽彩球雙人公開組｜第二名", "第22屆全國啦啦隊錦標賽爵士團體公開組｜第一名", "2025 大專院校啦啦隊錦標賽嘻哈團體公開組｜第二名", "2024 全國啦啦隊公開賽彩球個人公開組｜第一名", "2024 全國啦啦隊公開賽彩球雙人公開組｜第二名", "2024 全國菁英盃啦啦隊錦標賽爵士團體公開組｜第一名", "2023 登峰造極青春洋溢啦啦隊邀請賽｜第一名", "2022 全國啦啦隊錦標賽爵士雙人高中組｜第一名", "111年 運動 i 台灣 2.0｜優秀運動員", "111年 全國啦啦隊挑戰賽彩球個人高中一般組｜第一名", "111年 全國啦啦隊挑戰賽爵士雙人高中一般組｜第一名", "2022 全國啦啦隊公開賽彩球個人高中公開組｜第一名", "2022 全國啦啦隊錦標賽彩球個人高中組｜第二名", "2022 全國啦啦隊公開賽爵士雙人高中公開組｜第三名", "2021 全國啦啦隊公開賽彩球個人高中組｜第三名", "110學年度 中等啦啦隊錦標賽爵士雙人高中組｜第三名"],
    certificates: [], stats: [["國手", "國家代表隊"], ["彩球拉拉", "教授科目"], ["多項", "全國賽獲獎"], ["尚無", "教學評分"]]
  }
};

const id = new URLSearchParams(location.search).get("id") || "amber";
const teacher = teacherProfiles[id] || teacherProfiles.amber;
const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
document.title = `${teacher.name}｜老師介紹｜容耀`;
document.querySelector("[data-teacher-profile]").innerHTML = `
  <a class="teacher-back" href="teachers.html">← 返回全部老師</a>
  <section class="teacher-profile-hero"><img src="${teacher.image}" alt="${teacher.name}"><div><span>${teacher.role}</span><h1>${teacher.name}</h1><p>${teacher.specialty}</p><div class="profile-rating"><b>✦ 專業師資</b><small>資料來源：老師履歷</small></div></div></section>
  <section class="teacher-stats">${teacher.stats.map(item => `<div><b>${item[0]}</b><span>${item[1]}</span></div>`).join("")}</section>
  <section class="teacher-profile-content">
    <article><span>EDUCATION</span><h2>學歷</h2>${list(teacher.education)}<span>EXPERIENCE</span><h2>經歷</h2>${list(teacher.highlights)}${teacher.certificates.length ? `<h3>專業證照</h3>${list(teacher.certificates)}` : ""}</article>
    <article><span>AWARDS</span><h2>競賽與獲獎紀錄</h2>${teacher.awards.length ? list(teacher.awards) : list(teacher.highlights)}<h3>教學評分</h3><p class="rating-empty">目前尚無學員評價，完成課程後即可留下真實評分。</p></article>
  </section>
  <section class="teacher-contact"><div><span>想和 ${teacher.name} 一起上課？</span><h2>告訴我們你的學習目標</h2></div><a href="https://line.me/R/share?text=${encodeURIComponent(`您好，我想詢問 ${teacher.name} 的課程。`)}" target="_blank" rel="noopener noreferrer">LINE 開始媒合 →</a></section>`;
