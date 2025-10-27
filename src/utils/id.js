export function generateId(prefix = "id") {
const rand = Math.random().toString(36).slice(2, 8);
const now = Date.now().toString(36);
return `${prefix}_${now}${rand}`;
}