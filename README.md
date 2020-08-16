# Feathers Debugger Chrome Extension

Debug FeathersJS API requests, find bottlenecks, read payloads and understand how your API is queried.

> Extension to debug [FeathersJS](https://github.com/feathersjs/feathers) server.

![sample image](https://raw.githubusercontent.com/radenkovic/feathers-debugger/master/docs/sample.gif)


## Usage

> This plugin is still in active development.


1. Install chrome extension

2. Add hook

Note: this will be npm package. For now you can install it manually.


Create hook that will write file `feathers-debugger` to public folder.

```js
// feathers-debugger.js
const fs = require('fs');
const path = require('path');

const PUBLIC_PATH = 'public';

// Remove file on every server start
try {
  const stats = fs.statSync(path.join(PUBLIC_PATH, '/feathers-debugger'));
  if (stats['size'] > 2000000) {
    // Delete file if it's too large
    fs.unlinkSync(path.join(PUBLIC_PATH, '/feathers-debugger'));
  }
} catch (e) {
  // NO_OP
}

// Stream to write file
const writer = fs.createWriteStream(
  path.join(PUBLIC_PATH, '/feathers-debugger'),
  { flags: 'a' }
);

module.exports = () => (ctx) => {
  if (!ctx._req_ts) {
    ctx._req_ts = Date.now();
  } else {
    ctx._req_duration = Date.now() - ctx._req_ts;
  }
  const payload = {
    id: ctx._req_id,
    path: ctx.path,
    type: ctx.type,
    method: ctx.method,
    provider: ctx.params ? ctx.params.provider : undefined,
    ts: ctx._req_ts,
    duration: ctx._req_duration,
    end: Date.now(),
  };
  if (payload.duration) {
    writer.write(JSON.stringify(payload) + '\n');
  }
};


```

3. Include that hook in `app.hooks.js`:

```js
// app.hooks
const feathersDebugger = require('./feathers-debugger')

module.exports = {
  before: {
    all: [
      feathersDebugger(),
    ],
    // ....
    finally: {
      all: [
        feathersDebugger()
      ]
    }
```

4. (optional) gitignore `public/feathers-debugger`

5. Open devtools and click "Feathers" tab

Happy debugging!




## Development

- git clone https://github.com/radenkovic/feathers-debugger
- yarn
- yarn dev
- open [localhost:3000/devtools.html](http://localhost:3000/devtools.html)



