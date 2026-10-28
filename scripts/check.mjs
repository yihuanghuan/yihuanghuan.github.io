import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, resolve, dirname } from 'node:path';
import { projects, competitionProjects } from '../content/projects.mjs';
import { courseProjects } from '../content/course-projects.mjs';

const root = fileURLToPath(new URL('../dist/',import.meta.url));
const errors = [];
let checked = 0;
async function walk(dir){const all=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())all.push(...await walk(p));else{if((await stat(p)).size>26214400)errors.push(`${p}: exceeds hosting single-file limit of 25 MiB`);if(e.name.endsWith('.html'))all.push(p);}}return all;}
const pages = await walk(root);
for(const path of pages){
 const html=await readFile(path,'utf8');
 if(!/<html lang="en">/.test(html))errors.push(`${path}: missing document language`);
 if(!/<title>[^<]+<\/title>/.test(html))errors.push(`${path}: missing title`);
 if(!/name="description"/.test(html))errors.push(`${path}: missing description`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 if(new Set(ids).size!==ids.length)errors.push(`${path}: duplicate IDs`);
 for(const m of html.matchAll(/\b(?:href|src|poster)="([^"]+)"/g)){
  const href=m[1];if(/^(?:https?:|mailto:|data:)/.test(href))continue;
  const [resource,anchor]=href.split('#');
  const pathname=resource.split('?')[0];
  let target=pathname?resolve(dirname(path),decodeURIComponent(pathname)):path;
  try{if((await stat(target)).isDirectory())target=join(target,'index.html');await stat(target);checked++;if(anchor&&target.endsWith('.html')){const other=await readFile(target,'utf8');if(!other.includes(`id="${anchor}"`))errors.push(`${path}: missing anchor ${href}`);}}catch{errors.push(`${path}: missing resource ${href}`);}
 }
 for(const m of html.matchAll(/<img\b[^>]*>/g)){if(!/\balt="[^"]+"/.test(m[0]))errors.push(`${path}: image without alt`);if(!/width="[0-9.]+"/.test(m[0])||!/height="[0-9.]+"/.test(m[0]))errors.push(`${path}: missing image dimensions`);}
 for(const m of html.matchAll(/<video\b[^>]*>/g)){
  const thumbnailLoop = path === join(root,'index.html') && /class="thumbnail-loop"/.test(m[0]);
  if(thumbnailLoop){for(const attr of ['autoplay','muted','loop','playsinline'])if(!new RegExp(`\\b${attr}\\b`).test(m[0]))errors.push(`${path}: thumbnail loop missing ${attr}`);if(!/aria-hidden="true"/.test(m[0]))errors.push(`${path}: decorative loop must use the accessible poster`);}
  else if(!/\bcontrols\b/.test(m[0])||/\bautoplay\b/.test(m[0]))errors.push(`${path}: video must have controls and remain paused`);
  if(!/preload="none"/.test(m[0]))errors.push(`${path}: video should not preload the recording`);
  if(!/width="[0-9.]+"/.test(m[0])||!/height="[0-9.]+"/.test(m[0]))errors.push(`${path}: missing video dimensions`);
 }
 if(/href="#"|TODO|placeholder|TBD/.test(html))errors.push(`${path}: unfinished public content`);
}
const expectedPages = projects.length + competitionProjects.length + courseProjects.length + 1;
if(pages.length!==expectedPages)errors.push(`Expected ${expectedPages} pages; found ${pages.length}`);
const home=await readFile(join(root,'index.html'),'utf8');
for(const phrase of ['Under review','final-10-s','SLAM and encoders','in progress','Gazebo simulation'])if(!home.includes(phrase))errors.push(`Homepage missing qualifier: ${phrase}`);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`PASS: ${pages.length} pages, ${checked} local resources/anchors, metadata, image labels and research qualifiers.`);
