const planets = require('../models/planet.model');
const launches = require('../models/launch.model');

const {getPagination} = require('../utils/pagination');

exports.getAllLaunches = async (req, res, next) => {
	const {skip, limit} = getPagination(req.query);
	try {
		const result = await launches
			.find(
				{},
				{
					'_id': 0,
					'__v': 0,
				}
			)
			// .sort({flightNumber: -1}) // sort by flightNumber in descending order
			.sort({flightNumber: 1})
			.skip(skip)
			.limit(limit);

		return res.status(200).json({
			status: 'success',
			data: result,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
};

exports.addNewLaunch = async (req, res, next) => {
	const incomingLaunch = req.body;
	if (!incomingLaunch.rocket || !incomingLaunch.mission || !incomingLaunch.launchDate || !incomingLaunch.planet) {
		return res.status(400).json({
			message: 'Missing required fields',
		});
	}
	try {
		const result = await scheduleNewLaunch(incomingLaunch);
		const newLaunch = await launches.create(result);
		return res.status(201).json({
			status: 'success',
			data: newLaunch,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error.message,
		});
	}
};

exports.abortLaunch = async (req, res, next) => {
	const launchId = +req.params.id;
	try {
		const abortLaunch = await launches.updateOne(
			{
				flightNumber: launchId,
			},
			{
				upcoming: false,
				success: false,
			}
		);

		if (abortLaunch.matchedCount != 1) {
			return res.status(404).json({
				message: 'Launch not found',
			});
		}

		return res.status(200).json({
			message: 'success',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: error.message,
		});
	}
};

const scheduleNewLaunch = async (launch) => {
	// Validate that the planet destination comes from our planets collection.
	const destinationPlanet = await planets.findOne({
		kepler_name: launch.planet,
	});

	// If the planet does not exist, throw an error.
	if (!destinationPlanet) {
		throw new Error('No matching planet was found');
	}

	// Get the latest flight number and increment it by 1.
	const newFlightNumber = (await getLatestFlightNumber()) + 1;

	// Create a new launch object with the updated properties.
	const newLaunch = Object.assign(launch, {
		flightNumber: newFlightNumber,
		customers: ['ZTM', 'NASA'],
	});

	// Return the new launch object.
	return newLaunch;
};

// this method is our way of incrementing the flightNumbers
const getLatestFlightNumber = async () => {
	// findOne will return the first entry available
	// in this case the sort will decend and return the highest number
	const latestLaunch = await launches.findOne().sort('-flightNumber');

	// check to see if there is a latest launch
	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
};

const existLaunchWithId = async (launchId) => {
	return await launches.findOne({
		flightNumber: launchId,
	});
};
