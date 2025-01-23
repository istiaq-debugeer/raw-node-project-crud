const { StringDecoder } = require('string_decoder');
const url=require('url')
const handler={};
const routes=require('../routes');
const {notFoundHandler}=require('../handlers/routeHandlers/notFoundHandlers');
const {parseJSON}=require('../helpers/utilities');

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
        method
       

    };
    const decoder = new StringDecoder('utf-8')
    let realData = '';
    const choseHandler=routes[trimedPath]? routes [trimedPath]:notFoundHandler;

    req.on('data',(buffer)=>{
        realData += decoder.write(buffer);
      
    });
    req.on('end',()=>{
        realData+=decoder.end();
       
        requestProperties.body=parseJSON(realData)
        // console.log(requestProperties.body.firstName)
    
    choseHandler( requestProperties,(statusCode,payload)=>{
       statusCode=typeof statusCode ==='number'?statusCode:500
       payload=typeof payload ==='object'?payload:{};
       
       const payloadString=JSON.stringify(payload);

       //return the final response
       res.setHeader('Content-Type','application/json');
       res.writeHead(statusCode);
       res.end(payloadString);

    });
    
   
   
});
}

module.exports=handler