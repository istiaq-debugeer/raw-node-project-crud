// dependencies
const http=require('http');
require('dotenv').config();

const {handleRequest}= require ('./helpers/handleReqRes');
const environment=require('./helpers/environments');
const data=require('./lib/data');

const app={};

data.read('test','newFile2',(err,data)=>{
    console.log(`error was`,err,data);
});
app.config={
    port:3000
};

app.createServer=()=>{
    const server=http.createServer(app.handleRequest)
    server.listen(environment.port,()=>{
        
        console.log(`listening to port  ${environment.port}`);
    });
};

//hanlerequest response

app.handleRequest=handleRequest
app.createServer();