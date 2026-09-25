export const cycles = { monthly: '每月', quarterly: '每季', yearly: '每年', weekly: '每周' };
export const currencies = ['JPY', 'USD', 'CNY', 'EUR', 'GBP', 'HKD', 'TWD', 'KRW', 'SGD', 'AUD', 'CAD'];
export const categories = ['影音娱乐', '效率工具', '云端存储', '域名服务', '生活服务', '其他'];
export const dateKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseDate = value => new Date(`${value}T00:00:00`);
export const monthly = s => s.amount * ({ monthly: 1, quarterly: 1 / 3, yearly: 1 / 12, weekly: 52 / 12 }[s.cycle]);
export function nextPayment(s, today = new Date()) {
  if (!s.date) return null;
  const anchor = parseDate(s.date);
  const start = parseDate(dateKey(today));
  if (anchor >= start) return anchor;
  if (s.cycle === 'weekly') {
    const days = Math.round((Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()) - Date.UTC(anchor.getFullYear(), anchor.getMonth(), anchor.getDate())) / 86400000);
    anchor.setDate(anchor.getDate() + Math.ceil(days / 7) * 7);
    return anchor;
  }
  const step = { monthly: 1, quarterly: 3, yearly: 12 }[s.cycle];
  let offset = Math.floor(((start.getFullYear() - anchor.getFullYear()) * 12 + start.getMonth() - anchor.getMonth()) / step) * step;
  const occurrence = n => {
    const first = new Date(anchor.getFullYear(), anchor.getMonth() + n, 1);
    return new Date(first.getFullYear(), first.getMonth(), Math.min(anchor.getDate(), new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()));
  };
  let next = occurrence(offset);
  if (next < start) next = occurrence(offset += step);
  return next;
}
export function validate(items) {
  if (!Array.isArray(items) || items.length > 5000) throw new Error('订阅数据格式不正确，或超过 5000 条。');
  const ids = new Set();
  return items.map(s => {
    if (!s || typeof s.id !== 'string' || !s.id || ids.has(s.id) || typeof s.name !== 'string' || !s.name.trim() || s.name.length > 80 || !Number.isFinite(s.amount) || s.amount < 0 || s.amount > 1e9 || !currencies.includes(s.currency) || !Object.hasOwn(cycles, s.cycle) || !categories.includes(s.category) || !['active', 'paused'].includes(s.status) || typeof s.method !== 'string' || s.method.length > 80 || typeof s.notes !== 'string' || s.notes.length > 500 || typeof s.date !== 'string' || (s.date && (!/^\d{4}-\d{2}-\d{2}$/.test(s.date) || s.date < '1900-01-01' || s.date > '9999-12-31' || !Number.isFinite(parseDate(s.date).getTime()) || dateKey(parseDate(s.date)) !== s.date))) throw new Error('订阅字段无效，请检查备份文件。');
    ids.add(s.id);
    return { id: s.id, name: s.name.trim(), amount: s.amount, currency: s.currency, cycle: s.cycle, category: s.category, status: s.status, method: s.method, date: s.date, notes: s.notes };
  });
}
