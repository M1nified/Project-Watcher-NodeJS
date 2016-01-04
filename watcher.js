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
  mkdirParent(dirPath, mode, callback) {
    //Call the standard fs.mkdir
    this.fs.mkdir(dirPath, mode, (error)=>{
      //When it fail in this way, do the custom steps
      if (error && error.errno === 34) {
        //Create all the parents recursively
        this.mkdirParent(path.dirname(dirPath), mode, callback);
        //And then the directory
        this.mkdirParent(dirPath, mode, callback);
      }
      //Manually run the callback since we used our own callback to do all these
      callback && callback(error);
    });
  };
  ensureThePath(f){
    // console.log('ENSURE THE PATH: ', f);
    let promise = new Promise((resolve,reject)=>{
      let dir = this.path.dirname(f);
      // console.log('DIR: ',dir);
      // console.log(this.fs.statSync(dir));
      try{
        this.fs.accessSync(dir);
      }catch(e){
        let mkdir = (d) => {
          d = this.path.normalize(d);
          // console.log('MKDIR: ',d);
          // debugger;
          try{
            // console.log('TWORZE: ',d);
            this.fs.mkdirSync(d);
          }catch(e){
            let parent = this.path.dirname(d);
            // console.log(e.code);
            // console.log('lvup -> ',parent)
            try{
              this.fs.accessSync(parent);
              // console.log('KONIEC',e);
            }catch(e){
              mkdir(parent);
            }
            mkdir(d);
            //mkdir(this.path.dirname(d));
            //this.fs.mkdirSync(dir);
          }
        }
        mkdir(this.path.resolve(dir));
      }
      resolve();
    })
    return promise;
  }
  uglifyConditioned(stringofcode){
    if(this.settings.babel_uglify){
      console.log('uglify');
      let result = this.UglifyJS.minify(stringofcode,{
        fromString:true
      });
      return result.code;
    }
    return stringofcode;
  }
  babelFile(f){
    this.logDate();
    f = this.path.normalize(f);
    let target = this.path.normalize(this.settings.destination_path+f);
    console.log('DID BABEL: ',f);
    this.babel.transformFile(f, this.settings.babel_options, function (err, result) {
      // result; // => { code, map, ast }
      if(err){
        console.log('\n',err,'\n');
        this.notifyErr(err);
      }else{
        this.ensureThePath(target).then(()=>{
          let code = this.uglifyConditioned(result.code);
          this.fs.writeFile(target,code,{flag:'w+'},(err)=>{if(err)console.log(err);this.notifyErr(err);})
        })
      }
    }.bind(this));
  }
  copyFile(f){
    this.logDate();
    f = this.path.normalize(f);
    let target = this.path.normalize(this.settings.destination_path+f);
    console.log('DID COPY: ',f);
    this.fs.readFile(f,(err,data)=>{
      this.ensureThePath(target).then(()=>{
        this.fs.writeFile(target,data,{flag:'w+'},(err)=>{if(err){console.log(err);((err)=>{this.notifyErr(err);})(err);}})
      })
    })
  }
  watchFile(f,actionForFile){
    f = this.path.normalize(f);
    console.log('WATCHING: ',f);
    this.watchers.push({file:f});
    this.fs.watchFile(f,function(curr,prev){
      actionForFile.call(this,f);
    }.bind(this))
  }
  constructor(settings){
    this.watchers = [];
    this.settings = settings;
    if(this.settings.module_path){
      module.paths.push(this.settings.module_path);
    }
    this.fs = require('fs');
    this.babel = require("babel-core");
    this.find = require('fs-finder');
    this.notifier = require('node-notifier');
    this.path = require('path');
    this.UglifyJS = require("uglify-js");
    this.initial_path = this.path.normalize(this.fs.realpathSync(this.settings.source_path));
    console.log('THIS PATH: ',this.initial_path);
    for(let f of this.settings.babel){
      f = this.path.normalize(f);
      // console.log('EXP: ',f);
      this.find.from('.').exclude(['node_modules']).findFiles(f,(files)=>{
        // console.log('FILES: ',files);
        for(let file of files){
          file= this.path.relative(this.settings.source_path,file);
          console.log('SET BABEL FOR: ',file);
          if(this.settings.initial_run){
            this.babelFile(file);
          }
          this.watchFile(file,this.babelFile);
        }
      })
    }
    for(let f of this.settings.copy){
      f = this.path.normalize(f);
      this.find.from('.').exclude(['node_modules']).findFiles(f,(files)=>{
        // console.log(files);
        for(let file of files){
          file= this.path.relative(this.settings.source_path,file);
          console.log('SET COPY FOR: ',file);
          if(this.settings.initial_run){
            this.copyFile(file);
          }
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
