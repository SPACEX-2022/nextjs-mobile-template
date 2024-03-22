'use client'
import * as echarts from 'echarts';
import {useEffect, useRef, useState} from "react";
import styles from './styles.module.css';
import {CapsuleTabs, Grid, NavBar, ResultPage, Skeleton} from "antd-mobile";
import {drawKLineChart, drawMoneyFlowChart, drawTimeShareChart} from "@/app/stockInfo/charts";
import {useRouter, useSearchParams} from "next/navigation";
import {request} from "@/services";
import {useEventListener, useLatest, useSetState} from "ahooks";
import {useMounted} from "@/app/useMounted";
import {data} from "@/app/data";
import {random, RandomPercent} from "@/utils";
import dayjs from "dayjs";

export default function StockInfo() {
    const [pageLoading, setPageLoading] = useState(true)
    const [pageError, setPageError] = useSetState({
        show: false,
        title: 'Error',
        desc: '服务器出错，请稍后重试',
    })
    const mounted = useMounted();
    const router = useRouter();
    const searchParams = useSearchParams()
    const [activeKey, setActiveKey] = useState('today');
    const chart = useRef<any>(null);
    const [secucode, setSecucode] = useState<string>('000001.SH');
    const response = useRef<any>({});
    const name = searchParams.get('name');
    const latestActiveKeyRef = useLatest(activeKey);

    const [randomData] = useSetState({
        vol: random(100, 1000),
        turnoverRate: random(1, 10, 2),
        limit: random(1, 10, 2),
        mainInFlow: random(1, 10, 2),
        mainOutFlow: random(1, 10, 2),
        netFlow: random(1, 10, 2),
        largeOrder: 1.94 || random(-3, 3, 2),
        bigOrder: -0.87 || random(-3, 3, 2),
        midOrder: -1.27 || random(-3, 3, 2),
        smallOrder: 0.19 || random(-3, 3, 2),
    })
    const [demoData, setDemoData] = useSetState({
        yesterdayClose: 0,
        open: 0,
        close: 0,
        lowest: 0,
        highest: 0,
        upDownRange: 0,
        upDownValue: 0,
        ...randomData,
    })


    if (typeof document === 'undefined') return null;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        document.title = name!;

        request('/magicvideo/visual/dict/companyQry',{
            method: 'POST',
            body: JSON.stringify({ criterion: name }),
        }).then((res) => {
            if (res.code !== '0') {
                setPageError({
                    desc: res.message
                })
                throw new Error();
            }

            // const prodCode = '000001.SH'
            const prodCode = res.dataResult.prodShortnameMatch[0].prodCode
            setSecucode(prodCode)
            return Promise.all([
                request('/magicvideo/visual/data/common/timeline',{
                    method: 'POST',
                    body: JSON.stringify({ code: prodCode, time: 1710991010000 }),
                }),
                request('/magicvideo/visual/data/common/kline',{
                    method: 'POST',
                    body: JSON.stringify({ code: prodCode, time: 1710991010000 }),
                }),
            ])
        }).then(([timelineData, kLineData]) => {
            if (timelineData.code !== '0') {
                setPageError({
                    desc: timelineData.message
                })
                throw new Error();
            }
            if (kLineData.code !== '0') {
                setPageError({
                    desc: kLineData.message
                })
                throw new Error();
            }
            response.current.timelineData = timelineData.dataResult[0].lineChartComp.value;
            response.current.kLineData = kLineData.dataResult[0].lineChartComp.value;

            initDemoData();

            setPageLoading(false);
        }).catch(e => {
            console.log(e)
            setPageLoading(false);

            setPageError({
                show: true,
            });
        })
    }, [])

    const initDemoData = () => {
        const [,open, close, lowest, highest, upDownRange, upDownValue] = response.current.kLineData[response.current.kLineData.length - 1]
        const [,, yesterdayClose] = response.current.kLineData[response.current.kLineData.length - 2]

        setDemoData({
            yesterdayClose: parseFloat(yesterdayClose),
            open: parseFloat(open),
            close: parseFloat(close),
            lowest: parseFloat(lowest),
            highest: parseFloat(highest),
            upDownRange,
            upDownValue,
            ...randomData,
        })
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (!pageLoading && !pageError.show) {
            chart.current = echarts.init(document.getElementById('main'));

            // drawTimeShareChart('main')
            // drawKLineChart('main')
            drawMoneyFlowChart('moneyFlowChart', [demoData.largeOrder, demoData.bigOrder, demoData.midOrder, demoData.smallOrder])

            drawTodayChart();
            chart.current.on('showTip', (e: any) => {
                const { dataIndex } = e;
                console.log(dataIndex)
                if (latestActiveKeyRef.current === 'today') {
                    setDemoData({
                        close: parseFloat(response.current.timelineData.slice(1)[dataIndex][1])
                    })
                    // console.log(parseFloat(response.current.timelineData.slice(1)[dataIndex][1]))
                } else {
                    const [, open, close, lowest, highest, quoteChange, riseAndFallVal] = response.current.kLineData.slice(1)[dataIndex];
                    console.log(open, close)
                    setDemoData({
                        yesterdayClose: parseFloat(dataIndex === 0 ? response.current.kLineData.slice(1)[dataIndex][1] : response.current.kLineData.slice(1)[dataIndex - 1][2]),
                        open: parseFloat(open),
                        close: parseFloat(close),
                        lowest: parseFloat(lowest),
                        highest: parseFloat(highest),
                    })
                }
            })
            chart.current.on('hideTip', (e: any) => {
                initDemoData();
            })
        }
    }, [pageLoading, pageError.show]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener('mouseup', () => {
        // console.log(222, chart.current)
        if (chart.current) {
            chart.current.dispatchAction({
                type: 'hideTip'
            })
            chart.current.dispatchAction({
                type: 'updateAxisPointer',
                currTrigger: 'leave'
            });
            initDemoData();
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
        const data = response.current.timelineData;
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
        const data = response.current.kLineData;
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

    if (pageError.show) {
        return (
            <ResultPage
                status='error'
                title={ pageError.title }
                description={ pageError.desc }
                secondaryButtonText='返回上一页'
                onSecondaryButtonClick={back}
            />
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.stockInfo}>
                <div className={styles.stockName}>{ name }</div>
                <div className={styles.stockCode}>（{ secucode }）</div>
            </div>
            <div className={styles.stockData}>
                <div className={styles.priceData}>
                    <div className={styles.price}><RandomPercent ruler={demoData.close - demoData.yesterdayClose} number={demoData.close} floatCount={2} symbol={false} percentSymbol={false} /></div>
                    <div className={styles.upPrice}>
                        <RandomPercent ruler={demoData.close - demoData.yesterdayClose} number={demoData.close - demoData.open} floatCount={2} symbol={false} percentSymbol={false} />
                        &nbsp;
                        <RandomPercent ruler={demoData.close - demoData.yesterdayClose} number={(demoData.close - demoData.open) / demoData.open * 100} floatCount={2} symbol={false} />
                    </div>
                </div>
                <div className={styles.tranactionData}>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>高：</span>
                        <span className={styles.dataValue}><RandomPercent ruler={demoData.highest - demoData.yesterdayClose} number={demoData.highest} floatCount={2} symbol={false} percentSymbol={false} /></span>
                    </div>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>低：</span>
                        <span className={styles.dataValue}><RandomPercent ruler={demoData.lowest - demoData.yesterdayClose} number={demoData.lowest} floatCount={2} symbol={false} percentSymbol={false} /></span>
                    </div>
                </div>
                <div className={styles.tranactionData}>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>开：</span>
                        <span className={styles.dataValue}><RandomPercent ruler={demoData.open - demoData.yesterdayClose} number={demoData.open} floatCount={2} symbol={false} percentSymbol={false} /></span>
                    </div>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>换：</span>
                        <span className={styles.dataValue}>
                            <RandomPercent color={false} floatCount={2} min={3} symbol={false} />
                        </span>
                    </div>
                </div>
                <div className={styles.tranactionData}>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>量：</span>
                        <span className={styles.dataValue}>
                            <RandomPercent color={false} min={1} max={10} floatCount={1} symbol={false} percentSymbol={false} suffix={'万手'} />
                        </span>
                    </div>
                    <div className={styles.tranactionDataItem}>
                        <span className={styles.dataLabel}>额：</span>
                        <span className={styles.dataValue}>
                            <RandomPercent color={false} min={20} max={100} symbol={false} floatCount={1} percentSymbol={false} suffix={'亿'} />
                        </span>
                    </div>
                </div>
            </div>
            <CapsuleTabs activeKey={activeKey} onChange={onChange} className={styles.dateSelect}>
                <CapsuleTabs.Tab title='分时' key='today' />
                <CapsuleTabs.Tab title='日K' key='month' />
            </CapsuleTabs>
            <div id="main" className={styles.chart} ></div>
            <div className={styles.section}>
                <div className={styles.sectionTitle}>
                    今日资金流向（亿元）
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
                                <div className={styles.moneyFlowVal}><RandomPercent floatCount={2} number={demoData.mainInFlow} symbol={false} percentSymbol={false} /></div>
                                <div className={styles.moneyFlowVal}><RandomPercent floatCount={2} number={demoData.mainOutFlow} symbol={false} percentSymbol={false} /></div>
                                <div className={styles.moneyFlowVal}><RandomPercent floatCount={2} number={demoData.netFlow} symbol={false} percentSymbol={false} /></div>
                            </div>
                        </div>
                        <div className={styles.moneyFlowData}>
                            {/*<div className={styles.moneyFlowLabelWrap}>*/}
                            {/*    <div className={styles.moneyFlowLabel}>大单</div>*/}
                            {/*    <div className={styles.moneyFlowLabel}>中单</div>*/}
                            {/*    <div className={styles.moneyFlowLabel}>小单</div>*/}
                            {/*</div>*/}
                            <div id="moneyFlowChart" className={styles.moneyFlowChart}></div>
                            {/*<div className={styles.moneyFlowValWrap}>*/}
                            {/*    <div className={styles.moneyFlowVal}><RandomPercent floatCount={0} number={demoData.bigOrder} symbol={false} percentSymbol={false} /></div>*/}
                            {/*    <div className={styles.moneyFlowVal}><RandomPercent floatCount={0} number={demoData.midOrder} symbol={false} percentSymbol={false} /></div>*/}
                            {/*    <div className={styles.moneyFlowVal}><RandomPercent floatCount={0} number={demoData.smallOrder} symbol={false} percentSymbol={false} /></div>*/}
                            {/*</div>*/}
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
                                <div className={styles.transactionDataValue}><RandomPercent ruler={demoData.open - demoData.yesterdayClose} floatCount={2} number={demoData.open} symbol={false} percentSymbol={false} /></div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>均价：</div>
                                <div className={styles.transactionDataValue}>
                                    <RandomPercent color={false} min={20} max={50} symbol={false} percentSymbol={false} />
                                </div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>最高价：</div>
                                <div className={styles.transactionDataValue}><RandomPercent ruler={demoData.highest - demoData.yesterdayClose} floatCount={2} number={demoData.highest} symbol={false} percentSymbol={false} /></div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>最低价：</div>
                                <div className={styles.transactionDataValue}><RandomPercent ruler={demoData.lowest - demoData.yesterdayClose} floatCount={2} number={demoData.lowest} symbol={false} percentSymbol={false} /></div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>量比：</div>
                                <div className={styles.transactionDataValue}>
                                    <RandomPercent min={30} max={80} percentSymbol={false} />
                                </div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>换手率：</div>
                                <div className={styles.transactionDataValue}>
                                    <RandomPercent min={5} max={50} />
                                </div>
                            </div>
                        </Grid.Item>
                    </Grid>
                    <div className={styles.divisionLine}></div>
                    <Grid columns={3} gap={8}>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>涨停：</div>
                                <div className={styles.transactionDataValue + ` upColor`}>{ (parseFloat(demoData.open + '') * 1.1).toFixed(2) }</div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>跌停：</div>
                                <div className={styles.transactionDataValue + ` downColor`}>{ (parseFloat(demoData.open + '') * 0.9).toFixed(2) }</div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>总手：</div>
                                <div className={styles.transactionDataValue}>
                                    <RandomPercent min={1000} max={5000} symbol={false} percentSymbol={false} suffix={'万'} />
                                </div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>金额：</div>
                                <div className={styles.transactionDataValue}>
                                    <RandomPercent min={20} max={50} symbol={false} percentSymbol={false} suffix={'亿'} />
                                </div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>振幅：</div>
                                <div className={styles.transactionDataValue}>
                                    <RandomPercent min={10} max={100} symbol={false} />
                                </div>
                            </div>
                            <div className={styles.transactionData}>
                                <div className={styles.transactionDataLabel}>委比：</div>
                                <div className={styles.transactionDataValue}>
                                    <RandomPercent min={10} max={100} symbol={false} />
                                </div>
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
                                <div className={styles.intervalDataValue}>
                                    <RandomPercent />
                                </div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>3日日均换手率：</div>
                                <div className={styles.intervalDataValue}>
                                    <RandomPercent min={1} symbol={false} />
                                </div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>3日日均成交额：</div>
                                <div className={styles.intervalDataValue}>
                                    <RandomPercent min={100000} max={200000} floatCount={2} symbol={false} percentSymbol={false} suffix={''} />
                                </div>
                            </div>
                        </Grid.Item>
                        <Grid.Item>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>5日涨跌幅：</div>
                                <div className={styles.intervalDataValue}>
                                    <RandomPercent />
                                </div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>5日日均换手率：</div>
                                <div className={styles.intervalDataValue}>
                                    <RandomPercent min={1} symbol={false} />
                                </div>
                            </div>
                            <div className={styles.intervalData}>
                                <div className={styles.intervalDataLabel}>5日日均成交额：</div>
                                <div className={styles.intervalDataValue}>
                                    <RandomPercent min={200000} max={500000} floatCount={2} symbol={false} percentSymbol={false} suffix={''} />
                                </div>
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
                                2023-10-09
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