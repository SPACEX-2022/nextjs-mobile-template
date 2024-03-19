'use client'
import styles from './styles.module.css';
import Image from "next/image";
import logoImg from './images/logo@2x.png';
import rankTop10Img from './images/rankTop10@2x.png';
import {List} from "antd-mobile";

export default function Home() {
  return (
      <main>
          <div className={styles.rankTitle}>
              <img className={styles.logoImg} src={logoImg.src} alt=""/>
              <img className={styles.rankTop10Img} src={rankTop10Img.src} alt=""/>
          </div>
          <List>
              <List.Item onClick={() => {
              }}>
                  账单
              </List.Item>
              <List.Item onClick={() => {
              }}>
                  总资产
              </List.Item>
              <List.Item onClick={() => {
              }}>
                  设置
              </List.Item>
          </List>
      </main>
  );
}
