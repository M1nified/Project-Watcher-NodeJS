# JavaScript Project Watcher by M1nified
## Running
### Requires
#### node_modules
* babel-core
* fs
* fs-finder
* node-notifier
* path
* uglify-js

#### ES6
Tested on Node.js v5.3.0

### Project options
You can provide custom settings in json file.
The defaults are:
```json
{
  "babel" : [],
  "babel_options" : {},
  "babel_uglify" : false,
  "copy" : [],
  "destination_path" : "_PRODUCED/",
  "initial_run" : true,
  "module_path" : null,
  "source_path" : "."
}
```
##### Which means
* `babel` Array of strings representing relative paths (wildcards) of files to be babeled
* `babel_options` Object of babel options (https://babeljs.io/docs/usage/options/)
* `babel_uglify` Boolean, if true babeled files will be uglified
* `copy` Array of strings representing relative paths (wildcards) of files to be coppied
* `destination_path` String, the output path
* `initial_run` Boolean, if true watcher will be triggered while initiating (Use `false` for big projects for faster load)
* `module_path` String representing node_modules path (might be bugged)
* `source_path` String representing the root of input tree

### ProjectWatcher arguments
`-O file.json` or `--options file.json` points the project options file

### Run
`node ProjectWatcher.js [arguments]`

## Examples
TODO
