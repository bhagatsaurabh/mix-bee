import { useCallback, useEffect, useRef, useState } from "react";

import styles from "./Controls.module.css";
import Button from "@/components/common/Button/Button";

const Controls = ({ onStop, onRecord, state }) => {
  return (
    <aside className={styles.controls}>
      <Button disabled={state === "stopped"} onClick={onStop} icon="stop" size={1} background />
      <Button disabled={state === "stopped"} onClick={onRecord} icon="record" size={1} background />
    </aside>
  );
};

export default Controls;
