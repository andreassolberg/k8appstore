# K8s App Store


Run web server

	NODE_ENV=development npm start | bunyan


Build or watch


	cd app

	browserify -t [ babelify --presets [ es2015 react ] ] js/app.js -o js/bundle.js
	watchify --debug -t [ babelify --presets [ es2015 react ] ] js/app.js -o js/bundle.js


	browserify -t [ babelify --presets [ es2015 react ] ] app/js/app.js -o app/js/bundle.js
	watchify --debug -t [ babelify --presets [ react ] ] app/js/app.js -o app/js/bundle.js

