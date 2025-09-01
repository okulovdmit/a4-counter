import React from 'react';
import { UploadForm } from '../upload-form/upload-form';
import { Info } from '../info/info';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TPdfFile } from '@utils/types';

type TCounterProps = {
	isResult: boolean;
	pdf: TPdfFile[];
	calculateTotal: (pdf: TPdfFile[]) => { totalA4: number; totalPages: number };
	handleFiles: (files: File[]) => Promise<void>;
	deleteFile: (id: string) => void;
	deleteAllFiles: () => void;
	location: string;
};
export const Check = ({
	isResult,
	pdf,
	calculateTotal,
	handleFiles,
	deleteFile,
	deleteAllFiles,
	location,
}: TCounterProps) => {
	const navigate = useNavigate();
	const header = location === '/format-counter' ? 'counter' : 'check';

	const handleNavigate = () => {
		navigate(-1);
	};
	return (
		<>
			{isResult && (
				<motion.div
					key='check'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 1,
						ease: 'easeIn',
					}}
					exit={{
						opacity: 0,
						transition: { duration: 0.2, ease: 'easeOut' },
					}}>
					<button onClick={() => handleNavigate()}>Назад</button>
					<DndProvider backend={HTML5Backend}>
						<UploadForm handleFiles={handleFiles} header={header} />
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
		</>
	);
};
