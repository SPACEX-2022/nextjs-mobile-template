'use client'
import styles from './styles.module.css';
import {useEffect, useMemo, useState} from "react";
import {request} from "@/services";
import {useRouter, useSearchParams} from "next/navigation";
import {data} from "@/app/data";
import {Metadata} from "next";
import {RandomPercent} from "@/utils";

export default function ThemeInfo() {
    const router = useRouter();
    const searchParams = useSearchParams()
    const [dataIndex, setIndex] = useState(0);

    useEffect(() => {
        console.log(searchParams)
        const index = searchParams.get('index')
        setIndex(parseInt(index!));
        document.title = data[index! as any][0][0].val!.replace(/\n/g, "");
        router.prefetch('/stockInfo')
    }, []);

    const viewStock = (name: string) => {
        router.push('/stockInfo?name=' + name)
    }

    const head = data[dataIndex][0];

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.tHeader} colSpan={head.length}>
                            { head[0].val!.replace(/\n/g, '') }
                            <span className={styles.tHeaderPercent}>
                                <RandomPercent color={false} />
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data[dataIndex].map((row, rowIndex, itemIndex) => {
                            return (
                                <tr key={rowIndex}>
                                    {
                                        row.map((col, colIndex) => {
                                            if (colIndex === 0 || col.val == null) return null
                                            let arr = [1, ...new Array(row.length - 4).fill(1).map((i, index) => {
                                                return index + 2;
                                            })];
                                            if (arr.includes(colIndex)) {
                                                let attr: Record<string, any> = {};
                                                if (col.rowSpan > 1) {
                                                    attr.rowSpan = col.rowSpan;
                                                }
                                                if (col.colSpan > 1) {
                                                    attr.colSpan = col.colSpan;
                                                }
                                                return (
                                                    <td key={colIndex}
                                                        className={styles.tablePlateTitle}
                                                        { ...attr }
                                                    >
                                                        <div className={styles.tablePlateTitleWrapper}>
                                                            {col.val}
                                                            <div className={styles.tablePlateTitlePercent}>
                                                                <RandomPercent />
                                                            </div>
                                                        </div>
                                                    </td>
                                                )
                                            } else if (colIndex === row.length - 2) {
                                                return (
                                                    <td key={colIndex}
                                                        className={styles.tableStockName}
                                                        onClick={() => viewStock(col.val)}>
                                                        {col.val}
                                                    </td>
                                                )
                                            } else {
                                                return (
                                                    <td key={colIndex} className={styles.tableStockDesc}>{col.val}</td>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                            )
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