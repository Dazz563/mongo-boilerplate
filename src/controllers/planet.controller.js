const planets = require('../models/planet.model');
const launches = require('../models/launch.model');

exports.getAllplanets = async (req, res, next) => {
	try {
		const result = await planets.find(
			{},
			{
				'_id': 0,
				'__v': 0,
			}
		);
		return res.status(200).json({
			status: 'success',
			data: result,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: 'Internal Server Error',
			error,
		});
	}
};

exports.addNewPlanet = async (req, res, next) => {
	const newPlanet = req.body;
	try {
		const result = await planets.create(newPlanet);
		return res.status(201).json({
			status: 'success',
			data: result,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			message: 'Internal Server Error',
			error,
		});
	}
};
