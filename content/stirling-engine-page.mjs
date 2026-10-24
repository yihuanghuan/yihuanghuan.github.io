import { courseNav, figure, sectionLinks, relatedCourses } from './course-projects.mjs';
const slug = 'stirling-engine';
const fig = (file, alt, caption, cls) => figure(slug, file, alt, caption, cls);

export function stirlingEngineBody() {
  return `${courseNav()}
<article class="project-detail course-detail">
<header><h1>When the Model Predicts Motion,<br>but the Engine Will Not Run</h1>
<p>Engineering Design · Chongqing University<br>Team course project · β-type Stirling engine with a rhombic drive</p>
<p>My focus: thermodynamic modeling and ADAMS–Simulink co-simulation, connected to the team's prototype iterations.</p>
${sectionLinks()}</header>

<section id="background"><h2>From a thermodynamic cycle to a physical mechanism</h2>
<p>A Stirling engine converts a temperature difference into mechanical motion through a sealed working gas. Our course project used a β-type configuration and a rhombic drive to coordinate the pistons. The first prototype assembled into the intended mechanism, yet failed to sustain rotation.</p>
<div class="course-figure-pair">${fig('first-prototype.jpg', 'The first assembled engine with its flywheel and paired gears on a wooden base.', 'First prototype: the mechanism assembled, but did not sustain running.')}${fig('revised-prototype.jpg', 'The revised physical engine with a larger flywheel, paired gears, and cooling connections.', 'Revised prototype: changes addressed the drive, support structure, and thermal conditions.')}</div>
</section>

<section id="question"><h2>Core question: what makes a modeled cycle physically sustainable?</h2>
<p>The design problem was a coupled one. The gas cycle had to provide useful work, the transmission had to carry it through the full cycle, and the thermal system had to maintain the temperature difference. I used modeling to examine these relationships and to interpret the mismatch between predicted motion and the first physical result.</p>
</section>

<section id="reasoning"><h2>Reasoning: trace the losses and question the assumptions</h2>
<p>The failed run made manufacturing details central to the analysis. The team found leakage at piston-cylinder fits, limited shaft and support precision, gear slipping, and insufficient flywheel inertia. A favorable pressure-volume cycle alone could not resolve those problems. The design needed a credible mechanical path from gas pressure to rotation.</p>
<p>I also examined the thermal assumptions. As heat conducted through the structure, the cold side warmed, reducing the available temperature difference. Cooling the cold side and reducing inactive gas volume became two model-guided design changes. Their value could be compared in the calculation before interpreting what the complete prototype actually achieved.</p>
<table class="result-table"><caption>How observations changed the design questions</caption><thead><tr><th scope="col">Observation</th><th scope="col">Question and response</th></tr></thead><tbody>
<tr><th scope="row">Slipping and binding in the first drive</th><td>How sensitive is the mechanism to alignment and compliance? Revisit gear size, shaft support, fits, and flywheel design.</td></tr>
<tr><th scope="row">The cold side warms during heating</th><td>Can the temperature difference be maintained? Add a water jacket and circulating cooling.</td></tr>
<tr><th scope="row">Large inactive gas volume</th><td>How much gas volume contributes little to the stroke? Compare a shorter-cylinder configuration in the cycle model.</td></tr>
</tbody></table>
</section>

<section id="approach"><h2>Approach: connect thermodynamics, dynamics, and iteration</h2>
<p>I developed the thermodynamic model and ADAMS–Simulink co-simulation. The cycle model related piston phase and gas volume to pressure. In the coupled simulation, the mechanical system returned the flywheel angle; an S-Function used that state to update the force and torque applied to the mechanism.</p>
${fig('cosimulation.jpg', 'Simulink diagram coupling a force-and-torque calculation with an ADAMS mechanical model and returning angle feedback.', 'Co-simulation loop: pressure-derived force and torque drive the mechanical model, whose angle feeds the next calculation.','figure-medium')}
<p>The team revised the prototype's gears, flywheel, support parts, and cooling system. A later vertical layout addressed an additional concern about piston side loading. These iterations linked the model to fabrication constraints. The revised mechanical design and later vertical prototype are shown below.</p>
<div class="course-figure-pair">${fig('revised-cad.jpg', 'CAD view of the revised rhombic-drive engine and its flywheel.', 'Revised mechanical layout with a rhombic drive and flywheel.')}${fig('vertical-prototype.jpg', 'The later vertical engine prototype photographed on a workbench.', 'Later vertical prototype. The running experiment below uses the horizontal configuration.','course-portrait')}</div>
</section>

<section id="results"><h2>Validation: compare model outcomes with a real running prototype</h2>
${fig('model-comparison.png', 'Calculated work per cycle of 0.1438 joules for baseline, 0.2325 for colder cold side, and 0.2056 for reduced dead volume.', 'Calculated indicated work per cycle: 0.1438 J at baseline, 0.2325 J with a colder cold side, and 0.2056 J with reduced dead volume. Each modification is compared separately with the baseline; these values describe gas-cycle work rather than measured shaft output. <a href="../../assets/course/stirling-engine/model-comparison.csv">Plot data</a>.')}
<div class="course-figure-pair">${fig('cooling-pv.jpg', 'Pressure-volume model curves comparing the baseline with improved cooling.', 'Pressure–volume cycles for the baseline and colder cold-side case.')}${fig('dead-volume-pv.jpg', 'Pressure-volume model curves comparing the baseline with reduced dead volume.', 'Pressure–volume cycles for the baseline and reduced dead-volume case.')}</div>
<p>Co-simulated rotation settled around 550 rpm. The physical prototype reached approximately 540 rpm, estimated by counting rotations in slow-motion video. The similar speeds suggest a useful modeling reference, while the different assumptions and measurement methods limit a direct accuracy claim.</p>
<figure class="research-figure figure-medium" id="demo"><video controls playsinline preload="none" poster="../../assets/course/stirling-engine/experiment-poster.jpg" aria-label="Original-speed running experiment of the revised Stirling engine"><source src="../../assets/course/stirling-engine/experiment.mp4" type="video/mp4">Your browser does not support embedded video. <a href="../../assets/course/stirling-engine/experiment.mp4">Download the experiment video</a>.</video><figcaption>Original-speed physical experiment, approximately 34 seconds. The recording shows the heated engine rotating with its cooling system in place; audio is omitted.</figcaption></figure>
<p class="table-note">The prototype sustains rotation in this demonstration. Shaft power and long-duration endurance were not measured.</p>
</section>

<section id="takeaways"><h2>Takeaways</h2>
<p>I learned to use a model as a way to expose assumptions and guide the next engineering decision. The strongest progress came from connecting gas-cycle calculations to tolerances, friction, inertia, and thermal management. The experience also made me more careful about what each form of evidence can establish: calculated cycle work, simulated motion, and physical operation answer different questions.</p>
<p class="table-note">My contributions focused on thermodynamic modeling and co-simulation. Fabrication and prototype iterations were team work.</p>
</section></article>${relatedCourses(slug)}`;
}
