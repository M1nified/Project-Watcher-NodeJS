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
var watcher = require('./watcher.js');

var DEFAULT = {
  settings : function(){
    return {
      module_path : null,
      source_path : '.',
      destination_path : '_PRODUCED',
      babel : [],
      babel_options : {},
      copy : ["*"]
    }
  }
}
var w = null;
function start(){
  try{
    w.clear();
  }catch(e){}
  var settings = DEFAULT.settings();
  try{
    let options = JSON.parse(fs.readFileSync('project-watcher-options.json'));
    for(let opt in options){
      settings[opt] = options[opt];
    }
  }catch(e){
    console.log(e)
  }
  w = new watcher.Watcher(settings);
}
start();
fs.watchFile('project-watcher-options.json',(curr,prev)=>{
  start();
})
