'use client'
import styles from './styles.module.css';
import {useEffect, useMemo, useState} from "react";
import {request} from "@/services";
import {useRouter, useSearchParams} from "next/navigation";
import {data} from "@/app/data";

export default function ThemeInfo() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [dataIndex, setIndex] = useState(0);

    const count = useMemo(() => {
        return data[dataIndex].children.reduce((acc, curr) => acc + curr.children.length, 0);
    }, [])

    useEffect(() => {
        console.log(searchParams)
        const index = searchParams.get('index')
        setIndex(parseInt(index!));
    }, []);

    let index = -1;
    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <tbody>
                    {
                        [data[dataIndex]].map((item, itemIndex) => {
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