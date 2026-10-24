export const courseProjects = [
  {
    slug: 'mobile-manipulator',
    title: 'Color-Conditioned Writing on a Mobile Manipulator',
    course: 'Robotics Fundamentals',
    summary: 'Connecting visual task state to arm motion: character-writing sequences, visual corner detection, and line-following control on a team-built mobile robot.',
    thumbnail: 'course/mobile-manipulator/thumbnail.jpg',
    imageAlt: 'The physical mobile robot with its articulated arm and gripper.'
  },
  {
    slug: 'stirling-engine',
    title: 'Modeling and Iterative Prototyping of a Stirling Engine',
    course: 'Engineering Design',
    summary: 'Using thermodynamic modeling and ADAMS–Simulink co-simulation to understand why an engine would not run, then connect thermal and mechanical design changes to a working prototype.',
    thumbnail: 'course/stirling-engine/thumbnail.jpg',
    imageAlt: 'The revised physical Stirling engine with its flywheel, paired gears, and water-cooling connections.'
  },
  {
    slug: 'ecg-signal-processing',
    title: 'Embedded ECG Acquisition and Signal Processing',
    course: 'Quantitative Engineering Analysis II',
    summary: 'Bringing signal analysis onto an STM32: ECG acquisition, digital filtering, heart-rate estimation, and simulator-based evaluation of the complete measurement chain.',
    thumbnail: 'course/ecg-signal-processing/thumbnail.jpg',
    imageAlt: 'The STM32 ECG acquisition system displaying the waveform from a signal simulator.'
  }
];

export function courseNav() {
  return '<nav class="back-link"><a href="../../#additional-projects">← Back to Other Projects</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>';
}

export function figure(slug, file, alt, caption, cls = '') {
  const path = `../../assets/course/${slug}/${file}`;
  return `<figure class="research-figure ${cls}"><a href="${path}"><img src="${path}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
}

export function sectionLinks() {
  return '<nav class="course-section-links" aria-label="Project sections"><a href="#question">Question</a> · <a href="#reasoning">Reasoning</a> · <a href="#approach">Approach</a> · <a href="#results">Results</a> · <a href="#takeaways">Takeaways</a></nav>';
}

export function relatedCourses(slug) {
  return `<nav class="related-projects" aria-label="Other course projects"><h2>Other Course Projects</h2><ul>${courseProjects.filter(p => p.slug !== slug).map(p => `<li><a href="../${p.slug}/">${p.title}</a></li>`).join('')}</ul></nav>`;
}
