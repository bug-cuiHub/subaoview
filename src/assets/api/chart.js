import echarts from 'echarts/lib/echarts'

function Chart(chartType, data, id) {
    this.chartType = chartType;
    this.data = data;
    this.id = id;
}
Chart.prototype.getsoption = function () {
    let option = null;
    let type = this.chartType;
    this[type] ? option = this[type](this.data) : option = null;
    return option;
}
// 折线图
Chart.prototype.Line = function (data) {
    return {
        title: {
        },
        tooltip: {},
        xAxis: {
            boundaryGap: false,
            data: ["最低海拔", "最低海拔", "平均海拔", "平均海拔", "最高海拔", "最高海拔"],
            show: false
        },
        yAxis: {
            name: '海拔（米）',
            axisLabel: {
                textStyle: {
                    fontSize: 10
                }
            }
        },
        series: [
            {
                name: '海拔',
                type: 'line',
                areaStyle: {
                    normal: {
                        color: {
                            x: 1,
                            y: 1,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0.1, color: '#dda0dd' // 右边的颜色
                            },
                            {
                                offset: 0.3, color: '#87cefa' // 中间的颜色
                            },
                            {
                                offset: 0.5, color: '#87cefa' // 中间的颜色
                            },
                            {
                                offset: 1, color: '#6495ed' // 左边的颜色
                            }],
                            globalCoord: false
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        color: {
                            x: 1,
                            y: 1,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0.1, color: '#dda0dd' // 右边的颜色
                            },
                            {
                                offset: 0.3, color: '#87cefa' // 中间的颜色
                            },
                            {
                                offset: 0.5, color: '#87cefa' // 中间的颜色
                            },
                            {
                                offset: 1, color: '#6495ed' // 左边的颜色
                            }],
                            globalCoord: false
                        }
                    }
                },
                data: [
                    {
                        value: data[0],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{b}\n{c}m',
                                offset: [40, 0],
                                textStyle: {
                                    color: '#6495ed'
                                }
                            }
                        },
                    },
                    {
                        value: data[0],
                    },
                    {
                        value: data[1],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{b}\n{c}m',
                                offset: [40, 0],
                                textStyle: {
                                    color: '#87cefa'
                                }
                            }
                        },
                    },
                    {
                        value: data[1],
                    },
                    {
                        value: data[2],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{b}\n{c}m',
                                offset: [40, 0],
                                textStyle: {
                                    color: '#dda0dd'
                                }
                            }
                        },
                    },
                    {
                        value: data[2],
                    }
                ]
            }
        ]
    }
}
// 铅笔状柱状图
Chart.prototype.PencilBar = function (data) {
    return {
        title: {
        },
        tooltip: {},
        xAxis: {
            data: [
                '第一产业', '第二产业', '第三产业',
            ],
            axisLabel: {
                textStyle: {
                    fontSize: 10
                }
            }
        },
        yAxis: {
            name: '经济(亿元)',
            axisLabel: {
                textStyle: {
                    fontSize: 10
                }
            }
        },
        label: {
            normal: {
                textStyle: {
                    fontSize: 13
                }
            }
        },
        series: [
            {
                type: 'bar',
                data: [
                    {
                        value: data[0],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c}亿元'
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [100, 100, 0, 0],
                                color: '#ffa500'
                            }
                        }
                    },
                    {
                        value: data[1],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c}亿元'
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [100, 100, 0, 0],
                                color: '#dc143c'
                            }
                        }
                    },
                    {
                        value: data[2],
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{c}亿元'
                            }
                        },
                        itemStyle: {
                            normal: {
                                barBorderRadius: [100, 100, 0, 0],
                                color: '#ba55d3'
                            }
                        }
                    }
                ],
                barWidth: '20%'
            },
        ],
    }
}
// 渐变柱状图
Chart.prototype.ShadowBar = function (data) {
    return {
        title: {
        },
        tooltip: {
        },
        xAxis: {
            data: ["最低海拔", "平均海拔", "最高海拔"],
            show: false,
            axisLabel: {
                textStyle: {
                    fontSize: 10
                }
            }
        },
        yAxis: {
            name: '海拔（米）',
            axisLabel: {
                textStyle: {
                    fontSize: 10
                }
            }
        },
        series: [
            {
                type: 'bar',
                data: [
                    {
                        value: data[0],
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
                                    offset: 0,
                                    color: '#ffffff' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#ffe4b5' // 100% 处的颜色
                                }], false)
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{b}\n{c}m',
                                textStyle: {
                                    color: '#ffa500'
                                }
                            }
                        },
                    },
                    {
                        value: data[1],
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
                                    offset: 0,
                                    color: '#ffffff' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#ffb6c1' // 100% 处的颜色
                                }], false)
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{b}\n{c}m',
                                textStyle: {
                                    color: '#dc143c'
                                }
                            }
                        },
                    },
                    {
                        value: data[2],
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(1, 1, 1, 0, [{
                                    offset: 0,
                                    color: '#ffffff' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: '#dda0dd' // 100% 处的颜色
                                }], false)
                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: '{b}\n{c}m',
                                textStyle: {
                                    color: '#ba55d3'
                                }
                            }
                        },
                    },
                ],
                barWidth: '40%'
            }
        ]
    }
}
// 环状图
Chart.prototype.Pie = function (data) {
    return {
        series: [{
            name: '人口类型比例',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
                normal: {
                    formatter: '{c}万人\n{b}\n{d}%\n',
                    textStyle: {
                        fontSize: 12
                    }
                },
                position: 'outside'
            },
            labelLine: {
                smooth: true,
                length: 20,
                length2: 5
            },
            clockwise: false,
            data: [{
                value: data[1],
                name: '乡村人口',
                itemStyle: {
                    normal: {
                        color: '#ffa500',
                        textStyle: {
                            fontSize: 30
                        }
                    }
                }
            },
            {
                value: data[0],
                name: '城市人口',
                itemStyle: {
                    normal: {
                        color: '#dc143c',
                        textStyle: {
                            fontSize: 30
                        }
                    }
                }
            },
            ]
        }],
        tooltip: {
            show: true,
            formatter: '{b}比例:{d}%'
        }
    }
}
export default Chart;