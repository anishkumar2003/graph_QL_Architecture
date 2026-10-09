
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";

// 1. Temporary data source
let users = [
  { id: "1", name: "Anish", email: "anish@example.com" },
  { id: "2", name: "Rahul", email: "rahul@example.com" }
];

// 2. Schema: what our API supports
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUsers: [User!]!
    getUser(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean!
  }
`;

// 3. Resolvers: how operations execute
const resolvers = {
  Query: {
    getUsers: () => users,

    getUser: (_, { id }) =>
      users.find(user => user.id === id) ?? null
  },

  Mutation: {
    createUser: (_, { name, email }) => {
      const user = {
        id: String(Date.now()),
        name,
        email
      };

      users.push(user);
      return user;
    },

    updateUser: (_, { id, name, email }) => {
      const user = users.find(user => user.id === id);

      if (!user) return null;

      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;

      return user;
    },

    deleteUser: (_, { id }) => {
      const originalLength = users.length;
      users = users.filter(user => user.id !== id);

      return users.length < originalLength;
    }
  }
};

// 4. Create and start Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server ready at ${url}`);
