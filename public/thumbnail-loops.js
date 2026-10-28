// Only short, nearby homepage previews load; static posters remain the fallback.
(() => {
 const videos = [...document.querySelectorAll('.homepage .thumbnail-loop')];
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const nearby = new Set();
 function stop(video) { video.pause(); video.classList.remove('is-playing'); }
 function start(video) {
  if (motion.matches) return;
  const source = video.querySelector('source');
  if (!source.hasAttribute('src')) {
   source.src = source.dataset.src;
   video.muted = true;
   video.load();
  }
  const attempt = video.play();
  if (attempt) attempt.catch(() => video.classList.remove('is-playing'));
 }
 for (const video of videos) {
  video.addEventListener('playing', () => video.classList.add('is-playing'));
  video.addEventListener('error', () => stop(video));
 }
 if (!('IntersectionObserver' in window)) return;
 const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
   if (entry.isIntersecting) { nearby.add(entry.target); start(entry.target); }
   else { nearby.delete(entry.target); stop(entry.target); }
  }
 }, { rootMargin: '100px' });
 videos.forEach(video => observer.observe(video));
 motion.addEventListener('change', () => videos.forEach(video => {
  if (motion.matches) stop(video);
  else if (nearby.has(video)) start(video);
 }));
})();
