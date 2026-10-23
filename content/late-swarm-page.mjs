// Project-specific narrative and original research assets. Provenance:
// ../docs/late-swarm-evidence.md in the parent workspace.
export function lateSwarmBody() {
 const assets = '../../assets/late-swarm/';
 const figure = (file, alt, caption) => `<figure class="research-figure${file === 'commitment-results.png' ? ' figure-medium' : file === 'motion-style-results.png' ? ' figure-small' : ''}"><a href="${assets}${file}"><img src="${assets}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
 const safetyGroups = [
  {name:'Predictable',n:23,rows:[['P0F0','2.0','1.738','0.228','100.0'],['P0F1','2.0','1.624','0.250','100.0'],['P1F0','0.0','0.000','2.068','0.0'],['P1F1','0.0','0.000','2.068','0.0']]},
  {name:'Residual',n:26,rows:[['P0F0','0.0','1.661','1.400','100.0'],['P0F1','0.0','0.305','1.468','57.7'],['P1F0','0.0','1.488','1.428','88.5'],['P1F1','0.0','0.389','1.459','61.5']]},
  {name:'Mixed',n:25,rows:[['P0F0','2.0','3.242','0.525','100.0'],['P0F1','2.0','1.880','0.624','100.0'],['P1F0','0.0','1.369','1.420','88.0'],['P1F1','0.0','0.330','1.462','52.0']]}
 ];
 const safetyTable = `<div class="table-scroll" role="region" aria-label="Planning and realized safety outcomes" tabindex="0"><table class="result-table safety-table" aria-describedby="safety-table-note"><caption>Table II. Planning and realized safety outcomes by experimental condition</caption><thead><tr><th scope="col">Risk family</th><th scope="col">Condition</th><th scope="col">Predicted conflicts</th><th scope="col">J<sub>hard</sub><br>(pair-s)</th><th scope="col">d<sub>min</sub><br>(m)</th><th scope="col">Any risk<br>(%)</th></tr></thead>${safetyGroups.map(g=>`<tbody>${g.rows.map((row,i)=>`<tr>${i===0?`<th scope="rowgroup" rowspan="4">${g.name}<br><span class="sample-count">N = ${g.n}</span></th>`:''}<th scope="row">${row[0]}</th>${row.slice(1).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody>`).join('')}</table></div><p class="table-note" id="safety-table-note">P1/F1 indicate planning/feedback enabled; P0/F0 indicate disabled. Predicted conflicts and d<sub>min</sub> are means across complete blocks; d<sub>min</sub> averages each execution’s minimum separation. J<sub>hard</sub> measures realized exposure below the 1.5 m hard-risk threshold, summed over UAV pairs. “Any risk” is the fraction of complete blocks containing at least one threshold-crossing event. N counts complete four-condition blocks in each risk family, not UAVs.</p>`;
 return `<nav class="back-link"><a href="../../#research">← Back to research</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail late-swarm-page">
<header><h1>LATE-Swarm: Late-Bound Semantic-to-Physical Commitment for Natural-Language UAV Swarm Reconfiguration</h1>
<p><strong>Yihuan Huang</strong>, Hongwei Chen, Jianxiang Wang, JianYu Kong, Tao Jiang<br>Chongqing University · March–September 2026<br><em>Submitted to ICRA 2027 · Under review</em></p>
<p><a href="../../files/late-swarm.pdf">Manuscript</a> &nbsp;/&nbsp; <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance">Code</a> &nbsp;/&nbsp; <a href="#demo">Video</a></p></header>

<p class="project-abstract">A natural-language command can express a clear goal before its physical parameters can be determined. LATE-Swarm preserves unresolved intent and binds geometry, assignment, and execution timing as the information needed to resolve them becomes available. The ROS 2/PX4 framework connects this staged reasoning to closed-loop multi-UAV execution.</p>

<section id="demo"><h2>Simulation Demonstration</h2>
<figure class="research-figure"><video controls playsinline preload="none" poster="${assets}demo-poster.jpg" aria-label="43-second edited Gazebo, RViz and reference-telemetry demonstration"><source src="${assets}demo.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${assets}demo.mp4">Download the demonstration.</a></video><figcaption>Edited 43-second demonstration at 8, 12, and 16 UAVs. Gazebo, RViz, and reference telemetry come from <strong>separate runs aligned by task phase</strong>; display time is normalized and is not a shared physical clock.</figcaption></figure>
<p>In the 16-UAV example, all UAVs first form a circle, then split into concurrent six-UAV circle and ten-UAV line formations, and finally reunite as one line. The clip illustrates mission composition; aggregate performance figures below come from a separate evaluation campaign.</p></section>

<section id="motivation"><h2>Research Motivation</h2>
<p>I initiated this project while working on UAV control and exploring how LLMs could make swarm coordination easier to specify. My initial approach asked the language model to turn every instruction parameter directly into a number. Explicit numerical requests worked, but a relative request such as “shrink the formation” exposed a limitation: an appropriate value depends on the swarm’s current configuration and physical constraints.</p>
<p>This changed the question I was asking. Rather than asking the LLM to guess missing numbers, I investigated <strong>when each physical decision has enough information to be made</strong>. The resulting representation preserves relative, qualitative, and automatic requests until the corresponding state and planning information is available.</p></section>

<section id="contributions"><h2>My Contributions</h2>
<p>I led the method design, system implementation, and evaluation, with guidance from Prof. Tao Jiang. My work included:</p>
<ul><li>Developing the Candidate Language-to-Formation Specification (Candidate LFS) to preserve execution-relevant intent without premature numerical commitment.</li>
<li>Implementing state-conditioned formation generation and a safety-aware UAV-to-slot allocator, using Hungarian initialization and lexicographic pairwise refinement.</li>
<li>Resolving execution duration after assignment using travel distances and velocity, acceleration, and jerk limits, then integrating minimum-jerk references with LADRC tracking and feedback avoidance.</li>
<li>Designing and running controlled evaluations of commitment timing, motion-style authority, planning–feedback safety roles, and end-to-end mission execution.</li></ul></section>

<section id="method"><h2>Method</h2>
${figure('framework.png','Original five-module LATE-Swarm framework: semantic specification, state-aware formation generation, safety-aware assignment, motion generation, and feedback safety and tracking.','From language to coordinated motion: Candidate LFS preserves unresolved intent; fresh swarm state resolves formation geometry and assignment; the motion generator and feedback controller realize the resulting plan. Final execution timing is committed after assignment.')}
<ol><li><strong>Preserve intent.</strong> The LLM produces a Candidate LFS. Explicit requests retain their field-specific meaning; relative, qualitative, or automatic values remain unresolved where downstream information is needed.</li>
<li><strong>Resolve geometry and assignment.</strong> A fresh participant-state snapshot determines the formation center and admissible scale. Assignment refinement prioritizes nominal hard-conflict violations, then planning-margin intrusion and travel distance.</li>
<li><strong>Commit timing and execute.</strong> Assigned travel distances determine the final feasible duration. The motion generator produces per-UAV references, and feedback handles residual execution-time proximity risks.</li></ol>
<p>Motion style has bounded authority over automatic timing and designated tracking parameters. It cannot override resolved safety parameters, motion limits, or a feasible explicit duration. Requests can be adjusted or rejected when physical constraints cannot be met.</p></section>

<section id="results"><h2>Experimental Evidence</h2>
<h3>1. Commitment timing under state change</h3>
<p>A controlled comparison used six semantic families with ten sampled physical-state realizations each: <strong>60 paired state units</strong>. Early and late commitment shared the command, execution state, policy, and downstream allocation, differing in when unresolved numerical values were committed.</p>
${figure('commitment-results.png','Early and late commitment have zero adverse outcomes without state shift; with state shift, early commitment has 83.3 percent consistency violations and 46.7 percent correction or rejection, while late has zero for both.','When the execution state remains unchanged, both commitment strategies preserve consistency. When it changes after interpretation, early commitment produces state-consistency violations in 83.3% of paired units and feasibility correction or rejection in 46.7%; late commitment produces neither outcome in this evaluation.')}
<table class="result-table"><caption>State-shift condition, 60 paired units</caption><thead><tr><th scope="col">Outcome</th><th scope="col">Early</th><th scope="col">Late</th></tr></thead><tbody><tr><th scope="row">State-consistency violations</th><td>50/60</td><td>0/60</td></tr><tr><th scope="row">Feasibility correction / rejection</th><td>28/60</td><td>0/60</td></tr></tbody></table>
<p>Both strategies had zero measured adverse outcomes when the execution-relevant state did not change. The benefit is therefore specific to the tested state-shift condition. In a separate valid-command evaluation, Candidate LFS preserved exact task semantics on 96 commands with <strong>zero premature numerical commitments across 225 registered unresolved-value instances</strong>.</p>

<h3 id="safety">2. Complementary planning and feedback roles</h3>
<p>A planning on/off × feedback on/off study separated predictable nominal conflicts from residual execution-time risk. Planning reduced hard-risk exposure in the Predictable family by a population main effect of <strong>1.681 pair-s</strong>; feedback reduced it in the Residual family by <strong>1.228 pair-s</strong>.</p>
${safetyTable}
${figure('safety-results.png','Representative trajectories and inter-UAV separation showing predictable-risk reduction through planning and residual-risk reduction through feedback.','Two representative mechanisms complement the population results above. Top: planning changes the assignment to remove nominal conflicts, reducing the selected pair’s time below the hard-risk threshold from 0.81 to 0.00 s. Bottom: feedback reduces a residual encounter from 1.02 to 0.59 s below threshold despite zero predicted conflicts. These pair-specific times are in seconds; aggregate exposure is measured in pair-seconds.')}
<p>Feedback reduced residual exposure but did not eliminate every threshold crossing in the Residual and Mixed families. These experiments support complementary risk-mitigation roles within the tested domain, rather than a formal collision-avoidance guarantee.</p>

<h3>3. Bounded motion-style authority</h3>
<p>All <strong>60 registered authority checks</strong> passed with zero unauthorized overrides. Feasible explicit timing and the hard-risk threshold remained protected, while automatic timing and designated tracking parameters could vary with motion style.</p>
${figure('motion-style-results.png','Paired motion-style effects relative to Smooth: greater effort and acceleration, lower tracking RMSE, near-zero rise-time effects, and nonmonotonic settling-time effects.','Motion style changes tracking behavior while initial state, targets, explicit duration, and nominal reference remain fixed. Across 15 matched scenario–seed triplets, Normal and Aggressive profiles produce stronger control action and lower mean tracking RMSE relative to Smooth. Markers show mean paired differences; error bars are two-sided 95% Student-t confidence intervals.')}
<p>Stronger control action improved mean tracking RMSE, but settling time was nonmonotonic. “Aggressive” does not imply universally faster arrival.</p>

<h3>4. End-to-end mission execution</h3>
<p>A <strong>separate campaign of 60 prospectively feasible attempts</strong> covered simple, under-specified, and compositional missions at 8, 12, and 16 UAVs.</p>
<ul><li><strong>60/60</strong> attempts met the end-to-end completion criterion.</li><li><strong>0.085 m</strong> overall mean tracking RMSE.</li><li><strong>Minimum separation above 1.5 m</strong> in every successful execution of this campaign.</li></ul>
<p>This campaign is distinct from the 60 state-shift units and the 60 authority checks. Its separation results should not be generalized to the deliberately challenging risk-decomposition experiments.</p></section>

<section id="limitations"><h2>Scope & What I Learned</h2>
<p>The work was evaluated in simulation; hardware experiments, richer dynamic missions, formally certified safety, and transfer to other multi-robot systems remain future work. Assignment uses local pairwise refinement and does not establish global optimality.</p>
<p>The project taught me to examine information dependencies between task interpretation and physical execution. My interest in learned manipulation now builds on that experience, but LATE-Swarm itself is a language-guided swarm-control framework, not a vision-language-action manipulation policy.</p></section>

<section id="resources"><h2>Paper & Reproducibility</h2><ul>
<li><a href="../../files/late-swarm.pdf">Manuscript PDF</a> — submitted to ICRA 2027, under review.</li>
<li><a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance">Repository and current documentation</a>.</li>
<li><a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance/tree/late-swarm-core-v1.0">Frozen core implementation</a> / <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance/tree/late-swarm-paper-repro-v1.0">paper reproduction</a> / <a href="https://github.com/yihuanghuan/LLM-UAVswarm-performance/tree/late-swarm-paper-results-v1.0">processed results</a>.</li></ul>
<p>The repository documents dataset release status separately; the currently reserved Zenodo DOI is not presented here as a published dataset.</p></section>
</article>`;
}
