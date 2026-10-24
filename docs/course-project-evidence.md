# Course project page evidence

These pages summarize the supplied course archives. Original reports and source code remain private. Photographs are project records, not generated demonstrations. Personal contributions are distinguished from team work in the page headers and text.

## Mobile manipulator

- Source: Robotics Fundamentals course report, accompanying OpenMV / Arduino / kinematics code, and three additional project photographs supplied on 24 October 2026.
- The report supports the ultrasonic-to-visual corner-detection change and the author's writing, corner-detection, and PID contributions.
- `writing-sequences.png` and its CSV reconstruct the stored wrist-angle column from `pos_er`, `pos_T`, and `pos_shi` in `c_servo.ino`, in execution order. They show program states, not measured motion. Counts: 11 / 11 / 13 configurations.
- `kinematic-sketch.jpg`: original report figure, PDF page 5.
- `course-layout-en.png`: English localization of the original assignment map reproduced on PDF page 8, edited with the built-in image tool. Route topology, station letters, block colors, and obstacle symbols were visually compared with the original. Grading prose was omitted. Retained translations: Start; Writing & recognition station / Finish; Obstacles; Block stations.
- Localization prompt: preserve the route and physical symbols exactly, crop bottom assignment/rules, remove the attempt/scoring sentence, replace retained Chinese with the English labels above, white background, no invented routes or data.
- `robot-platform.jpeg` / homepage thumbnail: supplied `image12.jpeg`; `writing-result.jpeg`: supplied `image45.jpeg`; `robot-course.jpg`: supplied `20261024-154927.png`, resized and JPEG-compressed for web delivery.
- No quantitative success-rate or pen-position accuracy claim is made.

## Stirling engine

- Sources: Engineering Design team presentation, personal design report, co-simulation report, and the supplied test video.
- Team presentation pages 36 and 41: first and revised prototypes / CAD. Personal report page 19: separate vertical prototype. Co-simulation report pages 9 and 12: coupling diagram and speed output.
- Team presentation pages 43 and 45 supply the original P–V plots and the replot values: baseline 0.1438 J/cycle, colder cold side 0.2325 J/cycle, reduced dead volume 0.2056 J/cycle. These are separate model comparisons of indicated work, not measured shaft power or cumulative improvements.
- Approximately 550 rpm is simulation output; approximately 540 rpm is the team's estimate from video. Their methods and scope are separate in the page.
- `experiment.mp4`: supplied approximately 34-second test recording, original playback speed, web-compatible H.264, audio removed. Poster frame at 8 seconds.
- No experimentally verified shaft-power or endurance claim is made.

## ECG

- Source: Quantitative Engineering Analysis II report and accompanying STM32 firmware, supplied drivers, and CMSIS components.
- Report pages 9 and 16: raw / filtered offline course-supplied signal and spectrum comparisons. Waveform scales differ and the caption says so.
- Report pages 29–31: simulator heart-rate tests, amplitude test, and electrode demonstration.
- Heart-rate error within 2 BPM describes the reported limited simulator tests, not a broad accuracy benchmark. Approximately +10% amplitude error was reported. The claimed later 3% calibration / Hann-window changes do not consistently match the archived firmware, so neither is presented as a verified result.
- No clinical validation is claimed.

## Validation

The site build and static checker validate generated pages, local links, image labels, metadata, sitemap integration, and accessible non-autoplay video markup. Browser checks cover page layout, responsive rendering, navigation, and media. These checks validate the website, not the original experiments.
