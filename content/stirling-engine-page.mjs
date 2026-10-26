import { courseNav, figure, sectionLinks, relatedCourses } from './course-projects.mjs';
const slug = 'stirling-engine';
const fig = (file, alt, caption, cls) => figure(slug, file, alt, caption, cls);
export function stirlingEngineBody() {
 return `${courseNav()}<article class="project-detail course-detail">
<header><h1>Model-Guided Design<br>of a Running Stirling Engine</h1>
<p>Engineering Design · Chongqing University<br>Team course project · β-type Stirling engine with a rhombic drive</p>
<p>I developed the thermodynamic model and ADAMS–Simulink co-simulation, connecting calculated cycle behavior to the team’s prototype iterations.</p>
${sectionLinks([['demo','Experiment'],['implementation','Model & design'],['results','Results']])}</header>
<section id="demo"><h2>A working thermal–mechanical prototype</h2>
<figure class="research-figure figure-medium"><video controls playsinline preload="none" poster="../../assets/course/stirling-engine/experiment-poster.jpg" aria-label="Running experiment of the revised Stirling engine"><source src="../../assets/course/stirling-engine/experiment.mp4" type="video/mp4">Your browser does not support embedded video.</video><figcaption>Original-speed, 34-second test of the horizontal prototype with circulating cooling. The team estimated approximately 540 rpm from slow-motion video.</figcaption></figure>
${fig('revised-prototype.jpg','Revised engine with a flywheel, paired gears, and cooling connections.','The revised prototype combines a rhombic drive, flywheel, and water-cooling system.','figure-medium')}
<p>Startup testing guided improvements to sealing, gear engagement, shaft support, and flywheel inertia. My modeling work examined how thermal conditions and gas volume could support that mechanical design.</p></section>
<section id="implementation"><h2>Connect the gas cycle to the mechanism</h2>
<p>The cycle model related piston phase and chamber volume to gas pressure. In the coupled simulation, ADAMS returned the flywheel angle; a Simulink S-Function used that state to update the pressure-derived force and torque applied to the mechanism.</p>
${fig('cosimulation-en.png','Simulink force-and-torque calculation coupled to an ADAMS model with angle feedback.','Angle feedback closes the loop between mechanical motion, chamber volumes, and pressure-derived loads.','figure-medium')}
<p>I reconciled the tools’ units at this interface and examined startup separately from settled operation. Co-simulated rotation settled around <strong>550 rpm</strong>, providing a reference for interpreting the working prototype.</p>
<h3>Use the model to compare concrete design changes</h3>
<p>I evaluated cold-side cooling and reduced inactive gas volume separately. Lowering the cold-side temperature sustained a larger temperature difference; reducing dead volume increased the fraction of gas volume contributing to the working cycle. Each comparison kept the baseline explicit so its effect could guide a specific design choice.</p>
<div class="course-figure-pair">${fig('revised-cad.jpg','CAD view of the revised rhombic-drive layout and flywheel.','Revised mechanical layout developed by the team.')}${fig('vertical-prototype-en.png','A later vertical engine prototype on the workbench.','A later vertical layout addressed piston side loading.','course-portrait')}</div>
</section>
<section id="results"><h2>Calculated cycle gains and physical operation</h2>
${fig('model-comparison.png','Calculated cycle work: baseline 0.1438 J, colder cold side 0.2325 J, reduced dead volume 0.2056 J.','Calculated indicated work per cycle. Relative to the 0.1438 J baseline, colder cold-side conditions give +61.7% and reduced dead volume gives +43.0%, evaluated as separate modifications. <a href="../../assets/course/stirling-engine/model-comparison.csv">Plot data</a>.')}
<div class="course-figure-pair">${fig('cooling-pv-en.png','Pressure-volume curves for baseline and colder cold-side conditions.','Cooling comparison: pressure–volume cycle from the thermodynamic model.')}${fig('dead-volume-pv-en.png','Pressure-volume curves for baseline and reduced dead volume.','Dead-volume comparison: a separate model study against the same baseline.')}</div>
<p>The model studies gave the thermal changes a clear direction, while the <strong>approximately 540 rpm video-estimated prototype speed</strong> demonstrated the assembled system in operation. Connecting those results to fits, inertia, and cooling made the model useful to the team’s design process.</p>
</section></article>${relatedCourses(slug)}`;
}
