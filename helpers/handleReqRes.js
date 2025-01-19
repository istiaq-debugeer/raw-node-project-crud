const { StringDecoder } = require('string_decoder');
const url=require('url')
const handler={};
const routes=require('../routes');
const {notFoundHandler}=require('../handlers/routeHandlers/notFoundHandlers');

handler.handleRequest=(req,res)=>{

    const parsedUrl=url.parse(req.url,true)
    const path=parsedUrl.pathname
    const trimedPath=path.replace(/^\/+|\/+$/g,'');
    const method=req.method.toLowerCase();
    const queryStringObject=parsedUrl.query;
    const headerObject=req.headers;

    const requestProperties={
        parsedUrl,
        path,
        trimedPath,
        queryStringObject,
        headerObject,

    };
    const decoder = new StringDecoder('utf-8')
    let realData = '';
    const choseHandler=routes[trimedPath]? routes [trimedPath]:notFoundHandler;
    choseHandler( requestProperties,(statusCode,payload)=>{
       statusCode=typeof(statusCode)==='number'?statusCode:500
       payload=typeof(payload)==='object'?payload:{};
       
       const payloadString=JSON.stringify(payload);

       //return the final response

       res.writeHead(statusCode);
       res.end(payloadString);

    });
    req.on('data',(buffer)=>{
        realData += decoder.write(buffer);
        console.log(realData);
        res.end('Hello javascript');
    });
   
   
};

module.exports=handler