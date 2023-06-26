// mongo will return ALL the data in the database with a 0 limit
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

exports.getPagination = (query) => {
	const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
	const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;

	// if page = 1, limit = 20 / skip = 0 * 20 items (skip 0 items)
	// if page = 2, limit = 20 / skip = 1 * 20 items (skip 20 items)
	// if page = 3, limit = 20 / skip = 2 * 20 items (skip 40 items)
	// if page = 4, limit = 20 / skip = 3 * 20 items (skip 60 items)
	const skip = (page - 1) * limit;

	return {
		skip,
		limit,
	};
};
