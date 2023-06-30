import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import styles from "./Recordings.module.css";
import Button from "@/components/common/Button/Button";

const Recordings = ({}) => {
  const navigate = useNavigate();
  const recordings = useSelector((state) => state.recordings);

  const handleDownload = (url, id) => {
    const downloader = document.createElement("a");
    document.body.appendChild(downloader);
    downloader.style.display = "none";
    downloader.href = url;
    downloader.download = `recording-${id}.ogg`;
    downloader.click();
    downloader.remove();
  };

  return (
    <aside className={styles.recordingslist}>
      <section className={styles.header}>
        <Button onClick={() => navigate(-1)} icon="close" accent="dark" />
        <h2>Recordings</h2>
      </section>
      <section className={styles.list}>
        {recordings.length === 0 && <h3 className={styles.nocontent}>No Recordings</h3>}
        {recordings.map((recording, idx) => (
          <div key={idx} className={styles.recording}>
            <h3>Recording {idx + 1}</h3>
            <Button
              onClick={() => handleDownload(recording, idx + 1)}
              icon="download"
              left
              accent="dark"
            >
              Download
            </Button>
          </div>
        ))}
      </section>
    </aside>
  );
};

export default Recordings;
