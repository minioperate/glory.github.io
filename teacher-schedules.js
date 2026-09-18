// Manual schedule data. Dates and times use Asia/Taipei (UTC+8).
// Add actual dates only: "YYYY-MM-DD": [{ start: "10:00", end: "11:00", booked: false }]
// Mark confirmed bookings with booked: true. Do not include customer information.
window.teacherSchedules = {
  amber: { name: "布丁", updatedAt: "", dates: {} },
  inch: { name: "茵淇教練", updatedAt: "", dates: {} },
  neitzu: { name: "念慈老師", updatedAt: "", dates: {} },
};

// Keep authored schedules above; create empty entries for newly listed teachers.
for (const teacher of window.teacherCatalog.teachers) {
  if (!window.teacherSchedules[teacher.id]) {
    window.teacherSchedules[teacher.id] = { name: teacher.name, updatedAt: "", dates: {} };
  }
}
