import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./Mixer.module.css";
import layout1 from "@/assets/layout-1.json";
import layout2 from "@/assets/layout-2.json";
import HexGroup from "../common/HexGroup/HexGroup";
import { loadSample } from "@/store/actions/samples";

const Mixer = () => {
  const [orientation, setOrientation] = useState(null);
  const layout = orientation === "landscape" ? layout1 : layout2;
  const dispatch = useDispatch();
  const ctx = useRef(null);
  const inGain = useRef(null);
  const buffers = useRef([]);

  const fetchSample = async (gId, hId) => {
    const buffer = await dispatch(loadSample({ gId, hId, ctx: ctx.current }));
    buffers.current[hId - 1] = buffer.payload;
  };

  const loadSamples = async (data) => {
    data.forEach((group) => {
      group.hexpads.forEach((hexpad) => {
        fetchSample(group.id, hexpad.id);
      });
    });
  };

  useEffect(() => {
    const query = window.matchMedia("(orientation: landscape)");
    setOrientation(query.matches ? "landscape" : "portrait");
    query.onchange = (e) => {
      setOrientation(e.matches ? "landscape" : "portrait");
    };

    ctx.current = new AudioContext();
    const inputGain = ctx.current.createGain();
    inputGain.connect(ctx.current.destination);
    inGain.current = inputGain;

    return () => {
      query.onchange = null;
    };
  }, []);
  useEffect(() => {
    if (layout) {
      dispatch({ type: "mixer/init", payload: layout });
      loadSamples(layout);
    }
  }, [layout]);

  const handleClick = (group, id) => {
    dispatch({ type: "mixer/activate", payload: { group, id } });
    if (buffers.current[id - 1]) {
      const source = ctx.current.createBufferSource();
      source.buffer = buffers.current[id - 1];
      source.connect(inGain.current);
      source.start();
    }
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
