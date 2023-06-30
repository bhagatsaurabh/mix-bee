import { useSelector } from "react-redux";
import styles from "./HexPad.module.css";

const HexPad = ({ group, data, onClick }) => {
  const status = useSelector((state) =>
    state.mixer[group - 1]?.hexpads.find((hexpad) => hexpad.id === data.id)
  );

  const classes = [styles.hexpad];
  if (status.active) classes.push(styles.active);
  if (status.loaded) classes.push(styles.loaded);
  if (status.queued) classes.push(styles.queued);

  return (
    <div
      data-id={data.id}
      style={{ left: data.pos.x, top: data.pos.y }}
      className={classes.join(" ")}
      onClick={() => status.loaded && onClick?.(group, data.id, status)}
    >
      <span></span>
    </div>
  );
};

export default HexPad;
