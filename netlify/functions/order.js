exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };
  let d;
  try { d = JSON.parse(event.body); } catch { return { statusCode: 400, body: '' }; }
  if (d.hp || d.t < 3000) return { statusCode: 200, body: 'ok' }; // захист від ботів
  const esc = s => String(s || '').slice(0, 200)
    .replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const qty = Math.min(Math.max(parseInt(d.qty) || 1, 1), 10);
  const text =
    `🛒 <b>Нове замовлення</b>\n` +
    `Товар: ${esc(d.product)} × ${qty}\n` +
    `Сума: ${qty * 2899} грн\n\n` +
    `👤 ${esc(d.fio)}\n📞 ${esc(d.phone)}\n` +
    `🏙 ${esc(d.city)}\n📦 НП: ${esc(d.np)}`;
  const r = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: process.env.CHAT_ID, text, parse_mode: 'HTML' })
  });
  return { statusCode: r.ok ? 200 : 502, body: '' };
};
