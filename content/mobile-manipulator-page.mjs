import { courseNav, figure, sectionLinks, relatedCourses, courseMetadata } from './course-projects.mjs';
const slug = 'mobile-manipulator';
const fig = (file, alt, caption, cls) => figure(slug, file, alt, caption, cls);
export function mobileManipulatorBody(project) {
 return `${courseNav()}<article class="project-detail course-detail">
<header><h1>${project.title}</h1>
${courseMetadata(project)}
<p>I implemented the character-writing programs and contributed visual corner detection and line-following PID tuning for a team-built robot.</p>
${sectionLinks([['demo','Demo'],['results','Results'],['implementation','Implementation']])}</header>
<section id="demo"><h2>From a color observation to a written character</h2>
<p>Our robot followed a marked route, collected three colored blocks, delivered them to matching stations, and wrote a character selected by the final block’s color. I connected that saved task state to calibrated arm-motion sequences for “二” (two horizontal strokes), “十” (a cross), and “T”.</p>
<div class="course-figure-pair">${fig('robot-platform.jpeg','The team-built mobile robot with an articulated arm and gripper.','The mobile manipulation platform: OpenMV vision, Arduino control, a wheeled base, and an articulated arm.')}${fig('writing-result.jpeg','The arm holds a marker at the writing surface with a completed character visible.','Physical writing test with the programmed character visible above the tool.','course-portrait')}</div>
</section>
<section id="implementation"><h2>Two decisions that connected perception to motion</h2>
<h3>Recognize the route through its line geometry</h3>
<p>The controller used corner counts to identify delivery stations. I helped move corner recognition from obstacle-distance cues to the geometry of the visible line, refining slope conditions and tuning line-following PID control. A time guard distinguished a new corner from repeated observations of the same event.</p>
${fig('robot-course.jpg','The physical robot beside a colored-block station on the black-line course.','Line geometry supplied the route events used to navigate between task stations.','course-portrait')}
<h3>Separate character selection from calibrated execution</h3>
<p>The last block color selected a writing routine after three delivery cycles. At the writing surface, the base established its stopping distance before the arm executed the selected sequence. This kept task selection, character geometry, and actuator calibration as distinct implementation steps.</p>
<p>I used the kinematics tools to relate Cartesian points to arm configurations, then implemented stored joint-angle sequences with transition states between strokes. Joint reference offsets and direction-dependent servo corrections translated those configurations into commands for the physical arm.</p>
${fig('kinematic-sketch-en.png','Coordinate frames along the arm and at its writing tool.','Arm and tool coordinate frames used to connect writing geometry with joint motion.','figure-medium')}
</section>
<section id="results"><h2>Working task logic and physical writing</h2>
<ul><li><strong>Three writing routines</strong> connect the robot’s saved color state to the selected character.</li><li><strong>Visual corner recognition</strong> links route geometry to station selection.</li><li><strong>Calibrated arm and base commands</strong> bring the selected writing sequence onto the team’s physical platform.</li></ul>
${fig('course-layout-en.png','The assignment map with start, pickup, color delivery, and writing stations.','The complete team task: collect at B, deliver to color-matched stations, and return to the writing area.')}
<p>This project gave me an early way to reason across perception, task state, and manipulation: select a task-relevant cue, preserve its meaning through the controller, and map it to a concrete physical action.</p>
</section></article>${relatedCourses(slug)}`;
}
