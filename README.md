# K8s App Store


Run web server

	NODE_ENV=development npm start | bunyan


Build or watch

	browserify -t [ babelify --presets [ es2015 react ] ] app/js/app.js -o app/js/bundle.js
	watchify -t [ babelify --presets [ react ] ] app/js/app.js -o app/js/bundle.js

