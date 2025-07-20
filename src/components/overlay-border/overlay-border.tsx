import { motion } from 'motion/react';
import React from 'react';
import styles from './overlay-border.module.css';

type TOverlayProps = {
	children: React.ReactElement;
};
export const OverlayBorder = ({ children }: TOverlayProps) => {
	return (
		<div className={styles.container}>
			<motion.div
				className={styles.border}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 2, ease: 'easeInOut' }}></motion.div>
			{children}
		</div>
	);
};
