const { ApolloServer,PubSub } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose'); 
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const { MONGODB } = require('./config');

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: ({ req }) => ({ req, pubsub }),
//     cors: {
//         origin: "*", // <- allow request from all domains
//         credentials: true,  // <- enable CORS response for requests with credentials (cookies, http authentication)
//       },
// });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
  cors: {
    origin: "*", // <- allow request from all domains
    credentials: true,  // <- enable CORS response for requests with credentials (cookies, http authentication)
  },
});

mongoose
    .connect(MONGODB, { 
        useNewUrlParser : true
    })
    .then(() => {
        console.log('Mongodb connected');
        return server.listen({ port:PORT });
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    })
    .catch(err => {
        console.log(err)
    })
