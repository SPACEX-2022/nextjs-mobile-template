'use client'
import styles from './styles.module.css';
import {useEffect, useMemo} from "react";
import {request} from "@/services";

const data = [
    {
        name: '计算芯片',
        level: 1,
        children: [
            {
                name: 'AI芯片',
                level: 2,
                children: [
                    {
                        name: '寒武纪',
                        level: 3,
                        desc: '国内AI芯片排名第一，国内自主AI芯片稀缺公司',
                    },
                    {
                        name: '澜起科技',
                        level: 3,
                        desc: '国内AI芯片排名第一，国内自主AI芯片稀缺公司',
                    },
                ]
            },
            {
                name: 'GPU',
                level: 2,
                children: [
                    {
                        name: '寒武纪',
                        level: 3,
                        desc: '国内AI芯片排名第一，国内自主AI芯片稀缺公司',
                    },
                    {
                        name: '澜起科技',
                        level: 3,
                        desc: '国内AI芯片排名第一，国内自主AI芯片稀缺公司',
                    },
                ]
            }
        ]
    }
]

export default function ThemeInfo() {
    const count = useMemo(() => {
        return data[0].children.reduce((acc, curr) => acc + curr.children.length, 0);
    }, [])

    useEffect(() => {
        request('/api/visual/data/common/timeline',{
            method: 'POST',
            body: JSON.stringify({ code: '000001.SH', time: 1710731514000 }),
        })
    }, []);

    let index = -1;
    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <tbody>
                    {
                        data.map((item, itemIndex) => {
                            return item.children.map((plate, plateIndex) => {
                                return plate.children.map((child, childIndex) => {
                                    index++;
                                    return (
                                        <tr key={child.name}>
                                            {
                                                index === 0 ?
                                                    <td className={styles.tableThemeTitle} rowSpan={count}>{ item.name }</td>
                                                    : null
                                            }
                                            {
                                                childIndex === 0 ?
                                                    <td className={styles.tablePlateTitle} rowSpan={plate.children.length}>{ plate.name }</td>
                                                    : null
                                            }
                                            <td className={styles.tableStockName}>{ child.name }</td>
                                            <td className={styles.tableStockDesc}>{ child.desc }</td>
                                        </tr>
                                    )
                                })
                            })
                        })
                    }
                </tbody>
            </table>

            <div className={styles.disclaimers}>
                【免责声明】以上信息基于独立、客观、公正和审慎的原则整理，信息均来源于公开资料，本软件对这些信息的准确性，完整性，时效性，不作任何保证。本软件内容仅仅是查询使用，仅供参考，并不构成对任何人的投资建议，请自主决策，自担风险。
            </div>
        </div>
    )
}