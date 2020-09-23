# Feathers Debugger Chrome Extension

Debug FeathersJS API requests, find bottlenecks, read payloads and understand how your API is queried.

> Extension to debug [FeathersJS](https://github.com/feathersjs/feathers) server.

![sample image](https://raw.githubusercontent.com/radenkovic/feathers-debugger/master/docs/sample.gif)

## Features

- Waterfall chart
- Track request duration
- Find API bottlenecks
- Visualize Queries
- Inspect Query params and errors (coming soon!)


## Usage

1. Install chrome extension from [Chrome Web Store](https://chrome.google.com/webstore/detail/feathers-debugger/nmpoglofdnlpdkpdnjadngpjcocoffie)

2. Add [Feathers Debugger Service](https://www.npmjs.com/package/feathers-debugger-service) and configure it as explained [here](https://github.com/radenkovic/feathers-debugger-service).

3. Open Chrome devtools, and you will see Feathers tab on the right.

4. Happy Debugging!


## Development

Contributions are welcome!

- git clone https://github.com/radenkovic/feathers-debugger
- yarn
- yarn dev
- open [localhost:3000/devtools.html](http://localhost:3000/devtools.html)

## Deployment
- Bump version in package.json
- Bump version in manifest.json
- yarn build
- Create github release
- Upload to Chrome Store
