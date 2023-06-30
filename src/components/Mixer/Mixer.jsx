import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import styles from "./Mixer.module.css";
import layout1 from "@/assets/layout-1.json";
import layout2 from "@/assets/layout-2.json";
import HexGroup from "../common/HexGroup/HexGroup";
import { loadSample } from "@/store/actions/samples";

const Mixer = ({ onStart, onStop }) => {
  const [orientation, setOrientation] = useState(null);
  const layout = orientation === "landscape" ? layout1 : layout2;
  const dispatch = useDispatch();
  const ctx = useRef(null);
  const inGain = useRef(null);
  const hexpads = useRef(new Array(36).fill({}));
  const buffers = useRef([]);
  const sources = useRef([]);
  const [scheduledHandle, setHandle] = useState(-1);
  const actives = useRef(new Array(36).fill(false));
  const [started, setStarted] = useState(false);

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

    clearInterval(scheduledHandle);
    setHandle(setInterval(() => schedule(), 4350));
  };
  const stop = () => {
    sources.current.forEach((source) => source?.stop());
  };
  const schedule = () => {
    stop();
    for (let i = 0; i < 36; i += 1) {
      if (actives.current[i] && buffers.current[i]) {
        const source = ctx.current.createBufferSource();
        source.buffer = buffers.current[i];
        source.connect(inGain.current);
        sources.current[i] = source;
        source.start();
      }
    }
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
      clearInterval(scheduledHandle);
    };
  }, []);
  useEffect(() => {
    if (layout) {
      dispatch({ type: "mixer/init", payload: layout });
      loadSamples(layout);
      stop();
      for (let i = 0; i < 36; i += 1) actives.current[i] = false;
    }
  }, [layout]);

  const handleClick = (group, id, active) => {
    dispatch({ type: "mixer/activate", payload: { group, id } });
    if (active) {
      sources.current[id - 1]?.stop();
      actives.current[id - 1] = false;
      if (started && !actives.current.reduce((curr, act) => curr || act, false)) {
        setStarted(false);
        onStop?.();
      }
    } else {
      actives.current[id - 1] = true;
      if (!started) {
        setStarted(true);
        onStart?.();
      }
    }
  };

  return (
    <section className={styles.mixer}>
      {orientation &&
        layout.map((group) => (
          <HexGroup
            onClick={(g, id, state) => handleClick(g, id, state)}
            className={styles[group.name]}
            key={group.id}
            group={group}
          />
        ))}
    </section>
  );
};

export default Mixer;
