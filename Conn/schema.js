const { gql } = require('@apollo/server');

// Define the GraphQL schema
const typeDefs = gql`
  type Hotel {
    id: String!
    number: String!
    floor: String!
    view: String!
  }

  type User {
    id: String!
    name: String!
    roomNumber: String! 
  }

  type Query {
    hotel(id: String!): Hotel
    hotels: [Hotel]
    user(id: String!): User
    users: [User]
  }
`;

module.exports = typeDefs;
