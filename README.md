# JavaScript Project Watcher by M1nified
## Running
### Requires
#### node_modules
* fs
* babel-core
* fs-finder
* node-notifier

#### ES6
Tested on Node.js v5.3.0

### Options
You can provide custom settings in json file.
The defaults are:
```javascript
{
  module_path : null,
  source_path : '.',
  destination_path : '_PRODUCED/',
  babel : [],
  babel_options : {},
  copy : [],
  options_file:'project-watcher-options.json',
  initial_run:true
}
```