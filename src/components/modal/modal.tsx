import { createPortal } from 'react-dom';
import { useKey } from '../../hooks/use-key';
import React from 'react';
import { motion } from 'motion/react';
import styles from './modal.module.css';

type TModal = {
	children: React.ReactNode;
	close: () => void;
};

const modalAnimation = {
	hidden: {
		y: '-30vh',
		opacity: 0,
	},
	visible: {
		y: 0,
		opacity: 1,
		transition: { delay: 0.5 },
	},
};

const rootModal = document.getElementById('root-modal') as HTMLDivElement;
export default function Modal({ children, close }: TModal): React.JSX.Element {
	const key = 'Escape';
	const handelKeyDown = useKey(key, close);
	return createPortal(
		<motion.div
			className={styles.modal__overlay}
			onKeyDown={handelKeyDown}
			onClick={close}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			<motion.div
				className={styles.modal}
				tabIndex={0}
				role='button'
				onClick={(e) => e.stopPropagation()}
				variants={modalAnimation}
				initial='hidden'
				animate='visible'
				exit='hidden'>
				{children}
				<motion.button
					className={styles.btn}
					onClick={close}
					whileTap={{ scale: 0.9 }}
					whileHover={{ scale: 1.1 }}
					transition={{
						type: 'spring',
						duration: 0.1,
						ease: 'easeInOut',
					}}>
					<img src='/icons/close.png' alt='Close' />
				</motion.button>
			</motion.div>
		</motion.div>,
		rootModal
	);
}
