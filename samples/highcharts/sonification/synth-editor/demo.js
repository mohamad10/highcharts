/**
 * Basic synth patch editor for Highcharts Sonification Instruments
 * */

let audioContext;
const SynthPatch = Highcharts.sonification.SynthPatch;
let synthPatch;
let idCount = 1; // Counter used for oscillator IDs
const oscillators = []; // The current oscillators we have settings for
const charts = {}; // Our envelope chart references
const el = el => document.getElementById(el);
const presets = {
    basic: el('preset-basic').textContent,
    advanced: el('preset-advanced').textContent,
    whirlwind: el('preset-whirlwind').textContent
};

// Get envelope options from an envelope chart
function getChartEnvelope(chartContainerId) {
    const chart = charts[chartContainerId];
    return chart ? chart.series[0].points
        .map(p => ({ t: p.x, vol: p.y })) : [];
}


// Update the patch options and JSON from the current UI settings
function updatePatch() {
    const val = id => el(id).value,
        floatVal = id => {
            const x = parseFloat(val(id));
            return isNaN(x) ? void 0 : x;
        },
        intVal = id => {
            const x = parseInt(val(id), 10);
            return isNaN(x) ? void 0 : x;
        };
    const options = {
        masterVolume: el('masterVolume').value,
        masterAttackEnvelope: getChartEnvelope('masterAttackEnvChart'),
        masterReleaseEnvelope: getChartEnvelope('masterReleaseEnvChart'),
        oscillators: oscillators.map(osc => {
            const i = osc.inputs,
                modulatesIndex = oscillators
                    .findIndex(osc => osc.id === intVal(i.modulateOsc));
            return {
                type: val(i.type),
                freqMultiplier: floatVal(i.freqMultiplier),
                fixedFrequency: floatVal(i.fixedFrequency),
                volume: floatVal(i.volume),
                detune: intVal(i.detune),
                volumePitchTrackingMultiplier: floatVal(i.volPitchTrackingMult),
                lowpass: {
                    frequency: floatVal(i.lowpassFreq),
                    frequencyPitchTrackingMultiplier:
                        floatVal(i.lowpassPitchTrackingMult),
                    Q: floatVal(i.lowpassQ)
                },
                highpass: {
                    frequency: floatVal(i.highpassFreq),
                    frequencyPitchTrackingMultiplier:
                        floatVal(i.highpassPitchTrackingMult),
                    Q: floatVal(i.highpassQ)
                },
                modulateOscillator: modulatesIndex > -1 ?
                    modulatesIndex : void 0,
                attackEnvelope: getChartEnvelope(i.attackEnvChart),
                releaseEnvelope: getChartEnvelope(i.releaseEnvChart)
            };
        })
    };
    for (const [key, val] of Object.entries(options)) {
        if (val.length === 0) {
            delete options[key];
        }
    }
    el('json').textContent = JSON.stringify(options, null, ' ');

    if (synthPatch) {
        synthPatch.stop();
    }
    if (audioContext) {
        synthPatch = new SynthPatch(audioContext, options);
        synthPatch.connect(audioContext.destination);
        synthPatch.startSilently();
    }
}


// Create a chart for defining a volume envelope (attack or release)
function createEnvelopeChart(type, container) {
    function cleanSeriesData(series) {
        const newData = series.points.map(o => [o.x, o.y])
            .sort((a, b) => a[0] - b[0]);
        if (newData[0] && newData[0][0] > 1) {
            newData.unshift([0, type === 'attack' ? 0 : 1]);
        }
        series.setData(newData);
        updatePatch();
    }

    charts[container] = Highcharts.chart(container, {
        title: { text: null },
        credits: { enabled: false },
        accessibility: { enabled: false },
        legend: { enabled: false },
        tooltip: { enabled: false },
        chart: {
            backgroundColor: 'transparent',
            plotBorderWidth: 1,
            events: {
                click: function (e) {
                    this.series[0].addPoint([
                        Math.round(e.xAxis[0].value),
                        Math.round(e.yAxis[0].value * 100) / 100
                    ]);
                    updatePatch();
                }
            }
        },
        yAxis: {
            min: 0,
            max: 1,
            tickAmount: 3,
            minPadding: 0,
            maxPadding: 0,
            minRange: 0,
            startOnTick: false,
            endOnTick: false,
            title: {
                enabled: false
            }
        },
        xAxis: {
            min: 0,
            max: 500,
            minPadding: 0,
            maxPadding: 0,
            minRange: 0,
            startOnTick: false,
            endOnTick: false
        },
        series: [{
            cursor: 'pointer',
            pointInterval: 50,
            marker: {
                enabled: true
            },
            dragDrop: {
                draggableY: true,
                draggableX: true,
                dragMaxX: 500,
                dragMinX: 1,
                dragMaxY: 1,
                dragMinY: 0
            },
            point: {
                events: {
                    click: function () {
                        const series = this.series;
                        this.remove(false);
                        cleanSeriesData(series);
                    },
                    drop: function (e) {
                        const point = e.newPoints[e.newPointId].point,
                            { x, y } = e.newPoint;
                        e.preventDefault();
                        point.update({
                            x: Math.round(x),
                            y: Math.round(y * 100) / 100
                        }, false);
                        cleanSeriesData(point.series);
                    }
                }
            },
            data: []
        }]
    });
}


// Update the lists of oscillators we can modulate in the UI
function updateModulationLists() {
    const newList = oscillators.reduce(
        (str, osc) => `${str}<option value="${osc.id}">#${osc.id}</option>`,
        '<option value=""></option>'
    );
    oscillators.forEach(o => {
        const sel = el(o.inputs.modulateOsc),
            oldVal = sel.value;
        sel.innerHTML = newList;
        if (newList.indexOf(`value="${oldVal}"`) > 0) {
            sel.value = oldVal; // Don't remove existing values if we don't have to
        }
    });
    updatePatch();
}


// A class for abstracting the Oscillator cards in the UI
class Oscillator {
    constructor(options) {
        this.options = options || {};
        this.container = el('oscillators');
        this.id = idCount++;
        this.htmlNode = document.createElement('div');
        this.htmlNode.className = 'oscillator';
        this.content = `<h3>#${this.id}</h3>
            <button id="removeOsc${this.id}">Remove #${this.id}</button>`;
        this.addControls();
        this.render();
        setTimeout(() => updateModulationLists(), 0);
        this.container.appendChild(this.htmlNode);
        el('removeOsc' + this.id).onclick = () => this.remove();
    }

    remove() {
        this.container.removeChild(this.htmlNode);
        oscillators.splice(oscillators.indexOf(this), 1);
        delete this.container;
        delete charts[this.inputs.attackEnvChart];
        delete charts[this.inputs.releaseEnvChart];
        updateModulationLists();
    }

    addControl(type, id, label, controlContent) {
        const identifier = `osc${this.id}${id}`,
            nameAndId = `name="${identifier}" id="${identifier}"`;
        this.content += `<label for="${identifier}">${label}</label>` +
            (type === 'select' ?
                `<select ${nameAndId}>${controlContent}</select>` :
                `<input type="number" ${nameAndId} value="${controlContent}">`
            );
        return identifier;
    }

    addChartContainer(id, label) {
        const identifier = `osc${this.id}${id}`;
        this.content += `<div class="chart" id="${identifier}"></div>
            <label class="chartlabel">${label}</label>`;
        return identifier;
    }

    addControls() {
        const opts = this.options,
            typeOptions = ['sine', 'sawtooth', 'triangle', 'square', 'whitenoise']
                .reduce((str, option) => `${str}<option value="${option}">${option}</option>`, '');
        this.inputs = {
            type: this.addControl('select', 'Type', 'Waveform type', typeOptions),
            freqMultiplier: this.addControl('input', 'FreqMultiplier', 'Freq multiplier',
                opts.freqMultiplier || ''),
            fixedFrequency: this.addControl('input', 'FixedFreq', 'Fixed frequency',
                opts.fixedFrequency || ''),
            volume: this.addControl('input', 'Vol', 'Volume',
                opts.volume || '0.5'),
            detune: this.addControl('input', 'Detune', 'Detune (cents)',
                opts.detune || ''),
            volPitchTrackingMult: this.addControl('input', 'VolPitchTrackingMult', 'Volume tracking multiplier',
                opts.volPitchTrackingMult || ''),
            lowpassFreq: this.addControl('input', 'lowpassFreq', 'Lowpass frequency',
                opts.lowpassFreq || ''),
            lowpassPitchTrackingMult: this.addControl('input', 'LowpassPitchTrackingMult', 'Lowpass tracking multiplier',
                opts.lowpassPitchTrackingMult || ''),
            lowpassQ: this.addControl('input', 'lowpassQ', 'Lowpass Q',
                opts.lowpassQ || ''),
            highpassFreq: this.addControl('input', 'highpassFreq', 'Highpass frequency',
                opts.highpassFreq || ''),
            highpassPitchTrackingMult: this.addControl('input', 'HighpassPitchTrackingMult', 'Highpass tracking multiplier',
                opts.highpassPitchTrackingMult || ''),
            highpassQ: this.addControl('input', 'highpassQ', 'Highpass Q',
                opts.highpassQ || ''),
            modulateOsc: this.addControl('select', 'ModulateOsc', 'Modulate oscillator', ''),
            attackEnvChart: this.addChartContainer('AttackEnv', 'Attack envelope'),
            releaseEnvChart: this.addChartContainer('ReleaseEnv', 'Release envelope')
        };
    }

    render() {
        const oscillator = this;
        this.htmlNode.innerHTML = this.content;
        this.content = '';
        setTimeout(() => {
            if (!oscillator.container) {
                return;
            }
            createEnvelopeChart('attack', this.inputs.attackEnvChart);
            createEnvelopeChart('release', this.inputs.releaseEnvChart);
            el(this.inputs.modulateOsc).onchange = function () {
                if (this.value === '' + oscillator.id) {
                    alert("Oscillator can't modulate itself - please assign to a different oscillator.");
                    this.value = '';
                }
            };
            Object.values(this.inputs).forEach(id => el(id).addEventListener('change', updatePatch));
        }, 0);
    }
}


function playJingle() {
    if (audioContext && synthPatch) {
        const t = audioContext.currentTime;
        [261.63, 329.63, 392, 523.25].forEach(
            (freq, i) => synthPatch.playFreqAtTime(t + i * 0.1, freq, 150)
        );
    }
}


// Apply a preset to UI and patch settings
function applyPreset(presetId) {
    const options = JSON.parse(presets[presetId]),
        envToChart = (chart, env) => charts[chart].series[0].setData(
            (env || []).map(o => [o.t, o.vol])
        );

    // Reset first
    let i = oscillators.length;
    while (i--) {
        oscillators[i].remove();
    }
    idCount = 1;

    el('masterVolume').value = options.masterVolume;
    envToChart('masterAttackEnvChart', options.masterAttackEnvelope);
    envToChart('masterReleaseEnvChart', options.masterReleaseEnvelope);
    options.oscillators.forEach(opts => {
        oscillators.push(new Oscillator({
            freqMultiplier: opts.freqMultiplier,
            fixedFrequency: opts.fixedFrequency,
            volume: opts.volume,
            detune: opts.detune,
            volPitchTrackingMult: opts.volumePitchTrackingMultiplier,
            lowpassFreq: opts.lowpass.frequency,
            lowpassPitchTrackingMult: opts.lowpass
                .frequencyPitchTrackingMultiplier,
            lowpassQ: opts.lowpass.Q,
            highpassFreq: opts.highpass.frequency,
            highpassPitchTrackingMult: opts.highpass
                .frequencyPitchTrackingMultiplier,
            highpassQ: opts.highpass.Q
        }));
    });

    setTimeout(() => {
        const opts = options.oscillators;
        let i = opts.length;
        while (i--) {
            el(oscillators[i].inputs.type).value = opts[i].type;
            el(oscillators[i].inputs.modulateOsc).value =
                opts[i].modulateOscillator !== null ? opts[i].modulateOscillator + 1 : '';
            envToChart(oscillators[i].inputs.attackEnvChart,
                opts[i].attackEnvelope);
            envToChart(oscillators[i].inputs.releaseEnvChart,
                opts[i].releaseEnvelope);
        }

        setTimeout(updatePatch, 0);
        setTimeout(playJingle, 50);
    }, 100);
}


const synthKeysPressed = new Set();
document.addEventListener('keydown', e => {
    const freq = {
        KeyA: 261.63, // C4
        KeyW: 277.18,
        KeyS: 293.66,
        KeyE: 311.13,
        KeyD: 329.63,
        KeyF: 349.23,
        KeyT: 369.99,
        KeyG: 392,
        KeyY: 415.30,
        KeyH: 440,
        KeyU: 466.16,
        KeyJ: 493.88,
        KeyK: 523.25, // C5
        KeyO: 554.37,
        KeyL: 587.33
    }[e.code];
    if (freq && synthPatch && !synthKeysPressed.has(e.code)) {
        synthKeysPressed.add(e.code);
        el('keyStatus').textContent = 'Synth key pressed';
        synthPatch.playFreqAtTime(0, freq, null, el('glideDuration').value); // Play indefinitely
    }
});

document.addEventListener('keyup', e => {
    synthKeysPressed.delete(e.code);
    if (!synthKeysPressed.size) {
        el('keyStatus').textContent = 'No synth key pressed';
        if (synthPatch) {
            synthPatch.silenceAtTime(0);
        }
    }
});


el('preset').innerHTML = Object.keys(presets)
    .reduce((str, p) => `${str}<option value="${p}">${p}</option>`, '');

el('addOsc').onclick = () => oscillators.push(new Oscillator());
el('startSynth').onclick = function () {
    audioContext = new AudioContext();
    updatePatch();
    el('controls').classList.remove('hidden');
    this.classList.add('hidden');
    el('keyStatus').textContent = 'No synth key pressed';
    setTimeout(playJingle, 50);
};
el('masterVolume').onchange = updatePatch;
el('json').onclick = function () {
    this.select();
};
el('preset').onchange = function () {
    applyPreset(this.value);
};
createEnvelopeChart('attack', 'masterAttackEnvChart');
createEnvelopeChart('release', 'masterReleaseEnvChart');
applyPreset('basic');
