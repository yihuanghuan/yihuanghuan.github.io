import { researchMetadata } from './projects.mjs';
export function lateSwarmBody(project) {
 const assets = '../../assets/late-swarm/';
 const figure = (file,alt,caption,cls='') => `<figure class="research-figure ${cls}"><a href="${assets}${file}"><img src="${assets}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
 return `<nav class="back-link"><a href="../../#research">← Back to Research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail late-swarm-page">
<header><h1>${project.title}</h1>
${researchMetadata(project)}
<p><strong>Yihuan Huang</strong>, Hongwei Chen, Jianxiang Wang, JianYu Kong, Tao Jiang<br><em class="detail-submission">Submitted to ICRA 2027 · Under review</em></p>
<p><a href="#demo">Demo</a> &nbsp;/&nbsp; <a href="#results">Results</a> &nbsp;/&nbsp; <a href="../../files/late-swarm.pdf">Paper</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanhuang/LLM-UAVswarm-performance">Code</a></p></header>
<p class="project-abstract">I designed and implemented a language-to-control framework that resolves formation geometry, UAV assignment, and execution timing as the required physical information becomes available. In Gazebo, the framework completed <strong>60/60 missions with 8–16 UAVs</strong>, achieving 0.085 m mean tracking RMSE.</p>
<section id="demo"><h2>Coordinated missions from language</h2>
<figure class="research-figure"><video controls playsinline preload="none" poster="${assets}demo-poster.jpg" aria-label="Gazebo, RViz and reference telemetry swarm demonstration"><source src="${assets}demo.mp4" type="video/mp4">Your browser does not support embedded video.</video><figcaption>43-second demonstration with 8, 12, and 16 UAVs: task-phase-aligned views from separate Gazebo, RViz, and reference-telemetry runs.</figcaption></figure>
</section>
<section id="mission-composition"><h2>Composing sequential and parallel missions</h2>
<p>A single instruction can describe a mission with several dependent stages. In the paper’s 16-UAV example, all vehicles first form a spacious circle. The mission then divides into two simultaneous tasks: UAVs 1–6 form a circle while UAVs 7–16 form a line. Once both groups have stabilized, all 16 vehicles reunite as one line.</p>
<p>I connected the language-level transition conditions to state-dependent task activation. Each sequential task is resolved from a fresh snapshot, so the completed stage supplies the starting state for the next one. Parallel tasks share one snapshot: assignment stays within each task’s participant group, while nominal proximity is evaluated across the combined group. Their shared completion time is the maximum of the constituent resolved durations.</p>
${figure('compositional-mission.png','Complete five-panel sequence of a 16-UAV mission at 0, 13, 23, 30, and 45 seconds.','Three-stage compositional mission with 16 UAVs in Gazebo, from the paper. Panel timestamps show elapsed time in this mission. Colored trails indicate recent motion and direction.')}</section>
<section id="contributions"><h2>My contribution: decide when to commit</h2>
<p>I initiated the project while exploring language interfaces for UAV control. A relative instruction such as “shrink the formation” led to the key design question: <strong>when does each decision have enough physical information to be resolved?</strong> Its radius depends on the current configuration; its timing depends on the assigned travel distances.</p>
<p>With guidance from Prof. Tao Jiang, I led the method design, system implementation, and evaluation. I developed Candidate LFS to preserve relative and qualitative intent, built state-aware formation generation and safety-aware slot allocation, and connected the resulting plan to ROS 2/PX4 execution.</p></section>
<section id="intent"><h2>Preserving intent before choosing numbers</h2>
<p>I developed Candidate LFS as the interface between language interpretation and physical realization. It records the participating vehicles, formation, center and scale requests, timing, motion style, safety preference, and task transitions. Formation identity and style can be specified immediately; relative, qualitative, and automatic requests retain their meaning until the required physical information is available.</p>
<p>For the instruction “Form a compact circle around the current swarm with smooth motion,” the representation preserves the following requests:</p>
<table class="result-table"><caption>Illustrative semantic representation of the paper’s command</caption><thead><tr><th scope="col">Request</th><th scope="col">Preserved meaning</th><th scope="col">Resolved with</th></tr></thead><tbody>
<tr><th scope="row">Formation</th><td>Circle</td><td>Language interpretation</td></tr>
<tr><th scope="row">Center</th><td>Current participant centroid</td><td>Fresh participant state</td></tr>
<tr><th scope="row">Scale</th><td>Compact</td><td>Formation geometry, participant count, and planning separation</td></tr>
<tr><th scope="row">Timing</th><td>Automatic</td><td>Assigned travel distances and motion limits</td></tr>
<tr><th scope="row">Style</th><td>Smooth</td><td>Language interpretation; applied within the execution profile</td></tr></tbody></table>
<p>I evaluated the representation on <strong>96 registered valid commands containing 225 unresolved-value instances</strong>. All 96 preserved the requested task semantics, with zero premature numerical commitments across those instances.</p></section>
<section id="method"><h2>Bind decisions to the information they need</h2>
${figure('framework.png','Five-module LATE-Swarm framework from semantic specification to state-aware planning and feedback tracking.','Candidate LFS carries task intent forward. Current swarm state resolves geometry and assignment; assigned travel distances determine feasible timing; motion generation and feedback realize the plan.')}
<h3>Resolve geometry from the participating swarm</h3>
<p>At activation, the formation generator obtains the current participant state. It resolves the center from the participant centroid or explicit request, maps the scale request to a numerical value, and combines formation geometry with the planning separation to generate target slots. Geometry also supplies a conservative travel bound for provisional timing.</p>
<h3>Assign targets with ordered priorities</h3>
<p>I initialized the UAV-to-slot mapping with a distance-minimizing Hungarian assignment, then implemented pairwise slot exchanges using ordered priorities: nominal hard-conflict count, planning-margin intrusion, and travel distance. This gives conflict reduction priority while retaining a clear preference between candidate assignments.</p>
<p>An important design choice was to evaluate three-dimensional closest approach along synchronized equal-progress nominal paths. Their closest separation is unchanged by a common time scaling. Assignment can therefore be resolved before the final duration, and the resulting travel distances provide the information needed for timing.</p>
<h3>Commit duration from the selected motion</h3>
<p>After assignment, the longest selected travel distance determines a reference-feasible duration under velocity, acceleration, and jerk limits. The motion generator then creates per-UAV minimum-jerk references for closed-loop tracking. This connects task intent, target allocation, and executable motion through explicit information dependencies.</p>
${figure('state-dependent-realization.png','Shared command for UAVs 1–4 with two initial layouts, the same participant centroid, and automatic durations of 2.92 and 4.46 seconds.','The paper’s information-dependency example for UAVs 1–4. The participant centroid and command are the same in both layouts; different initial positions produce different assigned travel distances and automatic durations of approximately 2.92 s and 4.46 s. Gray vehicles are outside the selected participant set.','figure-medium')}
<p id="safety">Planning addresses predictable trajectory conflicts, while feedback responds to execution-time proximity. Motion style adjusts automatic timing and designated tracking parameters within the resolved safety and motion constraints.</p></section>
<section id="results"><h2>Results</h2>
<h3>State-aware commitment under changing conditions</h3>
<p>Across <strong>60 paired state units</strong> spanning six semantic families, late commitment used the execution state to resolve relative requests. Under state shift, state-consistency violations fell from <strong>50/60 to 0/60</strong>, and feasibility correction or rejection fell from <strong>28/60 to 0/60</strong>, compared with early commitment.</p>
${figure('commitment-results.png','State-shift comparison: early commitment has 83.3% consistency violations and 46.7% correction or rejection; late commitment has zero for both.','The paired comparison holds command, execution state, policy, and downstream allocation fixed while varying commitment timing. Both strategies have zero adverse outcomes in the no-shift condition.','figure-medium')}
<h3 id="motion-style">Motion-style effects</h3>
<p>I evaluated motion style with matched initial states, targets, explicit duration, and nominal references, isolating its effect on designated tracking parameters.</p>
${figure('motion-style-results.png','Six-panel comparison of Normal and Aggressive relative to Smooth, showing control effort, acceleration, tracking RMSE, rise time, and settling time with confidence intervals.','Mean paired differences relative to Smooth across 15 matched scenario–seed triplets; error bars show two-sided 95% Student-t confidence intervals. Normal and Aggressive use stronger control action and achieve lower mean tracking RMSE in this evaluation.','figure-medium')}
<h3>Testing delegated motion-style authority</h3>
<p>I evaluated the tracking effects of motion style separately from its authority over task parameters. Representative timing checks show how explicit and automatic requests are handled across Smooth, Normal, and Aggressive profiles:</p>
<table class="result-table"><caption>Representative authority checks · resolved duration (s)</caption><thead><tr><th scope="col">Timing request</th><th scope="col">Smooth</th><th scope="col">Normal</th><th scope="col">Aggressive</th></tr></thead><tbody>
<tr><th scope="row">Feasible explicit: 4.00 s</th><td>4.00</td><td>4.00</td><td>4.00</td></tr>
<tr><th scope="row">Automatic</th><td>3.750</td><td>3.317</td><td>3.173</td></tr></tbody></table>
<p>For these timing cases, the reference-feasible lower bound was 2.884 s. In the independent authority evaluation, <strong>all 60 registered attempts across four test families</strong> satisfied the applicable parameter-authority rules, with zero unauthorized overrides. The hard-risk threshold remained 1.50 m across the tested styles. These authority checks complement the paired tracking comparison and the separate end-to-end mission campaign.</p>
<h3>End-to-end Gazebo missions</h3>
<p>A separate campaign covered simple, under-specified, and compositional missions at 8, 12, and 16 UAVs.</p>
<ul><li><strong>60/60</strong> prospectively feasible attempts met the completion criterion.</li><li><strong>0.085 m</strong> overall mean tracking RMSE.</li><li><strong>Minimum separation above 1.5 m</strong> in every execution of this campaign.</li></ul>
<p>The work connected a language representation to the information dependencies of physical execution. That design principle guided the interface between interpretation, planning, and closed-loop control.</p></section>
<section id="resources"><h2>Paper and implementation</h2><p><i>LATE-Swarm: Late-Bound Semantic-to-Physical Commitment for Natural-Language UAV Swarm Reconfiguration</i></p><p><a href="../../files/late-swarm.pdf">Manuscript · ICRA 2027 under review</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanhuang/LLM-UAVswarm-performance">Repository</a></p>
<p>Fixed releases: <a href="https://github.com/yihuanhuang/LLM-UAVswarm-performance/tree/late-swarm-core-v1.0">core implementation</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanhuang/LLM-UAVswarm-performance/tree/late-swarm-paper-repro-v1.0">paper reproduction</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanhuang/LLM-UAVswarm-performance/tree/late-swarm-paper-results-v1.0">processed results</a>.</p></section>
</article>`;
}
