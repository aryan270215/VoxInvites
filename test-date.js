try {
  const d = new Date("10:00 AM");
  console.log(d.toLocaleTimeString());
} catch(e) {
  console.error("error:", e);
}
