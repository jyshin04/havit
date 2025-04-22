// Utility to debug bounding rects in the DOM
export function debugRect(rect, color = 'red', label = '') {
  const el = document.createElement('div');
  el.style.position = 'fixed';
  el.style.left = rect.left + 'px';
  el.style.top = rect.top + 'px';
  el.style.width = rect.width + 'px';
  el.style.height = rect.height + 'px';
  el.style.border = `2px solid ${color}`;
  el.style.zIndex = 9999;
  el.style.pointerEvents = 'none';
  if (label) el.innerText = label;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}
