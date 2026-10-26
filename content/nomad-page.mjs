const asset = '../../assets/nomad/';
const code = 'https://github.com/yihuanghuan/NoMaD';
const figure = (file, alt, caption, cls='') => `<figure class="research-figure ${cls}"><a href="${asset}${file}"><img src="${asset}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
const video = (file, label, caption, cls='') => `<figure class="research-figure ${cls}"><h3>${label}</h3><video controls playsinline preload="none" poster="${asset}${file}-poster.jpg" aria-label="${label}"><source src="${asset}${file}.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${asset}${file}.mp4">Download video</a>.</video><figcaption>${caption}</figcaption></figure>`;

export function nomadBody() {
 return `<nav class="back-link"><a href="../../#research">← Back to research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail nomad-detail">
<header><h1>Adapting NoMaD for Interactive<br>Navigation on TITA</h1>
<p>Chongqing University · Oct 2025–May 2026<br>Core Developer · Advisor: Assoc. Prof. Can Pu</p>
<p><a href="#demo">TITA demos</a> &nbsp;/&nbsp; <a href="#results">Results</a> &nbsp;/&nbsp; <a href="${code}">Code</a> &nbsp;/&nbsp; <a href="https://general-navigation-models.github.io/nomad/index.html">Original NoMaD project</a></p></header>
<p class="project-abstract">I extended a pretrained NoMaD navigation policy with camera-aware visual preprocessing and an interactive inference workflow, then integrated it into a closed-loop navigation system on TITA. My work connects three parts of deployment: preserving useful visual cues, changing goals while maintaining observation history, and turning predicted waypoints into physical robot motion.</p>
<p><strong>My contributions:</strong> <a href="#visual-adaptation">visual input adaptation</a> · <a href="#goal-tests">interactive goal handling</a> · <a href="#deployment">real-robot integration and testing</a></p>

<section id="demo"><h2>From policy output to a moving robot</h2>
<p>The physical deployment is shown from two viewpoints below: an external recording of TITA and a camera view with sampled trajectory overlays.</p>
<div class="nomad-demo-grid">
${video('tita-external','TITA · external view','Physical indoor deployment on the TITA wheeled-legged robot. Full recording from the supplied project presentation; playback speed is unchanged.','nomad-portrait')}
${video('tita-onboard','Camera view · policy output','Camera observations and sampled trajectory overlays from the physical deployment recording.')}
</div></section>

<section id="visual-adaptation"><h2>1. Adapting visual inputs to a new robot</h2>
<p>Camera placement changes which floor, doorway, and obstacle cues reach the pretrained policy. I compared resize strategies to retain useful scene coverage on the target platform.</p>
<p>The five-scene offline comparison evaluated square-input <strong>squash resizing against center cropping</strong>. Squash resizing improved trajectory-success estimates by <strong>13.0–16.3 percentage points</strong>. Separately, my public visual-test pipeline removes the top 10% and resizes the remaining scene to 85 × 64.</p>
${figure('visual-input-adaptation.png','A real corridor photograph with its top 10% marked for removal, alongside an enlarged 85 by 64 preprocessing result.','Preprocessing illustrated on a real project photograph: remove the top 10%, then resize to 85 × 64. The low-resolution result is enlarged for inspection.')}
${figure('preprocessing-evaluation.png','Center-crop and squash-resize offline success estimates across five scenes; squash resizing is higher in each retained comparison.','Offline preprocessing evaluation. Squash-resize and center-crop values across five scenes. <a href="'+asset+'preprocessing-evaluation.csv">Chart data</a>.')}
</section>

<section id="goal-tests"><h2>2. Making inference interactive</h2>
<p>I separated goal selection from observation input in my inference workflow, so a new goal image can be supplied independently of the current scene. A rolling four-frame queue supports continuous video inference. The goal image changes the policy’s conditioning while the observation history continues to update.</p>
<p>At the same corridor junction, I tested different goal images. Each visualization pairs the observation and predicted trajectories on the left with the selected goal on the right. Switching the goal changes the predicted direction from a left turn to forward motion.</p>
${figure('goal-left.jpg','Current corridor observation with left-turn trajectory predictions, paired with a door goal image.','Goal A: the door. Predicted waypoints turn left toward the selected visual destination.')}
${figure('goal-straight.jpg','The same corridor observation with forward trajectory predictions, paired with a corridor goal image.','Goal B: the corridor ahead. Changing the visual goal produces a forward trajectory in the same observation scene.')}
<p>These are offline image-goal tests. They make the conditioning behavior visible before connecting the policy output to robot commands.</p>
${video('exploration-offline','Recorded video · exploration mode','Offline inference on a recorded camera sequence, with the goal masked. Colored curves show independently sampled waypoint trajectories as the scene changes.','figure-medium')}
</section>

<section id="deployment"><h2>3. Closing the loop on TITA</h2>
<p>I connected the adapted visual pipeline to live camera input and robot motion. Action increments are denormalized and accumulated into local waypoints; a waypoint-to-velocity controller produces forward and angular commands for the TITA locomotion interface. The resulting motion changes the next observation and closes the loop.</p>
${figure('deployment-pipeline.png','A deployment diagram with a real TITA photograph, visual adaptation, rolling observation context, independent goal switching, pretrained NoMaD inference, and a velocity-command return path.','My adaptation and integration modules are shown in blue; the pretrained NoMaD policy is shown in gray. Real hardware and scene images connect the implementation to the physical setup. The return path carries velocity commands back to TITA.')}
<p>I separated the robot’s ROS 2 interfaces from GPU inference through a TCP bridge, allowing each environment to retain its working runtime while exchanging images and motion commands.</p>
<table class="result-table"><caption>Deployment timing</caption><tbody>
<tr><th scope="row">Warm inference</th><td>About 38 ms · RTX 5070 Laptop GPU · batch 1 · 10 DDPM steps</td></tr>
<tr><th scope="row">Navigation update target</th><td>4 Hz, corresponding to a 250 ms update period</td></tr>
</tbody></table>
<p class="table-note">Model inference is measured after warm-up; the navigation period includes image transfer, waypoint processing, and command delivery.</p>
${figure('physical-trial-stills.jpg','Three real photographs of TITA from the same physical trial at 8, 25 and 45 seconds.','Physical-test evidence: frames at 8 s, 25 s, and 45 s from the external recording above. They show the real platform during the indoor trial and preserve the recording’s time order.')}
</section>

<section id="evaluation"><h2>Offline evaluation</h2>
<p>Offline trajectory feasibility and obstacle-clearance tests covered seven indoor scene types.</p>
<h3>Scene coverage</h3>
${figure('scene-evaluation.png','Reported offline trajectory success by scene: straight corridor 92.3%, gentle turn 87.5%, obstacle bypass 81.0%, sharp turn 75.0%, left T-junction 85.7%, right T-junction 82.1%, open space 88.9%.','Offline trajectory-success estimates average 84.6% across seven scenes; success is defined by predicted trajectory feasibility and obstacle clearance. <a href="'+asset+'scene-evaluation.csv">Chart data</a>.')}

</section>

<section id="results"><h2>Results and takeaways</h2>
<ul><li><strong>A working physical deployment.</strong> The camera-to-policy-to-motion pipeline runs on TITA, with external and camera-view recordings documenting the indoor demonstration.</li>
<li><strong>Visible goal-conditioned behavior.</strong> Paired image tests show how changing the goal changes the waypoint direction, while the goal-masked sequence demonstrates continuous exploration predictions.</li>
<li><strong>Task-specific adaptations with visible evidence.</strong> The preprocessing comparison and goal-switching tests connect my implementation changes to measurable and observable effects.</li></ul>
<p>This work gave me experience with the interfaces around a learned policy: the images it receives, the history it retains, and the commands that reach the robot. I am continuing policy adaptation and deployment work with π0.5 in the same lab.</p></section>

<section id="resources"><h2>Code and context</h2>
<p><a href="${code}">Project repository</a> &nbsp;/&nbsp; <a href="${code}/blob/main/test_inference_local.py">Checkpoint-matched inference</a> &nbsp;/&nbsp; <a href="${code}/blob/main/test_vision_video.py">Video context queue</a> &nbsp;/&nbsp; <a href="https://general-navigation-models.github.io/nomad/index.html">Original NoMaD project</a></p>
<p>Built on the pretrained NoMaD method by A. Sridhar, D. Shah, C. Glossop, and S. Levine, <a href="https://arxiv.org/abs/2310.07896"><i>NoMaD: Goal Masked Diffusion Policies for Navigation and Exploration</i></a>. My work focused on visual adaptation, interactive inference, and TITA deployment.</p></section>
</article>`;
}
