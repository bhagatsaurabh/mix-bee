import { useEffect, useState } from "react";

import Header from "@/components/common/Header/Header";
import styles from "./Hive.module.css";
import Brand from "@/components/common/Brand/Brand";
import Symbol from "@/components/common/Symbol/Symbol";
import Button from "@/components/common/Button/Button";

const Hive = ({}) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    document.onpointerdown = (e) => {
      setRipples([...ripples, { id: new Date().getTime(), x: e.clientX, y: e.clientY }]);
    };

    return () => {
      document.onpointerdown = null;
    };
  }, [ripples]);

  const handleRippleEnd = (ripple) => {
    const curr = [...ripples];
    curr.splice(
      ripples.findIndex((r) => r.id === ripple.id),
      1
    );
    setRipples(curr);
  };

  return (
    <>
      <Header
        left={<Brand />}
        right={<Button className="fs-0" icon="github" size={2} fit round />}
        fixed
      />
      <main className={styles.hive}>
        <div className={styles.mask}>
          {ripples.map((ripple) => (
            <div
              onAnimationEnd={(e) => e.pseudoElement && handleRippleEnd(ripple)}
              key={ripple.id}
              style={{ left: ripple.x, top: ripple.y }}
              className={[styles.ripple].join(" ")}
            ></div>
          ))}
        </div>
      </main>
      <Symbol className={styles.textvert} />
    </>
  );
};

export default Hive;
