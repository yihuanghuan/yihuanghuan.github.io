const assets = '../../assets/uav-swarm-control/';
const repo = 'https://github.com/yihuanghuan/Distributed-Multi-UAV-Formation-and-Obstacle-Avoidance-System';
const report = path => `${repo}/blob/main/Report/${path}`;
const figure = (file, alt, caption, compact = false) => `<figure class="research-figure${compact ? ' figure-medium' : ''}"><a href="${assets}${file}"><img src="${assets}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;

export function uavSwarmBody() {
 return `<nav class="back-link"><a href="../../#research">← Back to research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail">
<header><h1>Distributed UAV Swarm Formation<br>and Obstacle Avoidance</h1>
<p>Chongqing University · Sep 2025–May 2026<br>Core Developer · Advisor: Prof. Tao Jiang</p>
<p><a href="${repo}">ROS 2 implementation</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/distributed-uav-swarm">Simulink implementation</a> &nbsp;/&nbsp; <a href="#demo">Video</a></p></header>
<p class="project-abstract">How can a swarm maintain formation while avoiding obstacles when only some vehicles receive the leader’s state directly? I reproduced two complementary control methods, investigated their limitations in my simulations, and integrated neighbor-based acceleration estimation, bounded formation feedback, and local obstacle avoidance into a ROS 2/PX4 system.</p>

<section id="demo"><h2>Formation and avoidance in simulation</h2>
<figure class="research-figure figure-medium"><video controls preload="none" playsinline poster="${assets}fusion-trajectories.png" aria-label="Simulink demonstration of the fused formation and avoidance controller"><source src="${assets}fusion-demo.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${assets}fusion-demo.mp4">Download the simulation video</a>.</video><figcaption>Recorded MATLAB/Simulink demonstration: one leader and four followers navigate around spherical obstacles using the fused controller. This is a simulated flight visualization.</figcaption></figure></section>

<section id="reproduction"><h2>Starting from two reproductions</h2>
<p>I began with single-UAV trajectory generation and tracking, then reproduced Pan’s potential-field approach and Wang’s distributed formation controller separately. The useful question became how to combine obstacle avoidance with timely formation response over a sparse communication graph.</p>
<table class="result-table"><caption>What each reproduction contributed, and what I needed to extend.</caption><thead><tr><th scope="col">Reproduction</th><th scope="col">Useful component</th><th scope="col">Gap in my target task</th></tr></thead><tbody>
<tr><th scope="row">Pan et al. <a href="#ref-pan">[1]</a></th><td>Improved artificial potential fields (IAPF), rotating escape forces, and potential-based formation keeping.</td><td>In my sparse-topology tests, error-driven following lagged behind leader motion; large initial attraction could pull the leader ahead of the formation.</td></tr>
<tr><th scope="row">Wang et al. <a href="#ref-wang">[2]</a></th><td>Distributed leader-acceleration estimation and bounded position/velocity feedback.</td><td>My reproduction tracked a prescribed leader trajectory; it needed a goal-driven leader and an obstacle-avoidance layer.</td></tr>
</tbody></table>
<p>The estimator and double-<i>tanh</i> feedback originate in Wang’s method; IAPF and rotating-field ideas originate in Pan’s method. My work focused on reproduction, integration, and the changes required when these components interact.</p></section>

<section id="fusion"><h2>From separate methods to one controller</h2>
<h3>1. Addressing delayed response at the end of the network</h3>
<p>With chain-like communication, a follower cannot simply read the complete leader state. I implemented the distributed acceleration estimator and used its output as feedforward, alongside relative position and velocity feedback from neighbors. This addressed the trailing response that motivated the fusion.</p>
<p>The Simulink configuration below connects the leader only to follower 1; follower links are 1–2, 2–3, and 2–4. The later four-UAV ROS 2 configuration uses leader→2, leader→3, and 2→4. These are different experiments.</p>
<h3>2. Separating leader navigation from follower protection</h3>
<p>A follower’s formation slot is a moving target. Applying goal-distance-scaled repulsion directly to that slot can weaken avoidance precisely when the follower is close to its desired position. I separated the two roles: the leader uses goal attraction and obstacle avoidance, while followers use local obstacle repulsion without that goal-distance attenuation, combined with formation feedback.</p>
<h3>3. Making the combined signals executable</h3>
<p>Obstacle-driven leader maneuvers can produce acceleration feedforward that overwhelms bounded formation correction. I added feedforward clipping, obstacle damping, and numerical safeguards. In the Simulink implementation, a nonzero estimator boundary layer reduces chattering; thrust is projected onto the current body axis and vertical commands are constrained during attitude extraction.</p>
<p>These changes alter the original controller. The source papers’ convergence arguments do not, by themselves, prove finite-time convergence or collision avoidance for this modified system.</p>
${figure('simulink-model.png', 'Simulink model connecting leader and follower controllers, distributed estimator, attitude mapping, and quadrotor dynamics.', 'Implemented Simulink model. The leader controller and follower controller produce virtual forces; the estimator supplies acceleration feedforward; attitude extraction maps these commands into the quadrotor dynamics.')}
${figure('formation-errors.png', 'X, Y and Z follower slot errors during the 80-second fused-controller simulation.', 'Follower position errors relative to their formation slots in the recorded 80 s simulation. Avoidance temporarily deforms the formation, with X-axis errors reaching roughly 12 m before settling back near zero. The plot documents recovery in this run, rather than rigid formation preservation throughout avoidance.', true)}
</section>

<section id="ros2"><h2>ROS 2 / PX4 implementation</h2>
<p>I transferred the control structure to ROS 2 Humble and PX4 SITL/Gazebo, with one controller instance per UAV. Each instance subscribes to the configured neighbors’ odometry and acceleration estimates. Formation commands pass through LADRC disturbance compensation and an acceleration-to-attitude/thrust mapping; PX4 retains the lower-level attitude and rate control.</p>
<p>One practical issue was coordinate consistency: PX4 local origins differ for vehicles spawned at different Gazebo positions. I added spawn offsets before exchanging positions so that formation errors are computed in a common world frame.</p>
<h3>Escaping a collinear obstacle trap</h3>
<p>In the recorded wall experiment, the APF baseline stalled before the obstacle. Adding a rotating escape force with direction locking prevented repeated left/right reversals and allowed the leader to travel around the wall.</p>
${figure('deadlock-comparison.png', 'Leader trajectories with and without rotating escape force in the collinear wall experiment.', 'Gazebo collinear-wall comparison. The baseline stops near (22.0, 3.2) m; the rotating-force variant with direction locking finishes near (49.8, 3.2) m, about 0.4 m from the goal in the reported run. This figure shows the leader trajectory. <a href="'+report('deadlock_ablation/deadlock_ablation_report.md')+'">Experiment report and data</a>.')}
<h3>Testing disturbance compensation</h3>
${figure('ladrc-ablation.png', 'Leader paths and cross-track errors with LESO compensation enabled and disabled under simulated lateral wind.', 'Leader-only LADRC ablation in a four-UAV SITL setup, including a 0→5 m/s wind ramp, gusts, and steady crosswind. The report gives wind-phase cross-track RMSE of 0.8 m with LESO and 40.6 m without it. The disabled-LESO baseline already has a substantial pre-wind height error, so this comparison reflects both model mismatch and wind disturbance; it does not isolate wind rejection alone. <a href="'+report('LADRC%20vs%20PD/ablation_study_report.md')+'">Full report</a>.')}
</section>

<section id="results"><h2>Experimental Results and Conclusions</h2>
<ul><li><strong>Formation recovery after obstacle avoidance.</strong> In the recorded 80 s Simulink experiment, one leader and four followers navigated around spherical obstacles, and follower slot errors settled back near zero after the avoidance maneuvers. The run demonstrates how acceleration feedforward, formation feedback, and local repulsion work together to restore the desired formation.</li>
<li><strong>Successful escape from the collinear wall trap.</strong> In the Gazebo comparison, the rotating escape force with direction locking enabled the leader to bypass the wall and finish about 0.4 m from the goal. The baseline remained in front of the wall. This experiment supports maintaining a consistent escape direction during the maneuver.</li>
<li><strong>Disturbance compensation in the integrated system.</strong> In the reported four-UAV SITL setup, the LADRC-enabled leader achieved a wind-phase cross-track RMSE of 0.8 m under the configured wind ramp, gusts, and steady crosswind. Together with the trajectory comparison above, this supports using LESO compensation to handle the combined model mismatch and environmental disturbance in this test.</li></ul>
<p>These experiments demonstrate the implemented path from separate paper reproductions to a working formation-and-avoidance pipeline in Simulink and ROS 2/PX4 simulation. The central outcome is the integration of neighbor-based acceleration estimation, bounded formation feedback, role-specific obstacle avoidance, and disturbance-compensated flight control.</p></section>

<section id="resources"><h2>Code and references</h2>
<p><a href="${repo}">Integrated ROS 2 system and experiment reports</a><br>
<a href="https://github.com/yihuanghuan/apf-swarm-control">Pan reproduction</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/Leader-Follower-swarm">Wang reproduction</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/distributed-uav-swarm">Fused Simulink model</a></p>
<p>Earlier single-UAV work: <a href="https://github.com/yihuanghuan/minisnap_PID">minimum-snap tracking</a>, <a href="https://github.com/yihuanghuan/minisnap_LADRC">minimum-snap + LADRC</a>, <a href="https://github.com/yihuanghuan/A_minisnap">A* + minimum-snap</a>, and <a href="https://github.com/yihuanghuan/circle_LADRC">circular tracking with LADRC</a>.</p>
<ol class="reference-list"><li id="ref-pan">Z. Pan et al. <a href="https://doi.org/10.1109/TCSII.2021.3112787">An Improved Artificial Potential Field Method for Path Planning and Formation Control of the Multi-UAV Systems</a>.</li>
<li id="ref-wang">Z. Wang et al. <a href="https://doi.org/10.1109/TMECH.2020.3017816">Distributed Control Algorithm for Leader–Follower Formation Tracking of Multiple Quadrotors: Theory and Experiment</a>.</li></ol></section>
</article>`;
}
