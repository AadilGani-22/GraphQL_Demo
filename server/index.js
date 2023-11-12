const express = require('express');
const {ApolloServer} = require("@apollo/server");
const {expressMiddleware} = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios");

// import USERS from './user'
// import TODOS from './todos'

const {USERS} = require("./user");
const {TODOS} = require("./todo");

async function startServer(){
    const app = express();
    //server of appolo server
    //resolvers and type def and
    // ! is non-null that is compulsary field

    //if we want to fetch any thing from graphql then we 'query' but if we want to give any thing to the graphql then we 'mututate'

    //axios is used for calling api requests
    //logic likhte hai resolver k andar
    //it can be from data base or from api
    const server = new ApolloServer({
        typeDefs:`
            type User{
                id:ID!
                name:String!
                username:String!
                email:String!
                phone:String!
                website:String!
            }
            type Todo{
                id:ID!
                title:String!
                completed:Boolean
                user:User
            }
            
            type Query{
                getTodos:[Todo]
                getAllUsers: [User]
                getUser(id:ID!) : User
            }
        `,
        // resolvers:{
        //     Todo:{
        //         user: async(todo) =>(await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data,
        //     },
        //     Query:{
        //         getTodos:async() => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data,
        //         getAllUsers:async() => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
        //         getUser: async(parent,{id}) =>(await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data,
        //     },
        // },
        resolvers:{
            Todo:{
            user:(todo)=>USERS.find((e)=>e.id === todo.id),
        },
        Query:{
            getTodos:() => TODOS,
            getAllUsers:() => USERS,
            getUser:async(parent,{id})=>USERS.find((e)=>e.id === id),
        },
    },
    });


    //middlewares ka use 
    app.use(bodyParser.json());
    app.use(cors());

    await server.start();

    app.use("/graphql",expressMiddleware(server));

    app.listen(8000,()=>console.log(`Server started at port 8000`));
}

startServer();