export function getMealIDs(nodes) {
	const ids = [];
	nodes.forEach((el) => {
		ids.push(el.idMeal);
	});

	return ids;
}
