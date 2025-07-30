// Use path aliases configured in tsconfig.json for cleaner, more maintainable imports.
import { Greeting } from '@/components/Greeting';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Greeting />
    </main>
  );
}
