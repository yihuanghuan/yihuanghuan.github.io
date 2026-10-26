import { courseNav, figure, sectionLinks, relatedCourses, courseMetadata } from './course-projects.mjs';
const slug = 'ecg-signal-processing';
const fig = (file, alt, caption, cls) => figure(slug, file, alt, caption, cls);
export function ecgBody(project) {
 return `${courseNav()}<article class="project-detail course-detail">
<header><h1>${project.title}</h1>
${courseMetadata(project)}
<p>I integrated signal analysis, digital filtering, heart-rate estimation, and waveform visualization using an ADS1292R module, STM32 board, and existing acquisition/DSP libraries.</p>
${sectionLinks([['demo','Demo'],['results','Results'],['implementation','Implementation']])}</header>
<section id="demo"><h2>From sampled signal to a live display</h2>
${fig('simulator-test-en.png','STM32 and TFT showing an ECG waveform during a simulator test.','The acquisition and display system under simulator testing. HR shows heart rate in BPM.','figure-medium')}
<p>The system acquires samples over SPI, decodes signed ADC values, filters the stream, estimates heart rate from repeated peaks, and updates the TFT waveform and spectrum. Simulator tests gave <strong>heart-rate error within 2 BPM</strong> for the tested inputs.</p></section>
<section id="implementation"><h2>Carry signal reasoning into streaming firmware</h2>
<p>I used a supplied offline ECG recording to examine baseline variation and high-frequency content in the time and frequency domains. A recursive DC-removal stage addressed the slow component, followed by low-pass FIR filtering to reduce higher-frequency interference while preserving the repeated peak structure.</p>
<div class="course-figure-pair">${fig('raw-waveform-en.png','Raw ECG recording with baseline variation and higher-frequency interference.','Raw signal used for the offline filtering study.')}${fig('filtered-waveform-en.png','Filtered ECG waveform with repeated peaks.','Processed waveform. Each plot uses its displayed amplitude scale.')}</div>
${fig('spectrum-comparison-en.png','Raw and filtered spectra with reduced high-frequency content after processing.','Offline spectrum comparison: filtering reduces higher-frequency interference in the supplied recording.','figure-medium')}
<p>On the STM32, I connected these stages to streaming acquisition using persistent IIR state and CMSIS-DSP FIR buffers. Correct sample order and signed decoding linked the numerical signal representation to the behavior seen on the display.</p>
<p>The peak-based estimator used an amplitude-dependent threshold and successive peak intervals. At the configured 500 Hz sample rate, sample separation supplied the time interval for heart-rate estimation. This connected the offline analysis to a continuously updating embedded measurement.</p></section>
<section id="results"><h2>Reference-based tests and live acquisition</h2>
<p>I tested the chain progressively: the module’s internal test signal verified data transfer and display; the ECG simulator supplied a known timing reference; electrode acquisition exercised the live input path.</p>
<div class="course-figure-pair">${fig('amplitude-test-en.png','ECG simulator and STM32 display during a fixed-heart-rate input test.','Simulator testing at a 75 BPM reference while varying input amplitude.','course-portrait')}${fig('electrode-test-en.png','Electrode connections and STM32 display during live acquisition.','Live electrode acquisition through the same embedded processing and display chain.')}</div>
<table class="result-table"><caption>Signal-processing and simulator results</caption><thead><tr><th scope="col">Test</th><th scope="col">Result</th></tr></thead><tbody>
<tr><th scope="row">Offline filtering</th><td>Reduced slow and high-frequency interference while preserving repeated peaks.</td></tr>
<tr><th scope="row">Simulator heart rate</th><td><strong>Error within 2 BPM</strong> in the tested inputs, including the 75 BPM amplitude-change test.</td></tr>
<tr><th scope="row">Embedded integration</th><td>Streaming acquisition, filtering, peak-based estimation, waveform, and spectrum display.</td></tr></tbody></table>
<p>The project connected signal interpretation to embedded execution, with each processing stage traceable through the firmware, test input, and displayed result.</p>
</section></article>${relatedCourses(slug)}`;
}
