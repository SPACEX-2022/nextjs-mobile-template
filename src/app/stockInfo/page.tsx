'use client'
import * as echarts from 'echarts';
import {useEffect, useRef, useState} from "react";
import styles from './styles.module.css';
import {CapsuleTabs, Grid, NavBar, Skeleton} from "antd-mobile";
import {drawKLineChart, drawMoneyFlowChart, drawTimeShareChart} from "@/app/stockInfo/charts";
import {useRouter, useSearchParams} from "next/navigation";
import {request} from "@/services";
import {useEventListener} from "ahooks";
import {useMounted} from "@/app/useMounted";
import {data} from "@/app/data";

export default function StockInfo() {
    const [pageLoading, setPageLoading] = useState(true)
    const mounted = useMounted();
    const router = useRouter();
    const searchParams = useSearchParams()
    const [activeKey, setActiveKey] = useState('today');
    const chart = useRef<any>(null);
    const response = useRef<any>({});
    const name = searchParams.get('name');
    if (typeof document === 'undefined') return null;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        document.title = name!;

        Promise.all([
            request('/api/visual/data/common/timeline',{
                method: 'POST',
                body: JSON.stringify({ code: '000001.SH', time: 1710731514000 }),
            }),
            request('/api/visual/data/common/kline',{
                method: 'POST',
                body: JSON.stringify({ code: '000001.SH', time: 1710731514000 }),
            }),
        ]).then(([timelineData, kLineData]) => {
            response.current.timelineData = timelineData;
            response.current.kLineData = kLineData;

            setPageLoading(false);
        })
    }, [])

    useEffect(() => {
        if (!pageLoading) {
            chart.current = echarts.init(document.getElementById('main'));

            // drawTimeShareChart('main')
            // drawKLineChart('main')
            drawMoneyFlowChart('moneyFlowChart')

            drawTodayChart();
        }
    }, [pageLoading]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener('mouseup', () => {
        console.log(222, chart.current)
        if (chart.current) {
            chart.current.dispatchAction({
                type: 'hideTip'
            })
            chart.current.dispatchAction({
                type: 'updateAxisPointer',
                currTrigger: 'leave'
            });
        }
    }, { target: document.body })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener('touchend', () => {
        console.log(222, chart.current)
        if (chart.current) {
            chart.current.dispatchAction({
                type: 'hideTip'
            })
            chart.current.dispatchAction({
                type: 'updateAxisPointer',
                currTrigger: 'leave'
            });
        }
    }, { target: document.body })

    // useEventListener('dragstart', e => {
    //     e.preventDefault();
    //     e.stopPropagation();
    // }, { target: document.body, passive: true })

    const drawTodayChart = () => {
        const data = response.current.timelineData.dataResult[0].lineChartComp.value;
        console.log(222, response.current.timelineData, data)
        const list: number[] = [];
        const xList: string[] = [];
        data.slice(1).forEach(([time, val]: any[]) => {
            xList.push(time);
            list.push(parseFloat(val));
        })
        drawTimeShareChart(chart.current, xList, list)
    }

    const drawMonthChart = () => {
        const data = response.current.kLineData.dataResult[0].lineChartComp.value;
        console.log(222, response.current.kLineData, data)
        const dateList: string[] = [];
        const kLineChart: number[][] = [];
        data.slice(1).forEach(([date, openPrice, closePrice, lowestPrice, highestPrice, quoteChange, riseAndFallVal]: any[]) => {
            dateList.push(date);
            kLineChart.push([openPrice, closePrice, lowestPrice, highestPrice]);
        })
        drawKLineChart(chart.current, dateList, kLineChart)
        // data.slice(1).forEach(([time, val]: any[]) => {
        //     xList.push(time);
        //     list.push(parseFloat(val));
        // })
        // drawTimeShareChart('main', xList, list)
    }

    const onChange = (key: string) => {
        setActiveKey(key)
        if (key === 'today') {
            drawTodayChart();
        } else {
            drawMonthChart();
        }
    }

    const back = () => {
        router.back();
    }

    if (pageLoading) {
        return (
            <div className={styles.container}>
                <Skeleton.Title animated />
                <Skeleton.Paragraph lineCount={7} animated />
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.stockInfo}>
                <div className={styles.stockName}>{ name }</div>
                <div className={styles.stockCode}>（002340）</div>
            </div>
            <div className={styles.stockData}>
                <div className={styles.priceData}>
                    <div className={styles.price}>6.56</div>
                    <div className={styles.upPrice}>0.45 7.36%</div>
                </div>
                <div className={styles.tranactionData}>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>高：</span>
                        <span className={styles.dataValue}>6.70</span>
                    </div>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>低：</span>
                        <span className={styles.dataValue}>6.70</span>
                    </div>
                </div>
                <div className={styles.tranactionData}>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>开：</span>
                        <span className={styles.dataValue}>6.70</span>
                    </div>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>换：</span>
                        <span className={styles.dataValue}>9.13%</span>
                    </div>
                </div>
                <div className={styles.tranactionData}>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>量：</span>
                        <span className={styles.dataValue}>234万手</span>
                    </div>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>额：</span>
                        <span className={styles.dataValue}>6.70亿</span>
                    </div>
                </div>
            </div>
            <CapsuleTabs activeKey={activeKey} onChange={onChange} className={styles.dateSelect}>
                <CapsuleTabs.Tab title='今日' key='today' />
                <CapsuleTabs.Tab title='1个月' key='month' />
            </CapsuleTabs>
            <div id="main" className={styles.chart} ></div>
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    今日资金流向（万元）
                </div>
                <div className={styles.sectionContent}>
                    <div className={styles.moneyFlowDataWrapper}>
                        <div className={styles.moneyFlowInfo}>
                            <div className={styles.moneyFlowLabelWrap}>
                                <div className={styles.moneyFlowLabel}>主力流入</div>
                                <div className={styles.moneyFlowLabel}>主力流出</div>
                                <div className={styles.moneyFlowLabel}>净流入</div>
                            </div>
                            <div className={styles.moneyFlowValWrap}>
                                <div className={styles.moneyFlowVal}>45235</div>
                                <div className={styles.moneyFlowVal}>45235</div>
                                <div className={styles.moneyFlowVal}>-45235</div>
                            </div>
                        </div>
                        <div className={styles.moneyFlowData}>
                            <div className={styles.moneyFlowLabelWrap}>
                                <div className={styles.moneyFlowLabel}>大单</div>
                                <div className={styles.moneyFlowLabel}>大单</div>
                                <div className={styles.moneyFlowLabel}>大单</div>
                            </div>
                            <div id="moneyFlowChart" className={styles.moneyFlowChart}></div>
                            <div className={styles.moneyFlowValWrap}>
                                <div className={styles.moneyFlowVal}>12345</div>
                                <div className={styles.moneyFlowVal}>2345</div>
                                <div className={styles.moneyFlowVal}>23456</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    盘口
                </div>
                <div className={styles.sectionContent}>
                    <Grid columns={3} gap={8}>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>开盘价：</div>
                                <div className={styles.transactionDataValue}>45.3</div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>均价：</div>
                                <div className={styles.transactionDataValue}>45.3</div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>最高价：</div>
                                <div className={styles.transactionDataValue}>45.3</div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>最低价：</div>
                                <div className={styles.transactionDataValue}>45.3</div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>量比：</div>
                                <div className={styles.transactionDataValue}>45.3</div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>换手率：</div>
                                <div className={styles.transactionDataValue}>45.3%</div>
                            </div>
                        </Grid.Item>
                    </Grid>
                    <div className={styles.divisionLine}></div>
                    <Grid columns={3} gap={8}>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>涨停：</div>
                                <div className={styles.transactionDataValue}>45.3</div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>跌停：</div>
                                <div className={styles.transactionDataValue}>45.3</div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>总手：</div>
                                <div className={styles.transactionDataValue}>4533万</div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>金额：</div>
                                <div className={styles.transactionDataValue}>45.3亿</div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>振幅：</div>
                                <div className={styles.transactionDataValue}>45%</div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>委比：</div>
                                <div className={styles.transactionDataValue}>45.32%</div>
                            </div>
                        </Grid.Item>
                    </Grid>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    区间数据
                </div>
                <div className={styles.sectionContent}>
                    <Grid columns={2} gap={8}>
                        <Grid.Item>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>3日涨跌幅：</div>
                                <div className={styles.intervalDataValue}></div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>3日日均换手率：</div>
                                <div className={styles.intervalDataValue}></div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>3日日均成交额：</div>
                                <div className={styles.intervalDataValue}></div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>5日涨跌幅：</div>
                                <div className={styles.intervalDataValue}></div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>5日日均换手率：</div>
                                <div className={styles.intervalDataValue}></div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>5日日均成交额：</div>
                                <div className={styles.intervalDataValue}></div>
                            </div>
                        </Grid.Item>
                    </Grid>
                </div>
            </div>
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    相关线索
                </div>
                <div className={styles.sectionContent}>
                    <ul className={styles.clueUl}>
                        <li className={styles.clueLi}>
                            <div className={styles.clueTime}>
                                2023-11-26
                            </div>
                            <div className={styles.clueLine}></div>
                            <div className={styles.clueText}>
                                赛力斯集团回应华为成立智能汽车新公司：已收到共同投资的邀请
                            </div>
                        </li>
                        <li className={styles.clueLi}>
                            <div className={styles.clueTime}>
                                2024-10-09
                            </div>
                            <div className={styles.clueLine}></div>
                            <div className={styles.clueText}>
                                问界新M7引发“涟漪效应”：M9盲订超8千台，赛力斯销量涨六成
                            </div>
                        </li>
                        <li className={styles.clueLi}>
                            <div className={styles.clueTime}>
                                2023-09-28
                            </div>
                            <div className={styles.clueLine}></div>
                            <div className={styles.clueText}>
                                主力资金监控：赛力斯净买入超10亿元
                            </div>
                        </li>
                        <li className={styles.clueLi}>
                            <div className={styles.clueTime}>
                                2023-09-26
                            </div>
                            <div className={styles.clueLine}></div>
                            <div className={styles.clueText}>
                                博俊科技：已为赛力斯问界M9供应车身件
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}