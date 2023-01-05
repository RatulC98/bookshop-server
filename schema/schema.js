const graphql = require("graphql");

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } = graphql;

//Dummy Data
var books = [
  { id: "1", name: "Lord of the Mysteries", genre: "Adventure", authorId: "101" },
  { id: "2", name: "Reverend Insanity", genre: "Adventure", authorId: "102" },
  { id: "3", name: "Martial World", genre: "Action", authorId: "102" },
];

var authors = [
  { id: "101", name: "Cuttle Fish", age: 27 },
  { id: "102", name: "Fang Yuan", age: 35 },
];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        let tmpAuthor;
        authors.forEach((author) => {
          if (author.id == parent.authorId) {
            tmpAuthor = author;
          }
        });
        return tmpAuthor;
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: graphql.GraphQLInt },
    books: {
      type: new graphql.GraphQLList(BookType),
      resolve(parent, args) {
        let bookList = [];
        books.forEach((book) => {
          if (parent.id == book.authorId) {
            bookList.push(book);
          }
        });
        return bookList;
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        // here we write code to get data from db
        let tmpBook;
        books.forEach((book) => {
          if (book.id == args.id) {
            tmpBook = book;
          }
        });
        return tmpBook;
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        let tmpAuthor;
        authors.forEach((author) => {
          if (author.id == args.id) {
            tmpAuthor = author;
          }
        });
        return tmpAuthor;
      },
    },
    authors: {
      type: new graphql.GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
    books: {
      type: new graphql.GraphQLList(BookType),
      resolve() {
        return books;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        // id: {type: GraphQLInt},
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let tmpAuthor = {
          id: 101 + authors.length,
          name: args.name,
          age: args.age,
        };
        authors.push(tmpAuthor);
        return tmpAuthor;
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
      },
      resolve(parent, args) {
        let id = (books.length + 1)
        let tmpBook = {
          id: id.toString(),
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        };
        books.push(tmpBook);
        return tmpBook;
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
