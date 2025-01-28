
const crypto=require('crypto');
const utilities={};
const environment=require('./environments')

utilities.parseJSON=(jsonstring)=>{
    let output={};

    try{
        output=JSON.parse(jsonstring)
    }catch{
        outuput={};
    }

    return output;
};

utilities.hash=(str)=>{
   if(typeof str==='string' && str.length>0){
    const hash=crypto
    .createHmac('sha256','password')
    .update(str)
    .digest('hex');
    return hash
   }
   return  false
};
module.exports=utilities;