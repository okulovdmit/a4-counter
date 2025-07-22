type TNotificationProps = {
	formatError?: boolean;
	sizeError?: boolean;
	otherError?: boolean;
};
export const Notification = ({
	formatError,
	sizeError,
	otherError,
}: TNotificationProps) => {
	const format = 'Неверный формат. Файл должен быть PDF. Выберите другой файл.';
	const size = 'Файл слишком большой. Максимальный размер 7 МБ.';
	const other = 'Что-то пошло не так, повторите попытку позже';
	const text = formatError ? format : sizeError ? size : otherError ?? other;
	return (
		<div className='notification'>
			<p>{text}</p>
		</div>
	);
};
