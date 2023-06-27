import styles from "./Icon.module.css";
import * as icons from "@/assets/icons";

const Icon = ({ size, accent, name, className, onClick }) => {
  const iSize = size || 1;
  const icon = icons[name] ?? icons["warning"];
  const iAccent = styles[accent] ?? styles["light"];
  const classes = [styles["icon"], iAccent];
  if (className) classes.push(className);

  const handleClick = (e) => onClick?.(e);

  return (
    <img
      onClick={handleClick}
      style={{ width: `${iSize}rem` }}
      src={icon}
      className={classes.join(" ")}
      alt={`${name}-icon`}
    />
  );
};

export default Icon;
