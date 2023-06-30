import styles from "./HexGroup.module.css";
import HexPad from "../HexPad/HexPad";

const HexGroup = ({ group, className, onClick }) => {
  return (
    <div
      style={{ left: group.pos.x, top: group.pos.y }}
      className={[styles.hexgroup, className ?? ""].join(" ")}
    >
      {group.hexpads.map((hexpad) => (
        <HexPad
          group={group.id}
          onClick={(g, id, status) => onClick(g, id, status)}
          key={hexpad.id}
          data={hexpad}
        />
      ))}
    </div>
  );
};

export default HexGroup;
