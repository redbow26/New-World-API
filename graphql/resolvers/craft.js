// Database schema
const Craft = require('../../database/schema/Craft');

module.exports = {
    crafts: async args => {
        // Create the query with the information
        const query = {}
        if (args.stationName) {
            query['station.name'] = args.stationName;
        } 
        if (args.tier) {
            query.tier = args.tier;
        }
        try {
            // Find the element in the database with the specify query
            const crafts = await Craft.find(query);
            return crafts.map(craft => {
                return { ...craft._doc};
            });
        } catch (err) {
            console.log(err);
            // Graphql handle the error
            throw err;
        }
    },
    craft: async args => {
        try {
            // Find the element in the database with the specify query
            const craft = await Craft.findOne({ name: args.name });
            return  { ...craft._doc };
        } catch (err) {
            console.log(err);
            // Graphql handle the error
            throw err;
        }
    },
    createCrafts: async args => {
        // Create new data with the craft schema
        const craft = new Craft({
            name: args.input.name,
            tier: args.input.tier,
            ingredients: args.input.ingredients,
            level: args.input.level,
            station: args.input.station
        });
        try {
            // Save data in the database
            const craft = craft.save()
            // Return the craft data after adding to the database
            return {...craft._doc};
        } catch (err) {
            console.log(err);
            // Graphql handle the error
            throw err;
        }
    }
}