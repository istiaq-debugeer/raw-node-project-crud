const { hash } = require('../../helpers/utilities');
const data=require('../../lib/data')
const fs=require('fs');
const path=require('path');
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

handler._users.get = (requestProperties, callback) => {
    console.log('Query String:', requestProperties.queryStringObject); // Debug

    const phone = typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
        ? requestProperties.queryStringObject.phone
        : false;

    if (phone) {
        data.read('users', phone, (err, data) => {
            console.log('Read Error:', err); // Debug
            console.log('Read Data:', data); // Debug

            if (!err && data) {
                const user = { ...JSON.parse(data) };
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'Requested user was not found!',
                });
            }
        });
    } else {
        const usersDir = path.join(__dirname, '../../.data/users/');
        fs.readdir(usersDir, (err, files) => {
            if (!err && files.length > 0) {
                const users = [];
                let filesProcessed = 0;

                files.forEach((file) => {
                    const userId = file.replace('.json', ''); // Remove `.json` extension
                    data.read('users', userId, (readErr, userData) => {
                        filesProcessed++;
                        if (!readErr && userData) {
                            const user = { ...JSON.parse(userData) };
                            delete user.password; // Remove sensitive data
                            users.push(user);
                        }

                        // Return all users once all files are processed
                        if (filesProcessed === files.length) {
                            callback(200, users);
                        }
                    });
                });
            } else {
                callback(404, { error: 'No users found!' });
            }
        });
    }
};
        



handler._users.put=(requestProperties,callback)=>{
    const phone=typeof requestProperties.queryStringObject.phone ==='string' &&
    requestProperties.queryStringObject.phone.trim().length ===11 ? requestProperties.queryStringObject.phone:false;

    const firstName = typeof requestProperties.body.firstName === 'string' && 
    requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName=typeof requestProperties.body.lastName ==='string' &&
    requestProperties.body.lastName.trim().length> 0 ? requestProperties.body.lastName:false;

    const password=typeof requestProperties.body.password ==='string' &&
    requestProperties.body.password.trim().length>0 ? requestProperties.body.password:false;

    if(phone){
        if(firstName || lastName || password){
            data.read('users',phone,(err,userData)=>{
                const userdata=JSON.parse(userData);
                if(firstName){
                    userdata.firstName=firstName;
                }
                if(lastName){
                    userdata.lastName=lastName;
                }
                if(password){
                    userdata.password=hash(password);
                }
                data.update('users',phone,userdata,(err2)=>{
                    if(!err2){
                        callback(200,{message:'User was updated successfully'})
                    }else{
                        callback(500,{message:'Could not update user'})
                    }
                });
            });
        }else{
            callback(400,{message:'Invalid phone  number'})
        }
    }else{
        callback(400,{message:'Invalid phone  number'})
    }
};
handler._users.delete=(requestProperties,callback)=>{
    const phone=typeof requestProperties.queryStringObject.phone ==='string' &&
    requestProperties.queryStringObject.phone.trim().length ===11 ? requestProperties.queryStringObject.phone:false;

    if(phone){
        data.read('users',phone,(err,userData)=>{
            if(!err && userData){
                data.delete('users',phone,(err2)=>{
                    if(!err2){
                        callback(200,{message:'User was deleted successfully'})
                    }else{
                        callback(500,{message:'Could not delete user'})
                    }
                });
            }else{
                callback(500,{message:'Could not find the user'})
            }
        });
    }else{  
        callback(400,{message:'There was a problem in your request'})
    }
};

module.exports=handler;