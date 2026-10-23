import { mkdir, writeFile, cp, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { projects, competitionProjects } from '../content/projects.mjs';
import { lateSwarmBody } from '../content/late-swarm-page.mjs';
import { uavSwarmBody } from '../content/uav-swarm-page.mjs';
import { nomadBody } from '../content/nomad-page.mjs';
import { westlakeBody } from '../content/westlake-page.mjs';
import { vexBody } from '../content/vex-page.mjs';

// Adapted from https://github.com/jonbarron/jonbarron.github.io
const root = fileURLToPath(new URL('../', import.meta.url));
const out = join(root, 'dist');
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
 return `<!DOCTYPE HTML>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${escape(description)}"><meta name="author" content="Yihuan Huang"><meta name="robots" content="index,follow"><title>${escape(title)}</title><link rel="stylesheet" href="${prefix}template.css"><link rel="stylesheet" href="${prefix}styles.css?v=${styleVersion}"></head>
<body><a class="skip-link" href="#main">Skip to content</a><main id="main"><table class="page-table" role="presentation"><tbody><tr><td class="page-cell">
${body}
<footer><a href="${prefix}">Yihuan Huang</a> · Updated October 2026<br>Template adapted from <a href="https://jonbarron.info/">Jon Barron</a>.</footer>
</td></tr></tbody></table></main></body></html>`;
}

function projectRow(p) {
 const result = p.slug === 'end-effector-stabilization'
  ? 'On real hardware, compensation settled to final-10-s mean pose errors of 2.31 mm and 0.53° after approximately 10 cm of base motion, estimated from SLAM and encoders.'
  : p.slug === 'late-swarm'
  ? 'In Gazebo simulation, all 60 missions met completion criteria with 8–16 UAVs; mean tracking RMSE was 0.085 m.'
  : p.slug === 'uav-swarm-control'
  ? 'The project traces the problems found in separate reproductions, the fused controller, and its simulation tests.'
  : 'Includes physical deployment videos and evaluations of visual preprocessing and goal-conditioned behavior.';
 const status = p.slug === 'late-swarm' ? '<br><span class="submission-status">Submitted to <strong>ICRA 2027</strong></span><span class="review-status"> · Under review</span>' : '';
 const authors = p.slug === 'late-swarm' ? '<div><strong>Yihuan Huang</strong>, Hongwei Chen, Jianxiang Wang, JianYu Kong, Tao Jiang</div>' : '';
 const thumbnail = p.thumbnail ? `<a class="research-thumbnail" href="./projects/${p.slug}/"><img src="./assets/${escape(p.thumbnail)}" alt="${escape(p.imageAlt)}" width="${p.thumbnailWidth || 2266}" height="${p.thumbnailHeight || 1148}" loading="lazy"></a>` : '';
 const extraLinks = p.slug === 'late-swarm' ? ' / <a href="./files/late-swarm.pdf">Paper</a> / <a href="./projects/late-swarm/#demo">Video</a>' : ['nomad-navigation','end-effector-stabilization'].includes(p.slug) ? ` / <a href="./projects/${p.slug}/#demo">Videos</a>` : '';
 return `<tr><td class="research-entry"><div class="${thumbnail?'research-with-image':'research-text'}">${thumbnail}<div><h3 class="papertitle"><a href="./projects/${p.slug}/">${escape(titles[p.slug])}</a></h3>${authors}<div class="entry-meta">${escape(p.organization)} · ${escape(p.period)}${status}</div><div class="entry-links"><a href="./projects/${p.slug}/">Project</a> / ${external('Code',p.links[0].url)}${extraLinks}</div><p>${escape(p.summary)} ${escape(result)}</p></div></div></td></tr>`;
}

function home() {
 const body = `<header class="intro" id="about"><h1 class="name">Yihuan Huang <span lang="zh">黄翊桓</span></h1>
<p>I am an undergraduate student in Robotics Engineering at <a href="https://www.cqu.edu.cn/">Chongqing University</a>, expecting to graduate in June 2027.</p>
<p>I am interested in <strong>robot learning and generalizable manipulation</strong>, particularly vision-language-action policies. My previous work spans language-guided UAV coordination, visual state estimation, and feedback control on physical robots. I was a visiting research student at the WINDY Lab, Westlake University, advised by Prof. Shiyu Zhao.</p>
<p>I am seeking a master’s program in robotics in the United States for Fall 2027.</p>
<p class="contact-links"><a href="mailto:20233692@stu.cqu.edu.cn">Email</a> &nbsp;/&nbsp; <a href="./files/yihuan-huang-cv.pdf">CV</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan">GitHub</a></p></header>
<section id="research"><h2>Research</h2><table class="research-table" role="presentation"><tbody>${projects.map(projectRow).join('')}</tbody></table></section>
<section id="current-work"><h2>Current Work</h2><p>In Assoc. Prof. Can Pu’s lab, I am reproducing, fine-tuning, and deploying <strong>π0.5</strong> on a semi-humanoid robot developed by the lab. The fine-tuned policy has been deployed and can demonstrate picking a block of the color specified in an instruction and placing it into a box. My role focuses on model reproduction, fine-tuning, and deployment. Further evaluation is in progress.</p></section>
<section id="competitions"><h2>Robotics Competitions & Leadership</h2>
<div class="research-with-image"><a class="research-thumbnail" href="./projects/vex-robotics/"><img src="./assets/vex/thumbnail.jpg" alt="Practice-field testing of a VEX robot at Chongqing University." width="660" height="660" loading="lazy"></a><div>
<h3 class="papertitle"><a href="./projects/vex-robotics/">${escape(competitionProjects[0].title)}</a></h3>
<div class="entry-meta">Chongqing University · 2024–2025 High Stakes season<br>Deputy Lead, Control Systems Group</div>
<div class="entry-links"><a href="./projects/vex-robotics/">Experience</a> / <a href="./projects/vex-robotics/#demo">Competition video</a></div>
<p>${escape(competitionProjects[0].summary)}</p>
<p>2025 VEX Worlds · <strong>Technology Division quarter-finalist</strong> (CQU2).</p>
</div></div></section>
<section id="additional-projects"><h2>Other Projects</h2><ul class="plain-list"><li><strong>Vision-Guided Mobile Manipulator</strong> · Course project, Sep 2024–Jan 2025<br>A mobile platform with a 4-DoF arm for picking, placing, and character writing, using OpenMV perception, inverse kinematics, and servo control.</li></ul></section>
<section id="education"><h2>Education</h2><p><strong>Chongqing University</strong>, B.Eng. in Robotics Engineering<br>September 2023–June 2027 (expected)</p></section>
<section id="experience"><h2>Teaching & Mentoring</h2><ul class="plain-list"><li><strong>Undergraduate Teaching Assistant</strong>, Department of Robotics Engineering<br>Guided more than 90 students through STM32 programming and debugging.</li></ul></section>`;
 return shell({title:'Yihuan Huang',description:'Yihuan Huang, Robotics Engineering undergraduate at Chongqing University. Research interests in robot learning, vision-language-action policies, and generalizable manipulation.',body});
}

function detail(p) {
 if (p.slug === 'vex-robotics') return shell({title:'VEX Robotics | Yihuan Huang',description:p.summary,body:vexBody(),prefix:'../../'});
 if (p.slug === 'end-effector-stabilization') return shell({title:'End-Effector Stabilization | Yihuan Huang',description:p.summary,body:westlakeBody(),prefix:'../../'});
 if (p.slug === 'nomad-navigation') return shell({title:'NoMaD on TITA | Yihuan Huang',description:p.summary,body:nomadBody(),prefix:'../../'});
 if (p.slug === 'uav-swarm-control') return shell({title:'UAV Swarm Control | Yihuan Huang',description:p.summary,body:uavSwarmBody(),prefix:'../../'});
 if (p.slug === 'late-swarm') return shell({title:'LATE-Swarm | Yihuan Huang',description:p.summary,body:lateSwarmBody(),prefix:'../../'});
 const body = `<nav class="back-link"><a href="../../#research">← Back to research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail"><header><h1>${escape(titles[p.slug])}</h1><p>${escape(p.organization)} · ${escape(p.period)}<br>${escape(p.role)} · Advisor: ${escape(p.advisor)}${p.slug==='late-swarm'?'<br><em>Submitted to ICRA 2027 · Under review</em>':''}</p><p>${p.links.map(l=>external(l.label,l.url)).join(' &nbsp;/&nbsp; ')}</p></header>
<section><h2>Overview</h2><p>${escape(p.problem)}</p></section>
<section><h2>My Contributions</h2><ul>${p.contributions.map(c=>`<li>${escape(c)}</li>`).join('')}</ul></section>
<section><h2>Method</h2><ol>${p.method.map(([label,text])=>`<li><strong>${escape(label)}.</strong> ${escape(text)}</li>`).join('')}</ol></section>
<section id="results"><h2>Results</h2><ul>${p.results.map(([metric,label])=>`<li><strong>${escape(metric)}</strong> — ${escape(label)}</li>`).join('')}</ul><p>${escape(p.qualifier)}</p></section>
<section><h2>Discussion</h2><p>${escape(p.reflection)}</p></section>
<section id="resources"><h2>Code & Context</h2><p>${p.links.map(l=>external(l.label,l.url)).join(' &nbsp;/&nbsp; ')}</p><p>${escape(p.codeNote)}</p></section></article>
<nav class="related-projects"><h2>Other Research</h2><ul>${projects.filter(x=>x.slug!==p.slug).map(x=>`<li><a href="../${x.slug}/">${escape(titles[x.slug])}</a></li>`).join('')}</ul></nav>`;
 return shell({title:`${titles[p.slug]} | Yihuan Huang`,description:p.summary,body,prefix:'../../'});
}

await mkdir(out,{recursive:true});
await cp(join(root,'public'),out,{recursive:true});
await writeFile(join(out,'index.html'),home());
for(const project of [...projects,...competitionProjects]){const target=join(out,'projects',project.slug,'index.html');await mkdir(dirname(target),{recursive:true});await writeFile(target,detail(project));}
await writeFile(join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://yihuanghuan.github.io/sitemap.xml\n');
await writeFile(join(out,'.nojekyll'),'');
await writeFile(join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['',...[...projects,...competitionProjects].map(p=>'projects/'+p.slug+'/')].map(path=>`<url><loc>https://yihuanghuan.github.io/${path}</loc></url>`).join('')}</urlset>`);
console.log(`Built homepage, ${projects.length} research pages and ${competitionProjects.length} competition page using the Jon Barron template.`);
