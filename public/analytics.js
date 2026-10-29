// Foreground time estimates supplement Umami's event-to-event visit duration.
// No cookies, identifiers, or IP lookups are added by this script.
(() => {
  if (window.location.hostname !== 'yihuanhuang.github.io') return;
  let started = document.visibilityState === 'visible' && document.hasFocus() ? performance.now() : null;
  let pending = 0;

  function accumulate() {
    const now = performance.now();
    if (started !== null) pending += now - started;
    started = document.visibilityState === 'visible' && document.hasFocus() ? now : null;
  }

  function send() {
    accumulate();
    const seconds = Math.floor(pending / 1000);
    if (seconds < 1 || typeof window.umami?.track !== 'function') return;
    pending -= seconds * 1000;
    try {
      Promise.resolve(window.umami.track('page-engagement', {
        path: window.location.pathname,
        seconds,
      })).catch(() => { pending += seconds * 1000; });
    } catch {
      pending += seconds * 1000;
    }
  }

  setInterval(send, 30_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') send();
    else accumulate();
  });
  window.addEventListener('blur', send);
  window.addEventListener('focus', accumulate);
  window.addEventListener('pagehide', send);
  window.addEventListener('pageshow', accumulate);
})();
