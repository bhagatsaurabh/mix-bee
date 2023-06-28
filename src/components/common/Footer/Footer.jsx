import styles from "./Footer.module.css";

const Footer = ({ left, right, fixed }) => {
  const classes = [styles.footer];
  if (fixed) classes.push(styles.fixed);

  return (
    <footer className={classes.join(" ")}>
      <div className={styles.left}>{left}</div>
      <div className={styles.right}>{right}</div>
    </footer>
  );
};

export default Footer;
