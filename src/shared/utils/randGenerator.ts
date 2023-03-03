
export const randomNumber = (
	minVal: number,
	maxVal: number
) => {
	const randomPeriod =
		Math.floor(Math.random() * (maxVal - minVal + 1) + minVal);

	return randomPeriod  * 1000
};