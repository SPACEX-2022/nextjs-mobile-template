import styles from './styles.module.css';
import Image from "next/image";
import logoImg from './images/logo@2x.png';
import rankTop10Img from './images/rankTop10@2x.png';

export default function Home() {
  return (
    <main>
      <div className={styles.rankTitle}>
        <img className={styles.logoImg} src={logoImg.src} alt=""/>
        <img className={styles.rankTop10Img} src={rankTop10Img.src} alt=""/>
      </div>
    </main>
  );
}
