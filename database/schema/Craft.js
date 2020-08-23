// Requirement
const mongoose = require('mongoose');

// Craft schema for mongoDB
const CraftSchema = new mongoose.Schema({
    // Name of the object
    name: {
        type: String,
        required: true,
    },
    // Tier of this craft
    tier: {
        type: Number,
        required: true,
    },
    // Nested document
    // Ingredients array needed for this craft
    ingredients: {
        type: [ {
            // Name of the ingredient
            name: {
                type: String,
            },
            // Quantity needed
            quantity: {
                type: Number,
            }
        } ],
        required: true,
        default: []
    },
    // Jobs level for this craft
    level: {
        type: Number,
        required: true,
    },
    // Nested document
    // Station where this craft is done
    station: {
        // query: station.name
        // Name of the station
        name: {
            type: String,
            required: true,
        },
        // Station level needed for this craft
        level: {
            type: Number,
            required: true,
        }
    }
});

module.exports = mongoose.model('Craft', CraftSchema);