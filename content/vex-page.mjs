const asset = '../../assets/vex/';
const figure = (file, alt, caption, cls='') => `<figure class="research-figure ${cls}"><a href="${asset}${file}"><img src="${asset}${file}" alt="${alt}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;

export function vexBody() {
 return `<nav class="back-link"><a href="../../#competitions">← Back to competitions & leadership</a> &nbsp;/&nbsp; <a href="../../files/yihuan-huang-cv.pdf">CV</a></nav>
<article class="project-detail vex-detail">
<header><h1>VEX Robotics:<br>From the Practice Field to Worlds</h1>
<p>Chongqing University · 2024–2025 High Stakes season<br>Deputy Lead, Control Systems Group</p>
<p><a href="#season">The season</a> &nbsp;/&nbsp; <a href="#ring-sorting">Engineering</a> &nbsp;/&nbsp; <a href="#demo">Competition footage</a> &nbsp;/&nbsp; <a href="#leadership">Teamwork & mentoring</a> &nbsp;/&nbsp; <a href="#community">Community & Worlds</a></p></header>
<p class="project-abstract">VEX gave me a place to turn code into physical behavior, and a team with whom to work through the consequences. Across the 2024–2025 High Stakes season, I helped develop ring sorting and chassis control, mentored new members, and joined the Chongqing University team at VEX Worlds. The experience connected my earliest interest in robotics with learning, building, and competing alongside others.</p>
<p>My main engineering contribution was to rethink an unreliable sorting action. Instead of relying on tightly timed pneumatic ejection, I designed and programmed a conveyor-motion sequence that made use of the ring’s inertia.</p>

<section id="season"><h2>The competition: High Stakes</h2>
<p>VEX Robotics brings together teams that design, build, and program robots for a new game each year. I competed in its university division, VEX U, with Chongqing University during the <strong>2024–2025 High Stakes season</strong>.</p>
<p>In High Stakes, robots collect red and blue rings and score them on stakes. Moving mobile goals and climbing the central ladder add further strategic choices. Autonomous routines and driver-controlled play bring mechanical design, sensing, and control together on the same field.</p>
<div class="vex-season-grid">
${figure('official-high-stakes-field.jpg','Official High Stakes game-field overview showing colored rings, mobile goals, stakes, and the central ladder.','The High Stakes field and its scoring elements. Official game overview, adapted from <a href="https://content.vexrobotics.com/docs/2024-2025/v5rc-high-stakes/V5RC-HighStakes-4.0.pdf#page=19">VEX Robotics’ game manual, Fig. FO-1</a>; VEX U uses its own match rules.')}
<figure class="research-figure vex-game-pieces"><div class="vex-ring-pair"><img src="${asset}official-red-ring.png" alt="Official red High Stakes ring." loading="lazy"><img src="${asset}official-blue-ring.png" alt="Official blue High Stakes ring." loading="lazy"></div><img class="vex-mobile-goal" src="${asset}official-mobile-goal.png" alt="Official High Stakes mobile goal, with a yellow base and upright stake." loading="lazy"><figcaption>Rings and a mobile goal. Illustrations © VEX Robotics, from the <a href="https://api.vex.com/vr/home/playgrounds/v5rc_high_stakes.html">official High Stakes guide</a>.</figcaption></figure>
</div>
<p>For our control group, these game tasks became practical engineering questions: how to reject the wrong ring color reliably, and how to move quickly while keeping the robot’s position estimate useful. Those were the two problems I focused on.</p>
</section>

<section id="ring-sorting"><h2>1. Make ring sorting tolerant to timing errors</h2>
<div class="vex-practice-grid"><div>
<p>The intake collected both red and blue rings, so unwanted colors had to be removed automatically. Handling every rejection manually would add to the driver’s workload during a match.</p>
<p>Our early design detected color and triggered a pneumatic pusher as the ring passed the rejection point. Testing showed variation between detection and the actuator’s effective response, making the outcome too dependent on timing.</p>
<p>The useful question became what the mechanism demanded from the controller. If rejection depended on a closely timed encounter between a moving ring and the pusher, changing a delay would still leave that dependency in place. I looked for an action that could work over a wider range of ring positions.</p>
<p><strong>My change:</strong> use the conveyor’s motion to eject the ring. After identifying an unwanted color, the mechanism advances into the rejection region, brakes, and reverses. The ring’s inertia carries it outward as the conveyor changes motion. This reduces dependence on the precise timing of a separate pusher.</p>
</div>${figure('practice.jpg','Testing a VEX robot on a practice field with rings and mobile goals.','Practice-field work on the intake, conveyor, and drive system.')}</div>
<ol class="vex-sorting-sequence" aria-label="Revised ring-rejection sequence">
<li><strong>Detect</strong><span>Identify an unwanted ring.</span></li>
<li><strong>Advance</strong><span>Move into the rejection region.</span></li>
<li><strong>Brake & reverse</strong><span>Use inertia to carry the ring outward.</span></li>
<li><strong>Resume</strong><span>Return to normal intake.</span></li>
</ol>
<p>I analyzed the timing problem, proposed the revised mechanism, and wrote its control program. A teammate led reliability testing and kept the statistics. <strong>The revised sorter completed eight official matches without a sorting failure.</strong></p>
<p>This was an early lesson in designing around physical constraints. Changing the mechanism’s action changed the control problem itself, giving the software more room to accommodate the response variation we observed.</p>
</section>

<section id="motion"><h2>2. Faster motion needs reliable localization</h2>
<p>Reducing chassis weight helped us pursue faster movement, but hard braking introduced pitching and sliding. A tracking wheel could lose contact with the floor, so its rotation no longer represented the robot’s actual displacement. The resulting odometry error then affected autonomous positioning.</p>
<p>I worked on motion control with this physical constraint in mind. I explored a position–velocity cascade in MATLAB: the outer position loop produces a velocity demand, and the inner loop controls how the robot follows it. In the robot programs, drive-output limits also varied with the motion segment and remaining distance, with lower output near the endpoint.</p>
<p>This connected the control choices to the whole task: acceleration and braking had to preserve chassis stability and useful odometry while still moving efficiently. My <a href="../../files/vex-motion-control-notes.pdf">motion-control notes</a> include the cascaded-control study and simulation figures.</p>
<p>I began to see the robot as a chain of dependencies. Mechanical choices changed braking behavior; braking affected sensor contact; sensor contact affected the position estimate used by the next control action. This encouraged me to evaluate a motion routine by how consistently it could finish its task, with sensing and mechanical behavior included in the design.</p>
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
<p>One member of the control group was unsure how to tune PID parameters efficiently. I explained what the proportional, integral, and derivative terms did, then shared a tuning rhyme to make the initial adjustment sequence easier to remember:</p>
<blockquote class="vex-memory"><p>“Start with P; set I and D to zero.<br>Raise P until steady oscillations show.<br>Take sixty percent for P; half a period for integral time;<br>One-eighth for derivative time.”</p></blockquote>
<p>The rhyme was a starting point for explanation. I then worked through the adjustments with her on a real robot built by our mechanical teammates. Watching the robot respond connected the parameter changes to physical behavior, helping her understand the tuning process more quickly.</p>
<h3>Giving competing designs room to be tested</h3>
<p>Mechanical design sometimes led to disagreement within the team. When two members favored different structures, we would bring the question to a short whole-team discussion. Each person explained the idea and its reasoning, and the team considered the alternatives together.</p>
<p>When resources allowed, both members could build their proposed approaches so we could compare the results. This gave us a practical way to move a disagreement toward an engineering decision. I valued a team culture in which an idea could be heard, questioned, and tested.</p>
<p>The sorting work depended on communication across control development, hardware, testing, and driving. My proposal and implementation were one part of that process; teammates’ testing and feedback helped us judge whether the mechanism was ready for competition.</p>
<p>Working toward a common match strategy also required us to connect individual decisions. A sorting routine had to fit the driver’s workload; a drive setting had to fit the next maneuver; an autonomous routine had to fit the team’s plan. I came to appreciate clear communication as part of making the robot work reliably.</p>
</section>

<section id="community"><h2>4. A wider robotics community at Worlds</h2>
<h3>Five days of joint practice in Xi’an</h3>
<p>Before Worlds, during the May Day holiday, we travelled to Xi’an for <strong>five days of joint practice with the Xi’an Jiaotong University team</strong>. Both universities were preparing to compete at the same world championship, and we still chose to train together, exchange experience, and help each other improve.</p>
<p>That preparation is an important part of how I remember the season. The competition gave us a shared goal, while joint practice gave us a chance to learn with people outside our own team. It showed me how competing and sharing knowledge could be part of the same robotics community.</p>
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
<p>For me, Worlds expanded the meaning of participating in robotics. It was a chance to see our work alongside other teams’ work, meet people who shared the same enthusiasm, and recognize how much there was to learn from different designs. Those encounters are part of why I value the community around robotics.</p>
</section>

<section id="resources"><h2>Supporting material</h2>
<p><a href="../../files/vex-motion-control-notes.pdf">Selected motion-control notes (Chinese)</a> &nbsp;/&nbsp; <a href="../../files/vex-cqu1-second-prize.pdf">CQU1 Second Prize certificate</a> &nbsp;/&nbsp; <a href="#demo">CQU2 Worlds recording</a></p>
</section></article>`;
}
