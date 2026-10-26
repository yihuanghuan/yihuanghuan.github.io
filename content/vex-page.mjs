const asset = '../../assets/vex/';
const figure = (file, alt, caption, cls='') => `<figure class="research-figure ${cls}"><a href="${asset}${file}"><img src="${asset}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;

export function vexBody() {
 return `<nav class="back-link"><a href="../../#competitions">← Back to competitions & leadership</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail vex-detail">
<header><h1>VEX Robotics:<br>From the Practice Field to Worlds</h1>
<p>Chongqing University · 2024–2025 High Stakes season<br>Deputy Lead, Control Systems Group</p>
<p><a href="#season">The season</a> &nbsp;/&nbsp; <a href="#ring-sorting">Engineering</a> &nbsp;/&nbsp; <a href="#demo">Demo & results</a> &nbsp;/&nbsp; <a href="#leadership">Teamwork & mentoring</a> &nbsp;/&nbsp; <a href="#community">Community & Worlds</a></p></header>
<p class="project-abstract">At Chongqing University, I designed and programmed an inertia-based ring sorter that completed eight official matches without a sorting failure. As deputy control-group lead, I mentored five new members and joined CQU2 at the 2025 VEX Worlds, reaching the Technology Division quarter-finals.</p>

<section id="season"><h2>The competition: High Stakes</h2>
<p>VEX Robotics brings together teams that design, build, and program robots for a new game each year. I competed in its university division, VEX U, with Chongqing University during the <strong>2024–2025 High Stakes season</strong>.</p>
<p>High Stakes combines ring collection and scoring with mobile-goal placement and climbing. These tasks shaped our work on automatic sorting, chassis motion, and match strategy.</p>
<div class="vex-season-grid">
${figure('official-high-stakes-field.jpg','Official High Stakes game-field overview showing colored rings, mobile goals, stakes, and the central ladder.','The High Stakes field and its scoring elements. Official game overview, adapted from <a href="https://content.vexrobotics.com/docs/2024-2025/v5rc-high-stakes/V5RC-HighStakes-4.0.pdf#page=19">VEX Robotics’ game manual, Fig. FO-1</a>; VEX U uses its own match rules.')}
<figure class="research-figure vex-game-pieces"><div class="vex-ring-pair"><img src="${asset}official-red-ring.png" alt="Official red High Stakes ring." loading="lazy"><img src="${asset}official-blue-ring.png" alt="Official blue High Stakes ring." loading="lazy"></div><img class="vex-mobile-goal" src="${asset}official-mobile-goal.png" alt="Official High Stakes mobile goal, with a yellow base and upright stake." loading="lazy"><figcaption>Rings and a mobile goal. Illustrations © VEX Robotics, from the <a href="https://api.vex.com/vr/home/playgrounds/v5rc_high_stakes.html">official High Stakes guide</a>.</figcaption></figure>
</div>
</section>

<section id="ring-sorting"><h2>1. Make ring sorting tolerant to timing errors</h2>
<div class="vex-practice-grid"><div>
<p>The intake collected both red and blue rings, so unwanted colors had to be removed automatically. Handling every rejection manually would add to the driver’s workload during a match.</p>
<p>Our early design detected color and triggered a pneumatic pusher as the ring passed the rejection point. Testing showed variation between detection and the actuator’s effective response, making the outcome too dependent on timing.</p>
<p>I looked for a rejection action that would work across a wider range of ring positions, giving the controller more timing tolerance.</p>
<p><strong>My change:</strong> use the conveyor’s motion to eject the ring. After identifying an unwanted color, the mechanism advances into the rejection region, brakes, and reverses. The ring’s inertia carries it outward as the conveyor changes motion. This reduces dependence on the precise timing of a separate pusher.</p>
</div>${figure('practice.jpg','Testing a VEX robot on a practice field with rings and mobile goals.','Practice-field work on the intake, conveyor, and drive system.')}</div>
<ol class="vex-sorting-sequence" aria-label="Revised ring-rejection sequence">
<li><strong>Detect</strong><span>Identify an unwanted ring.</span></li>
<li><strong>Advance</strong><span>Move into the rejection region.</span></li>
<li><strong>Brake & reverse</strong><span>Use inertia to carry the ring outward.</span></li>
<li><strong>Resume</strong><span>Return to normal intake.</span></li>
</ol>
<p>I analyzed the timing problem, proposed the revised mechanism, and wrote its control program. A teammate led reliability testing and kept the statistics. <strong>The revised sorter completed eight official matches without a sorting failure.</strong></p>
</section>

<section id="motion"><h2>2. Faster motion needs reliable localization</h2>
<p>Reducing chassis weight helped us pursue faster movement, but hard braking introduced pitching and sliding. A tracking wheel could lose contact with the floor, so its rotation no longer represented the robot’s actual displacement. The resulting odometry error then affected autonomous positioning.</p>
<p>I worked on motion control with this physical constraint in mind. I explored a position–velocity cascade in MATLAB: the outer position loop produces a velocity demand, and the inner loop controls how the robot follows it. In the robot programs, drive-output limits also varied with the motion segment and remaining distance, with lower output near the endpoint.</p>
<p>This connected the control choices to the whole task: acceleration and braking had to preserve chassis stability and useful odometry while still moving efficiently. My <a href="../../files/vex-motion-control-notes.pdf">motion-control notes</a> include the cascaded-control study and simulation figures.</p>
${figure('field-side.jpg','Teams and their robots beside a VEX competition field, with the match displayed overhead.','Field-side preparation: control routines had to fit the robot, the driver’s workflow, and the match strategy.','figure-medium')}
</section>

<section id="demo"><h2>On the competition field</h2>
<figure class="research-figure figure-medium"><h3>2025 VEX Worlds · Technology Division</h3>
<video controls playsinline preload="none" poster="${asset}worlds-match-poster.jpg" aria-label="2025 VEX Worlds qualification match featuring CQU2"><source src="${asset}worlds-match.mp4" type="video/mp4">Your browser does not support embedded video. <a href="${asset}worlds-match.mp4">Download recording</a>.</video>
<figcaption>Qualification-match footage from the Technology Division at the 2025 VEX Robotics World Championship. CQU2 is on the blue alliance. The supplied recording is shown at its original playback speed.</figcaption></figure>
<ul class="plain-list vex-results">
<li><strong>2025 VEX Worlds · CQU2</strong><br>Technology Division quarter-finalist — top eight in the division.</li>
<li><strong>2024–2025 national elite competition / China Worlds qualifier · CQU1</strong><br>Second Prize · <a href="../../files/vex-cqu1-second-prize.pdf">Team certificate</a></li>
</ul>
</section>

<section id="leadership"><h2>3. Learning and building as a team</h2>
<p>As deputy lead of the control systems group, I mentored <strong>five new members</strong> in C++ programming and PID control. I also co-led competition-strategy discussions, analyzing opponents and refining autonomous routines with the team.</p>
<h3>Making PID tuning something a teammate could see</h3>
<p>When a new control-group member needed help tuning PID, I connected each parameter to the robot’s response, shared a tuning memory aid, and worked through the adjustments with her on the robot built by our mechanical teammates. Hands-on tuning made the link between a parameter change and physical motion visible.</p>
<h3>Giving competing designs room to be tested</h3>
<p>Mechanical design sometimes led to disagreement within the team. When two members favored different structures, we would bring the question to a short whole-team discussion. Each person explained the idea and its reasoning, and the team considered the alternatives together.</p>
<p>When resources allowed, both members could build their proposed approaches so we could compare the results. This gave us a practical way to move a disagreement toward an engineering decision. I valued a team culture in which an idea could be heard, questioned, and tested.</p>
</section>

<section id="community"><h2>4. A wider robotics community at Worlds</h2>
<h3>Five days of joint practice in Xi’an</h3>
<p>Before Worlds, during the May Day holiday, we travelled to Xi’an for <strong>five days of joint practice with the Xi’an Jiaotong University team</strong>. Both universities were preparing to compete at the same world championship, and we still chose to train together, exchange experience, and help each other improve.</p>
<h3>Meeting the wider community at Worlds</h3>
<p>Joining VEX Worlds in Dallas brought our practice-field work into a setting with teams from different countries. I remember both the variety of robots and the enthusiasm of the people behind them. A shared game gave us a concrete way to encounter different engineering approaches: everyone was working with the same task, but the solutions could look very different.</p>
<div class="vex-gallery">
<div class="vex-gallery-track" id="vex-worlds-track" tabindex="0" role="region" aria-label="Photographs from VEX Worlds; scroll horizontally to browse">
${figure('worlds-team.jpg','Chongqing University VEX team with their robots at the World Championship venue.','With the Chongqing University team and our robots at VEX Worlds.')}
${figure('worlds-international.jpg','Robotics teams together with their robots and national flags at Worlds.','Meeting other teams and sharing the experience of taking our robots to Worlds.')}
${figure('worlds-exchange.jpg','Teams together with their robots at the VEX World Championship.','Different teams, different designs, and a shared interest in building robots.')}
${figure('worlds-venue.jpg','The VEX Robotics World Championship venue and event display.','The Worlds venue: a shared setting for teams from around the world.')}
</div>
<p class="table-note">Drag the scrollbar below the photographs, swipe, or use the arrow keys to browse. Select a photograph to open the full image.</p>
</div>
<h3>Learning from a different way to climb</h3>
<p>One idea from another team stayed with me: using one robot to lift another for the climbing task. It prompted me to look again at what a task actually required before settling on a familiar mechanism. That way of questioning an assumed solution also connects to my own ring-sorting work.</p>
<p>Worlds gave me a wider community in which to compare designs, share experience, and learn alongside people with the same enthusiasm for building robots.</p>
</section>

<section id="resources"><h2>Supporting material</h2>
<p><a href="../../files/vex-motion-control-notes.pdf">Selected motion-control notes (Chinese)</a> &nbsp;/&nbsp; <a href="../../files/vex-cqu1-second-prize.pdf">CQU1 Second Prize certificate</a> &nbsp;/&nbsp; <a href="#demo">CQU2 Worlds recording</a></p>
</section></article>`;
}
