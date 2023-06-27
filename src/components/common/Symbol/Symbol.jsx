import styles from "./Symbol.module.css";

const Symbol = ({ className }) => {
  return (
    <div className={[styles.symbol, className ?? ""].join(" ")}>
      <span>Copyright &copy; {new Date().getFullYear()} | Saurabh Bhagat</span>
    </div>
  );
};

export default Symbol;
