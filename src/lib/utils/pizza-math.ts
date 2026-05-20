export interface PizzaCalcInput {
	totalHeadcount: number;
	totalSlices: number;
	slicesPerPerson: number;
	slicesPerPie: number;
	bufferMultiplier: number;
}

export interface PizzaCalcResult {
	demandSlices: number;
	bufferedSlices: number;
	suggestedPies: number;
}

export function calculatePizza(input: PizzaCalcInput): PizzaCalcResult {
	const headcountDemand = input.totalHeadcount * input.slicesPerPerson;
	const demandSlices = Math.max(input.totalSlices, headcountDemand);
	const bufferedSlices = demandSlices * input.bufferMultiplier;
	const suggestedPies = Math.ceil(bufferedSlices / input.slicesPerPie);
	return { demandSlices, bufferedSlices, suggestedPies };
}

export function computeOrderByAt(eventStart: Date, leadTimeHours: number): Date {
	return new Date(eventStart.getTime() - leadTimeHours * 3600_000);
}
