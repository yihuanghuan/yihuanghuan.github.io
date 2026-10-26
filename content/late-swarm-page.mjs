export function lateSwarmBody() {
 const assets = '../../assets/late-swarm/';
 const figure = (file,alt,caption,cls='') => `<figure class="research-figure ${cls}"><a href="${assets}${file}"><img src="${assets}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
 return `<nav class="back-link"><a href="../../#research">← Back to Research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail late-swarm-page">
<header><h1>LATE-Swarm: Late-Bound Semantic-to-Physical Commitment for Natural-Language UAV Swarm Reconfiguration</h1>
<p><strong>Yihuan Huang</strong>, Hongwei Chen, Jianxiang Wang, JianYu Kong, Tao Jiang<br>Chongqing University · Mar–Sep 2026<br><em>Submitted to ICRA 2027 · Under review</em></p>
<p><a href="#demo">Demo</a> &nbsp;/&nbsp; <a href="#results">Results</a> &nbsp;/&nbsp; <a href="../../files/late-swarm.pdf">Paper</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance">Code</a></p></header>
<p class="project-abstract">I designed and implemented a language-to-control framework that resolves formation geometry, UAV assignment, and execution timing as the required physical information becomes available. In Gazebo, the framework completed <strong>60/60 missions with 8–16 UAVs</strong>, achieving 0.085 m mean tracking RMSE.</p>
<section id="demo"><h2>Coordinated missions from language</h2>
<figure class="research-figure"><video controls playsinline preload="none" poster="${assets}demo-poster.jpg" aria-label="Gazebo, RViz and reference telemetry swarm demonstration"><source src="${assets}demo.mp4" type="video/mp4">Your browser does not support embedded video.</video><figcaption>43-second demonstration with 8, 12, and 16 UAVs: task-phase-aligned views from separate Gazebo, RViz, and reference-telemetry runs.</figcaption></figure>
<p>The 16-UAV example forms a circle, splits into concurrent six-UAV circle and ten-UAV line formations, then reunites as one line. The sequence shows how the framework composes and executes multi-stage tasks.</p></section>
<section id="contributions"><h2>My contribution: decide when to commit</h2>
<p>I initiated the project while exploring language interfaces for UAV control. A relative instruction such as “shrink the formation” led to the key design question: <strong>when does each decision have enough physical information to be resolved?</strong> Its radius depends on the current configuration; its timing depends on the assigned travel distances.</p>
<p>With guidance from Prof. Tao Jiang, I led the method design, system implementation, and evaluation. I developed Candidate LFS to preserve relative and qualitative intent, built state-aware formation generation and safety-aware slot allocation, and connected the resulting plan to ROS 2/PX4 execution.</p></section>
<section id="method"><h2>Bind decisions to the information they need</h2>
${figure('framework.png','Five-module LATE-Swarm framework from semantic specification to state-aware planning and feedback tracking.','Candidate LFS carries task intent forward. Current swarm state resolves geometry and assignment; assigned travel distances determine feasible timing; motion generation and feedback realize the plan.')}
<ol><li><strong>Represent intent.</strong> Explicit requests retain their meaning, while relative and automatic fields await the state needed to resolve them.</li>
<li><strong>Plan with current state.</strong> Formation generation uses a fresh participant snapshot. Hungarian initialization and lexicographic pairwise refinement prioritize conflict reduction, clearance, and travel distance.</li>
<li><strong>Time and execute.</strong> Velocity, acceleration, and jerk limits shape the final duration and minimum-jerk references. LADRC tracking and feedback avoidance respond during execution.</li></ol>
<p id="safety">Planning addresses predictable trajectory conflicts, while feedback responds to execution-time proximity. Motion style adjusts automatic timing and designated tracking parameters within the resolved safety and motion constraints.</p></section>
<section id="results"><h2>Results</h2>
<h3>State-aware commitment under changing conditions</h3>
<p>Across <strong>60 paired state units</strong> spanning six semantic families, late commitment used the execution state to resolve relative requests. Under state shift, state-consistency violations fell from <strong>50/60 to 0/60</strong>, and feasibility correction or rejection fell from <strong>28/60 to 0/60</strong>, compared with early commitment.</p>
${figure('commitment-results.png','State-shift comparison: early commitment has 83.3% consistency violations and 46.7% correction or rejection; late commitment has zero for both.','The paired comparison holds command, execution state, policy, and downstream allocation fixed while varying commitment timing. Both strategies have zero adverse outcomes in the no-shift condition.','figure-medium')}
<h3>End-to-end Gazebo missions</h3>
<p>A separate campaign covered simple, under-specified, and compositional missions at 8, 12, and 16 UAVs.</p>
<ul><li><strong>60/60</strong> prospectively feasible attempts met the completion criterion.</li><li><strong>0.085 m</strong> overall mean tracking RMSE.</li><li><strong>Minimum separation above 1.5 m</strong> in every execution of this campaign.</li></ul>
<p>The work connected a language representation to the information dependencies of physical execution. That design principle guided the interface between interpretation, planning, and closed-loop control.</p></section>
<section id="resources"><h2>Paper and implementation</h2><p><a href="../../files/late-swarm.pdf">Manuscript · ICRA 2027 under review</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance">Repository</a></p>
<p>Fixed releases: <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance/tree/late-swarm-core-v1.0">core implementation</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance/tree/late-swarm-paper-repro-v1.0">paper reproduction</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance/tree/late-swarm-paper-results-v1.0">processed results</a>.</p></section>
</article>`;
}
