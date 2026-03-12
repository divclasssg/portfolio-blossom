import styles from './GreetingSection.module.scss';

export default function GreetingSection({ greeting }) {
  return (
    <section className={styles['greeting']} aria-label="인사말">
      <p className={styles['text']}>{greeting}</p>
    </section>
  );
}
