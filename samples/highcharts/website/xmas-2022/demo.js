Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};


Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

Math.easeOutElastic = x => {
    const c4 = (2 * Math.PI) / 3;

    return x === 0 ?
        0 :
        x === 1 ?
            1 :
            Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;

};

Math.easeOutBack = x => {
    const c1 = 1.70158;
    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);

};

const tips = [
    '',
    'Eat lots of cookies',
    'Water the tree',
    'Be kind',
    'Exercise',
    'Have a candy cane',
    'Stuff your stocking',
    'Don\'t forget the dog',
    'Try something new',
    'Relax',
    'Enjoy family time',
    'Say thank you',
    'Hang some mistletoe',
    'Drink some nog',
    'Be patient',
    'Don\'t let the cat eat tinsle',
    'Bake cookies',
    'Leave cookies for Santa',
    'Avoid the fruit cake',
    'Wrap it up',
    'Act surprised',
    'Stay cozy',
    'Go outside',
    'Sleep in',
    'Rest up',
    'Lend a hand',
    'Laugh jollily',
    'Avoid coal',
    'Ring some bells',
    'Roast some chestnuts',
    'Deck the halls'

];

// var Instrument = Highcharts.sonification.SonificationInstrument,
//     Timeline = Highcharts.sonification.SonificationTimeline,
//     el = function (id) {
//         return document.getElementById(id);
//     },
//     timeline2;

// function makeTimeline2() {
//     var ctx = new AudioContext(),
//         instr1 = new Instrument(ctx, ctx.destination, {
//             synthPatch: 'flute',
//             capabilities: {
//                 tremolo: true,
//                 filters: true,
//                 pan: false
//             }
//         }),
//         instr2 = new Instrument(ctx, ctx.destination, {
//             synthPatch: 'flute',
//             capabilities: {
//                 tremolo: false,
//                 filters: true,
//                 pan: false
//             }
//         }),

//         timeline = new Timeline();

//     timeline.addChannel('instrument', instr1, [{
//         time: 0, // fa
//         instrumentEventOptions: {
//             note: 'g5',
//             noteDuration: 500,
//             volume: 0.3
//         }
//     }, {
//         time: 500, // who
//         instrumentEventOptions: { note: 'e5', volume: 0.5 }
//     }, {
//         time: 1000, // for
//         instrumentEventOptions: { note: 'a5', volume: 0.7 }
//     }, {
//         time: 1500, // aze
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     }, {
//         time: 2000, // dah
//         instrumentEventOptions: { note: 'f5', volume: 0.4 }
//     }, {
//         time: 2500, // who
//         instrumentEventOptions: { note: 'd5', volume: 0.9 }
//     },
//     {
//         time: 3000, // /dor
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 3500, // aze
//         instrumentEventOptions: { note: 'f5', volume: 0.9 }
//     },
//     {
//         time: 4000, // wel
//         instrumentEventOptions: { note: 'e5', volume: 0.9 }
//     },
//     {
//         time: 4500, // come
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 5000, // christ
//         instrumentEventOptions: { note: 'c6', volume: 0.9 }
//     },
//     {
//         time: 5500, // mas
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 6000, // come
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 6500, // this
//         instrumentEventOptions: { note: 'e5', volume: 0.9 }
//     },
//     {
//         time: 7000, // way
//         instrumentEventOptions: { note: 'd5', volume: 0.9 }
//     },
//     {
//         time: 8000, // fa
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 8500, // who
//         instrumentEventOptions: { note: 'e5', volume: 0.9 }
//     },
//     {
//         time: 9000, // for
//         instrumentEventOptions: { note: 'a5', volume: 0.9 }
//     },
//     {
//         time: 9500, // aze
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 10000, // dah
//         instrumentEventOptions: { note: 'f5', volume: 0.9 }
//     },
//     {
//         time: 10500, // who
//         instrumentEventOptions: { note: 'd5', volume: 0.9 }
//     },
//     {
//         time: 11000, // dor
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 11500, // aze
//         instrumentEventOptions: { note: 'a5', volume: 0.9 }
//     },
//     {
//         time: 11750, // aze
//         instrumentEventOptions: { note: 'b5', volume: 0.9 }
//     },
//     {
//         time: 12000, // wel
//         instrumentEventOptions: { note: 'c6', volume: 0.9 }
//     },
//     {
//         time: 12500, // come
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 13000, // christ
//         instrumentEventOptions: { note: 'g5', volume: 0.9 }
//     },
//     {
//         time: 13500, // mas
//         instrumentEventOptions: { note: 'e5', volume: 0.9 }
//     },
//     {
//         time: 14000, // christ
//         instrumentEventOptions: { note: 'f5', volume: 0.9 }
//     },
//     {
//         time: 14250, // christ
//         instrumentEventOptions: { note: 'e5', volume: 0.9 }
//     },
//     {
//         time: 14500, // mas
//         instrumentEventOptions: { note: 'd5', volume: 0.9 }
//     },
//     {
//         time: 15000, // day
//         instrumentEventOptions: { note: 'c5', volume: 0.9 }
//     }]);

//     timeline.addChannel('instrument', instr2, [{
//         time: 0, // fa
//         instrumentEventOptions: {
//             note: 'c4',
//             noteDuration: 500,
//             volume: 0.3
//         }
//     }, {
//         time: 1500, // aze
//         instrumentEventOptions: { note: 'g4', volume: 0.5 }
//     }, {
//         time: 2000, // dah
//         instrumentEventOptions: { note: 'd4', volume: 0.7 }
//     }, {
//         time: 3500, // aze
//         instrumentEventOptions: { note: 'g4', volume: 0.9 }
//     }, {
//         time: 4000, // wel
//         instrumentEventOptions: { note: 'c4', volume: 0.3 }
//     }, {
//         time: 4500, // come
//         instrumentEventOptions: { note: 'b4', volume: 0.4 }
//     },
//     {
//         time: 5000, // christ
//         instrumentEventOptions: { note: 'a4', volume: 0.4 }
//     },
//     {
//         time: 5500, // mas
//         instrumentEventOptions: { note: 'e5', volume: 0.4 }
//     },
//     {
//         time: 6000, // come
//         instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     },
//     {
//         time: 6500, // this
//         instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     },
//     {
//         time: 7000, // way
//         instrumentEventOptions: { note: 'b4', volume: 0.4 }
//     },
//     {
//         time: 8000, // fa
//         instrumentEventOptions: { note: 'c4', volume: 0.4 }
//     },
//     {
//         time: 9500, // aze
//         instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     },
//     {
//         time: 10000, // dah
//         instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     },
//     {
//         time: 11500, // aze
//         instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     },
//     {
//         time: 12000, // wel
//         instrumentEventOptions: { note: 'c4', volume: 0.4 }
//     },
//     {
//         time: 12500,
//         instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     },
//     {
//         time: 13000, // christ
//         instrumentEventOptions: { note: 'e4', volume: 0.4 }
//     },
//     {
//         time: 13500, // mas
//         instrumentEventOptions: { note: 'a4', volume: 0.4 }
//     },
//     {
//         time: 14000, // christ
//         instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     },
//     {
//         time: 14500, // mas
//         instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     },
//     {
//         time: 15000, // day
//         instrumentEventOptions: { note: 'c4', volume: 0.4 }
//     }]);

//     // timeline.addChannel('instrument', instr3, [{
//     //     time: 0, //fa
//     //     instrumentEventOptions: {
//     //         note: 'c4',
//     //         noteDuration: 500,
//     //         volume: 0.3
//     //     }
//     // }, {
//     //     time: 1500, //aze
//     //     instrumentEventOptions: { note: 'g4', volume: 0.5 }
//     // }, {
//     //     time: 2000, //dah
//     //     instrumentEventOptions: { note: 'd4', volume: 0.7 }
//     // }, {
//     //     time: 3500, //aze
//     //     instrumentEventOptions: { note: 'g4', volume: 0.9 }
//     // }, {
//     //     time: 4000, //wel
//     //     instrumentEventOptions: { note: 'c4', volume: 0.3 }
//     // }, {
//     //     time: 4500, //come
//     //     instrumentEventOptions: { note: 'b4', volume: 0.4 }
//     // },
//     // {
//     //     time: 5000,//christ
//     //     instrumentEventOptions: { note: 'a4', volume: 0.4 }
//     // },
//     // {
//     //     time: 5500, //mas
//     //     instrumentEventOptions: { note: 'e5', volume: 0.4 }
//     // },
//     // {
//     //     time: 6000, //come
//     //     instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     // },
//     // {
//     //     time: 6500, //this
//     //     instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     // },
//     // {
//     //     time: 7000, //way
//     //     instrumentEventOptions: { note: 'b4', volume: 0.4 }
//     // },
//     // {
//     //     time: 8000, //fa
//     //     instrumentEventOptions: { note: 'c4', volume: 0.4 }
//     // },
//     // {
//     //     time: 9500, //aze
//     //     instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     // },
//     // {
//     //     time: 10000, //dah
//     //     instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     // },
//     // {
//     //     time: 11500, //aze
//     //     instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     // },
//     // {
//     //     time: 12000, //wel
//     //     instrumentEventOptions: { note: 'c4', volume: 0.4 }
//     // },
//     // {
//     //     time: 12500,
//     //     instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     // },
//     // {
//     //     time: 13000, //christ
//     //     instrumentEventOptions: { note: 'e4', volume: 0.4 }
//     // },
//     // {
//     //     time: 13500, //mas
//     //     instrumentEventOptions: { note: 'a4', volume: 0.4 }
//     // },
//     // {
//     //     time: 14000, //christ
//     //     instrumentEventOptions: { note: 'd4', volume: 0.4 }
//     // },
//     // {
//     //     time: 14500, //mas
//     //     instrumentEventOptions: { note: 'g4', volume: 0.4 }
//     // },
//     // {
//     //     time: 15000, //day
//     //     instrumentEventOptions: { note: 'c4', volume: 0.4 }
//     // }]);

//     return timeline;
// }

const branchEnds = [
    null,
    [11.9, 15.75],
    [11.46, 15.56],
    [12.72, 13.74],
    [12.8, 13.9],
    [12.54, 10.68],
    [14.1, 11.7],
    [14.82, 8.2],
    [14.9, 8.77],
    [15.75, 5.9],
    [15.8, 4.8],
    [16.8, 1.8],
    [15.93, 1.8],
    // twigs
    [12.4, 12.36],
    [14.6, 10.6],
    [13.67, 9.3],
    [13, 9.22],
    [13.2, 5.2],
    [14.8, 3.1]


];

// el('play2').onclick = function () {
//     (timeline2 = timeline2 || makeTimeline2()).play();
//     //  kReset();
//     setTimeout(function () {
//         kscope();
//     }, 0);
//     playButton.style.display = 'none';

// };


Highcharts.chart('container', {
    chart: {
        styledMode: (true),
        animation: {
            enabled: false,
            duration: 1000,
            easing: 'easeOutBack'
        },
        margin: 30,
        events: {
            load: function () {
                const chart = this;

                setTimeout(function () {
                    chart.series[0].points[0].update({
                        y: 17
                    }, false);
                    chart.redraw();
                }, 100);

                setTimeout(function () {

                    [].forEach.call(
                        document.querySelectorAll('#container .branch .highcharts-graph'),
                        p => p.classList.add('show')
                    );
                    [].forEach.call(
                        document.querySelectorAll('#container .twig .highcharts-graph'),
                        p => p.classList.add('show')
                    );

                    chart.series.forEach(function (s, index) {

                        if (index > 0 && index < 13) {
                            s.points[1].update({
                                x: branchEnds[index][0],
                                y: branchEnds[index][1]
                            }, false);

                        }

                    });

                    chart.update({
                        plotOptions: {
                            line: {
                                marker: {
                                    enabled: true
                                }
                            }
                        }
                    }, false);
                    chart.redraw();
                }, 500);

                setTimeout(function () {
                    chart.series.forEach(function (s, index) {
                        if (index > 0) {
                            s.points.forEach(function (p) {
                                p.onMouseOver();
                            });
                        }

                    });
                    chart.series[29].points[0].onMouseOver();

                    [].forEach.call(
                        document.querySelectorAll('#container .highcharts-markers.twig'),
                        p => p.classList.add('show')
                    );

                }, 1000);

                setTimeout(function () {
                    let count = 0;

                    const stops = [27, 13, 18, 30, 20];

                    setInterval(function () {
                        if (count < stops.length) {
                            chart.series[stops[count]].points[0].onMouseOver();
                            count = count + 1;
                        }

                    }, 2000);
                }, 2000);

            }


        }
    },
    title: {
        text: 'Merry Christmas from Highcharts',
        y: 30
    },
    subtitle: {
        text: 'Enjoy some holiday tooltips',
        y: 53
    },
    yAxis: [
        // 0
        {
            min: 0,
            max: 20,
            tickInterval: 1,
            endOnTick: false,
            startOnTick: false,
            visible: false,
            labels: {
                enabled: false
            }
        },
        // 1
        {
            min: -2,
            max: 20,
            tickInterval: 1,
            endOnTick: false,
            startOnTick: false,
            visible: false
        },
        // 2
        {
            min: 0,
            max: 20,
            visible: false
        }
    ],
    xAxis: [
        // 0
        {
            min: 0,
            max: 20,
            endOnTick: false,
            visible: false,
            tickInterval: 1,
            labels: {
                enabled: true
            }
        },
        // 1
        {
            min: 0,
            max: 20,
            reversed: true,
            visible: false,
            tickInterval: 1,
            endOnTick: false
        },
        // 2
        {
            min: 0,
            max: 20,
            visible: false,
            tickInterval: 1,
            endOnTick: false,
            labels: {
                enabled: true
            }
        },
        // 3
        {
            min: 0,
            max: 20,
            reversed: true,
            visible: false,
            tickInterval: 1,
            endOnTick: false
        },
        // 4
        {
            min: 0,
            max: 20,
            visible: true,
            labels: {
                enabled: false
            },
            tickInterval: 1,
            endOnTick: false

        }
    ],

    plotOptions: {
        series: {
            label: {
                enabled: false
            },
            animation: false,
            states: {
                inactive: {
                    enabled: false
                },
                hover: {
                    marker: {
                        radius: 10
                    }
                }
            },
            marker: {
                enabled: false,
                symbol: 'circle',
                y: 10
            }
        },
        column: {
            zIndex: 20
        },
        line: {
            zIndex: 20,
            linecap: 'square',
            marker: {
                enabled: false,
                radius: 6
            },
            yAxis: 1
        }
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false,
        symbolRadius: 0,
        symbol: 'square'
    },
    tooltip: {
        useHTML: true,
        headerFormat: '',
        pointFormatter: function () {
            if (this.series.index !== 31) {
                return `<p class="tipheader">Holiday Tooltip 
                #${this.series.index}</p>
                <p class="tiptext">${tips[this.series.index]}</p>`;
            }

        }
    },
    series: [

        // 0 -col
        {
            type: 'column',
            zInde: 100,
            name: 'trunk',
            className: 'trunk',
            visible: true,
            data: [{
                x: 10,
                y: 0
            }]
        },
        // 1 br-1
        {
            type: 'line',
            linecap: 'square',
            visible: true,
            xAxis: 2,
            yAxis: 1,
            name: 'br-1',
            className: 'branch',
            data: [
                { x: 10, y: 14.2 },
                { x: 10, y: 13 }
            ]
        },
        // 2 bl -1
        {
            type: 'line',
            visible: true,
            xAxis: 1,
            yAxis: 1,
            name: 'bl-1',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 14.46
                },
                {
                    x: 10,
                    y: 14.2
                }
            ]
        },
        // // 3 br-2
        {
            type: 'line',
            linecap: 'square',
            visible: true,
            xAxis: 2,
            yAxis: 1,
            name: 'br-2',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 11.45
                },
                {
                    x: 10,
                    y: 7
                }
            ]
        },
        // // 4 bl -2
        {
            type: 'line',
            visible: true,
            xAxis: 1,
            yAxis: 1,
            name: 'bl-2',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 12.55
                },
                {
                    x: 10,
                    y: 12.5
                }]
        },
        // // 5 br-3
        {
            type: 'line',
            visible: true,
            xAxis: 2,
            yAxis: 1,
            name: 'br-3',
            className: 'branch',

            data: [
                {
                    x: 10,
                    y: 8.54
                },
                {
                    x: 10,
                    y: 8.78
                }
            ]
        },
        // // 6 bl-3
        {
            type: 'line',
            visible: true,
            xAxis: 1,
            yAxis: 1,
            name: 'bl-3',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 8.54
                },
                {
                    x: 10,
                    y: 8.6
                }
            ]
        },
        // // 7 br-4
        {
            type: 'line',
            visible: true,
            xAxis: 2,
            yAxis: 1,
            name: 'br-4',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 5.6
                },
                {
                    x: 10,
                    y: 5.6
                }
            ]
        },
        // // 8 bl-4
        {
            type: 'line',
            visible: true,
            xAxis: 1,
            name: 'bl-4',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 6.1
                },
                {
                    x: 10,
                    y: 6
                }
            ]
        },
        // // 9 br-5
        {
            type: 'line',
            visible: true,
            xAxis: 2,
            name: 'br-5',
            className: 'branch',
            data: [{
                x: 10,
                y: 3
            },
            {
                x: 10,
                y: 3
            }
            ]
        },
        // // 10 bl-5
        {
            type: 'line',
            visible: true,
            xAxis: 1,
            name: 'bl-5',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 3
                }, {
                    x: 10,
                    y: 3
                }
            ]
        },
        // // 11 br-6
        {
            type: 'line',
            visible: true,
            xAxis: 2,
            name: 'br-6',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 1
                }, {
                    x: 10,
                    y: 1.6
                }
            ]
        },
        // // 12 bl-6
        {
            type: 'line',
            visible: true,
            xAxis: 1,
            name: 'bl-6',
            className: 'branch',
            data: [
                {
                    x: 10,
                    y: 1.14
                }, {
                    x: 10,
                    y: 1.6
                }
            ]
        },

        // // 13 twigL-1
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-1',
            className: 'twig',
            data: [
                {
                    x: 11,
                    y: 9.45
                }, {
                    x: 12.4,
                    y: 12.36
                }
            ]
        },
        // // 14 twigL-2
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-2',
            className: 'twig',
            data: [
                {
                    x: 12,
                    y: 10
                }, {
                    x: 14.7,
                    y: 10.6
                }
            ]
        },
        // // 15 twigL-3
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-3',
            className: 'twig',
            data: [
                {
                    x: 11.3,
                    y: 6.67
                }, {
                    x: 15.2,
                    y: 6.8
                }
            ]
        },
        // // 16 twigL-4
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-4',
            className: 'twig',
            data: [
                {
                    x: 12.1,
                    y: 7.42
                }, {
                    x: 13,
                    y: 9.22
                }
            ]
        },
        // // 17 twigL-5
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-5',
            className: 'twig',
            data: [
                {
                    x: 12.68,
                    y: 3.97
                }, {
                    x: 14.1,
                    y: 5.65
                }
            ]
        },
        // // 18 twigL-6
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-6',
            className: 'twig',
            data: [
                {
                    x: 14.4,
                    y: 4.28
                }, {
                    x: 15.9,
                    y: 3.6
                }
            ]
        },
        // // 19 twigL-7
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-7',
            className: 'twig',
            data: [
                {
                    x: 11.3,
                    y: 13.45
                }, {
                    x: 11.9,
                    y: 14.5
                }
            ]
        },
        // // 20 twigL-8
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-8',
            className: 'twig',
            data: [
                {
                    x: 10,
                    y: 4.28
                }, {
                    x: 11.9,
                    y: 5.3
                }
            ]
        },
        // // 21 twigL-9
        {
            type: 'line',
            visible: true,
            xAxis: 3,
            name: 'twigL-9',
            className: 'twig',
            data: [
                {
                    x: 11.6,
                    y: 1.43
                }, {
                    x: 13.9,
                    y: 2.8
                }
            ]
        },

        // // 22 twigR-1
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-1',
            className: 'twig',
            data: [
                {
                    x: 10.6,
                    y: 11.8
                }, {
                    x: 13.2,
                    y: 11.54
                }
            ]
        },
        // // 23 twigR-2
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-2',
            className: 'twig',
            data: [
                {
                    x: 11.68,
                    y: 9.8
                }, {
                    x: 14.43,
                    y: 10.45
                }
            ]
        },
        // //24 twigR-3
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-3',
            className: 'twig',
            data: [
                {
                    x: 13.25,
                    y: 7.1
                }, {
                    x: 15.2,
                    y: 6.8
                }
            ]
        },
        // 25  twigR-4
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-4',
            className: 'twig',
            data: [
                {
                    x: 11,
                    y: 6.32
                }, {
                    x: 12.68,
                    y: 8.99
                }
            ]
        },
        // 26 twigR-5
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-5',
            className: 'twig',
            data: [
                {
                    x: 11.9,
                    y: 4
                }, {
                    x: 13.2,
                    y: 6
                }
            ]
        },
        // 27 twigR-6
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-6',
            className: 'twig',
            data: [
                {
                    x: 14,
                    y: 4.9
                }, {
                    x: 15.6,
                    y: 4.4
                }
            ]
        },
        // 28 twigR-7
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-7',
            className: 'twig',
            data: [
                {
                    x: 11.3,
                    y: 12.6
                }, {
                    x: 11.9,
                    y: 14.5
                }
            ]
        },
        // 29 twigR-8
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-8',
            className: 'twig',

            data: [
                {
                    x: 10,
                    y: 4
                }, {
                    x: 11.3,
                    y: 5

                }
            ]
        },
        // 30 twigR-9
        {
            type: 'line',
            visible: true,
            xAxis: 4,
            name: 'twigR-9',
            className: 'twig',
            data: [
                {
                    x: 11.96,
                    y: 1.27
                }, {
                    x: 15.1,
                    y: 2.9
                }
            ]
        },
        // 31 item
        {
            type: 'item',
            visible: true,
            enableMouseTracking: false,
            xAxis: 4,
            name: 'item',
            className: 'spiral',
            marker: {
                radius: 200,
                symbol: 'circle'
            },
            tooltip: {
                enabled: false
            },
            zIndex: 1,
            dataLabels: {
                enabled: false
            },
            innerSize: '10%',
            outerSize: '400%',
            center: [20, 20],
            startAngle: 180,
            endAngle: 180,
            data: [
                {

                    y: 60
                }
            ]
        }
    ]
});