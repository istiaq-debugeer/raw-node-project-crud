const { error } = require('console');
const fs=require('fs');

const path=require('path');

const lib={};

lib.basedir=path.join(__dirname,'/../.data/')

lib.create=function(dir,file,data,callback){
    fs.open(lib.basedir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            const stringData=JSON.stringify(data);

            fs.writeFile(fileDescriptor,stringData,(err2)=>{
                if(!err2){
                    fs.close(fileDescriptor,(err3)=>{
                        if(!err3){
                            callback(false)
                        }else{
                            callback('Error closing the new file')
                        }
                    })
                }else{
                    callback('erre writting to new file')
                }
            })
        }else{
            callback(err,'could not create new file ,it may already exists!')
        }
    })

}

lib.read=(dir,file,callback)=>{
    fs.readFile(lib.basedir+dir+'/'+file+'.json','utf8',(err,data)=>{
        callback(err,data);
    });
}; 

lib.update=(dir,file,data,callback)=>{
    fs.open(lib.basedir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{

        if(!err && fileDescriptor){
            const stringData=JSON.stringify(data);

            fs.ftruncate(fileDescriptor,(err1)=>{
                if(!err1){
                    fs.writeFile(fileDescriptor,stringData,(err2)=>{
                        if(!err2){
                            fs.close(fileDescriptor,(err3)=>{
                                if(!err3){
                                    callback(false)

                                }else{
                                    callback('Error closing file!')
                                }
                            })
                        }else{
                            callback('Error writting file')
                        }
                    })
                }else{
                    callback("Error truncating file!");
                }
            })
        }else{
            console.log(`Error updating .File may not exists `)
        }
    });
}

lib.delete=(dir,file,data,callback)=>{
    fs.unlink(lib.basedir+dir+'/'+file+'.json',(err,data)=>{
      if(!err){
        callback(false)
      }else{
        callback(`Error deleting file`)
      }   
    });
}
module.exports=lib;