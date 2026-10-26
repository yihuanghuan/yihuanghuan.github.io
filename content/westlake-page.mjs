import { researchMetadata } from './projects.mjs';
const asset = '../../assets/westlake/';
const branch = 'https://github.com/yihuanghuan/windy-arm/tree/agent/link6-velocity-feedforward';
const report = 'https://github.com/yihuanghuan/windy-arm/blob/agent/link6-velocity-feedforward/docs/camera_world_hold/';
const figure = (file, alt, caption, cls='') => `<figure class="research-figure ${cls}"><a href="${asset}${file}"><img src="${asset}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
const video = (file, label, caption) => `<figure class="research-figure"><h3>${label}</h3><video controls playsinline preload="none" poster="${asset}${file}-poster.jpg" aria-label="${label}"><source src="${asset}${file}.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${asset}${file}.mp4">Download video</a>.</video><figcaption>${caption}</figcaption></figure>`;

export function westlakeBody(project) {
 return `<nav class="back-link"><a href="../../#research">← Back to Research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail westlake-detail">
<header><h1>${project.title}</h1>
${researchMetadata(project)}
<p><a href="#demo">Demo</a> &nbsp;/&nbsp; <a href="#results">Results</a> &nbsp;/&nbsp; <a href="${branch}">Code</a></p></header>
<p class="project-abstract">On WINDY Lab’s aerial-manipulation platform, I developed visual feedback and control integration to keep an arm’s end effector steady as its base moves. Real-arm tests settled to final-10-s mean pose errors of <strong>2.31 mm / 0.53°</strong> after approximately 10 cm of horizontal base displacement.</p>
<p>Two findings shaped my solution: identifying the rigid body that carries the camera, and separating external disturbance from joint-induced camera motion.</p>

<section id="demo"><h2>Real hardware, moving base, fixed world target</h2>
<p>Manually moving the base tests the arm’s ability to preserve its captured world-frame pose. The paired views show the same physical experiment.</p>
${video('paired-demo','Paired views · 3D base-disturbance experiment (1.5×)','Left: physical arm. Right: a close-up of the corresponding RViz view. Cyan shows the reconstructed end-effector trajectory; gold marks the target and the reconstructed base trail. This excerpt covers recording time 80–210 s, paired by elapsed recording time and shown at 1.5× speed.')}
<p class="table-note">Full recordings at original speed: <a href="${asset}physical-demo.mp4">physical robot</a> &nbsp;/&nbsp; <a href="${asset}rviz-demo.mp4">RViz</a>. The full trial includes 216.68 seconds of engaged compensation.</p>
<div class="arm-trial-sequence">
${figure('trial-before.jpg','Physical and RViz frames before the disturbance at recording time 90 seconds.','Before disturbance · 90 s')}
${figure('trial-during.jpg','Physical and RViz frames during compensation at recording time 145 seconds.','During compensation · 145 s')}
${figure('trial-settled.jpg','Physical and RViz frames after settling at recording time 210 seconds.','After settling · 210 s')}
</div>

</section>

<section id="perception"><h2>1. From a prepared target to the ordinary environment</h2>
<p>I used an arm-mounted D435i to obtain pose feedback from the environment, progressively reducing the workspace preparation needed for deployment.</p>
<ol class="perception-evolution">
<li><strong>AprilTag: establish the feedback chain.</strong> I first used a fixed tag as the environmental reference and inverted the detected relative pose to localize the camera. This verified the camera-to-world feedback chain.</li>
<li><strong>Tissue box: remove the printed marker.</strong> I trained a YOLO keypoint model on a few hundred labeled tissue-box images and obtained object-based pose feedback. This motivated scene-based localization across new workspaces.</li>
<li><strong>Stereo-inertial ORB-SLAM3: use the scene itself.</strong> I moved to the D435i’s infrared stereo images and IMU to estimate camera motion from environmental features. My work adapted and integrated the existing estimator into the arm feedback pipeline, reducing reliance on a preselected target or printed tag.</li>
</ol>
</section>

<section id="geometry"><h2>2. Identify the sensor mounting and recover wrist motion</h2>
<p>Single-joint tests revealed the mounting geometry: joint 6 rotated the end effector while the camera remained nearly still.</p>
<p><strong>My finding:</strong> the camera was attached to the joint-6 motor housing. I checked kinematics, visual estimates, and gyro data, then rebuilt the pose chain around the housing and live joint-6 angle to recover the end-effector pose.</p>
${figure('hardware.jpg','Close-up photograph of the physical WINDY Lab robotic arm and wrist assembly.','The real arm and wrist assembly used for mounting-model identification and control testing.','figure-medium')}
${figure('mount-validation.png','Grouped bar chart comparing joint-6 encoder rotation, camera rotation and reconstructed end-effector rotation in two real-robot tests.','Two real-robot single-joint checks: +2.945° at joint 6 produced 0.026° camera rotation and 2.961° reconstructed end-effector rotation; −5.297° produced 0.045° and 5.262°, respectively. The plotted magnitudes show how the corrected model recovers end-effector rotation even when the camera hardly rotates.','figure-medium')}
<p>The resulting feedback follows a simple physical chain: <strong>world → camera → motor housing → end effector</strong>, with the final relationship updated by joint 6. I also checked all six Jacobian columns against finite differences before connecting the reconstructed pose to control.</p>
</section>

<section id="motion"><h2>3. Separate self-motion for disturbance compensation</h2>
<p>I used visual velocity feedforward to respond as the base moved. The camera measures both external motion and the arm’s correction, so the controller first separates those components.</p>
<div class="motion-relation" role="img" aria-label="External motion equals measured camera motion minus camera motion predicted from synchronized joint feedback."><span>Measured camera motion</span><span aria-hidden="true">−</span><span>Joint-induced camera motion</span><span aria-hidden="true">=</span><strong>External disturbance</strong></div>
<p><strong>My solution:</strong> align encoder states to the visual timestamp, predict self-motion with the camera Jacobian, and subtract it in the same frame. I then account for the offset between the camera and end effector, since a rotational disturbance creates different linear velocities at the two points.</p>
<p>Opposing disturbance-velocity feedforward, pose feedback, and bounded joint commands then drive the compensating motion.</p>
${figure('trajectory-detail.jpg','Cropped RViz frame with the cyan end-effector trace near the gold target and a gold base-motion trail below the arm.','A closer look at the real experiment’s reconstructed motion: the gold trail below the arm records base movement, while the cyan end-effector trace stays near the captured target above. Frame at recording time 195 s.','figure-small')}
</section>

<section id="results"><h2>Results</h2>
<p>The real arm counteracted manually applied base motion and settled after the base stopped. Two documented trials show the progression from horizontal disturbance testing to sustained 3D compensation.</p>
<div class="table-scroll" role="region" tabindex="0" aria-label="Real-arm test results"><table class="result-table arm-results"><caption>Results from separate physical experiments</caption><thead><tr><th scope="col">Trial</th><th scope="col">Control time</th><th scope="col">Final-10-s mean<br>position / orientation error</th></tr></thead><tbody>
<tr><th scope="row">≈10 cm horizontal base displacement over ≈5 s</th><td>128.27 s</td><td><strong>2.31 mm / 0.53°</strong></td></tr>
<tr><th scope="row">Manual 3D translation and small rotations</th><td>216.68 s</td><td><strong>1.10 mm / 0.878°</strong></td></tr>
</tbody></table></div>
<p class="table-note">Final-10-s mean pose errors estimated from SLAM and joint encoders during real-arm base-disturbance tests.</p>
${video('physical-additional','Physical robot · additional disturbance trial','Manual base motion and the arm’s compensating response, recorded from an external camera.')}
<p><strong>What this work established:</strong> a world-frame end-effector feedback loop that respects the actual sensor mounting, separates self-motion from external motion, and drives compensating joint motion on real hardware.</p>
</section>

<section id="lab"><h2>At WINDY Lab</h2>
${figure('with-prof-zhao.jpg','Yihuan Huang with Prof. Shiyu Zhao at Westlake University.','With my advisor, Prof. Shiyu Zhao, during my research visit to WINDY Lab, Westlake University.','figure-lab')}
</section>

<section id="resources"><h2>Code and experimental records</h2>
<p><a href="${branch}">Perception–control integration</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/D435i_Apriltag">AprilTag and object-pose exploration</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/ORB_SLAM3">ORB-SLAM3 fork</a></p>
<p><a href="${report}VELOCITY_FEEDFORWARD.md">Geometry checks and horizontal test record</a> &nbsp;/&nbsp; <a href="${report}VIDEO_DEMO_20260924.md">3D demonstration record</a></p>
<p>WINDY Lab developed the arm and aerial-manipulation platform. I adapted AprilTag, YOLO, and ORB-SLAM3 for visual feedback, and implemented the geometry correction, disturbance separation, and real-arm control integration.</p>
</section></article>`;
}
