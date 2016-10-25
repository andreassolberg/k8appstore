#! /bin/bash

browserify --debug -t [ babelify --presets [ es2015 react ] --plugins [ transform-es2015-arrow-functions ] ] js/app.js -o js/bundle.js
