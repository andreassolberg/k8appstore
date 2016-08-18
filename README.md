# K8s App Store


Run web server

```
NODE_ENV=development npm start | bunyan
```

Build or watch


	cd app

	watchify --debug -t [ babelify --presets [ es2015 react ] --plugins [ transform-es2015-arrow-functions ] ] js/app.js -o js/bundle.js

Alternatively from the root. Build:

	browserify -t [ babelify --presets [ es2015 react ] ] app/js/app.js -o app/js/bundle.js



Install dependencies:

	npm i
	cd app
	npm i

	npm install babelify -g
	npm install watchify -g
