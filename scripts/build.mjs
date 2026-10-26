import { mkdir, writeFile, cp, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join, dirname, resolve, relative } from 'node:path';
import { projects, competitionProjects } from '../content/projects.mjs';
import { lateSwarmBody } from '../content/late-swarm-page.mjs';
import { uavSwarmBody } from '../content/uav-swarm-page.mjs';
import { nomadBody } from '../content/nomad-page.mjs';
import { westlakeBody } from '../content/westlake-page.mjs';
import { vexBody } from '../content/vex-page.mjs';
import { courseProjects } from '../content/course-projects.mjs';
import { mobileManipulatorBody } from '../content/mobile-manipulator-page.mjs';
import { stirlingEngineBody } from '../content/stirling-engine-page.mjs';
import { ecgBody } from '../content/ecg-page.mjs';

// Adapted from https://github.com/jonbarron/jonbarron.github.io
const root = fileURLToPath(new URL('../', import.meta.url));
const out = join(root, 'dist');
const mediaSizes = JSON.parse(await readFile(join(root,'scripts/media-sizes.json'),'utf8'));
const styleVersion = createHash('sha256').update(await readFile(join(root,'public/styles.css'))).digest('hex').slice(0,10);
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titles = {
  'end-effector-stabilization': 'Visual-Inertial End-Effector Stabilization under Base Motion',
  'late-swarm': 'LATE-Swarm: Language-Guided UAV Swarm Reconfiguration',
  'nomad-navigation': 'Adapting NoMaD for Interactive Navigation on TITA',
  'uav-swarm-control': 'Distributed UAV Swarm Formation and Obstacle Avoidance'
};
const external = (label, url) => `<a href="${escape(url)}">${escape(label)}</a>`;

function shell({ title, description, body, prefix = './' }) {
 const back = prefix === '../../' ? body.match(/class="back-link"[^>]*><a href="([^"]+)">([^<]+)<\/a>/) : null;
 const returnLink = back ? `<nav class="project-return" aria-label="Return to project listing"><a href="${back[1]}">${back[2]}</a></nav>` : '';
 return `<!DOCTYPE HTML>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(description)}"><meta name="author" content="Yihuan Huang"><meta name="robots" content="index,follow"><title>${escape(title)}</title><link rel="stylesheet" href="${prefix}template.css"><link rel="stylesheet" href="${prefix}styles.css?v=${styleVersion}"></head>
<body><a class="skip-link" href="#main">Skip to content</a><main id="main"><table class="page-table" role="presentation"><tbody><tr><td class="page-cell">
${body}${returnLink}
<footer><a href="${prefix}">Yihuan Huang</a> · Updated Oct 2026<br>Template adapted from <a href="https://jonbarron.info/">Jon Barron</a>.</footer>
</td></tr></tbody></table></main></body></html>`;
}

function projectRow(p) {
 const status = p.slug === 'late-swarm' ? '<br><span class="submission-status">Submitted to <strong>ICRA 2027</strong></span><span class="review-status"> · Under review</span>' : '';
 const authors = p.slug === 'late-swarm' ? '<div><strong>Yihuan Huang</strong>, Hongwei Chen, Jianxiang Wang, JianYu Kong, Tao Jiang</div>' : '';
 const thumbnail = p.thumbnail ? `<a class="research-thumbnail" href="./projects/${p.slug}/"><img src="./assets/${escape(p.thumbnail)}" alt="${escape(p.imageAlt)}" loading="lazy"></a>` : '';
 const extraLinks = p.slug === 'late-swarm' ? ' / <a href="./files/late-swarm.pdf">Paper</a> / <a href="./projects/late-swarm/#demo">Video</a>' : ['nomad-navigation','end-effector-stabilization'].includes(p.slug) ? ` / <a href="./projects/${p.slug}/#demo">Videos</a>` : '';
 return `<tr><td class="research-entry"><div class="${thumbnail?'research-with-image':'research-text'}">${thumbnail}<div><h3 class="papertitle"><a href="./projects/${p.slug}/">${escape(titles[p.slug])}</a></h3>${authors}<div class="entry-meta">${escape(p.organization)} · ${escape(p.period)}${status}</div><div class="entry-links"><a href="./projects/${p.slug}/">Project</a> / ${external('Code',p.links[0].url)}${extraLinks}</div><p>${escape(p.summary)}</p></div></div></td></tr>`;
}

function home() {
 const body = `<header class="intro" id="about"><h1 class="name">Yihuan Huang <span lang="zh">黄翊桓</span></h1>
<p>I am an undergraduate student in Robotics Engineering at <a href="https://www.cqu.edu.cn/">Chongqing University</a>, expecting to graduate in Jun 2027.</p>
<p>I am interested in <strong>robot learning and generalizable manipulation</strong>, particularly vision-language-action policies. My previous work spans language-guided UAV coordination, visual state estimation, and feedback control on physical robots. I was a visiting research student at the WINDY Lab, Westlake University, advised by Prof. Shiyu Zhao.</p>
<p>I am seeking a master’s program in robotics in the United States for Fall 2027.</p>
<p class="contact-links"><a href="mailto:20233692@stu.cqu.edu.cn">Email</a> &nbsp;/&nbsp; <a href="./files/yihuan-huang-cv.pdf">CV</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan">GitHub</a></p></header>
<section id="current-work"><h2>Current Work</h2><p class="entry-meta">Progress update · Oct 2026</p><p>In Assoc. Prof. Can Pu’s lab, I have reproduced, fine-tuned, and deployed <strong>π0.5</strong> using the lab’s existing workflow and semi-humanoid robot. The deployed policy picks the block color specified in an instruction and places it into a box; further evaluation is in progress.</p></section>
<section id="research"><h2>Research</h2><table class="research-table" role="presentation"><tbody>${projects.map(projectRow).join('')}</tbody></table></section>
<section id="competitions"><h2>Robotics Competitions & Leadership</h2>
<div class="research-with-image"><a class="research-thumbnail" href="./projects/vex-robotics/"><img src="./assets/vex/thumbnail.jpg" alt="Practice-field testing of a VEX robot at Chongqing University." width="660" height="660" loading="lazy"></a><div>
<h3 class="papertitle"><a href="./projects/vex-robotics/">${escape(competitionProjects[0].title)}</a></h3>
<div class="entry-meta">Chongqing University · 2024–2025 High Stakes season<br>Deputy Lead, Control Systems Group</div>
<div class="entry-links"><a href="./projects/vex-robotics/">Experience</a> / <a href="./projects/vex-robotics/#demo">Competition video</a></div>
<p>${escape(competitionProjects[0].summary)}</p>
<p>2025 VEX Worlds · <strong>Technology Division quarter-finalist</strong> (CQU2).</p>
</div></div></section>
<section id="additional-projects"><h2>Other Projects</h2><table class="research-table" role="presentation"><tbody>${courseProjects.map(p => `<tr><td class="research-entry"><div class="research-with-image"><a class="research-thumbnail" href="./projects/${p.slug}/"><img src="./assets/${p.thumbnail}" alt="${escape(p.imageAlt)}" loading="lazy"></a><div><h3 class="papertitle"><a href="./projects/${p.slug}/">${escape(p.title)}</a></h3><div class="entry-meta">${escape(p.course)} · Course project</div><div class="entry-links"><a href="./projects/${p.slug}/">Project</a>${p.slug === 'stirling-engine' ? ` / <a href="./projects/${p.slug}/#demo">Experiment video</a>` : ''}</div><p>${escape(p.summary)}</p></div></div></td></tr>`).join('')}</tbody></table></section>
<section id="education"><h2>Education</h2><p><strong>Chongqing University</strong>, B.Eng. in Robotics Engineering<br>Sep 2023–Jun 2027 (expected)</p></section>
<section id="experience"><h2>Teaching & Mentoring</h2><ul class="plain-list"><li><strong>Undergraduate Teaching Assistant</strong>, Department of Robotics Engineering<br>Guided more than 90 students through STM32 programming and debugging.</li></ul></section>`;
 return shell({title:'Yihuan Huang',description:'Yihuan Huang, Robotics Engineering undergraduate at Chongqing University. Research interests in robot learning, vision-language-action policies, and generalizable manipulation.',body});
}

function detail(p) {
 if (p.slug === 'mobile-manipulator') return shell({title:'Mobile Manipulation and Writing | Yihuan Huang',description:p.summary,body:mobileManipulatorBody(),prefix:'../../'});
 if (p.slug === 'stirling-engine') return shell({title:'Stirling Engine Modeling and Prototyping | Yihuan Huang',description:p.summary,body:stirlingEngineBody(),prefix:'../../'});
 if (p.slug === 'ecg-signal-processing') return shell({title:'Embedded ECG Signal Processing | Yihuan Huang',description:p.summary,body:ecgBody(),prefix:'../../'});
 if (p.slug === 'vex-robotics') return shell({title:'VEX Robotics | Yihuan Huang',description:p.summary,body:vexBody(),prefix:'../../'});
 if (p.slug === 'end-effector-stabilization') return shell({title:'End-Effector Stabilization | Yihuan Huang',description:p.summary,body:westlakeBody(),prefix:'../../'});
 if (p.slug === 'nomad-navigation') return shell({title:'NoMaD on TITA | Yihuan Huang',description:p.summary,body:nomadBody(),prefix:'../../'});
 if (p.slug === 'uav-swarm-control') return shell({title:'UAV Swarm Control | Yihuan Huang',description:p.summary,body:uavSwarmBody(),prefix:'../../'});
 if (p.slug === 'late-swarm') return shell({title:'LATE-Swarm | Yihuan Huang',description:p.summary,body:lateSwarmBody(),prefix:'../../'});
 throw new Error(`No implemented project page for ${p.slug}`);
}

function preparePage(html, target) {
 const detailedFigures = new Set([
  'assets/late-swarm/framework.png', 'assets/late-swarm/commitment-results.png',
  'assets/westlake/mount-validation.png', 'assets/nomad/preprocessing-evaluation.png',
  'assets/nomad/deployment-pipeline.png', 'assets/course/stirling-engine/model-comparison.png',
  'assets/course/stirling-engine/cosimulation-en.png'
 ]);
 const sizeFor = src => {
  const key = relative(out,resolve(dirname(target),src)).replaceAll('\\','/');
  const size = mediaSizes[key];
  if (!size) throw new Error(`Missing actual media dimensions: ${key}`);
  return size;
 };
 const dimensions = (tag,size) => tag.replace(/\s(?:width|height)="[^"]*"/g,'').replace(/>$/,` width="${size[0]}" height="${size[1]}">`);
 html = html.replace(/<img\b[^>]*>/g, tag => dimensions(tag,sizeFor(tag.match(/\bsrc="([^"]+)"/)[1])));
 html = html.replace(/<video\b[^>]*>[\s\S]*?<\/video>/g, video => {
  const src = video.match(/<source\b[^>]*\bsrc="([^"]+)"/)[1];
  const size = sizeFor(src);
  const tag = video.match(/^<video\b[^>]*>/)[0];
  const sized = dimensions(tag,size).replace(/>$/,` style="aspect-ratio:${size[0]} / ${size[1]}">`);
  return video.replace(tag,sized)+`<p class="video-open"><a href="${src}">Open video</a></p>`;
 });
 return html.replace(/<figure\b[^>]*>[\s\S]*?<\/figure>/g, figure => {
  const image = figure.match(/<img\b[^>]*\bsrc="([^"]+)"/);
  if (!image) return figure;
  const key = relative(out,resolve(dirname(target),image[1])).replaceAll('\\','/');
  return detailedFigures.has(key) ? figure.replace('</figure>',`<p class="figure-open"><a href="${image[1]}">View full-size figure</a></p></figure>`) : figure;
 });
}

await mkdir(out,{recursive:true});
await cp(join(root,'public'),out,{recursive:true});
await writeFile(join(out,'index.html'),preparePage(home(),join(out,'index.html')));
for(const project of [...projects,...competitionProjects,...courseProjects]){const target=join(out,'projects',project.slug,'index.html');await mkdir(dirname(target),{recursive:true});await writeFile(target,preparePage(detail(project),target));}
await writeFile(join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://yihuanghuan.github.io/sitemap.xml\n');
await writeFile(join(out,'.nojekyll'),'');
await writeFile(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['',...[...projects,...competitionProjects,...courseProjects].map(p=>'projects/'+p.slug+'/')].map(path=>`<url><loc>https://yihuanghuan.github.io/${path}</loc></url>`).join('')}</urlset>`);
console.log(`Built homepage, ${projects.length} research pages, ${competitionProjects.length} competition page and ${courseProjects.length} course-project pages using the Jon Barron template.`);
