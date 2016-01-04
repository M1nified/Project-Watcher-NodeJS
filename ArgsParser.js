'use strict';
exports.args = (function(){
  var args = {

  }
  function isFlag(str){
    return /^(-\w|--\w\w+)$/.test(str)
  }
  var readArgs = function(){
    // console.log(process.argv);
    for(let i=0;i<process.argv.length;i++){
      let arg = process.argv[i];
      if(isFlag(arg)){
        let propmatches = arg.match(/^-(\w)|--(\w\w+)$/);
        arg = propmatches[1] || propmatches[2];
        if(!arg){
          continue;
        }
        if(i+1<process.argv.length && !isFlag(process.argv[i+1])){
          args[arg] = process.argv[i+1];
          i++;
        }else{
          args[arg] = true;
        }
      }
    }

  }
  readArgs();
  return args;
})();
