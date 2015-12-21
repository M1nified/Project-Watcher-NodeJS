'use strict';

class Watcher{
  logDate(){
    console.log(Date());
    return '';
  }
  notifyErr(err){
    if(!err){
      return;
    }
    this.notifier.notify({
      'title':'Project Watcher: ERROR',
      'subtitle':err.toString(),
      'message':err.toString(),
      'wait':true
    },function(error,response){
      // console.log(error);
      // console.log(response);
    })
  }
  babelFile(f){
    this.logDate();
    console.log('DID BABEL: ',f);
    this.babel.transformFile(f, this.settings.babel_options, function (err, result) {
      // result; // => { code, map, ast }
      if(err){
        console.log('\n',err,'\n');
        this.notifyErr(err);
      }else{
        this.fs.writeFile(this.settings.destination_path+f,result.code,{flag:'w+'},(err)=>{if(err)console.log(err);this.notifyErr(err);})
      }
    }.bind(this));
  }
  copyFile(f){
    this.logDate();
    console.log('DID COPY: ',f);
    this.fs.readFile(f,(err,data)=>{
      this.fs.writeFile(this.settings.destination_path+f,data,{flag:'w+'},(err)=>{if(err){console.log(err);((err)=>{this.notifyErr(err);})(err);}})
    })
  }
  watchFile(f,actionForFile){
    console.log('WATCHING: ',f);
    this.watchers.push({file:f});
    this.fs.watchFile(f,function(curr,prev){
      actionForFile.call(this,f);
    }.bind(this))
  }
  constructor(settings){
    this.watchers = [];
    this.settings = settings;
    if(this.settings.module_path)module.paths.push(this.settings.module_path);
    this.fs = require('fs');
    this.babel = require("babel-core");
    this.find = require('fs-finder');
    this.notifier = require('node-notifier');
    this.thispath = this.fs.realpathSync(this.settings.source_path);
    console.log('THIS PATH: ',this.thispath);
    for(let f of this.settings.babel){
      this.babelFile(f);
      this.watchFile(f,this.babelFile);
    }
    for(let f of this.settings.copy){
      this.find.from('.').exclude(['node_modules']).findFiles(f,(files)=>{
        // console.log(files);
        for(let file of files){
          file=file.replace(this.thispath,'').replace('/\//g','\\');
          file = file[0]==='\\' ? file.slice(1) : file;
          console.log('SET COPY FOR: ',file);
          this.copyFile(file);
          this.watchFile(file,this.copyFile);
        }
      })
    }
  }
  clear(){
    for(let w of this.watchers){
      this.fs.unwatchFile(w.file);
    }
  }
}
exports.Watcher = Watcher;
