import { ApolloServer, gql } from "apollo-server";

// Recap
// - 아폴로 서버를 실행하기 위해서는 반드시 최소 1개의 Query가 필요.
// - type Query는 가장 기본적인 타입.
// - Query에 넣는 필드들은 request할 수 있는 것들이 됨.
// - !를 쓰지 않으면 해당 필드는 nullable field가 됨. (null값을 가질 수 있는 필드) ex) String | null  암묵적으로 이런식임

//dummy data
// --------------------------------------------------------------------------------------
let tweets = [
  {
    id: "1",
    text: "1st,hello",
    userId: "2",
  },
  {
    id: "2",
    text: "2nd,hello",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "William",
    lastName: "Park",
  },
  {
    id: "2",
    firstName: "Yurim",
    lastName: "Kim",
  },
];

// --------------------------------------------------------------------------------------

// type 정의
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String
    lastName: String
    """
    Is the sum of firstName + lastName as a string
    """
    fullName: String!
  }

  type Tweet {
    id: ID!
    text: String
    author: User
  }
  type Query {
    """
    모든 유저를 보여줌
    """
    allUsers: [User!]!
    """
    모든 트윗을 보여줌
    """
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    ping: String!
  }
  type Mutation {
    """
    트윗 추가
    """
    postTweet(text: String, userId: ID): Tweet
    """
    트윗 삭제
    """
    deleteTweet(id: ID): Boolean
  }
`;

// resolvers 에서 CRUD 를 담당한다고 보면됨
// 두번째 args 가 중요함

// Resolver arguments
// Resolver 함수에는 parent(root or source), args, context, info 의 네 가지 인수가 순서대로 전달됨.
// --------------------------------------------------------------------------------------
//      User: {
//        fullName: (parent, args, context, info) => {
//        return "hello";
//      },
//      },
// --------------------------------------------------------------------------------------
// https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(root, { id }) {
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      return users;
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
  // dynamic filed 작동 예시
  User: {
    fullName(root) {
      console.log(root.firstName + " " + root.lastName);
      return `${root.firstName + " " + root.lastName}`;
    },
  },
  // Relationships
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});
