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
            <Link href='/units/UnitA'>A</Link>
          </li>
          <li>
            <Link href='/units/UnitB'>B</Link>
          </li>
          <li>
            <Link href='/units/UnitC'>C</Link>
          </li>
          <li>
            <Link href='/units/UnitD'>D</Link>
          </li>
          <li>
            <Link href='/units/UnitE'>E</Link>
          </li>
          <li>
            <Link href='/units/UnitF'>F</Link>
          </li>
          <li>
            <Link href='/units/UnitG'>G</Link>
          </li>
          <li>
            <Link href='/units/UnitH'>H</Link>
          </li>
        </ul>
      </div>
    </main>
  )
}
