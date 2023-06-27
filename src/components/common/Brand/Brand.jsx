import Icon from "../Icon/Icon";
import styles from "./Brand.module.css";

const Brand = ({}) => {
  return (
    <div className={styles.brand}>
      <Icon name="logoAccent" size={2} />
      <span className={styles.title}>Mixbee</span>
    </div>
  );
};

export default Brand;
