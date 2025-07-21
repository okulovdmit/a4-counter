import { OverlayBorder } from "../overlay-border/overlay-border";
import { TPdfFile } from "@utils/types";
import { motion } from "motion/react";
import styles from "./info.module.css";

type TInfo = {
  files: TPdfFile[];
  deleteFile: (id: string) => void;
  deleteAllFiles: () => void;
  calculateTotal: (pdf: TPdfFile[]) => { totalA4: number; totalPages: number };
};
export const Info = ({
  files,
  deleteFile,
  deleteAllFiles,
  calculateTotal,
}: TInfo) => {
  const total = calculateTotal(files);
  const { totalA4, totalPages } = total;
  return (
    <div className={styles.container}>
      <OverlayBorder>
        <div className={styles.list}>
          {files.map((item, index) => (
            <motion.div
              className={styles.item}
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeIn" }}
            >
              <p className={styles.name}>{item.name}</p>
              <p>Количество А4: {item.amountA4}</p>
              <motion.button
                onClick={() => deleteFile(item.id)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                transition={{
                  type: "spring",
                  duration: 0.1,
                  ease: "easeInOut",
                }}
              >
                <span>Delete</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </OverlayBorder>
      <motion.div
        className={styles.total}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: files.length < 5 ? 1 : 2,
          delay: 0.5,
          ease: "easeIn",
        }}
      >
        <p>Итого:</p>
        <div className="quantity">
          <p>Количество А4: {totalA4}</p>
          <p>Количество листов: {totalPages}</p>
        </div>
        <motion.button className={styles.btn} onClick={() => deleteAllFiles()}>
          Очистить
        </motion.button>
      </motion.div>
    </div>
  );
};
