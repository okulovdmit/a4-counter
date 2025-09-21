import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';
import { motion } from 'motion/react';
import styles from './upload-form.module.css';
import React from 'react';

type Item = {
	files: File[];
};

type TUploadForm = {
	handleFiles: (files: File[]) => Promise<void>;
	header: string;
};
export const UploadForm = ({ handleFiles, header }: TUploadForm) => {
	const [{ isOver }, dropRef] = useDrop<Item, unknown, { isOver: boolean }>({
		accept: NativeTypes.FILE,
		drop(item) {
			if (item.files) {
				handleFiles(Array.from(item.files));
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	});

	const text =
		header === 'counter' ? 'Подсчет форматов А4' : 'Подписать чертежи';
	return (
		<div
			ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
			className={`${styles.upload} ${isOver ? styles.active : ''}`}>
			<h1>{text}</h1>
			<input
				type='file'
				id='upload__input'
				accept='.pdf'
				multiple
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					const selectedFile: FileList | null = e.target.files;
					const filesArray: File[] = Array.from(selectedFile || []);
					handleFiles(filesArray);
				}}
				style={{ display: 'none' }}
			/>
			<motion.button
				onClick={() => document.getElementById('upload__input')?.click()}
				whileTap={{ scale: 0.9 }}
				whileHover={{ scale: 1.1 }}
				transition={{
					type: 'spring',
					duration: 0.1,
					ease: 'easeInOut',
				}}>
				<span>Выбрать</span>
			</motion.button>
			<div className={styles.drop}>
				<p>Перетащите свои pdf-файлы или нажмите на &#34;Выбрать&#34;</p>
			</div>
		</div>
	);
};
