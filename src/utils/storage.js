const kUsed = (theme) => `used:${theme}`;
const kDaily = (theme, key) => `daily:${theme}:${key}`;

export function getUsedIds(theme) {
  try {
    const s = localStorage.getItem(kUsed(theme));
    return s ? JSON.parse(s) : [];
  } catch (e) {
    return [];
  }
}

export function addUsedId(theme, id) {
  const arr = getUsedIds(theme);
  if (!arr.includes(id)) {
    arr.push(id);
    try {
      localStorage.setItem(kUsed(theme), JSON.stringify(arr));
    } catch (e) {}
  }
}

export function getDailyCache(theme, key) {
  try {
    const s = localStorage.getItem(kDaily(theme, key));
    return s ? JSON.parse(s) : null;
  } catch (e) {
    return null;
  }
}

export function setDailyCache(theme, key, item) {
  try {
    localStorage.setItem(kDaily(theme, key), JSON.stringify(item));
  } catch (e) {}
}