import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import styles from "./Mixer.module.css";
import layout1 from "@/assets/layout-1.json";
import layout2 from "@/assets/layout-2.json";
import HexGroup from "../common/HexGroup/HexGroup";
import { loadSample } from "@/store/actions/samples";

const Mixer = forwardRef(({ onStart, onStop, onRecordStart, onRecordStop, onSave }, ref) => {
  const navigate = useNavigate();
  const [orientation, setOrientation] = useState(null);
  const layout = orientation === "landscape" ? layout1 : layout2;
  const dispatch = useDispatch();
  const ctx = useRef(null);
  const inGain = useRef(null);
  const hexpads = useRef(new Array(36).fill().map((_) => ({ active: false })));
  const [scheduledHandle, setHandle] = useState(-1);
  const [started, setStarted] = useState(false);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const [recording, setRecording] = useState(false);

  const fetchSample = async (gId, hId) => {
    const buffer = await dispatch(loadSample({ gId, hId, ctx: ctx.current }));
    hexpads.current[hId - 1].buffer = buffer.payload;
  };
  const loadSamples = async (data) => {
    data.forEach((group) => {
      group.hexpads.forEach((hexpad) => {
        fetchSample(group.id, hexpad.id);
      });
    });

    clearInterval(scheduledHandle);
  };
  const stop = () => {
    hexpads.current.forEach((hexpad) => hexpad.source?.stop());
  };
  const schedule = () => {
    stop();
    hexpads.current.forEach((hexpad) => {
      if (hexpad.active && hexpad.buffer) {
        const source = ctx.current.createBufferSource();
        source.buffer = hexpad.buffer;
        hexpad.source = source;
        source.connect(inGain.current);
        source.start();
        dispatch({ type: "mixer/clear-queued", payload: { group: hexpad.group, id: hexpad.id } });
      }
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
    const streamDest = ctx.current.createMediaStreamDestination();
    inputGain.connect(streamDest);
    inGain.current = inputGain;

    recorder.current = new MediaRecorder(streamDest.stream);
    recorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/ogg; codecs=opus" });
      const recording = new File([blob], "recorded.ogg");
      chunks.current = [];
      dispatch({ type: "recordings/add", payload: URL.createObjectURL(recording) });
    };

    return () => {
      query.onchange = null;
      clearInterval(scheduledHandle);
      stop();
    };
  }, []);
  useEffect(() => {
    if (layout) {
      dispatch({ type: "mixer/init", payload: layout });
      loadSamples(layout);
      stop();
      hexpads.current.forEach((hexpad) => (hexpad.active = false));
    }
  }, [layout]);
  useImperativeHandle(ref, () => ({
    stopAll() {
      if (started) {
        hexpads.current
          .filter((hexpad) => hexpad.active)
          .forEach((hexpad) => handleClick(hexpad.group, hexpad.id, { active: true }));
        dispatch({ type: "mixer/clear-queued-all" });
      }
      if (recording) this.record();
    },
    record() {
      if (recording) {
        setRecording(false);
        recorder.current.stop();
        onRecordStop?.();
        navigate("recordings");
      } else {
        setRecording(true);
        recorder.current.start();
        onRecordStart?.();
      }
    },
  }));

  const handleClick = (group, id, { active }) => {
    dispatch({ type: "mixer/activate", payload: { group, id } });
    if (active) {
      hexpads.current[id - 1].active = false;
      hexpads.current[id - 1].source?.stop();
      if (started && !hexpads.current.reduce((curr, hexpad) => curr || hexpad.active, false)) {
        clearInterval(scheduledHandle);
        setStarted(false);
        onStop?.();
      }
    } else {
      hexpads.current[id - 1].active = true;
      hexpads.current[id - 1].group = group;
      hexpads.current[id - 1].id = id;
      if (!started) {
        schedule();
        setHandle(setInterval(() => schedule(), 4350));
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
            onClick={(g, id, status) => handleClick(g, id, status)}
            className={styles[group.name]}
            key={group.id}
            group={group}
          />
        ))}
    </section>
  );
});

export default Mixer;
