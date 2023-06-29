import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./Mixer.module.css";
import layout1 from "@/assets/layout-1.json";
import layout2 from "@/assets/layout-2.json";
import HexGroup from "../common/HexGroup/HexGroup";

const Mixer = () => {
  const [orientation, setOrientation] = useState(null);
  const layout = orientation === "landscape" ? layout1 : layout2;
  const dispatch = useDispatch();
  const ctx = useRef(null);

  useEffect(() => {
    const query = window.matchMedia("(orientation: landscape)");
    setOrientation(query.matches ? "landscape" : "portrait");
    query.onchange = (e) => {
      setOrientation(e.matches ? "landscape" : "portrait");
    };

    ctx.current = new AudioContext();
    const inputGain = ctx.current.createGain();
    const outputGain = ctx.current.createGain();
    inputGain.connect(outputGain);
    outputGain.connect(ctx.current.destination);

    return () => {
      query.onchange = null;
    };
  }, []);
  useEffect(() => {
    if (layout) {
      dispatch({ type: "mixer/init", payload: layout });
    }
  }, [layout]);

  const handleClick = (group, id) => {
    dispatch({ type: "mixer/activate", payload: { group, id } });
  };

  return (
    <section className={styles.mixer}>
      {orientation &&
        layout.map((group) => (
          <HexGroup
            onClick={(g, id) => handleClick(g, id)}
            className={styles[group.name]}
            key={group.id}
            group={group}
          />
        ))}
    </section>
  );
};

export default Mixer;
