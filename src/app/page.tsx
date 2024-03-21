'use client'
import styles from './styles.module.css';
import Image from "next/image";
import logoImg from './images/logo@2x.png';
import rankTop10Img from './images/rankTop10@2x.png';
import {List, SearchBar} from "antd-mobile";
import {data} from "@/app/data";
import {useRouter} from "next/navigation";
import img1 from './images/img1.png';
import img2 from './images/img2.png';
import img3 from './images/img3.png';
import img4 from './images/img4.png';
import img5 from './images/img5.png';
import img6 from './images/img6.png';
import img7 from './images/img7.png';
import img8 from './images/img8.png';
import img9 from './images/img9.png';
import rank1Img from './images/rank1@2x.png';
import rank2Img from './images/rank2@2x.png';
import rank3Img from './images/rank3@2x.png';

const imgList = [
    img1.src,
    img2.src,
    img3.src,
    img4.src,
    img5.src,
    img6.src,
    img7.src,
    img8.src,
    img9.src,
]

const imgRankList = [
    rank1Img.src,
    rank2Img.src,
    rank3Img.src,
]

export default function Home() {
    const router = useRouter()
    const onClick = (index: number) => {
        router.push('themeInfo?index=' + index)
    }

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div className={styles.searchBarWrapper}>
                    <SearchBar className={styles.searchBar} placeholder='请输入题材或个股名称搜索'/>
                </div>
                <div className={styles.rankTitle}>
                    <img className={styles.logoImg} src={logoImg.src} alt=""/>
                    <img className={styles.rankTop10Img} src={rankTop10Img.src} alt=""/>
                </div>
            </div>
            <List>
                {
                    data.map((row, index) => (
                        <List.Item key={row[0][0].val} className={styles.listItem} onClick={() => onClick(index)}>
                            { index <= 2 ? <img className={styles.listItemRankImg} src={imgRankList[index]} alt=""/> : null }
                            <img className={styles.listItemImg} src={imgList[index] || imgList[0]} alt=""/>
                            {row[0][0].val!.replace(/\n/g, '')}
                        </List.Item>
                    ))
                }
            </List>
        </main>
    );
}
