require('dotenv').config();

// Requirement
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');

// Custom requirement
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolver = require('./graphql/resolvers/index');

// Create the express app
const app = express();

// Use env variable port or port 3001
PORT = process.env.PORT || 3001;

// Use the body parser middleware with express app
app.use(bodyParser.json());

// Graphql api route -> /api
// Use the graphqlHTTP middleware function 
app.use('/api', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
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


