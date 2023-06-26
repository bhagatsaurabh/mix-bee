import { useEffect, useRef } from "react";

import styles from "./Home.module.css";
import cover from "@/assets/images/cover-transparent-light.png";
import { distance, lerp, rand, randInt, slerp } from "@/misc/utils";

const windows = new Array(16)
  .fill({
    pos: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    el: null,
    speed: 1,
  })
  .map((obj, idx) => ({ ...obj, id: idx }));

const Home = () => {
  const el = useRef(null);
  const windowEls = useRef([]);
  const buttonEl = useRef(null);

  useEffect(() => {
    window.requestAnimationFrame(
      animate.bind(
        this,
        performance.now(),
        { w: el.current.clientWidth, h: el.current.clientHeight },
        windows.map((wndw, idx) => {
          wndw.el = windowEls.current[idx];
          return wndw;
        })
      )
    );
    /* el.current.addEventListener("pointermove", (e) => {
      setPos({ x: e.clientX - 50, y: e.clientY - 50 });
    }); */
  }, []);

  const handleLaunch = () => {
    const rect = buttonEl.current.getBoundingClientRect();
    const target = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    windows.forEach((wndw) => (wndw.converge = target));
  };

  return (
    <main className={styles.home}>
      <section ref={el} className={styles.brand}>
        <div className={styles.mask}>
          {windows.map((wndw, idx) => (
            <div
              key={wndw.id}
              ref={(e) => (windowEls.current[idx] = e)}
              className={styles.hole}
            ></div>
          ))}
        </div>
        <img style={{ pointerEvents: "none" }} src={cover} />
        <button ref={buttonEl} onClick={handleLaunch}>
          Launch
        </button>
      </section>
    </main>
  );
};

// let handle = -1;
const animate = (startTime, viewport, windows) => {
  windows.forEach((wndw) => {
    if (wndw.converge && !wndw.convergeStarted) {
      wndw.start = { ...wndw.pos };
      wndw.end = wndw.converge;
      wndw.convergeStarted = true;
    }
    if (distance(wndw.pos, wndw.end) <= wndw.speed + 1) {
      if (wndw.converge) return;
      let [startSide, endSide] = [randInt(0, 3), randInt(0, 3)];
      if (startSide === endSide) endSide = (endSide + 1) % 3;
      let [start, end] = [randRect(startSide, viewport), randRect(endSide, viewport)];
      wndw.start = start;
      wndw.end = end;
      wndw.pos = { x: start.x, y: start.y };
      wndw.speed = rand(1, 3);
    } else {
      wndw.pos = (wndw.converge ? slerp : lerp)(
        wndw.pos,
        wndw.end,
        wndw.converge ? wndw.speed / 100 : wndw.speed
      );
    }

    wndw.el.style.left = wndw.pos.x + "px";
    wndw.el.style.top = wndw.pos.y + "px";
  });

  window.requestAnimationFrame(animate.bind(this, startTime, viewport, windows));
};

const randRect = (side, viewport) => {
  switch (side) {
    case 0:
      return { x: randInt(0, viewport.w), y: -130 };
    case 1:
      return { x: viewport.w + 130, y: randInt(0, viewport.h) };
    case 2:
      return { x: randInt(0, viewport.w), y: viewport.h + 130 };
    case 3:
      return { x: -130, y: randInt(0, viewport.h) };
    default:
      return { x: 0, y: 0 };
  }
};

export default Home;
