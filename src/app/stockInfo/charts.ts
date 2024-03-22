import * as echarts from "echarts";

function calcColor(num: number) {
    if (num > 0) {
        return '#ef232a';
    } else if (num < 0) {
        return '#14b143';
    } else {
        return '#000';
    }
}

export function drawKLineChart(chart: any, dateList: string[], data: any[]) {
// prettier-ignore
    const colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
// prettier-ignore
    const volumes = [86160000, 79330000, 102600000, 104890000, 85230000, 115230000, 99410000, 90120000, 79990000, 107100000, 81020000, 91710000, 84510000, 118160000, 89390000, 89820000, 100210000, 102720000, 134120000, 83770000, 92570000, 109090000, 100920000, 136670000, 80100000, 97060000, 95020000, 81530000, 80020000, 85590000, 75790000, 87390000, 88560000, 86640000, 88440000, 103260000, 79120000, 95530000, 111990000, 87790000, 86480000, 79180000, 68940000, 73190000, 147390000, 78530000, 75560000, 82270000, 71870000, 78750000, 71260000, 69690000, 90540000, 101690000, 93740000, 94130000, 91950000, 248680000, 99380000, 85130000, 89440000];
    // const dataMA5 = calculateMA(5, data);
    // const dataMA10 = calculateMA(10, data);
    // const dataMA20 = calculateMA(20, data);
    const upColor = '#00da3c';
    const downColor = '#ec0000';
    const xAxisVisibleList = [
        Math.round(dateList.length / 4) * 1,
        Math.round(dateList.length / 4) * 2,
        Math.round(dateList.length / 4) * 3,
    ];
    // @ts-ignore
    const option = {
        // animation: false,
        color: colorList,
        // title: {
        //     left: 'center',
        //     text: 'Candlestick on Mobile'
        // },
        // legend: {
        //     top: 30,
        //     data: ['日K', 'MA5', 'MA10', 'MA20', 'MA30']
        // },
        // visualMap: {
        //     show: false,
        //     seriesIndex: 0,
        //     dimension: 2,
        //     pieces: [
        //         {
        //             value: 1,
        //             color: downColor
        //         },
        //         {
        //             value: -1,
        //             color: upColor
        //         }
        //     ]
        // },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            formatter: (params: any) => {
                // console.log(params);
                const [{ axisValue, borderColor, data: [,open, close, lowest, highest], dataIndex }] = params;
                const yesterdayClose = dataIndex === 0 ? data[0][0] : data[dataIndex - 1][1];

                const openColor = calcColor(open - yesterdayClose);
                const closeColor = calcColor(close - yesterdayClose);
                const lowestColor = calcColor(lowest - yesterdayClose);
                const highestColor = calcColor(highest - yesterdayClose);
                return `
<div style="margin: 0px 0 0;line-height:1;">
    <div style="margin: 0px 0 0;line-height:1;">
        <div style="font-size:14px;color:#000;font-weight:400;line-height:1;">${axisValue}</div>
        <div style="margin: 10px 0 0;line-height:1;">
            <div style="margin: 0px 0 0;line-height:1;">
                <div style="margin: 0px 0 0;line-height:1;"><span
                        style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${borderColor};"></span><span
                        style="font-size:14px;color:#000;font-weight:400;margin-left:2px">日K</span><span
                        style="float:right;margin-left:20px;font-size:14px;color:#000;font-weight:900"></span>
                    <div style="clear:both"></div>
                </div>
                <div style="margin: 10px 0 0;line-height:1;"><span
                        style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:${openColor};"></span><span
                        style="font-size:14px;color:#000;font-weight:400;margin-left:2px">开</span><span
                        style="float:right;margin-left:20px;font-size:14px;color:${openColor};font-weight:900">${open}</span>
                    <div style="clear:both"></div>
                </div>
                <div style="margin: 10px 0 0;line-height:1;"><span
                        style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:${closeColor};"></span><span
                        style="font-size:14px;color:#000;font-weight:400;margin-left:2px">收</span><span
                        style="float:right;margin-left:20px;font-size:14px;color:${closeColor};font-weight:900">${close}</span>
                    <div style="clear:both"></div>
                </div>
                <div style="margin: 10px 0 0;line-height:1;"><span
                        style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:${lowestColor};"></span><span
                        style="font-size:14px;color:#000;font-weight:400;margin-left:2px">低</span><span
                        style="float:right;margin-left:20px;font-size:14px;color:${lowestColor};font-weight:900">${lowest}</span>
                    <div style="clear:both"></div>
                </div>
                <div style="margin: 10px 0 0;line-height:1;"><span
                        style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:${highestColor};"></span><span
                        style="font-size:14px;color:#000;font-weight:400;margin-left:2px">高</span><span
                        style="float:right;margin-left:20px;font-size:14px;color:${highestColor};font-weight:900">${highest}</span>
                    <div style="clear:both"></div>
                </div>
                <div style="clear:both"></div>
            </div>
            <div style="clear:both"></div>
        </div>
        <div style="clear:both"></div>
    </div>
    <div style="clear:both"></div>
</div>
                `
            },
            // position: function (pos, params, el, elRect, size) {
            //     const obj = {
            //         top: 10
            //     };
            //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            //     return obj;
            // }
            // extraCssText: 'width: 170px'
        },
        // axisPointer: {
        //     link: [
        //         {
        //             xAxisIndex: [0, 1]
        //         }
        //     ]
        // },
        // dataZoom: [
        //     {
        //         type: 'slider',
        //         xAxisIndex: [0, 1],
        //         realtime: false,
        //         start: 20,
        //         end: 70,
        //         top: 65,
        //         height: 20,
        //         handleIcon:
        //             'path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        //         handleSize: '120%'
        //     },
        //     {
        //         type: 'inside',
        //         xAxisIndex: [0, 1],
        //         start: 40,
        //         end: 70,
        //         top: 30,
        //         height: 20
        //     }
        // ],
        xAxis: [
            {
                type: 'category',
                data: dateList,
                boundaryGap: true,
                axisLine: { onZero: false, lineStyle: { color: 'rgb(204, 204, 204)' } },
                axisLabel: {
                    color: '#000',
                    interval: (index: number, val: string) => xAxisVisibleList.includes(index),
                    // @ts-ignore
                    // formatter: function (value) {
                    //     return echarts.format.formatTime('YYYY-MM-dd', value);
                    // }
                },
                axisTick: {
                    show: true,
                    inside: true,
                    alignWithLabel: true,
                    length: 500,
                    lineStyle: {
                        color: 'rgb(234, 234, 234)',
                        type: 'dashed',
                    }
                },
                splitLine: {
                    show: true,
                    interval: (i: number) => {
                        console.log(i)
                        return [0].includes(i)
                    },
                    lineStyle: {
                        color: 'rgb(204, 204, 204)',
                        // type: 'dashed'
                    }
                },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                    show: true
                }
            },
            // {
            //     type: 'category',
            //     // gridIndex: 1,
            //     data: dateList,
            //     boundaryGap: false,
            //     splitLine: { show: false },
            //     axisLabel: { show: false },
            //     axisTick: { show: false },
            //     axisLine: { lineStyle: { color: '#777' } },
            //     min: 'dataMin',
            //     max: 'dataMax',
            //     // axisPointer: {
            //     //     type: 'shadow',
            //     //     label: { show: false },
            //     //     triggerTooltip: true,
            //     //     handle: {
            //     //         show: true,
            //     //         margin: 30,
            //     //         color: '#B80C00'
            //     //     }
            //     // }
            // }
        ],
        yAxis: [
            {
                scale: true,
                splitNumber: 1,
                axisLine: { lineStyle: { color: 'rgb(204, 204, 204)' } },
                splitLine: { show: true, lineStyle: { color: 'rgb(204, 204, 204)' } },
                axisTick: { show: false },
                axisLabel: {
                    show: false,
                    inside: true,
                    formatter: '{value}\n'
                }
            },
            // {
            //     scale: true,
            //     // gridIndex: 1,
            //     splitNumber: 2,
            //     axisLabel: { show: false },
            //     axisLine: { show: false },
            //     axisTick: { show: false },
            //     splitLine: { show: false }
            // }
        ],
        grid: [
            {
                left: 0,
                right: 1,
                top: 0,
                bottom: 20,
                containLabel: false,
            },
            // {
            //     left: 0,
            //     right: 0,
            //     height: 0,
            //     top: 0
            // }
        ],
        // graphic: [
        //     {
        //         type: 'group',
        //         left: 'center',
        //         top: 70,
        //         width: 300,
        //         bounding: 'raw',
        //         children: [
        //             {
        //                 id: 'MA5',
        //                 type: 'text',
        //                 style: { fill: colorList[1], font: labelFont },
        //                 left: 0
        //             },
        //             {
        //                 id: 'MA10',
        //                 type: 'text',
        //                 style: { fill: colorList[2], font: labelFont },
        //                 left: 'center'
        //             },
        //             {
        //                 id: 'MA20',
        //                 type: 'text',
        //                 style: { fill: colorList[3], font: labelFont },
        //                 right: 0
        //             }
        //         ]
        //     }
        // ],
        series: [
            // {
            //     name: 'Volume',
            //     type: 'bar',
            //     xAxisIndex: 1,
            //     yAxisIndex: 1,
            //     itemStyle: {
            //         color: '#7fbe9e'
            //     },
            //     emphasis: {
            //         itemStyle: {
            //             color: '#140'
            //         }
            //     },
            //     data: volumes
            // },
            {
                type: 'candlestick',
                name: '日K',
                data: data,
                itemStyle: {
                    color: '#ef232a',
                    color0: '#14b143',
                    borderColor: '#ef232a',
                    borderColor0: '#14b143'
                },
                emphasis: {
                    itemStyle: {
                        color: 'black',
                        color0: '#444',
                        borderColor: 'black',
                        borderColor0: '#444'
                    }
                }
            },
            // {
            //     name: 'MA5',
            //     type: 'line',
            //     data: dataMA5,
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1
            //     }
            // },
            // {
            //     name: 'MA10',
            //     type: 'line',
            //     data: dataMA10,
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1
            //     }
            // },
            // {
            //     name: 'MA20',
            //     type: 'line',
            //     data: dataMA20,
            //     smooth: true,
            //     showSymbol: false,
            //     lineStyle: {
            //         width: 1
            //     }
            // }
        ]
    };
    // const chart = echarts.init(document.getElementById(id));
    chart.setOption(option, true);
}

export function drawTimeShareChart(chart: any, xList: string[], list: number[]) {
    const intervalList = [
        Math.ceil(xList.length / 5) * 1,
        Math.ceil(xList.length / 5) * 2,
        Math.ceil(xList.length / 5) * 3,
        Math.ceil(xList.length / 5) * 4,
        xList.length,
    ]
    const option = {
        grid: {
            top: 0,
            bottom: 20,
            left: 0,
            right: 1,
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            // formatter: '{}: {}',
            // position: function (pos, params, el, elRect, size) {
            //     const obj = {
            //         top: 10
            //     };
            //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            //     return obj;
            // }
            // extraCssText: 'width: 170px'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xList,
            axisLine: {
              lineStyle: {
                  color: 'rgb(204, 204, 204)'
              }
            },
            axisTick: {
              show: false,
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgb(204, 204, 204)'
                }
            },
            axisLabel: {
                color: '#000',
                interval: (index: number, value: string) => ['09:30', '10:30', '11:30', '14:00', '15:00'].includes(value),
                alignMinLabel: 'left',
                alignMaxLabel: 'right',
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            splitNumber: 1,
            // boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: 'rgb(204, 204, 204)'
                }
            },
            axisLabel: {
                inside: true,
                margin: 4,
                lineHeight: 20,
                verticalAlignMinLabel: 'bottom',
                verticalAlignMaxLabel: 'top',
                color: function (value: number, index: number) {
                    // console.log(index);
                    return ['red', 'black', 'green'].reverse()[index];
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgb(204, 204, 204)'
                }
            },
        },
        series: [
            {
                data: list,
                type: 'line',
                showSymbol: false,
            }
        ]
    }
    // const chart = echarts.init(document.getElementById(id));
    chart.setOption(option, true);
}

export function drawMoneyFlowChart(id: string, data: number[]) {
    const labelRight = {
        position: 'right'
    };
    const option = {
        tooltip: {
            show: false,
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            top: -4.5,
            bottom: -4.5,
            left: 0,
            right: 0,
        },
        xAxis: {
            type: 'value',
            show: false,
            position: 'top',
            splitLine: {
                show: false,
                lineStyle: {
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            // boundaryGap: false,
            axisLine: { show: true, lineStyle: {color: 'rgb(201, 205, 212)'  } },
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
        },
        series: [
            {
                name: 'Cost',
                type: 'bar',
                stack: 'Total',
                // barGap: 10,
                barCategoryGap: 9,
                // barWidth: 12,
                itemStyle: {
                    color: ({ dataIndex, data }: any) => data.value > 0 ? 'rgb(255, 64, 17)' : 'rgb(0, 124, 87)',
                },
                label: {
                    show: false,
                    formatter: '{b}'
                },
                data: data.map(i => ({ value: i, label: { position: i > 0 ? 'right' : 'left' } }))
            }
        ]
    };
    const chart = echarts.init(document.getElementById(id));
    chart.setOption(option);
}