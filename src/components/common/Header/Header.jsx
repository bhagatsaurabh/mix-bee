import styles from "./Header.module.css";

const Header = ({ left, center, right, fixed }) => {
  const classes = [styles.header];
  if (fixed) classes.push(styles.fixed);

  return (
    <header className={classes.join(" ")}>
      <div className={styles.left}>{left}</div>
      <div className={styles.center}>{center}</div>
      <div className={styles.right}>{right}</div>
    </header>
  );
};

export default Header;
