import styles from './theme-switcher.module.css';

type ThemeSwitcherProps = {
	isLight: boolean;
	changeTheme: () => void;
};
export const ThemeSwitcher = ({ isLight, changeTheme }: ThemeSwitcherProps) => {
	return (
		<div className={styles.container}>
			<label htmlFor='theme-switcher' className={styles.switch}>
				<input
					id='theme-switcher'
					className={styles.input}
					type='checkbox'
					checked={isLight}
					onClick={() => changeTheme()}
				/>
				<span className={styles.slider}></span>
				<span className={styles.title}>Светлая тема</span>
			</label>
		</div>
	);
};
