import Icon from "@/components/common/Icon/Icon";
import styles from "./Error.module.css";
import Button from "@/components/common/Button/Button";
import { Link } from "react-router-dom";

const Error = ({}) => {
  return (
    <main className={styles.error}>
      <section className={styles.title}>
        <Icon size={3.5} name="warninig" accent="dark" className={styles.icon} />
        <h1>Error !</h1>
        <h3>Please try reloading the page</h3>
      </section>
      <section className={styles.content}>
        <Link
          target="_blank"
          rel="noreferrer"
          to="https://github.com/bhagatsaurabh/mix-bee/issues/new?title=The%20app%20crashed%20!&body=Please%20add%20details%20here..."
        >
          <Button icon="bug" left accent="dark">
            Report an issue
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default Error;
