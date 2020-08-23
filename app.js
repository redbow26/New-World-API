require('dotenv').config();

// Requirement
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Database schema
const Craft = require('./database/schema/Craft');

// Create the express app
const app = express();

// Use env variable port or port 3001
PORT = process.env.PORT || 3001;

// Use the body parser middleware with express app
app.use(bodyParser.json());

// Graphql api route -> /api
// Use the graphqlHTTP middleware function 
app.use('/api', graphqlHTTP({
    schema: buildSchema(`
        type station {
            name: String!
            level: Int!
        }
        
        type ingredient {
            name: String!
            quantity: Int!
        }
    
        type craft {
            _id: ID!
            name: String!
            tier: Int!
            ingredients: [ingredient!]!
            level: Int!
            station: station!
        }

        input stationInput {
            name: String!
            level: Int!
        }
        
        input ingredientInput {
            name: String!
            quantity: Int!
        }

        input craftInput {
            name: String!
            tier: Int!
            ingredients: [ingredientInput!]!
            level: Int!
            station: stationInput!
        }

        type RootQuery {
            crafts(stationName: String, tier: Int): [craft!]!
            craft(name: String!): craft
        }

        type RootMutation {
            createCrafts(input: craftInput): craft
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        crafts: args => {
            // Create the query with the information
            const query = {}
            if (args.stationName) {
                query['station.name'] = args.stationName;
            } 
            if (args.tier) {
                query.tier = args.tier;
            }
            // Find the element in the database with the specify query
            // With return, graphql know this resolver execute async function
            return Craft.find(query)
            .then(crafts => {
                return crafts.map(craft => {
                    return { ...craft._doc};
                });
            })
            .catch(err => {
                console.log(err);
                // Graphql handle the error
                throw err;
            });
        },
        craft: args => {
            // Find the element in the database with the specify query
            // With return, graphql know this resolver execute async function
            return Craft.findOne({ name: args.name })
            .then(craft => {
                return  { ...craft._doc };
            })
            .catch(err => {
                console.log(err);
                // Graphql handle the error
                throw err;
            });
        },
        createCrafts: args => {
            // Create new data with the craft schema
            const craft = new Craft({
                name: args.input.name,
                tier: args.input.tier,
                ingredients: args.input.ingredients,
                level: args.input.level,
                station: args.input.station
            });
            // Save data in the database
            // With return, graphql know this resolver execute async function
            return craft.save()
            .then(result => {
                // Return the craft data after adding to the database
                return {...result._doc};
            })
            .catch(err => {
                console.log(err);
                // Graphql handle the error
                throw err;
            });
        }
    },
    // Dev only
    graphiql: true,
}));

// Connect to the mongo database, with db provide in env variable
mongoose.connect(`mongodb://localhost/${process.env.MONGO_DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// When database connection done
.then(() => {
    // Launch express app on the specified port
    app.listen(PORT, () => console.log(`Now browse to localhost:${PORT}/api`));
})
.catch(err => console.log(err));


