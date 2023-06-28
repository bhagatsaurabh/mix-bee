import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import styles from "./Hive.module.css";
import { routes } from "@/router";
import Header from "@/components/common/Header/Header";
import Brand from "@/components/common/Brand/Brand";
import Symbol from "@/components/common/Symbol/Symbol";
import Button from "@/components/common/Button/Button";
import Footer from "@/components/common/Footer/Footer";
import Controls from "@/components/Controls/Controls";

const Hive = ({}) => {
  const [ripples, setRipples] = useState([]);
  const outlet = useOutlet();
  const location = useLocation();
  const navigate = useNavigate();
  const { nodeRef } = routes[1].children.find((route) => route.path === location.pathname) ?? {};
  const [status, setStatus] = useState("stopped");

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
      <Header center={<Brand />} fixed />
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
        <Button
          onClick={() => navigate("recordings")}
          className={styles.recordingsbutton}
          icon="disc"
          size={1}
          left
          background
          shadowflip
        >
          Recordings
        </Button>
        <CSSTransition
          in={location.pathname === "/hive/recordings"}
          nodeRef={nodeRef}
          timeout={500}
          classNames="slide"
          unmountOnExit
        >
          {(state) => (
            <div ref={nodeRef} className={[styles.recordings, "slide"].join(" ")}>
              {outlet}
            </div>
          )}
        </CSSTransition>
        <Controls state={status} />
      </main>
      <Symbol className={styles.textvert} />
      <Footer
        left={
          <a href="https://github.com/saurabh-prosoft/mix-bee" rel="noreferrer" target="_blank">
            <Button className="fs-0" icon="github" size={2} fit background />
          </a>
        }
        fixed
      />
    </>
  );
};

export default Hive;
