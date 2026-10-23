export const projects = [
  {
    slug: 'end-effector-stabilization',
    number: '01', category: 'STATE ESTIMATION · FEEDBACK CONTROL',
    title: 'Keeping a robotic arm steady on a moving base',
    subtitle: 'Visual-inertial end-effector stabilization under base motion',
    organization: 'WINDY Lab, Westlake University',
    period: 'Jul–Oct 2026', role: 'Visiting Research Student',
    advisor: 'Prof. Shiyu Zhao', status: 'Research project',
    image: 'arm.svg', thumbnail: 'westlake/thumbnail.jpg', thumbnailWidth: 720, thumbnailHeight: 480, imageAlt: 'The physical robotic arm used in the WINDY Lab end-effector stabilization project.',
    summary: 'Correcting the camera mounting model and separating joint-induced motion from external disturbance to stabilize a robotic arm’s end effector.',
    tags: ['Manipulation', 'Visual estimation', 'ROS 2'],
    metric: '2.3 mm / 0.53°', metricLabel: 'Mean pose error over the final 10 s¹',
    problem: 'How can an arm maintain its end-effector pose when the base underneath it moves? The controller must distinguish external base motion from the arm’s own corrective motion, while working with delayed visual estimates and imperfect hardware.',
    contributions: [
      'Developed a ROS 2 perception–control pipeline that combines D435i stereo-inertial ORB-SLAM3 estimates with joint encoder feedback.',
      'Rebuilt the camera-to-end-effector pose model to account for a camera attached to the wrist motor housing rather than its independently rotating output.',
      'Separated external disturbance velocity from joint-induced camera motion using synchronized measurements and a camera Jacobian.',
      'Combined velocity feedforward with Cartesian pose feedback, SO(3) orientation errors, and damped Jacobian inversion.'
    ],
    method: [
      ['Estimate', 'Recover camera motion in the world frame and align it with encoder measurements.'],
      ['Separate', 'Subtract the camera motion caused by the arm itself to estimate the external disturbance.'],
      ['Compensate', 'Combine opposing disturbance feedforward with pose feedback and constrained joint commands.']
    ],
    results: [
      ['≈10 cm', 'Base displacement during the reported stabilization experiment'],
      ['2.3 mm / 0.53°', 'Mean pose error over the final ten seconds¹'],
      ['217 s', 'Reported sustained compensation demonstration with 3D base motion']
    ],
    qualifier: '¹ Pose errors were estimated from SLAM and joint encoder data. They describe the final ten seconds of the reported experiment, rather than independently measured absolute accuracy or full-trajectory error.',
    reflection: 'Camera mounting geometry, synchronization, and Jacobian conditioning were as consequential as controller gains. This project shaped my interest in the interaction between learned policies, state estimation, and reliable physical execution.',
    links: [{ label: 'Control implementation', url: 'https://github.com/yihuanghuan/windy-arm/tree/agent/link6-velocity-feedforward' }],
    codeNote: 'The linked development branch contains the visual-inertial arm integration, geometry checks, and physical experiment records.'
  },
  {
    slug: 'late-swarm', number: '02', category: 'LANGUAGE-GUIDED ROBOTICS · MULTI-ROBOT SYSTEMS',
    title: 'From language to coordinated flight',
    subtitle: 'LATE-Swarm: Late-Bound Semantic-to-Physical Commitment for Natural-Language UAV Swarm Reconfiguration',
    organization: 'Chongqing University', period: 'Mar–Sep 2026',
    role: 'Method Design, Implementation & Evaluation', advisor: 'Prof. Tao Jiang',
    status: 'ICRA 2027 · Under review',
    thumbnail: 'late-swarm/framework.png', imageAlt: 'LATE-Swarm framework connecting semantic specification, state-aware planning, and closed-loop swarm execution.',
    summary: 'A staged language-to-control framework that resolves state-dependent formation decisions when the physical information needed to make them is available.',
    tags: ['Language grounding', 'Motion planning', 'UAV coordination'],
    metric: '60 / 60', metricLabel: 'Missions completed in Gazebo simulation',
    problem: 'An instruction such as “shrink the formation” does not specify a fixed numerical radius. Its meaning depends on the current swarm. LATE-Swarm asks which decisions should be made during language interpretation, and which should wait for physical state and motion constraints.',
    contributions: [
      'Led method design, implementation, and evaluation of a staged semantic-to-physical commitment framework.',
      'Designed a structured language-to-formation specification that preserves relative intent until the required swarm state becomes available.',
      'Developed UAV-to-slot allocation with Hungarian initialization and lexicographic pairwise refinement, prioritizing hard conflicts before clearance and travel cost.',
      'Integrated geometry resolution, feasible duration selection, minimum-jerk references, feedback avoidance, and tracking control.'
    ],
    method: [
      ['Interpret', 'Represent task intent without prematurely fixing state-dependent numerical parameters.'],
      ['Resolve', 'Use the current participant state to determine formation geometry and UAV assignments.'],
      ['Execute', 'Set feasible timing using assigned motion and dynamic limits, then track with feedback avoidance.']
    ],
    results: [
      ['60 / 60', 'Missions met completion criteria in Gazebo'],
      ['0.085 m', 'Reported mean tracking RMSE in that simulation evaluation'],
      ['8–16 UAVs', 'Fleet sizes in the reported evaluation']
    ],
    qualifier: 'These results describe the reported Gazebo evaluation. The allocation method is a local refinement procedure; it does not establish global optimality or a universal collision-avoidance guarantee.',
    reflection: 'The central lesson was to preserve intent until enough information exists to make a physical decision. I am interested in how this relationship between task specification and execution extends to learned manipulation policies.',
    links: [{label: 'Code & documentation', url: 'https://github.com/yihuanghuan/LLM-UAVswarm-performance'}, {label: 'Method details', url: 'https://github.com/yihuanghuan/LLM-UAVswarm-performance/blob/main/docs/METHOD_SEMANTICS.md'}],
    codeNote: 'First-author manuscript submitted to ICRA 2027; currently under review. The repository documents release and dataset availability separately.'
  },
  {
    slug: 'nomad-navigation', number: '03', category: 'ROBOT LEARNING · REAL-ROBOT DEPLOYMENT',
    title: 'Bringing visual navigation onto TITA',
    subtitle: 'Vision-based NoMaD navigation for a wheeled-legged robot',
    organization: 'Chongqing University', period: 'Oct 2025–May 2026',
    role: 'Core Developer', advisor: 'Assoc. Prof. Can Pu', status: 'Research project',
    thumbnail: 'nomad/thumbnail.jpg', thumbnailWidth: 960, thumbnailHeight: 560,
    imageAlt: 'TITA physical deployment alongside a camera-view recording with NoMaD waypoint predictions.',
    summary: 'Extended a pretrained NoMaD policy with camera-aware visual preprocessing and interactive goal handling, then integrated and tested the camera-to-motion pipeline on TITA.',
    tags: ['Diffusion policies', 'Visual navigation', 'Deployment'],
    metric: 'Perception → motion', metricLabel: 'Visual policy adaptation on a physical robot',
    problem: 'A navigation model produces waypoints; a robot needs continuous commands that match its sensing, geometry, and motion. This project focused on the engineering between a pretrained visual policy and a working navigation system on TITA.',
    contributions: [
      'Reproduced and adapted the established NoMaD visual navigation approach for the TITA wheeled-legged platform.',
      'Developed a dynamic observation queue and customized visual preprocessing for the deployment pipeline.',
      'Connected predicted spatial waypoints to continuous chassis velocity commands through a tracking controller.',
      'Evaluated navigation and obstacle avoidance through physical deployment in indoor environments.'
    ],
    method: [
      ['Observe', 'Prepare a time-ordered visual context suited to the deployed camera and platform.'],
      ['Predict', 'Run the NoMaD diffusion-based policy to obtain local navigation waypoints.'],
      ['Track', 'Translate those waypoints into continuous commands for the wheeled-legged chassis.']
    ],
    results: [
      ['TITA', 'Physical wheeled-legged deployment platform'],
      ['Visual input', 'Navigation without reliance on a precise metric map'],
      ['Indoor trials', 'Reported navigation and dynamic obstacle-avoidance demonstrations']
    ],
    qualifier: 'NoMaD is an existing method by its original authors. My work concerns reproduction, platform adaptation, and deployment. No quantitative benchmark improvement is claimed here.',
    reflection: 'The observation pipeline and the interface between model output and physical control are part of the policy’s practical behavior. This experience motivated my interest in adapting learned policies to new robotic platforms.',
    links: [{label: 'Implementation repository', url: 'https://github.com/yihuanghuan/NoMaD'}, {label: 'Original NoMaD project', url: 'https://general-navigation-models.github.io/nomad/index.html'}],
    codeNote: 'The repository includes upstream model and deployment code and local inference work. The original method and model architecture are credited to the NoMaD authors.'
  },
  {
    slug: 'uav-swarm-control', number: '04',
    title: 'Distributed UAV Swarm Formation and Obstacle Avoidance',
    organization: 'Chongqing University', period: 'Sep 2025–May 2026',
    role: 'Core Developer', advisor: 'Prof. Tao Jiang',
    thumbnail: 'uav-swarm-control/fusion-trajectories.png',
    thumbnailWidth: 1825, thumbnailHeight: 1439,
    imageAlt: 'Recorded Simulink trajectories of one leader and four followers around spherical obstacles.',
    summary: 'Reproduced potential-field avoidance and distributed formation tracking, then integrated neighbor-based acceleration estimation, bounded feedback, and LADRC into a ROS 2/PX4 system.',
    links: [{label: 'Integrated implementation', url: 'https://github.com/yihuanghuan/Distributed-Multi-UAV-Formation-and-Obstacle-Avoidance-System'}]
  }
];

export const competitionProjects = [{
  slug: 'vex-robotics',
  title: 'VEX Robotics: Engineering and Community',
  summary: 'Developed timing-tolerant ring sorting and explored motion control for stable odometry. As deputy lead of the control group, I mentored five new members and took part in the teamwork and international exchange around VEX Worlds.'
}];
