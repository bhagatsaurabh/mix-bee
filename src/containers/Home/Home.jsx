import { useEffect, useRef } from "react";
import styles from "./Home.module.css";
import cover from "@/assets/images/cover-transparent-light.png";

const Home = () => {
  const el = useRef(null);
  const holeEl = useRef(null);

  useEffect(() => {
    window.requestAnimationFrame(animate.bind(this, holeEl.current));
    /* el.current.addEventListener("pointermove", (e) => {
      setPos({ x: e.clientX - 50, y: e.clientY - 50 });
    }); */
  }, []);

  return (
    <main className={styles.home}>
      <section ref={el} className={styles.brand}>
        <img style={{ pointerEvents: "none" }} src={cover} />
        <div ref={holeEl} className={styles.hole}></div>
      </section>
    </main>
  );
};

const animate = (el) => {
  if (parseInt(el.style.left || 0) > 1000) return;
  el.style.left = parseInt(el.style.left || 0) + 1 + "px";
  el.style.top = parseInt(el.style.top || 0) + 1 + "px";
  window.requestAnimationFrame(animate.bind(this, el));
};

export default Home;
