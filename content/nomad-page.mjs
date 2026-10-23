const asset = '../../assets/nomad/';
const code = 'https://github.com/yihuanghuan/NoMaD';
const figure = (file, alt, caption, cls='') => `<figure class="research-figure ${cls}"><a href="${asset}${file}"><img src="${asset}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
const video = (file, label, caption, cls='') => `<figure class="research-figure ${cls}"><h3>${label}</h3><video controls playsinline preload="none" poster="${asset}${file}-poster.jpg" aria-label="${label}"><source src="${asset}${file}.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${asset}${file}.mp4">Download video</a>.</video><figcaption>${caption}</figcaption></figure>`;

export function nomadBody() {
 return `<nav class="back-link"><a href="../../#research">← Back to research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail nomad-detail">
<header><h1>Adapting NoMaD for Interactive<br>Navigation on TITA</h1>
<p>Chongqing University · Oct 2025–May 2026<br>Core Developer · Advisor: Assoc. Prof. Can Pu</p>
<p><a href="${code}">Code</a> &nbsp;/&nbsp; <a href="#demo">TITA demos</a> &nbsp;/&nbsp; <a href="#evaluation">Evaluation</a> &nbsp;/&nbsp; <a href="https://general-navigation-models.github.io/nomad/index.html">Original NoMaD project</a></p></header>
<p class="project-abstract">I extended a pretrained NoMaD navigation policy with camera-aware visual preprocessing and an interactive inference workflow, then integrated it into a closed-loop navigation system on TITA. My work connects three parts of deployment: preserving useful visual cues, changing goals while maintaining observation history, and turning predicted waypoints into physical robot motion.</p>
<p><strong>My contributions:</strong> <a href="#visual-adaptation">visual input adaptation</a> · <a href="#goal-tests">interactive goal handling</a> · <a href="#deployment">real-robot integration and testing</a></p>

<section id="demo"><h2>From policy output to a moving robot</h2>
<p>The physical deployment is shown from two viewpoints below: an external recording of TITA and a camera view with sampled trajectory overlays.</p>
<div class="nomad-demo-grid">
${video('tita-external','TITA · external view','Physical indoor deployment on the TITA wheeled-legged robot. Full recording from the supplied project presentation; playback speed is unchanged.','nomad-portrait')}
${video('tita-onboard','Camera view · policy output','Camera observations and candidate trajectory overlays from the deployment recording. The external and camera recordings are shown separately and are not synchronized.')}
</div></section>

<section id="visual-adaptation"><h2>1. Adapting visual inputs to a new robot</h2>
<p><strong>Problem.</strong> Changing camera placement and field of view changes the floor, doorway, and obstacle cues visible to a pretrained policy. A fixed crop can discard cues that matter on the target platform.</p>
<p><strong>My change.</strong> I implemented and evaluated aspect-ratio-changing resize as a camera adaptation strategy, then incorporated a task-specific top-region crop into the visual-test pipeline. This preserves the remaining scene’s horizontal coverage while matching the encoder’s input size. The public test variant removes the top 10% and resizes to 85 × 64; the practice report also evaluates square-input squash resizing.</p>
${figure('visual-input-adaptation.png','A real corridor photograph with its top 10% marked for removal, alongside an enlarged 85 by 64 preprocessing result.','Preprocessing illustrated on a real project photograph: remove the top 10%, then resize to 85 × 64. The low-resolution result is enlarged for inspection.')}
<p><strong>Evidence.</strong> In the retained five-scene comparison, squash resizing improves the offline trajectory success estimates by 13.0–16.3 percentage points over center cropping.</p>
${figure('preprocessing-evaluation.png','Center-crop and squash-resize offline success estimates across five scenes; squash resizing is higher in each retained comparison.','Preprocessing comparison from my practice evaluation. Each pair reproduces the original chart’s labeled values. <a href="'+asset+'preprocessing-evaluation.csv">Chart data</a>.')}
</section>

<section id="goal-tests"><h2>2. Making inference interactive</h2>
<p><strong>My change.</strong> I separated goal selection from observation input in my inference workflow, so a new goal image can be supplied independently of the current scene. A rolling four-frame queue supports continuous video inference instead of isolated image pairs. The goal image changes the policy’s conditioning while the observation history continues to update.</p>
<p><strong>Evidence.</strong> At the same corridor junction, I tested different goal images. Each visualization pairs the observation and predicted trajectories on the left with the selected goal on the right. Switching the goal changes the predicted direction from a left turn to forward motion.</p>
${figure('goal-left.jpg','Current corridor observation with left-turn trajectory predictions, paired with a door goal image.','Goal A: the door. Predicted waypoints turn left toward the selected visual destination.')}
${figure('goal-straight.jpg','The same corridor observation with forward trajectory predictions, paired with a corridor goal image.','Goal B: the corridor ahead. Changing the visual goal produces a forward trajectory in the same observation scene.')}
<p>These are offline image-goal tests. They make the conditioning behavior visible before connecting the policy output to robot commands.</p>
<h3>Continuous exploration predictions</h3>
${video('exploration-offline','Recorded video · exploration mode','Offline inference on a recorded camera sequence, with the goal masked. Colored curves show independently sampled waypoint trajectories as the scene changes. This recording is separate from the physical TITA demonstration.','figure-medium')}
</section>

<section id="deployment"><h2>3. Closing the loop on TITA</h2>
<p><strong>My integration.</strong> I connected the adapted visual pipeline to live camera input and robot motion. Action increments are denormalized and accumulated into local waypoints; a waypoint-to-velocity controller produces forward and angular commands for the TITA locomotion interface. The resulting motion changes the next observation and closes the loop.</p>
${figure('deployment-pipeline.png','A deployment diagram with a real TITA photograph, visual adaptation, rolling observation context, independent goal switching, pretrained NoMaD inference, and a velocity-command return path.','My adaptation and integration modules are shown in blue; the pretrained NoMaD policy is shown in gray. Real hardware and scene images connect the implementation to the physical setup. The return path carries velocity commands back to TITA.')}
<p>The split architecture allowed me to use the robot’s ROS 2 camera and motion interfaces while running the model in a separate GPU environment. A TCP bridge connects the two sides, avoiding a direct dependency between the inference environment and the robot’s ROS 2 Python runtime. Camera subscription uses Best Effort QoS to match the sensor publisher.</p>
<table class="result-table"><caption>Timing reported in the deployment record.</caption><tbody>
<tr><th scope="row">Warm inference</th><td>About 38 ms · RTX 5070 Laptop GPU · batch 1 · 10 DDPM steps</td></tr>
<tr><th scope="row">Navigation update target</th><td>4 Hz, corresponding to a 250 ms update period</td></tr>
<tr><th scope="row">Frame arrival to trajectory display</th><td>Reported below 100 ms, including preprocessing, inference, and visualization</td></tr>
</tbody></table>
<p>The GPU inference time and navigation update rate describe different parts of the pipeline. The 38 ms figure measures warm model inference, while the robot loop also includes image transfer, waypoint processing, and command delivery.</p>
${figure('physical-trial-stills.jpg','Three real photographs of TITA from the same physical trial at 8, 25 and 45 seconds.','Physical-test evidence: frames at 8 s, 25 s, and 45 s from the external recording above. They show the real platform during the indoor trial and preserve the recording’s time order.')}
</section>

<section id="evaluation"><h2>Offline evaluation</h2>
<p>The following charts were redrawn in a shared style from the numerical labels preserved in my practice materials. They summarize offline trajectory tests; the physical deployment videos above show the robot demonstration.</p>
<h3>Scene coverage</h3>
${figure('scene-evaluation.png','Reported offline trajectory success by scene: straight corridor 92.3%, gentle turn 87.5%, obstacle bypass 81.0%, sharp turn 75.0%, left T-junction 85.7%, right T-junction 82.1%, open space 88.9%.','The seven scene estimates average 84.6%. The practice report defines success by predicted trajectory feasibility and obstacle clearance. Redrawn from the original chart’s labeled values. <a href="'+asset+'scene-evaluation.csv">Chart data</a>.')}
<h3>Waypoint and distance prediction</h3>
${figure('waypoint-evaluation.png','Forward, lateral, and angular waypoint errors increase across four temporal-distance bins from 0–5 to 15–20 steps.','In the 0–5-step bin, the retained plot reports 0.12 m forward error, 0.08 m lateral error, and 3.2° angular error. Near-term waypoints provide the local targets for repeated control updates. <a href="'+asset+'waypoint-evaluation.csv">Chart data</a>.')}
<p>The distance-prediction evaluation in the practice report gives <strong>R² = 0.847</strong> and <strong>MAE = 1.03 temporal steps</strong>.</p>
</section>

<section id="results"><h2>Results and takeaways</h2>
<ul><li><strong>A working physical deployment.</strong> The camera-to-policy-to-motion pipeline runs on TITA, with external and camera-view recordings documenting the indoor demonstration.</li>
<li><strong>Visible goal-conditioned behavior.</strong> Paired image tests show how changing the goal changes the waypoint direction, while the goal-masked sequence demonstrates continuous exploration predictions.</li>
<li><strong>Task-specific adaptations with visible evidence.</strong> The preprocessing comparison and goal-switching tests connect my implementation changes to measurable and observable effects.</li></ul>
<p>This work gave me experience with the interfaces around a learned policy: the images it receives, the history it retains, and the commands that reach the robot. I am continuing policy adaptation and deployment work with π0.5 in the same lab.</p></section>

<section id="resources"><h2>Code and context</h2>
<p><a href="${code}">Project repository</a> &nbsp;/&nbsp; <a href="${code}/blob/main/test_inference_local.py">Checkpoint-matched inference</a> &nbsp;/&nbsp; <a href="${code}/blob/main/test_vision_video.py">Video context queue</a> &nbsp;/&nbsp; <a href="https://general-navigation-models.github.io/nomad/index.html">Original NoMaD project</a></p>
<p>Reproduction provided the starting point: I verified the forward pass, matched the checkpoint configuration, and inspected the denoising loop. The working setup uses four RGB frames, a 256-dimensional embedding, a U-Net with channel widths [64, 128, 256], and eight predicted 2D waypoints per sample.</p>
<p>The repository contains upstream GNM/ViNT/NoMaD code and my local reproduction scripts. The TITA ROS 2/TCP deployment is documented in the practice materials; the linked repository is not a complete release of that hardware integration.</p>
<p>Original method: A. Sridhar, D. Shah, C. Glossop, and S. Levine, <a href="https://arxiv.org/abs/2310.07896"><i>NoMaD: Goal Masked Diffusion Policies for Navigation and Exploration</i></a>. All deployment videos and evaluation figures on this page come from my project materials.</p></section>
</article>`;
}
