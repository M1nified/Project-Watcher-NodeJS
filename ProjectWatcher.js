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
  settings : {
      module_path : null,
      source_path : '.',
      destination_path : '_PRODUCED/',
      babel : [],
      babel_options : {},
      babel_uglify:false,
      copy : [],
      options_file:'project-watcher-options.json',
      initial_run:true
    }
}
var w = null;
// var settings = null;
var settings = DEFAULT.settings;
//checking args
var args = require('./ArgsParser.js');
if(args.O || args.options){
  settings.options_file = args.O || args.options || DEFAULT.settings.options_file;
}
//checking args END
function start(){
  try{
    w.clear();
  }catch(e){}
  try{
    let options = JSON.parse(fs.readFileSync(settings.options_file));
    for(let opt in options){
      settings[opt] = options[opt];
    }
  }catch(e){
    console.log(e)
  }
  w = new watcher.Watcher(settings);
}
start();
fs.watchFile(settings.options_file,(curr,prev)=>{
  start();
})
