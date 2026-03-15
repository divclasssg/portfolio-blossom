import AppBar from '../_components/AppBar/AppBar';
import TabBar from '../_components/TabBar/TabBar';
import styles from './page.module.scss';

export const metadata = { title: '마이페이지 — Eum' };

export default function MyPage() {
    return (
        <>
            <AppBar />
            <main className={styles['content']}>
                <h1 className="sr-only">마이페이지</h1>
                <p className={styles['placeholder']}>준비 중입니다</p>
            </main>
            <TabBar activePath="mypage" />
        </>
    );
}
