import React from 'react';
import { UploadForm } from '../upload-form/upload-form';
import { Info } from '../info/info';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../loader/loader';
import { motion } from 'motion/react';
import Modal from '../modal/modal';
import { Notification } from '../notification/notification';
import { TPdfFile } from '@utils/types';
import styles from './counter.module.css';

type TCounterProps = {
	isLoading: boolean;
	isResult: boolean;
	error: {
		isError: boolean;
		type: 'format' | 'size' | 'other' | null;
	};
	pdf: TPdfFile[];
	calculateTotal: (pdf: TPdfFile[]) => { totalA4: number; totalPages: number };
	handleFiles: (files: File[]) => Promise<void>;
	deleteFile: (id: string) => void;
	deleteAllFiles: () => void;
	handleClose: () => void;
};
export const Counter = ({
	isLoading,
	isResult,
	error,
	pdf,
	calculateTotal,
	handleFiles,
	deleteFile,
	deleteAllFiles,
	handleClose,
}: TCounterProps) => {
	const navigate = useNavigate();

	const handleNavigate = () => {
		navigate(-1);
	};
	return (
		<>
			{isResult && (
				<motion.div
					key='result'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 1,
						ease: 'easeOut',
					}}
					exit={{
						opacity: 0,
						transition: { duration: 1, ease: 'easeOut' },
					}}>
					<button onClick={() => handleNavigate()}>Назад</button>
					<DndProvider backend={HTML5Backend}>
						<UploadForm handleFiles={handleFiles} />
					</DndProvider>
					{pdf.length > 0 && (
						<Info
							files={pdf}
							deleteFile={deleteFile}
							deleteAllFiles={deleteAllFiles}
							calculateTotal={calculateTotal}
						/>
					)}
				</motion.div>
			)}
			{isLoading && (
				<motion.div
					className={styles.loader__container}
					key='loader'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, ease: 'easeOut' }}
					exit={{
						opacity: 0,
						transition: { duration: 0.5, ease: 'easeOut' },
					}}>
					<Loader />
				</motion.div>
			)}
			{error.isError && (
				<Modal close={handleClose}>
					<Notification
						formatError={error.type === 'format'}
						otherError={error.type === 'other'}
						sizeError={error.type === 'size'}
					/>
				</Modal>
			)}
		</>
	);
};
