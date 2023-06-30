import { useSelector } from "react-redux";
import styles from "./HexPad.module.css";

const HexPad = ({ group, data, onClick }) => {
  const isActive = useSelector(
    (state) => state.mixer[group - 1]?.hexpads.find((hexpad) => hexpad.id === data.id)?.active
  );
  const isLoaded = useSelector(
    (state) => state.mixer[group - 1]?.hexpads.find((hexpad) => hexpad.id === data.id)?.loaded
  );

  const classes = [styles.hexpad];
  if (isActive) classes.push(styles.active);
  if (isLoaded) classes.push(styles.loaded);

  return (
    <div
      data-id={data.id}
      style={{ left: data.pos.x, top: data.pos.y }}
      className={classes.join(" ")}
      onClick={() => isLoaded && onClick?.(group, data.id, isActive)}
    >
      <span></span>
    </div>
  );
};

export default HexPad;
