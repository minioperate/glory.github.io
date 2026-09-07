(() => {
  "use strict";
  function taipeiNow(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(date);
    const value = (type) => parts.find((part) => part.type === type).value;
    return { date: `${value("year")}-${value("month")}-${value("day")}`, time: `${value("hour")}:${value("minute")}` };
  }
  function slotsFor(schedule, date, now = taipeiNow()) {
    const source = schedule?.dates?.[date];
    if (!Array.isArray(source)) return [];
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    const slots = source.filter((slot) => slot && timePattern.test(slot.start) &&
      timePattern.test(slot.end) && slot.start < slot.end && typeof slot.booked === "boolean");
    return slots.map((slot) => ({
      ...slot,
      // Any overlap with a confirmed booking also blocks an open interval.
      booked: slot.booked || slots.some((other) => other.booked && slot.start < other.end && slot.end > other.start),
      past: date < now.date || (date === now.date && slot.start <= now.time),
    })).sort((a, b) => a.start.localeCompare(b.start));
  }
  function dayState(slots, date, now = taipeiNow()) {
    if (date < now.date || !slots.length) return "closed";
    if (slots.some((slot) => !slot.booked && !slot.past)) return "available";
    if (slots.every((slot) => slot.booked)) return "booked";
    return "closed";
  }
  function inquiryUrl(name, date = "", slot = null) {
    const when = slot ? `${date} ${slot.start}–${slot.end}（台灣時間）` : "可授課時間";
    return `https://line.me/R/share?text=${encodeURIComponent(`您好，我想洽詢 ${name} 的${when}，請協助確認是否可以安排課程。`)}`;
  }
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const dialog = document.createElement("dialog");
  dialog.className = "booking-dialog";
  dialog.setAttribute("aria-labelledby", "booking-title");
  document.body.appendChild(dialog);
  let teacherId = "", monthOffset = 0, selectedDate = "", selectedStart = "", opener;
  const monthDate = () => {
    const [year, month] = taipeiNow().date.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1 + monthOffset, 1));
  };
  function render(focusSelector = "") {
    const schedule = window.teacherSchedules?.[teacherId];
    if (!schedule) return;
    const now = taipeiNow();
    const month = monthDate();
    const prefix = `${month.getUTCFullYear()}-${String(month.getUTCMonth() + 1).padStart(2, "0")}`;
    const lastDay = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate();
    let cells = '<span aria-hidden="true"></span>'.repeat(month.getUTCDay());
    let availableDays = 0;
    for (let day = 1; day <= lastDay; day++) {
      const date = `${prefix}-${String(day).padStart(2, "0")}`;
      const slots = slotsFor(schedule, date, now);
      const state = dayState(slots, date, now);
      const partial = state === "available" && slots.some((slot) => slot.booked);
      const label = state === "booked" ? "已約滿" : state === "available" ? (partial ? "部分已約" : "可洽詢") : "未開放";
      if (state === "available") availableDays++;
      cells += `<button type="button" class="calendar-day ${state}" data-date="${date}" aria-label="${date} ${label}" aria-pressed="${selectedDate === date}" ${date === now.date ? 'aria-current="date"' : ""} ${state !== "available" ? "disabled" : ""}><b>${day}</b><small>${label}</small></button>`;
    }
    const slots = selectedDate ? slotsFor(schedule, selectedDate, now) : [];
    const selectedSlot = slots.find((slot) => slot.start === selectedStart && !slot.booked && !slot.past);
    if (!selectedSlot) selectedStart = "";
    dialog.innerHTML = `
      <div class="booking-dialog-head"><div><p>課程時段洽詢</p><h2 id="booking-title">${escapeHtml(schedule.name)}</h2></div><button class="dialog-close" type="button" aria-label="關閉月曆">×</button></div>
      <p class="booking-help">選擇日期與時段，再透過 LINE 洽詢。送出洽詢不代表預約成立，需由專人確認。</p>
      <div class="calendar-nav"><button type="button" data-month="-1" aria-label="上一個月" ${monthOffset === 0 ? "disabled" : ""}>‹</button><h3 aria-live="polite">${month.getUTCFullYear()} 年 ${month.getUTCMonth() + 1} 月</h3><button type="button" data-month="1" aria-label="下一個月" ${monthOffset === 11 ? "disabled" : ""}>›</button></div>
      <p class="calendar-legend">淺色：可洽詢　黑色：已預約／約滿　灰色：未開放</p>
      <div class="calendar-week" aria-hidden="true">${["日", "一", "二", "三", "四", "五", "六"].map((day) => `<span>${day}</span>`).join("")}</div>
      <div class="calendar-days" role="group" aria-label="選擇上課日期">${cells}</div>
      ${availableDays ? "" : '<p class="booking-help">本月尚無可洽詢時段，可透過下方連結詢問其他安排。</p>'}
      <div class="calendar-selection" aria-live="polite"><h3>${selectedDate ? `${selectedDate} 的時段` : "請先選擇可洽詢日期"}</h3><div class="booking-slots">${slots.map((slot) => `<button type="button" class="booking-slot ${slot.booked ? "booked" : slot.past ? "past" : ""}" data-start="${slot.start}" aria-pressed="${selectedStart === slot.start}" ${slot.booked || slot.past ? "disabled" : ""}>${slot.start}–${slot.end}<small>${slot.booked ? "已預約" : slot.past ? "已過期" : "可洽詢"}</small></button>`).join("")}</div></div>
      <button type="button" class="button calendar-send" ${selectedSlot ? "" : "disabled"}>用 LINE 洽詢所選時段</button>
      <a class="calendar-general" href="${inquiryUrl(schedule.name)}" target="_blank" rel="noopener noreferrer">沒有合適時間？用 LINE 詢問</a>
      <p class="calendar-note">所有時間以台灣時間為準。${schedule.updatedAt ? `時段更新：${escapeHtml(schedule.updatedAt)}。` : ""}實際安排請以專人確認為準。</p>`;
    if (focusSelector) dialog.querySelector(focusSelector)?.focus();
  }
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".booking-trigger");
    if (!trigger) return;
    const schedules = window.teacherSchedules || {};
    teacherId = trigger.dataset.teacherId || Object.keys(schedules).find((id) => schedules[id].name === trigger.dataset.teacherName);
    if (!schedules[teacherId]) return;
    opener = trigger;
    monthOffset = 0; selectedDate = ""; selectedStart = "";
    render(); dialog.showModal();
    dialog.querySelector(".dialog-close").focus();
  });
  dialog.addEventListener("close", () => opener?.focus());
  dialog.addEventListener("click", (event) => {
    const close = event.target.closest(".dialog-close");
    if (close) { dialog.close(); return; }
    if (event.target === dialog) {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      return;
    }
    const month = event.target.closest("[data-month]");
    if (month && !month.disabled) {
      monthOffset = Math.max(0, Math.min(11, monthOffset + Number(month.dataset.month)));
      selectedDate = ""; selectedStart = "";
      render(`button[data-month="${monthOffset === 0 ? 1 : monthOffset === 11 ? -1 : month.dataset.month}"]`); return;
    }
    const date = event.target.closest("[data-date]");
    if (date && !date.disabled) { selectedDate = date.dataset.date; selectedStart = ""; render(`[data-date="${selectedDate}"]`); return; }
    const slot = event.target.closest("[data-start]");
    if (slot && !slot.disabled) { selectedStart = slot.dataset.start; render(`[data-start="${selectedStart}"]`); return; }
    if (event.target.closest(".calendar-send")) {
      const schedule = window.teacherSchedules[teacherId];
      const selected = slotsFor(schedule, selectedDate).find((item) => item.start === selectedStart && !item.booked && !item.past);
      if (!selected) { selectedStart = ""; render(); return; }
      window.open(inquiryUrl(schedule.name, selectedDate, selected), "_blank", "noopener,noreferrer");
    }
  });
})();
