export const drawValidator = (text: string) => {
	//правило 1: Обозначение и наименование документа
	const designationReg = /ПТК\.022\.d{2}\.\d{2}.\d{3}/;
	if (!designationReg.test(text)) {
		return 'Ошибка в обозначении документа!';
	}

	//правило 2: Фамилия разработчика
	const developerReg = /Разработчик: [А-Яа-я]+/;
	if (!developerReg.test(text)) {
		return 'Ошибка в фамилии разработчика!';
	}

	//Правило 3: Фамилия проверяющего
	const checkReg = /Проверил: [А-Яа-я]+/;
	if (!checkReg.test(text)) {
		return 'Ошибка в фамилии проверяющего!';
	}
	return 'Чертеж соответствует требованиям!';
};
