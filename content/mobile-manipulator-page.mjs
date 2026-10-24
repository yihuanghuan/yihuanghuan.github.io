import { courseNav, figure, sectionLinks, relatedCourses } from './course-projects.mjs';
const slug = 'mobile-manipulator';
const fig = (file, alt, caption, cls) => figure(slug, file, alt, caption, cls);

export function mobileManipulatorBody() {
  return `${courseNav()}
<article class="project-detail course-detail">
<header><h1>From Visual Task State<br>to Robot Writing</h1>
<p>Robotics Fundamentals · Chongqing University<br>Team course project · Sep 2024–Jan 2025</p>
<p>My contributions: character-writing programs, visual corner detection, and line-following PID tuning.</p>
${sectionLinks()}</header>

<section id="background"><h2>A task that connects mobility and manipulation</h2>
<p>The robot had to follow a marked route, collect three colored blocks, deliver each to its matching station, and then write a character determined by the last block. The same visual observation therefore mattered at two scales: selecting a destination for the mobile base and selecting a motion sequence for the arm.</p>
${fig('course-layout-en.png', 'Course map with a starting point, pickup station, three colored delivery stations, and a writing area.', 'Task layout: start at A, collect blocks at B, deliver them to the color-matched stations, and return to the writing area.')}
<div class="course-figure-pair">
${fig('robot-platform.jpeg', 'Side view of the mobile robot, its four-wheel base, articulated arm, and gripper.', 'The team-built mobile manipulation platform used for navigation, block handling, and writing.')}
${fig('robot-course.jpg', 'The physical robot on the black-line course beside the colored blocks and a delivery station.', 'Physical course setup with a colored-block station. The route geometry provides the visual cues for navigation.', 'course-portrait')}
</div>
</section>

<section id="question"><h2>Core question: when should perception trigger an action?</h2>
<p>Successful execution required consistent transitions between navigation, pickup, delivery, and writing. A mistaken corner count could send the robot to the wrong station; a mismatched color state could trigger the wrong character. I approached the problem as <strong>turning visual events into a coherent sequence of physical actions</strong>, with each transition tied to a recognizable task condition.</p>
</section>

<section id="reasoning"><h2>Reasoning: choose cues that describe the task</h2>
<h3>Recognize the route event, then change the motion mode</h3>
<p>Our early corner detector used ultrasonic distance to nearby obstacles. False detections prompted a change in the question: what observation actually identifies a turn in the marked route? I helped move corner recognition toward the geometry of the visible line, refining slope-based conditions and tuning the accompanying line-following control. Ultrasonic distance still had a separate use: establishing the stopping distance at the writing surface.</p>
<p>The distinction mattered because the controller used corner counts to identify delivery stations. One false event could therefore change the rest of the route, even if the wheels tracked the line well afterward. I worked on the slope calculation and recognition conditions; the detector also used a time guard to avoid counting the same corner repeatedly. This separated recognizing a new event from continuously correcting the robot's motion.</p>
<h3>Separate the requested character from the actuator commands</h3>
<p>The writing task needed a similar separation. Color selected a character, while geometry determined how to draw it. I represented characters as planned waypoints and translated those positions into joint commands. This made task selection, path design, and physical calibration separate parts of the debugging process.</p>
<p>I treated a wrong character and a distorted stroke as different failures. The first directs attention to the saved color and the selected routine; the second directs attention to the waypoint sequence, arm configuration, and servo conversion. That distinction provided a practical way to debug the perception-to-action interface without changing every part of the system at once.</p>
<ol class="course-process"><li><strong>Recognize a task event</strong><span>Follow the line, detect a corner, or identify a block color.</span></li><li><strong>Update the task state</strong><span>Choose a delivery station or select the final character.</span></li><li><strong>Execute a motion sequence</strong><span>Send coordinated base and arm commands through the controller interface.</span></li></ol>
</section>

<section id="approach"><h2>Approach: connect character geometry to calibrated motion</h2>
<p>The team used OpenMV for visual processing and an Arduino controller for wheel and servo commands. Within that system, I implemented the writing routines and contributed to visual corner detection and PID tuning. The arm code separates the command that selects a character from the joint-angle sequence that draws it.</p>
<p>The task sequence retained the identified block color through delivery. After three delivery cycles, the last color selected the writing routine. At the writing surface, the base first established its stopping distance; only then did the arm execute the character. The base position thus became part of the writing setup, rather than something the arm could ignore.</p>
${fig('kinematic-sketch-en.png', 'Coordinate frames along the arm and at the writing tool.', 'Coordinate frames for relating the arm configuration to the writing-tool pose.', 'figure-medium')}
<p>The kinematics tools convert Cartesian points into arm configurations and support interpolation along lines. The embedded routines store calibrated joint-angle sequences for “二” (two horizontal strokes), “十” (a cross), and “T”, including transition states between strokes. Offsets and direction-dependent servo corrections connect the geometric representation to the actual actuators.</p>
<p>This conversion was important: a geometric joint angle and a servo command are different quantities. Joint reference offsets and direction-dependent corrections had to be applied before execution. Keeping that calibration layer separate allowed me to reason about character geometry while adjusting how the physical arm realized it.</p>
${fig('writing-sequences.png', 'Three plots of stored wrist angles across the executed waypoints for the two-stroke, T, and cross writing programs.', 'The writing routines use 11, 11, and 13 stored configurations. Orange points identify repeated 30° wrist states. The plots show programmed angles before servo conversion, not measured pen trajectories. <a href="../../assets/course/mobile-manipulator/writing-sequences.csv">Plot data</a>.')}
<h3>My design contribution</h3>
<p>I connected character-path design, joint-space execution, and visual task selection within the team's robot. The corner-detection work followed the same principle: choose a representation tied to the event the controller needs to recognize. The resulting design made errors easier to localize across perception, task logic, and actuation.</p>
<p>Stored motion sequences were practical for a fixed writing surface and a small character set. Their limitation is sensitivity to changes in the base-to-wall pose and pen contact. That tradeoff points to a clear next step: add tool-position or contact feedback before attempting more varied surfaces and characters.</p>
</section>

<section id="results"><h2>Validation: working task logic and its remaining limits</h2>
<p>Physical testing covered navigation, color-based delivery, and character writing. The controller implements distinct routines for all three characters and executes the selected routine when the command mode changes. The writing test below shows the arm and marker operating at the writing surface.</p>
${fig('writing-result.jpeg', 'The mobile manipulator holds a marker against the writing surface, with a completed character visible above the tool.', 'Physical writing test: the arm holds a marker at the writing surface, with the resulting character visible above it.', 'course-portrait')}
<table class="result-table"><caption>Task-level validation</caption><thead><tr><th scope="col">Part of the task</th><th scope="col">Implementation and observations</th></tr></thead><tbody>
<tr><th scope="row">Character-conditioned writing</th><td>Three encoded writing routines, selected through the robot command interface.</td></tr>
<tr><th scope="row">Corner recognition</th><td>Replaced the obstacle-distance cue with visual line geometry, then tuned the detector and PID control.</td></tr>
<tr><th scope="row">Physical execution</th><td>Task testing revealed remaining grasp-placement offsets and lighting-sensitive corner errors.</td></tr>
</tbody></table>
<p>The tests also showed why subsystem performance and complete-task reliability need separate attention. Lighting affected the event detector; placement offsets affected handling; arm calibration affected the visible stroke. Those observations helped identify where another iteration should act, rather than treating every unsuccessful run as a single control problem.</p>
<p class="table-note">The writing implementation uses stored joint configurations and timing. It does not provide visual feedback of the pen tip or an independently measured writing-accuracy benchmark.</p>
</section>

<section id="takeaways"><h2>Takeaways</h2>
<p>This project taught me to inspect the interfaces between perception, task state, and motion. A useful representation makes the cause of an error easier to locate: the visual cue, the selected action, the planned path, or the calibrated actuator command. It was an early step toward my interest in manipulation systems that connect task intent with reliable physical execution.</p>
<p class="table-note">The mobile platform, grasp-and-deliver behavior, and task integration were team work. My contributions centered on writing, part of the corner detector, and line-following tuning.</p>
</section></article>${relatedCourses(slug)}`;
}
