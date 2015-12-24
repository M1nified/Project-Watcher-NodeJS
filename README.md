# JavaScript Project Watcher by M1nified
## Running
### Requires
#### node_modules
* babel-core
* fs
* fs-finder
* node-notifier
* path

#### ES6
Tested on Node.js v5.3.0

### Project options
You can provide custom settings in json file.
The defaults are:
```json
{
  "module_path" : null,
  "source_path" : ".",
  "destination_path" : "_PRODUCED/",
  "babel" : [],
  "babel_options" : {},
  "copy" : [],
  "options_file" : "project-watcher-options.json",
  "initial_run" : true
}
```
### ProjectWatcher arguments
`-O file.json` or `--options file.json` points the project options file

### Run
`node ProjectWatcher.js [arguments]`
