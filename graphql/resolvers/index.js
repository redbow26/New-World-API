// Require every resolver
const craftResolver = require('./craft');

// Regroup every resolver
const rootResolver = {
    ...craftResolver,
}

module.exports = rootResolver;