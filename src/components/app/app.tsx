import { useEffect, useState } from 'react';
import styles from './app.module.css';
import { UploadForm } from '../upload-form/upload-form';
import { Info } from '../info/info';
import { PDFDocument } from 'pdf-lib';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TPdfFile } from '@utils/types';
import { v4 as uuidv4 } from 'uuid';
import { Loader } from '../loader/loader';
import { motion, AnimatePresence } from 'motion/react';
import Modal from '../modal/modal';
import { Notification } from '../notification/notification';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

export function App() {
	const [pdf, setPdf] = useState<TPdfFile[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isResult, setIsResult] = useState<boolean>(true);
	const [error, setError] = useState<{
		isError: boolean;
		type: 'format' | 'size' | 'other' | null;
	}>({ isError: false, type: null });
	const [isLight, setIsLight] = useState<boolean>(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme && savedTheme === 'light') {
			document.body.classList.add('light');
			setIsLight(true);
		}
	}, []);

	const calculateTotal = (pdf: TPdfFile[]) => {
		const totalA4 = pdf.reduce((total, file) => total + file.amountA4, 0);
		const totalPages = pdf.reduce((total, file) => total + file.pages, 0);
		return { totalA4, totalPages };
	};

	const calculate = async (files: File[]) => {
		const pdfFile: TPdfFile[] = [];
		if (pdf.length > 0) {
			setPdf(pdfFile);
		}

		for (let i = 0; i < files.length; i++) {
			const arrayBuffer = await files[i].arrayBuffer();
			const pdfDoc = await PDFDocument.load(arrayBuffer);
			const pages = pdfDoc.getPages();
			if (pages.length > 0) {
				let amount = 0;
				pages.forEach((page) => {
					const { width, height } = page.getSize();
					const ratioX = ((width / 72) * 25.4) / 210;
					const ratioY = ((height / 72) * 25.4) / 297;
					amount += ratioX * ratioY;
				});
				pdfFile.push({
					name: files[i].name,
					amountA4: Number(amount.toFixed(0)),
					pages: pages.length,
					id: uuidv4(),
				});
			}
		}
		setPdf(pdfFile);
	};

	const handleFiles = async (files: File[]): Promise<void> => {
		setIsLoading(true);
		setIsResult(false);
		const checkType = files.every((file) => file.type === 'application/pdf');
		if (!checkType) {
			setError({ isError: true, type: 'format' });
			return;
		}

		const maxSize = 7 * 1024 * 1024; // 7mb
		const checkSize = files.every((file) => file.size <= maxSize);
		if (!checkSize) {
			setError({ isError: true, type: 'size' });
			return;
		}

		try {
			await calculate(files);
		} catch (err) {
			setError({ isError: true, type: 'other' });
			console.error('Ошибка при обработке файлов:', err);
		} finally {
			setTimeout(() => {
				setIsLoading(false);
				setIsResult(true);
			}, 1000);
		}
	};

	const deleteFile = (id: string) => {
		const newFiles = pdf.filter((item) => item.id !== id);
		setPdf(newFiles);
	};
	const deleteAllFiles = () => {
		setPdf([]);
	};

	const handleClose = () => {
		setError({ isError: false, type: null });
		setIsLoading(false);
		setIsResult(true);
	};

	const changeTheme = () => {
		const body = document.body;
		body.classList.toggle('light');
		if (body.classList.contains('light')) {
			localStorage.setItem('theme', 'light');
			setIsLight(true);
		} else {
			localStorage.removeItem('theme');
			setIsLight(false);
		}
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<div className={styles.container}>
				<AnimatePresence mode='popLayout'>
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
					{isResult && (
						<motion.div
							key='result'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								duration: 1,
								ease: 'easeIn',
							}}
							exit={{
								opacity: 0,
								transition: { duration: 1, ease: 'easeOut' },
							}}>
							<ThemeSwitcher isLight={isLight} changeTheme={changeTheme} />
							<UploadForm handleFiles={handleFiles} />
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
					{error.isError && (
						<Modal close={handleClose}>
							<Notification
								formatError={error.type === 'format'}
								otherError={error.type === 'other'}
								sizeError={error.type === 'size'}
							/>
						</Modal>
					)}
				</AnimatePresence>
			</div>
		</DndProvider>
	);
}
