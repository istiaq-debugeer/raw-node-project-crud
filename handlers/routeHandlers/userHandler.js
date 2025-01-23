const { hash } = require('../../helpers/utilities');
const data=require('../../lib/data')

const handler={};

handler.userHandler=(requestProperties,callback)=>{
   
    const acceptedMethods=['get','post','put','delete'];
    const method = (requestProperties.method || '').toLowerCase();
    if (acceptedMethods.indexOf(requestProperties.method)>-1){
        handler._users[method](requestProperties,callback)

    }else{
        callback(405);
    }
   
};

handler._users={};

handler._users.post=(requestProperties,callback)=>{

    
    const firstName = typeof requestProperties.body.firstName === 'string' && 
    requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : true;

    const lastName=typeof requestProperties.body.lastName ==='string' && 
    requestProperties.body.lastName.trim().length> 0 ? requestProperties.body.lastName:true;

    const phone=typeof requestProperties.body.phone ==='string' && 
    requestProperties.body.phone.trim().length ===11 ? requestProperties.body.phone:true;

    const password=typeof requestProperties.body.password ==='string' && 
    requestProperties.body.password.trim().length>0 ? requestProperties.body.password:true;

    const tosAgreement=typeof requestProperties.body.tosAgreement ==='boolean' &&
     requestProperties.body.tosAgreement.length> 0 ? requestProperties.body.tosAgreement:true;

    console.log(firstName,lastName,phone,password,tosAgreement) 

    if(firstName && lastName && phone && password && tosAgreement){
        data.read('users',phone,(err1)=>{
            if( err1){
                let userObject={
                    firstName,
                    lastName,
                    phone,
                    password:hash(password),
                    tosAgreement
                };
                data.create('users',phone,userObject,(err2)=>{
                   if(!err2){
                    callback(200,{message:'User was created successfully'})
                   }else{
                    callback(500,{message:'Could not create user'})
                   }
                        
                });
            } else{
                callback(500,{
                    'error':'There was a problem in server side!',
                });
            }
        });
    

    }else{
        callback(400,{
            'error':'you have a problem in your request'
        });
    }
};

handler._users.get=(requestProperties,callback)=>{
    
    console.log(requestProperties.body)
    callback(200);
};

handler._users.put=(requestProperties,callback)=>{
    
};
handler._users.delete=(requestProperties,callback)=>{
    
};

module.exports=handler