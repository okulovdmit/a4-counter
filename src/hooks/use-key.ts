import React, { useCallback, useEffect } from 'react';

type TKeyHandler = (e: React.KeyboardEvent) => void;

export const useKey = (
	key: string,
	handler: () => void
): React.KeyboardEventHandler => {
	const handleKeyDown = useCallback<TKeyHandler>(
		(e) => {
			if (e.key === key) handler();
		},
		[key, handler]
	);

	useEffect(() => {
		const eventHandler = (e: KeyboardEvent) => {
			if (e.key === key) handler();
		};

		window.addEventListener('keydown', eventHandler);

		return () => {
			window.removeEventListener('keydown', eventHandler);
		};
	}, [key, handler]);

	return handleKeyDown;
}