const {
	getAllLaunches, //
	addNewLaunch,
	abortLaunch,
} = require('../controllers/launch.controller');

const express = require('express');
const launchRoutes = express.Router();

launchRoutes.get('/', getAllLaunches);
launchRoutes.post('/', addNewLaunch);
launchRoutes.delete('/:id', abortLaunch);

module.exports = launchRoutes;
