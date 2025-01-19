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

lib.update()
module.exports=lib;