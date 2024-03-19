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
        <div>
            <table>
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
                                            <td>{ child.name }</td>
                                            <td>{ child.desc }</td>
                                        </tr>
                                    )
                                })
                            })
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}