export function daysToMaxage(days) {
	var today = new Date();
	var resultDate = new Date(today);
	resultDate.setDate(today.getDate() + days);
	return resultDate.getTime() / 1000 - today.getTime() / 1000;
}
export function maxAgeToDateOfExpiry(maxAge) {
	return new Date(Date.now() + maxAge * 1000);
}
