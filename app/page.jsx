import Image from 'next/image'
import styles from './page.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h2>Units</h2>
        <ul>
          <li>
            <Link href='/units/a'>A</Link>
          </li>
          <li>
            <Link href='/units/b'>B</Link>
          </li>
          <li>
            <Link href='/units/c'>C</Link>
          </li>
          <li>
            <Link href='/units/d'>D</Link>
          </li>
          <li>
            <Link href='/units/e'>E</Link>
          </li>
          <li>
            <Link href='/units/f'>F</Link>
          </li>
          <li>
            <Link href='/units/g'>G</Link>
          </li>
          <li>
            <Link href='/units/h'>H</Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
