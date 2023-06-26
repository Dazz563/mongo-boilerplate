const {
	getAllplanets, //
	addNewPlanet,
} = require('../controllers/planet.controller');

const express = require('express');
const planetRoutes = express.Router();

planetRoutes.get('/', getAllplanets);
planetRoutes.post('/', addNewPlanet);

module.exports = planetRoutes;
