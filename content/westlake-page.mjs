const asset = '../../assets/westlake/';
const branch = 'https://github.com/yihuanghuan/windy-arm/tree/agent/link6-velocity-feedforward';
const report = 'https://github.com/yihuanghuan/windy-arm/blob/agent/link6-velocity-feedforward/docs/camera_world_hold/';
const figure = (file, alt, caption, cls='') => `<figure class="research-figure ${cls}"><a href="${asset}${file}"><img src="${asset}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
const video = (file, label, caption) => `<figure class="research-figure"><h3>${label}</h3><video controls playsinline preload="none" poster="${asset}${file}-poster.jpg" aria-label="${label}"><source src="${asset}${file}.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${asset}${file}.mp4">Download video</a>.</video><figcaption>${caption}</figcaption></figure>`;

export function westlakeBody() {
 return `<nav class="back-link"><a href="../../#research">← Back to research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail westlake-detail">
<header><h1>Keeping an End Effector Steady<br>on a Moving Base</h1>
<p>WINDY Lab, Westlake University · Jul–Oct 2026<br>Visiting Research Student · Advisor: Prof. Shiyu Zhao</p>
<p><a href="${branch}">Control code</a> &nbsp;/&nbsp; <a href="#demo">Real-robot videos</a> &nbsp;/&nbsp; <a href="#results">Experimental results</a></p></header>
<p class="project-abstract">WINDY Lab develops aerial manipulation systems: a robotic arm mounted on a UAV. Even small aircraft disturbances move the arm’s base. My work addressed a central requirement for interaction with the environment: keeping the end effector’s position and orientation stable in the world while its base moves.</p>
<p>I developed the visual feedback and perception–control integration for this task, progressing from marker-based localization to stereo-inertial estimation. Two key advances made the feedback physically meaningful: correcting the camera’s moving-body model and separating external disturbance from the arm’s own motion.</p>
<p><strong>My contributions:</strong> <a href="#perception">choosing practical visual feedback</a> · <a href="#geometry">correcting the mounting model</a> · <a href="#motion">isolating external motion</a> · <a href="#results">real-arm validation</a></p>

<section id="demo"><h2>Real hardware, moving base, fixed world target</h2>
<p>These paired views show the same real-arm experiment: the base is moved manually while the arm compensates to preserve its captured world-frame end-effector pose. The physical recording and RViz view play together in a single video.</p>
${video('paired-demo','Paired views · 3D base-disturbance experiment (1.5×)','Left: physical arm. Right: a close-up of the corresponding RViz view. Cyan shows the reconstructed end-effector trajectory; gold marks the target and the reconstructed base trail. This excerpt covers recording time 80–210 s, paired by elapsed recording time and shown at 1.5× speed.')}
<p class="table-note">Full recordings at original speed: <a href="${asset}physical-demo.mp4">physical robot</a> &nbsp;/&nbsp; <a href="${asset}rviz-demo.mp4">RViz</a>. The full trial includes 216.68 seconds of engaged compensation.</p>
<div class="arm-trial-sequence">
${figure('trial-before.jpg','Physical and RViz frames before the disturbance at recording time 90 seconds.','Before disturbance · 90 s')}
${figure('trial-during.jpg','Physical and RViz frames during compensation at recording time 145 seconds.','During compensation · 145 s')}
${figure('trial-settled.jpg','Physical and RViz frames after settling at recording time 210 seconds.','After settling · 210 s')}
</div>
<p class="table-note">Three moments from the same experiment. Each pair shows the physical arm above and its RViz view below, at the same elapsed recording time.</p>
</section>

<section id="perception"><h2>1. From a prepared target to the ordinary environment</h2>
<p>My starting question was how to obtain usable end-effector feedback without relying on indoor motion capture. A D435i mounted on the arm provided a route to camera pose estimation; the choice of visual reference determined how much preparation each new workspace required.</p>
<ol class="perception-evolution">
<li><strong>AprilTag: establish the feedback chain.</strong> I first used a fixed tag as the environmental reference and inverted the detected relative pose to localize the camera. This made it straightforward to verify the camera-to-world pipeline.</li>
<li><strong>Tissue box: remove the printed marker.</strong> I trained a YOLO keypoint model on a few hundred labeled tissue-box images and obtained object-based pose feedback. The next question was whether every new object should require another collection and labeling effort.</li>
<li><strong>Stereo-inertial ORB-SLAM3: use the scene itself.</strong> I moved to the D435i’s infrared stereo images and IMU to estimate camera motion from environmental features. My work adapted and integrated the existing estimator into the arm feedback pipeline, reducing reliance on a preselected target or printed tag.</li>
</ol>
<p>This progression was driven by deployment requirements: first verify pose feedback, then reduce the preparation needed in a new environment.</p>
</section>

<section id="geometry"><h2>2. A calibration problem that began with the physical model</h2>
<p>Repeated hand–eye calibration left a persistent rotation mismatch. When joint 6 rotated, the end effector changed orientation, but the camera barely moved. A fixed camera-to-end-effector transform could not explain both observations.</p>
<p><strong>My finding:</strong> the camera was attached to the joint-6 motor housing, rather than its rotating output. I checked single-joint motion against forward kinematics, visual estimates, and the gyro, then rebuilt the pose chain around the housing and the live joint-6 angle. This retained the existing hardware mounting while recovering the actual end-effector pose.</p>
${figure('hardware.jpg','Close-up photograph of the physical WINDY Lab robotic arm and wrist assembly.','The real arm used in the project. Understanding which rigid body carried the camera was essential to reconstructing the end effector’s motion correctly.','figure-medium')}
${figure('mount-validation.png','Grouped bar chart comparing joint-6 encoder rotation, camera rotation and reconstructed end-effector rotation in two real-robot tests.','Two real-robot single-joint checks: +2.945° at joint 6 produced 0.026° camera rotation and 2.961° reconstructed end-effector rotation; −5.297° produced 0.045° and 5.262°, respectively. The plotted magnitudes show how the corrected model recovers end-effector rotation even when the camera hardly rotates.','figure-medium')}
<p>The resulting feedback follows a simple physical chain: <strong>world → camera → motor housing → end effector</strong>, with the final relationship updated by joint 6. I also checked all six Jacobian columns against finite differences before connecting the reconstructed pose to control.</p>
</section>

<section id="motion"><h2>3. Compensate the disturbance without fighting the arm</h2>
<p>Pose feedback closed the loop, but visual velocity offered a way to respond to motion before a large pose error accumulated. The camera, however, observes both the external disturbance and the arm’s own corrective motion. Directly opposing all measured camera motion would also oppose the correction.</p>
<div class="motion-relation" role="img" aria-label="External motion equals measured camera motion minus camera motion predicted from synchronized joint feedback."><span>Measured camera motion</span><span aria-hidden="true">−</span><span>Joint-induced camera motion</span><span aria-hidden="true">=</span><strong>External disturbance</strong></div>
<p><strong>My solution:</strong> align encoder states to the visual timestamp, predict self-motion with the camera Jacobian, and subtract it in the same frame. I then account for the offset between the camera and end effector, since a rotational disturbance creates different linear velocities at the two points.</p>
<p>The controller combines opposing disturbance-velocity feedforward with pose feedback and bounded joint commands. If a velocity estimate cannot be aligned reliably, it falls back to pose feedback. This connects sensing geometry, timing, and physical execution in one closed loop.</p>
${figure('trajectory-detail.jpg','Cropped RViz frame with the cyan end-effector trace near the gold target and a gold base-motion trail below the arm.','A closer look at the real experiment’s reconstructed motion: the gold trail below the arm records base movement, while the cyan end-effector trace stays near the captured target above. Frame at recording time 195 s.','figure-small')}
</section>

<section id="results"><h2>Experimental results</h2>
<p>The real arm counteracted manually applied base motion and settled after the base stopped. Two documented trials show the progression from horizontal disturbance testing to sustained 3D compensation.</p>
<div class="table-scroll" role="region" tabindex="0" aria-label="Real-arm test results"><table class="result-table arm-results"><caption>Results from separate physical experiments</caption><thead><tr><th scope="col">Trial</th><th scope="col">Control-engaged duration</th><th scope="col">Peak position / orientation error</th><th scope="col">Final-10-s mean error</th></tr></thead><tbody>
<tr><th scope="row">≈10 cm horizontal base displacement over ≈5 s</th><td>128.27 s</td><td>27.18 mm / 5.49°</td><td><strong>2.31 mm / 0.530°</strong></td></tr>
<tr><th scope="row">Manual 3D translation and small rotations</th><td><strong>216.68 s</strong></td><td>36.15 mm / 8.42°</td><td>1.10 mm / 0.878°</td></tr>
</tbody></table></div>
<p class="table-note">Both trials used pose feedback plus 0.25 / 0.25 linear/angular velocity feedforward and completed without a tracking-protection exit. Pose errors are reconstructed from SLAM and encoders. Final-10-s values describe settling, rather than error throughout the disturbance. Manual input amplitudes were approximate; these are component-level arm tests for aerial manipulation.</p>
${figure('horizontal-error.png','Recorded Cartesian position-error components and orientation-error components during the approximately 10 cm horizontal disturbance trial.','Horizontal disturbance trial: the arm responds to the applied base motion, then settles near the captured target. Curves cover the full control-engaged window, including the initial wait for motion. Position components are in metres; the lower panel shows RPY components of the orientation-error rotation. Reported orientation magnitudes in the table use the SO(3) rotation-vector norm.','figure-medium')}
${figure('three-d-error.png','Recorded position and orientation error components over the three-dimensional base-disturbance demonstration.','Sustained 3D demonstration: reconstructed end-effector errors during 216.68 seconds of engaged compensation. This is the error record associated with the RViz trial above. Both error figures are original experiment plots, preserving the recorded traces.','figure-medium')}
${video('physical-additional','Physical robot · additional disturbance trial','Manual base motion and the arm’s compensating response, recorded from an external camera.')}
<p><strong>What this work established:</strong> a world-frame end-effector feedback loop that respects the actual sensor mounting, separates self-motion from external motion, and drives compensating joint motion on real hardware.</p>
</section>

<section id="lab"><h2>At WINDY Lab</h2>
${figure('with-prof-zhao.jpg','Yihuan Huang with Prof. Shiyu Zhao at Westlake University.','With my advisor, Prof. Shiyu Zhao, during my research visit to WINDY Lab, Westlake University.','figure-lab')}
</section>

<section id="resources"><h2>Code and experimental records</h2>
<p><a href="${branch}">Perception–control integration</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/D435i_Apriltag">AprilTag and object-pose exploration</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/ORB_SLAM3">ORB-SLAM3 fork</a></p>
<p><a href="${report}VELOCITY_FEEDFORWARD.md">Geometry checks and horizontal test record</a> &nbsp;/&nbsp; <a href="${report}VIDEO_DEMO_20260924.md">3D demonstration record</a></p>
<p>The aerial manipulation platform and arm were developed by WINDY Lab. My contribution focused on visual feedback, mounting-model correction, disturbance separation, control integration, and physical testing. ORB-SLAM3, AprilTag, and YOLO are existing methods used in this work.</p>
</section></article>`;
}
