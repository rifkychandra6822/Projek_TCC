const fetch = require('node-fetch');
const Berry = require('../models/Berry.js');

// Function to get Berry data from PokeAPI and store it in the database
const getBerryData = async (berryId) => {
    try {
        // Fetch Berry data from PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/berry-flavor/${berryId}/`);
        const data = await response.json();

        // Create a new Berry object
        const berry = new Berry({
            name: data.name,
            berries: data.berries,
            contest_type: data.contest_type.name
        });

        // Save the Berry data to the database
        await berry.save();

        return data;
    } catch (error) {
        console.error("Error fetching or saving Berry data: ", error);
        throw new Error('Error fetching or saving Berry data');
    }
};

module.exports = { getBerryData };
