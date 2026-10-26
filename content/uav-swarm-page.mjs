import { researchMetadata } from './projects.mjs';
const assets = '../../assets/uav-swarm-control/';
const repo = 'https://github.com/yihuanghuan/Distributed-Multi-UAV-Formation-and-Obstacle-Avoidance-System';
const report = path => `${repo}/blob/main/Report/${path}`;
const figure = (file, alt, caption, compact = false) => `<figure class="research-figure${compact ? ' figure-medium' : ''}"><a href="${assets}${file}"><img src="${assets}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;

export function uavSwarmBody(project) {
 return `<nav class="back-link"><a href="../../#research">← Back to Research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail">
<header><h1>${project.title}</h1>
${researchMetadata(project)}
<p><a href="#demo">Demo</a> &nbsp;/&nbsp; <a href="#results">Results</a> &nbsp;/&nbsp; <a href="${repo}">ROS 2 implementation</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/distributed-uav-swarm">Simulink implementation</a></p></header>
<p class="project-abstract">I integrated distributed formation tracking with local obstacle avoidance in Simulink and ROS 2/PX4 SITL. The system combines neighbor-based acceleration estimation, role-specific avoidance, and bounded formation feedback; a Gazebo wall-escape test finished about 0.4 m from the goal.</p>

<section id="demo"><h2>Formation and avoidance in simulation</h2>
<figure class="research-figure figure-medium"><video controls preload="none" playsinline poster="${assets}fusion-trajectories.png" aria-label="Simulink demonstration of the fused formation and avoidance controller"><source src="${assets}fusion-demo.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${assets}fusion-demo.mp4">Download the simulation video</a>.</video><figcaption>Recorded MATLAB/Simulink demonstration: one leader and four followers navigate around spherical obstacles using the fused controller. This is a simulated flight visualization.</figcaption></figure></section>

<section id="reproduction"><h2>Starting from two reproductions</h2>
<p>I began with single-UAV trajectory generation and tracking, then reproduced Pan’s potential-field approach and Wang’s distributed formation controller separately. The useful question became how to combine obstacle avoidance with timely formation response over a sparse communication graph.</p>
<p>Pan’s IAPF and rotating escape forces supplied obstacle avoidance <a href="#ref-pan">[1]</a>; Wang’s distributed acceleration estimator and bounded position/velocity feedback supplied formation tracking <a href="#ref-wang">[2]</a>. I reproduced both methods and integrated them around a goal-driven leader.</p>
</section>
<section id="fusion"><h2>From separate methods to one controller</h2>
<h3>1. Estimate leader motion through neighbors</h3>
<p>With chain-like communication, followers estimate the leader’s motion through neighbors. I implemented the distributed acceleration estimator and used its output as feedforward, alongside relative position and velocity feedback. This addressed the trailing response that motivated the fusion.</p>
<h3>2. Separating leader navigation from follower protection</h3>
<p>A follower’s formation slot moves with the leader. I separated navigation and protection: the leader uses goal attraction and obstacle avoidance, while followers use local obstacle repulsion without that goal-distance attenuation, combined with formation feedback.</p>
<h3>3. Making the combined signals executable</h3>
<p>I added feedforward clipping and obstacle damping to keep acceleration estimates compatible with bounded formation correction. A nonzero estimator boundary layer reduces chattering, and body-axis thrust projection connects virtual force to the quadrotor dynamics.</p>
${figure('simulink-model.png', 'Simulink model connecting leader and follower controllers, distributed estimator, attitude mapping, and quadrotor dynamics.', 'Implemented Simulink model. The leader controller and follower controller produce virtual forces; the estimator supplies acceleration feedforward; attitude extraction maps these commands into the quadrotor dynamics.')}
</section>

<section id="ros2"><h2>ROS 2 / PX4 implementation</h2>
<p>I transferred the control structure to ROS 2 Humble and PX4 SITL/Gazebo, with one controller instance per UAV. Each instance subscribes to the configured neighbors’ odometry and acceleration estimates. Formation commands pass through LADRC disturbance compensation and an acceleration-to-attitude/thrust mapping; PX4 retains the lower-level attitude and rate control.</p>
<p>One practical issue was coordinate consistency: PX4 local origins differ for vehicles spawned at different Gazebo positions. I added spawn offsets before exchanging positions so that formation errors are computed in a common world frame.</p>
<h3>Escaping a collinear obstacle trap</h3>
<p>In the recorded wall experiment, the APF baseline stalled before the obstacle. Adding a rotating escape force with direction locking prevented repeated left/right reversals and allowed the leader to travel around the wall.</p>
${figure('deadlock-comparison.png', 'Leader trajectories with and without rotating escape force in the collinear wall experiment.', 'Gazebo collinear-wall comparison. The rotating-force variant with direction locking bypasses the wall and finishes about 0.4 m from the goal in this leader-trajectory comparison. <a href="'+report('deadlock_ablation/deadlock_ablation_report.md')+'">Experiment report and data</a>.')}
</section>

<section id="results"><h2>Results</h2>
<ul><li><strong>Formation recovery after obstacle avoidance.</strong> In the recorded 80 s Simulink experiment, one leader and four followers navigated around spherical obstacles, and follower slot errors settled back near zero after the avoidance maneuvers. The run demonstrates how acceleration feedforward, formation feedback, and local repulsion work together to restore the desired formation.</li>
<li><strong>Successful escape from the collinear wall trap.</strong> In the Gazebo comparison, the rotating escape force with direction locking enabled the leader to bypass the wall and finish about 0.4 m from the goal. The baseline remained in front of the wall. This experiment supports maintaining a consistent escape direction during the maneuver.</li>
</ul>
<p>These experiments demonstrate the implemented path from separate paper reproductions to a working formation-and-avoidance pipeline in Simulink and ROS 2/PX4 simulation. The central outcome is the integration of neighbor-based acceleration estimation, bounded formation feedback, role-specific obstacle avoidance, and disturbance-compensated flight control.</p></section>

<section id="resources"><h2>Code and references</h2>
<p><a href="${repo}">Integrated ROS 2 system and experiment reports</a><br>
<a href="https://github.com/yihuanghuan/apf-swarm-control">Pan reproduction</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/Leader-Follower-swarm">Wang reproduction</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/distributed-uav-swarm">Fused Simulink model</a></p>
<p>Earlier single-UAV work: <a href="https://github.com/yihuanghuan/minisnap_PID">minimum-snap tracking</a>, <a href="https://github.com/yihuanghuan/minisnap_LADRC">minimum-snap + LADRC</a>, <a href="https://github.com/yihuanghuan/A_minisnap">A* + minimum-snap</a>, and <a href="https://github.com/yihuanghuan/circle_LADRC">circular tracking with LADRC</a>.</p>
<ol class="reference-list"><li id="ref-pan">Z. Pan et al. <a href="https://doi.org/10.1109/TCSII.2021.3112787">An Improved Artificial Potential Field Method for Path Planning and Formation Control of the Multi-UAV Systems</a>.</li>
<li id="ref-wang">Z. Wang et al. <a href="https://doi.org/10.1109/TMECH.2020.3017816">Distributed Control Algorithm for Leader–Follower Formation Tracking of Multiple Quadrotors: Theory and Experiment</a>.</li></ol></section>
</article>`;
}
