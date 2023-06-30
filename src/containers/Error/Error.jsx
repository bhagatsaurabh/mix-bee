import Icon from "@/components/common/Icon/Icon";
import styles from "./Error.module.css";
import Button from "@/components/common/Button/Button";

const Error = ({}) => {
  return (
    <main className={styles.error}>
      <section className={styles.title}>
        <Icon size={3.5} name="warninig" accent="dark" className={styles.icon} />
        <h1>Error !</h1>
        <h3>Please try reloading the page</h3>
      </section>
      <section className={styles.content}>
        <Button icon="bug" left accent="dark">
          Report an issue
        </Button>
      </section>
    </main>
  );
};

export default Error;
