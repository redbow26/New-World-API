// Requirement
const { buildSchema } = require('graphql');

// Graphql schema
module.exports = buildSchema(`
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
`);