import styles from './page.module.scss';

export default function Home() {
    return (
        <div className={styles['home-wrapper']}>
            <section className={styles['project-list']}>
                {/* 추후 프로젝트 카드 컴포넌트 추가 예정 */}
                <p className={styles.placeholder}>프로젝트 목록</p>
            </section>
        </div>
    );
}
