import { useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});

	const setValue = (value: T | ((prevValue: T) => T)) => {
		try {
			setStoredValue((prevStoredValue) => {
				const valueToStore = value instanceof Function ? value(prevStoredValue) : value;
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
				return valueToStore;
			});
		} catch (error) {
			console.error(error);
		}
	};

	return [storedValue, setValue] as const;
};
