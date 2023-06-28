import HexPad from "../common/HexPad/HexPad";
import styles from "./Mixer.module.css";

const Mixer = () => {
  return (
    <section className={styles.mixer}>
      <HexPad />
    </section>
  );
};

export default Mixer;
