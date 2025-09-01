import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Route, Routes, useLocation } from 'react-router-dom';
import { TPdfFile } from '@utils/types';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence } from 'motion/react';
import Home from '../../pages/home';
import { Uploader } from '../uploader/uploader';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';

export function App() {
	const location = useLocation();
	const background = location.state && location.state.background;
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
		<>
			<AnimatePresence mode='popLayout'>
				<ThemeSwitcher isLight={isLight} changeTheme={changeTheme} />
				<Routes location={background || location}>
					<Route path='/' element={<Home />} />
					<Route
						path='/format-counter'
						element={
							<Uploader
								isLoading={isLoading}
								isResult={isResult}
								error={error}
								handleClose={handleClose}
								handleFiles={handleFiles}
								deleteFile={deleteFile}
								deleteAllFiles={deleteAllFiles}
								pdf={pdf}
								calculateTotal={calculateTotal}
							/>
						}
					/>
					<Route
						path='/draw-check'
						element={
							<Uploader
								isLoading={isLoading}
								isResult={isResult}
								error={error}
								handleClose={handleClose}
								handleFiles={handleFiles}
								deleteFile={deleteFile}
								deleteAllFiles={deleteAllFiles}
								pdf={pdf}
								calculateTotal={calculateTotal}
							/>
						}
					/>
				</Routes>
			</AnimatePresence>
		</>
	);
}
