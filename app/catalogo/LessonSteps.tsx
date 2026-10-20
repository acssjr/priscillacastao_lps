import { lessonMethod } from "@/content/class-catalog";
import styles from "./page.module.css";

export function LessonSteps() {
  return <div className={styles.methodTrack}>
    <ol className={styles.methodSteps}>{lessonMethod.map((item, index) => <li key={item.title}>
      <div className={styles.stepCard} data-catalog-step>
        <span className={styles.stepNumber} aria-hidden="true">0{index + 1}</span>
        <h3>{item.title}</h3><ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
      </div>
    </li>)}</ol>
  </div>;
}
