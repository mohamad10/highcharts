/* eslint-disable prefer-const, quote-props, jsdoc/require-description */

// left arrow
Highcharts.SVGRenderer.prototype.symbols.leftarrow = (x, y, w, h) => [
    'M', x + w / 2 - 1, y,
    'L', x + w / 2 - 1, y + h,
    x - w / 2 - 1, y + h / 2,
    'Z'
];

// right arrow
Highcharts.SVGRenderer.prototype.symbols.rightarrow = (x, y, w, h) => [
    'M', x + w / 2 + 1, y,
    'L', x + w / 2 + 1, y + h,
    x + w + w / 2 + 1, y + h / 2,
    'Z'
];

const dataScopes = {
    FD: 'Days with Frost',
    ID: 'Days with Ice',
    RR: 'Days with Rain',
    TN: 'Average Temperature',
    TX: 'Maximal Temperature'
};

const initialMin = Date.UTC(2010, 0, 5);
const minRange = 30 * 24 * 3600 * 1000; // 30 days
const maxRange = 2 * 365 * 24 * 3600 * 1000; // 2 years

let cityScope = 'New York';
let dataScope = 'TXC';
let temperatureScale = 'C';

// Load world map for Highcharts Dashboards
fetch(
    'https://code.highcharts.com/mapdata/custom/world.topo.json'
).then(
    response => response.json()
).then(async world => {
    Dashboards.board('container', {
        dataPool: {
            connectors: [{
                name: 'Active City',
                type: 'CSV',
                options: {
                    dataTable: {
                        aliases: {
                            'avg. ˚C': 'TNC',
                            'avg. ˚F': 'TNF',
                            'avg. ˚K': 'TN',
                            'max ˚C': 'TXC',
                            'max ˚F': 'TXF',
                            'max ˚K': 'TX',
                            'Frost': 'FD',
                            'Ice': 'ID',
                            'Rain': 'RR1'
                        },
                        modifier: {
                            type: 'Chain',
                            chain: [{
                                type: 'Range',
                                ranges: [{
                                    column: 'time',
                                    minValue: minRange,
                                    maxValue: maxRange
                                }]
                            }, {
                                type: 'Math',
                                columnFormulas: [{
                                    column: 'TNC',
                                    formula: '= E1 - 273.15'
                                }, {
                                    column: 'TNF',
                                    formula: '= E1 * 1.8 - 459.67'
                                }, {
                                    column: 'TXC',
                                    formula: '= F1 - 273.15'
                                }, {
                                    column: 'TXF',
                                    formula: '= F1 * 1.8 - 459.67'
                                }]
                            }]
                        }
                    }
                }
            }, {
                name: 'cities',
                type: 'CSV',
                options: {
                    csvURL: 'https://www.highcharts.com/samples/data/climate-cities.csv'
                }
            }, {
                name: 'New York',
                type: 'CSV',
                options: {
                    csvURL: 'https://assets.highcharts.com/dashboard-demodata/climate/cities/40.71_-74.01.csv'
                }
            }]
        },
        components: [{
            cell: 'time-range-selector',
            type: 'Highcharts',
            chartOptions: {
                chart: {
                    height: '80px',
                    styledMode: true,
                    type: 'spline'
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: ''
                },
                tooltip: {
                    enabled: false
                },
                series: [{
                    // type: 'spline',
                    name: 'Timeline',
                    data: buildDates(),
                    showInNavigator: false,
                    marker: {
                        enabled: false
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }],
                navigator: {
                    enabled: true,
                    handles: {
                        symbols: ['leftarrow', 'rightarrow'],
                        lineWidth: 0,
                        width: 8,
                        height: 14
                    },
                    series: [{
                        name: cityScope,
                        // data: active city is added after board creation
                        animation: false,
                        animationLimit: 0
                    }],
                    xAxis: {
                        endOnTick: true,
                        gridZIndex: 4,
                        labels: {
                            x: 1,
                            y: 22
                        },
                        opposite: true,
                        showFirstLabel: true,
                        showLastLabel: true,
                        startOnTick: true,
                        tickPosition: 'inside'
                    },
                    yAxis: {
                        maxPadding: 0.5
                    }
                },
                scrollbar: {
                    enabled: true,
                    barBorderRadius: 0,
                    barBorderWidth: 0,
                    buttonBorderWidth: 0,
                    buttonBorderRadius: 0,
                    height: 14,
                    trackBorderWidth: 0,
                    trackBorderRadius: 0
                },
                xAxis: {
                    visible: false,
                    min: initialMin,
                    minRange: minRange,
                    maxRange: maxRange
                },
                yAxis: {
                    visible: false
                }
            }
        }, {
            cell: 'world-map',
            type: 'Highcharts',
            chartConstructor: 'mapChart',
            chartOptions: {
                chart: {
                    map: world,
                    styledMode: true
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: dataScope[2] === 'C' ? 50 : 122,
                    min: dataScope[2] === 'C' ? 0 : 32,
                    stops: [
                        [0.0, '#4CAFFE'],
                        [0.3, '#53BB6C'],
                        [0.5, '#DDCE16'],
                        [0.6, '#DF7642'],
                        [0.7, '#DD2323']
                    ]
                },
                legend: {
                    enabled: false
                },
                mapNavigation: {
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    },
                    enabled: true,
                    enableMouseWheelZoom: false
                },
                mapView: {
                    maxZoom: 4
                },
                series: [{
                    type: 'map',
                    name: 'World Map'
                }, {
                    type: 'mappoint',
                    name: 'Cities',
                    // data: city points are added after board creation
                    animation: false,
                    animationLimit: 0,
                    allowPointSelect: true,
                    dataLabels: [{
                        align: 'left',
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{point.name}',
                        padding: 0,
                        verticalAlign: 'top',
                        x: -2,
                        y: 2
                    }, {
                        animation: false,
                        crop: false,
                        enabled: true,
                        format: '{y:.0f}',
                        inside: true,
                        padding: 0,
                        verticalAlign: 'bottom',
                        y: -16
                    }],
                    marker: {
                        enabled: true,
                        lineWidth: 2,
                        radius: 12,
                        states: {
                            hover: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            },
                            select: {
                                lineWidthPlus: 4,
                                radiusPlus: 0
                            }
                        },
                        symbol: 'mapmarker'
                    }
                }],
                title: {
                    text: void 0
                },
                tooltip: {
                    enabled: true,
                    positioner: function (width, _height, axisInfo) {
                        return {
                            x: (
                                axisInfo.plotX -
                                this.options.padding
                            ),
                            y: (
                                axisInfo.plotY +
                                this.options.padding +
                                5
                            )
                        };
                    },
                    shape: 'rect',
                    useHTML: true
                }
            }
        }, {
            cell: 'city-chart',
            type: 'Highcharts',
            connector: 'Active City',
            sync: {
                highlight: true
            },
            columnKeyMap: {
                time: null,
                FD: null,
                ID: null,
                RR1: null,
                TN: null,
                TX: null,
                TNC: null,
                TNF: null,
                TXC: null,
                TXF: null,
                Date: null
            },
            chartOptions: {
                chart: {
                    spacing: [40, 40, 40, 10],
                    styledMode: true,
                    type: 'spline',
                    animation: false,
                    animationLimit: 0
                },
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                colorAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    max: 50,
                    min: 0,
                    stops: [
                        [0.0, '#4CAFFE'],
                        [0.3, '#53BB6C'],
                        [0.5, '#DDCE16'],
                        [0.6, '#DF7642'],
                        [0.7, '#DD2323']
                    ]
                },
                series: [{
                    // type: 'spline',
                    name: cityScope,
                    animation: false,
                    animationLimit: 0,
                    marker: {
                        enabledThreshold: 0.5
                    }
                }],
                title: {
                    margin: 20,
                    text: dataScopes.TX,
                    x: 15,
                    y: 5
                },
                tooltip: {
                    enabled: true
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%e. %b'
                    }
                },
                yAxis: {
                    title: {
                        text: 'C'
                    }
                }
            }
        }, {
            cell: 'selection-grid',
            type: 'DataGrid',
            connector: 'Active City',
            sync: {
                highlight: true
            },
            dataGridOptions: {
                cellHeight: 38,
                editable: false,
                columns: {
                    time: {
                        show: false
                    },
                    FD: {
                        headerFormat: 'Days with Frost'
                    },
                    ID: {
                        headerFormat: 'Days with Ice'
                    },
                    RR1: {
                        headerFormat: 'Days with Rain'
                    },
                    TN: {
                        show: false
                    },
                    TX: {
                        show: false
                    },
                    TNC: {
                        headerFormat: 'Average Temperature °C'
                    },
                    TNF: {
                        headerFormat: 'Average Temperature °F'
                    },
                    TXC: {
                        headerFormat: 'Maximal Temperature °C'
                    },
                    TXF: {
                        headerFormat: 'Maximal Temperature °F'
                    }
                }
            },
            editable: true
        }, {
            cell: 'kpi-data',
            type: 'KPI',
            title: cityScope,
            value: 10,
            valueFormat: '{value:.0f}m'
        }, {
            cell: 'kpi-temperature',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('TN' + temperatureScale),
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-max-temperature',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('TX' + temperatureScale),
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-rain',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('RR1'),
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-ice',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('ID'),
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }, {
            cell: 'kpi-frost',
            type: 'KPI',
            chartOptions: buildKPIChartOptions('FD'),
            states: {
                active: {
                    enabled: true
                },
                hover: {
                    enabled: true
                }
            }
        }],
        editMode: {
            enabled: true,
            contextMenu: {
                enabled: true,
                icon: (
                    'https://code.highcharts.com/gfx/dashboard-icons/menu.svg'
                ),
                items: [
                    'editMode',
                    {
                        id: 'dark-mode',
                        type: 'toggle',
                        text: 'Dark mode'
                    }, {
                        id: 'fahrenheit',
                        type: 'toggle',
                        text: 'Fahrenheit'
                    }
                ]
            }
        },
        gui: {
            layouts: [{
                id: 'layout-1', // mandatory
                rows: [{
                    cells: [{
                        id: 'time-range-selector',
                        width: '100%'
                    }]
                }, {
                    cells: [{
                        id: 'world-map',
                        width: '50%'
                    }, {
                        id: 'kpi-layout',
                        width: '50%',
                        layout: {
                            rows: [{
                                cells: [{
                                    id: 'kpi-data',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-temperature',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-max-temperature',
                                    width: '33.333%',
                                    height: '204px'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-rain',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-ice',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-frost',
                                    width: '33.333%',
                                    height: '204px'
                                }]
                            }]
                        }
                    }]
                }, {
                    cells: [{
                        id: 'selection-grid',
                        width: '50%'
                    }, {
                        id: 'city-chart',
                        width: '50%'
                    }]
                }]
            }]
        }
    });
}).catch(e => {
    // Silent errors in the console
    console.error(e);
});

function buildDates() {
    const dates = [];

    for (let date = new Date(Date.UTC(1951, 0, 5)),
        dateEnd = new Date(Date.UTC(2010, 11, 25));
        date <= dateEnd;
        date = date.getUTCDate() >= 25 ?
            new Date(Date.UTC(
                date.getFullYear(),
                date.getUTCMonth() + 1,
                5
            )) :
            new Date(Date.UTC(
                date.getFullYear(),
                date.getUTCMonth(),
                date.getUTCDate() + 10
            ))
    ) {
        dates.push([date.getTime(), 0]);
    }

    return dates;
}

function buildKPIChartOptions(dataScope) {
    return {
        chart: {
            height: 166,
            margin: [8, 8, 16, 8],
            spacing: [8, 8, 8, 8],
            styledMode: true,
            type: 'solidgauge'
        },
        pane: {
            background: {
                innerRadius: '90%',
                outerRadius: '120%',
                shape: 'arc'
            },
            center: ['50%', '70%'],
            endAngle: 90,
            startAngle: -90
        },
        series: [{
            data: [],
            dataLabels: {
                format: '{y:.0f}',
                y: -34
            },
            animation: false,
            animationLimit: 0,
            enableMouseTracking: false,
            innerRadius: '90%',
            radius: '120%'
        }],
        title: {
            margin: 0,
            text: dataScopes[dataScope.substring(0, 2)],
            verticalAlign: 'bottom',
            widthAdjust: 0
        },
        yAxis: {
            labels: {
                distance: 4,
                y: 12
            },
            max: 50,
            min: 0,
            minorTickInterval: null,
            stops: [
                [0.0, '#4CAFFE'],
                [0.3, '#53BB6C'],
                [0.5, '#DDCE16'],
                [0.6, '#DF7642'],
                [0.7, '#DD2323']
            ],
            tickAmount: 2,
            visible: true
        }
    };
}
