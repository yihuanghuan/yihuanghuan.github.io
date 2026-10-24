import { courseNav, figure, sectionLinks, relatedCourses } from './course-projects.mjs';
const slug = 'ecg-signal-processing';
const fig = (file, alt, caption, cls) => figure(slug, file, alt, caption, cls);

export function ecgBody() {
  return `${courseNav()}
<article class="project-detail course-detail">
<header><h1>From Noisy Samples<br>to an Embedded ECG Measurement</h1>
<p>Quantitative Engineering Analysis II · Chongqing University<br>Course project · STM32 signal acquisition and digital processing</p>
<p>My work centered on signal analysis, filtering, and embedded integration using the course hardware and supplied drivers.</p>
${sectionLinks()}</header>

<section id="background"><h2>A measurement chain that has to work end to end</h2>
<p>This project connected an ADS1292R acquisition module to an STM32 board to display an ECG waveform, estimate heart rate, and inspect its spectrum. It brought together two kinds of work: reasoning about a recorded signal offline and making the same processing stages operate within an embedded acquisition-and-display system.</p>
${fig('simulator-test-en.png', 'STM32 board and TFT displaying the ECG waveform during a simulator-based test.', 'The acquisition and display system connected to an ECG simulator for testing. HR is heart rate in beats per minute; Peak is the displayed peak value.','figure-medium')}
</section>

<section id="question"><h2>Core question: what does a plausible waveform actually verify?</h2>
<p>A recognizable waveform does not by itself validate a measurement system. Baseline drift and higher-frequency interference can alter the input; scaling errors can change the displayed amplitude; a peak detector can still produce a reasonable heart rate despite those problems. I treated <strong>signal quality, timing, and amplitude calibration as separate questions</strong> when interpreting the results.</p>
</section>

<section id="reasoning"><h2>Reasoning: separate the interference from the measurement error</h2>
<h3>Match each processing stage to a visible problem</h3>
<p>I first examined the signal in both time and frequency. A DC-removal stage addressed the slow component, while a low-pass FIR stage reduced higher-frequency content. Inspecting the spectrum after each stage made it possible to see which part of the interference each operation addressed.</p>
<p>I used the time trace to inspect repeated peaks and baseline variation, then the spectrum to identify interference that was harder to distinguish by eye. A visually smoother curve was only one check: the processing also needed to preserve the timing information used for heart-rate estimation. That led me to evaluate the waveform, spectrum, and measurement outputs together.</p>
<h3>Change amplitude while keeping the timing reference fixed</h3>
<p>Testing the full system exposed another distinction. Changing the simulator's amplitude left heart-rate estimates close to the reference, while the amplitude error stayed around +10%. That pattern suggested a scale-conversion issue worth checking independently of the peak detector. Unwindowed FFT input also introduced spectral leakage. These observations identified two separate refinement targets: amplitude calibration and FFT windowing.</p>
<p>The amplitude-change experiment was useful because it held the reference heart rate at 75 BPM. If timing estimates remained close while the relative amplitude error persisted, the next place to inspect was the conversion from ADC counts to voltage. This was a working diagnosis rather than proof of a single cause, but it narrowed the debugging task to a specific part of the measurement chain.</p>
<ol class="course-process"><li><strong>Inspect the signal</strong><span>Use time traces and spectra to distinguish slow drift from higher-frequency interference.</span></li><li><strong>Transfer the processing</strong><span>Connect offline filtering to the STM32 acquisition and display path.</span></li><li><strong>Test each measurement</strong><span>Compare timing and amplitude against a controlled simulator input.</span></li></ol>
</section>

<section id="approach"><h2>Approach: move a processing chain onto the device</h2>
<p>The system reads ADC samples through SPI, decodes signed values, filters the stream, estimates heart rate from successive peaks, and updates the TFT waveform and spectrum. The embedded implementation uses CMSIS-DSP FIR processing alongside the acquisition drivers.</p>
<p>I carried the offline filter reasoning into a streaming implementation. The recursive DC-removal stage retained state between samples, while the FIR stage used coefficients and state buffers. Buffer handling and signed ADC decoding were therefore part of signal correctness: the filter could only work as intended if the input samples arrived in the right order and numerical representation.</p>
<p>The heart-rate estimator detected local peaks with an amplitude-dependent threshold and converted their sample separation into a beat interval. With the 500 Hz sampling configuration, the interval was the sample count divided by 500; heart rate was then 60 divided by that interval in seconds. Amplitude estimation followed a separate conversion path involving ADC range, reference voltage, and gain.</p>
<p>For the offline analysis, I used a supplied ECG recording and examined the effect of DC removal and low-pass filtering before interpreting the peak intervals. The plots below show the raw and processed signals. This offline analysis used a separate input from the live simulator and electrode tests.</p>
<div class="course-figure-pair">${fig('raw-waveform-en.png', 'Raw ECG recording with visible baseline variation and high-frequency noise.', 'Raw ECG input for the offline filtering analysis.')}${fig('filtered-waveform-en.png', 'Filtered ECG waveform with recognizable repeated peaks.', 'Processed waveform after the filtering stages. The plotted amplitude scales differ; this pair illustrates waveform structure, not absolute voltage accuracy.')}</div>
${fig('spectrum-comparison-en.png', 'Spectrum comparison showing lower high-frequency and near-50-hertz content in the processed signal.', 'Offline spectrum comparison: red is the raw signal and blue is the processed signal. Filtering reduces high-frequency interference in this recording.','figure-small')}
<h3>My design contribution</h3>
<p>I brought signal analysis, filtering, peak-based estimation, and embedded display into one testable system. The main reasoning contribution was to separate three outputs that can look convincing for different reasons: a clean waveform, a plausible beat interval, and a correctly scaled voltage. Each needed its own check, so an improvement in one output would not hide an unresolved error in another.</p>
<p>The spectrum also raised a different issue from filtering. A finite FFT block can create leakage at its boundaries even when the time trace appears continuous. That distinction made windowing a targeted refinement to investigate, alongside amplitude calibration, rather than a reason to indiscriminately change the entire filter chain.</p>
</section>

<section id="results"><h2>Validation: use a reference input, then inspect the real acquisition</h2>
<p>I tested the acquisition path in stages: first the module's internal square-wave signal, then a simulator input with known timing, and finally live electrode acquisition. Each stage answered a different question, from basic data transfer and display to reference-based measurement and real-signal integration.</p>
<p>I used an ECG simulator to test the complete path from acquisition to displayed measurements. One test varied input amplitude while keeping the reference heart rate at 75 BPM. Heart-rate error stayed within 2 BPM across the simulator tests, while amplitude error was approximately +10%. These results motivated checking amplitude calibration independently of timing accuracy.</p>
<div class="course-figure-pair">${fig('amplitude-test-en.png', 'STM32 display alongside the ECG simulator used to change input amplitude while maintaining heart rate.', 'Simulator experiment: change amplitude while retaining the same timing reference. The display shows HR (heart rate) and Peak (peak value).','course-portrait')}${fig('electrode-test-en.png', 'Electrode acquisition demonstration with the STM32 display and sensor connections.', 'Electrode acquisition demonstration. It shows a live signal path, without an independent reference measurement of accuracy.')}</div>
<table class="result-table"><caption>Signal-processing and simulator test results</caption><thead><tr><th scope="col">Test</th><th scope="col">Observation</th><th scope="col">Interpretation</th></tr></thead><tbody>
<tr><th scope="row">Offline recording</th><td>Reduced slow and high-frequency interference; repeated peaks remain visible.</td><td>Filtering suppresses interference while retaining the repeated peak structure in this input.</td></tr>
<tr><th scope="row">Simulator timing</th><td>Heart-rate error within 2 BPM in the tested inputs, including an amplitude-change test at 75 BPM.</td><td>Changing amplitude preserved timing estimates close to the reference in this test set.</td></tr>
<tr><th scope="row">Amplitude</th><td>Approximately +10% error.</td><td>Motivated checking the conversion scale independently of heart-rate estimation.</td></tr>
</tbody></table>
<p class="table-note">The numerical results above apply to the simulator inputs tested. The electrode demonstration shows live acquisition; it does not establish clinical measurement accuracy.</p>
</section>

<section id="takeaways"><h2>Takeaways</h2>
<p>This project taught me to evaluate the complete measurement chain while keeping its outputs distinct. A stable peak interval, a clean spectrum, and a correctly scaled amplitude each require their own evidence. That habit transfers to robotics, where a plausible sensor visualization can hide calibration, timing, or representation errors that matter when the data drives an action.</p>
<p class="table-note">I used an ADS1292R module, an STM32 board, supplied ECG data, and existing acquisition/DSP libraries for signal analysis and system integration.</p>
</section></article>${relatedCourses(slug)}`;
}
