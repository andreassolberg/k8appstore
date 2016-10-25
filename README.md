# K8s App Store


docker build -t uninettno/k8appstore .
docker run -d -p 8080:8080 --env-file=./ENV -t uninettno/k8appstore



docker run -p 8080:8080 --env-file=./ENV -t uninettno/k8appstore:1.0.8
-----


https://store.apps.uninett-labs.no


kubectl --context daas --namespace appenginecore create -f etc-kubectl/appstore-deployment.json
kubectl --context daas --namespace appenginecore create -f etc-kubectl/appstore-service.yaml
kubectl --context daas --namespace appenginecore create -f etc-kubectl/appstore-ingress.json


kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appstore-deployment.json

AppEngine backend


Dataporten API
https://k8appengine.dataporten-api.no/

Real API
https://appengine.daas.labs.uninett.no

Ingress

Running in namespace
  appenginecore


New real API
  api.apps.uninett-labs.no


------


Run web server

```
NODE_ENV=development npm start | bunyan
```

Build or watch

```
cd app
watchify --debug -t [ babelify --presets [ es2015 react ] --plugins [ transform-es2015-arrow-functions ] ] js/app.js -o js/bundle.js
```

Alternatively from the root. Build:

```
browserify -t [ babelify --presets [ es2015 react ] ] app/js/app.js -o app/js/bundle.js
```

run:

```
npm start
```

browserify --debug -t [ babelify --presets [ es2015 react ] --plugins [ transform-es2015-arrow-functions ] ] js/app.js -o js/bundle.js



Install dependencies:

```
npm i
cd app
npm i

npm install babelify -g
npm install watchify -g
```

Make sure you configure the app in `etc/config.js`
