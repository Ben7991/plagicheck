import styles from './loader.module.css';

export default function Loader() {
  return (
    <section className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-white">
      <span className={styles.loader}></span>
    </section>
  );
}
