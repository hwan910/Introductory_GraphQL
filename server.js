import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "1st,hello",
  },
  {
    id: "2",
    text: "2nd,hello",
  },
];

const typeDefs = gql`
  type User {
    id: ID
    username: String
  }

  type Tweet {
    id: ID!
    text: String
    author: User
  }
  type Query {
    allTweets: [Tweet]
    tweet(id: ID!): Tweet
    ping: String!
  }
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

// resolvers 에서 CRUD 를 담당한다고 보면됨
// 두번째 args 가 중요함

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
  },
  // Query 와 Mutation 은 같은 기능을 같고 있음
  // => GraphQL에선 뭘 써도 신경쓰지 않음, 그러나 코드 가독성을 높이기 위해 나눠 놓고 있음

  Mutation: {
    postTweet(_, { text, userId }) {
      const newTweet = {
        id: tweets.length + 1,
        text,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
