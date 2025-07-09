//const { buildSchema } = require('graphql');  // express-graphpql
const fs = require('fs');
const path = require('path');
const {makeExecutableSchema} = require('@graphql-tools/schema')
const   resolvers  =require ('./resolvers');
const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8');

module.exports.graphqlSchema=makeExecutableSchema({
        typeDefs,
        resolvers
    })
