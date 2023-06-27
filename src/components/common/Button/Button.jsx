import { flip } from "@/misc/utils";
import Icon from "@/components/common/Icon/Icon";
import Spinner from "@/components/common/Spinner/Spinner";
import styles from "./Button.module.css";

const Button = ({
  busy,
  disabled,
  onClick,
  icon,
  left,
  right,
  size,
  accent,
  className,
  children,
  fit,
  round,
  flat,
}) => {
  const bSize = size || 1;
  const bAccent = styles[accent] ?? styles["light"];
  const classes = [bAccent];
  if (className) classes.push(className);
  if (fit) classes.push(styles.fit);
  if (flat) classes.push(styles.flat);
  if (round) classes.push(styles.round);

  let content = [];
  const iconClasses = [];
  if (children) {
    content.push(children);
    iconClasses.push(left ? "mr-1" : "ml-1");
  }
  if (icon) {
    content.push(
      !busy ? (
        <Icon
          className={iconClasses.join(" ")}
          size={bSize}
          accent={accent ?? "light"}
          name={icon}
        />
      ) : (
        <Spinner className={iconClasses.join(" ")} size={bSize} accent={accent ?? "light"} />
      )
    );

    if (left && !right) {
      content = flip(content);
    }
  }

  return (
    <button
      disabled={disabled}
      className={classes.join(" ")}
      style={{ fontSize: `${bSize}rem` }}
      onClick={onClick}
    >
      {...content}
    </button>
  );
};

export default Button;
