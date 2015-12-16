'use strict';
console.log("                                                                ");
console.log(" _____           _         _      _ _ _     _       _           ");
console.log("|  _  |___ ___  |_|___ ___| |_   | | | |___| |_ ___| |_ ___ ___ ");
console.log("|   __|  _| . | | | -_|  _|  _|  | | | | .'|  _|  _|   | -_|  _|");
console.log("|__|  |_| |___|_| |___|___|_|    |_____|__,|_| |___|_|_|___|_|  ");
console.log("              |___|                                             ");
console.log(" _          _____ ___       _ ___ _       _                     ");
console.log("| |_ _ _   |     |_  |  ___|_|  _|_|___ _| |                    ");
console.log("| . | | |  | | | |_| |_|   | |  _| | -_| . |                    ");
console.log("|___|_  |  |_|_|_|_____|_|_|_|_| |_|___|___|                    ");
console.log("    |___|                                                       ");
console.log("");
var fs = require("fs");
var settings = {
  module_path : null,
  path : '.',
  destination : '_PRODUCED',
  babel : [],
  babel_options : {},
  copy : ["*"]
}
try{
  let options = JSON.parse(fs.readFileSync('project-watcher-options.json'));
  for(let opt in options){
    settings[opt] = options[opt];
  }
}catch(e){
  console.log(e)
}
if(settings.module_path)module.paths.push(settings.module_path);
var babel = require("babel-core");
var find = require('fs-finder');

var thispath = fs.realpathSync(settings.path);
console.log('THIS PATH: ',thispath);
function logDate(){
  console.log(Date());
  return '';
}
function babelFile(f){
  logDate();
  console.log('DID BABEL: ',f);
  babel.transformFile(f, settings.babel_options, function (err, result) {
    // result; // => { code, map, ast }
    if(err){
      console.log(err);
    }else{
      fs.writeFile(settings.destination+f,result.code,{flag:'w+'},function(err){if(err)console.log(err);})
    }
  });
}
function copyFile(f){
  logDate();
  console.log('DID COPY: ',f);
  fs.readFile(f,(err,data)=>{
    fs.writeFile(settings.destination+f,data,{flag:'w+'},(err)=>{if(err)console.log(err);})
  })
}
function watchFile(f,actionForFile){
  console.log('WATCHING: ',f);
  fs.watchFile(f,function(curr,prev){
    actionForFile(f);
  }.bind(this))
}
for(let f of settings.babel){
  babelFile(f);
  watchFile(f,babelFile);
}
for(let f of settings.copy){
  find.from('.').exclude(['node_modules']).findFiles(f,(files)=>{
    // console.log(files);
    for(let file of files){
      file=file.replace(thispath,'').replace('/\//g','\\');
      file = file[0]==='\\' ? file.slice(1) : file;
      console.log('SET COPY FOR: ',file);
      copyFile(file);
      watchFile(file,copyFile);
    }
  })
}
