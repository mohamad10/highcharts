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

setupDashboards();

async function setupDashboards() {
    const board = Dashboards.board('container', {
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
                                    id: 'kpi-city',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-TN',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-TX',
                                    width: '33.333%',
                                    height: '204px'
                                }]
                            }, {
                                cells: [{
                                    id: 'kpi-RR',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-ID',
                                    width: '33.333%',
                                    height: '204px'
                                }, {
                                    id: 'kpi-FD',
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
        },
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
        dataPool: {
            connectors: [{
                name: 'Active City',
                type: 'CSV',
                options: {
                    dataTable: {
                        aliases: {
                            'y': dataScope
                        },
                        modifier: {
                            type: 'Range',
                            ranges: [{
                                column: 'time',
                                minValue: minRange,
                                maxValue: maxRange
                            }]
                        }
                    }
                }
            }, {
                name: 'Cities',
                type: 'CSV',
                options: {
                    csvURL: 'https://www.highcharts.com/samples/data/' +
                        'climate-cities.csv',
                    dataTable: {
                        aliases: {
                            'name': 'city'
                        }
                    }
                }
            }, {
                name: 'New York',
                type: 'CSV',
                options: {
                    csvURL: 'https://assets.highcharts.com/' +
                        'dashboard-demodata/climate/cities/40.71_-74.01.csv',
                    dataTable: {
                        modifier: {
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
                        }
                    }
                }
            }]
        }
    });

    console.log(board); // for debugging

    const activeCityTable = await board.dataPool
        .getConnectorTable('Active City');
    const cityTable = await board.dataPool.getConnectorTable('New York');

    activeCityTable.setColumns(cityTable.getColumns());

    await setupTimeRangeSelector(board);
    await setupWorldMap(board);
    await setupKPICity(board);
    await setupKPIData(board, 'TNC');
    await setupKPIData(board, 'TXC');
    await setupKPIData(board, 'RR1');
    await setupKPIData(board, 'ID');
    await setupKPIData(board, 'FD');
    await setupSelectionGrid(board);
    await setupCityChart(board);
}

async function setupTimeRangeSelector(board) {
    const activeCityTable =
        await board.dataPool.getConnectorTable('Active City');

    board.setComponents([{
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
                data: (dates => {
                    const dateEnd = new Date(Date.UTC(2010, 11, 25));
                    let date = new Date(Date.UTC(1951, 0, 5));
                    while (date <= dateEnd) {
                        dates.push([date.getTime(), 0]);
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
                            ));
                    }
                    return dates;
                })([]),
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
                    data: activeCityTable.getColumn(dataScope),
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
    }]);
}

async function setupWorldMap(board) {
    const world = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    );
    const citiesTable = await board.dataPool.getConnectorTable('Cities');

    board.setComponents([{
        cell: 'world-map',
        type: 'Highcharts',
        chartConstructor: 'mapChart',
        chartOptions: {
            chart: {
                map: await world.json(),
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
                data: citiesTable.getRowObjects(
                    void 0,
                    void 0,
                    ['lat', 'lon', 'name', 'y']
                ),
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
                events: {
                    click: async function (e) {
                        const activeCityTable = await board.dataPool
                            .getConnectorTable('Active City');
                        const point = e.point;
                        const city = point.name;
                        const cityTable = await board.dataPool
                            .getConnectorTable(city);

                        cityScope = city;

                        activeCityTable.setColumns(cityTable.getColumns());
                    }
                },
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
                },
                tooltip: {
                    footerFormat: '',
                    headerFormat: '',
                    pointFormat: '<b>{point.name}</b><br>{y:.0f}'
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
    }]);
}

async function setupKPICity(board) {
    const activeCityTable = await board.dataPool
        .getConnectorTable('Active City');

    let kpiComponent;

    board.setComponents([{
        cell: 'kpi-city',
        type: 'KPI',
        title: cityScope,
        subtitle: 'Elevation',
        value: 10,
        valueFormat: '{value:.0f}m',
        mount: function () {
            kpiComponent = this;
        }
    }]);

    activeCityTable.on('afterSetColumns', () => {
        const citiesTable = board.dataPool.getConnectorTable('Cities');

        kpiComponent.update({
            title: cityScope,
            value: citiesTable.getCell(
                'elevation',
                citiesTable.getRowIndexBy('name', cityScope)
            )
        });
    });
}

async function setupKPIData(board, dataScope) {
    // const activeCityTable = await board.dataPool
    //     .getConnectorTable('Active City');
    // const cityTable = await board.dataPool.getConnectorTable(cityScope);
    // const minRangeTime = activeCityTable.getModifier().options.minValue;
    const dataValue = 0; // cityTable.getCellAsNumber(
    //     dataScope,
    //     cityTable.getRowIndexBy('time', minRangeTime)
    // ) || 0;

    board.setComponents([{
        cell: `kpi-${dataScope.substring(0, 2)}`,
        type: 'KPI',
        chartOptions: {
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
                data: [dataValue],
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
        },
        states: {
            active: {
                enabled: true
            },
            hover: {
                enabled: true
            }
        }
    }]);
}

async function setupSelectionGrid(board) {
    board.setComponents([{
        cell: 'selection-grid',
        type: 'DataGrid',
        connector: await board.dataPool.getConnector('Active City'),
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
                    headerFormat: 'Frost'
                },
                ID: {
                    headerFormat: 'Ice'
                },
                RR1: {
                    headerFormat: 'Rain'
                },
                TN: {
                    show: false
                },
                TX: {
                    show: false
                },
                TNC: {
                    headerFormat: 'avg. ˚C'
                },
                TNF: {
                    show: false // headerFormat: 'avg. °F'
                },
                TXC: {
                    headerFormat: 'max. °C'
                },
                TXF: {
                    show: false // headerFormat: 'max. °F'
                }
            }
        },
        editable: true
    }]);
}

async function setupCityChart(board) {
    board.setComponents([{
        cell: 'city-chart',
        type: 'Highcharts',
        connector: await board.dataPool.getConnector('Active City'),
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
    }]);
}
