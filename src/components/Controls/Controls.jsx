import styles from "./Controls.module.css";
import Button from "@/components/common/Button/Button";

const Controls = ({ onStop, onRecord, status }) => {
  return (
    <aside className={styles.controls}>
      <Button disabled={!status.playback} onClick={onStop} icon="stop" left size={1} background>
        Stop
      </Button>
      <Button
        disabled={!status.playback}
        onClick={onRecord}
        icon={"record"}
        left
        size={1}
        background
        className={status.record ? styles.blink : ""}
      >
        {status.record ? "Recording" : "Record"}
      </Button>
    </aside>
  );
};

export default Controls;
