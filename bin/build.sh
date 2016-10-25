#! /bin/bash

VERSION="1.1.3"
IMAGE="uninettno/k8appstore:$VERSION"

echo "Building $IMAGE"
echo "{\"version\": \"$VERSION\"}" > app/etc/version.json

# docker build -t andreassolberg/smedstua -t gcr.io/solberg-cluster/ .
docker build -t $IMAGE .
docker push $IMAGE
#gcloud docker push $IMAGE


jq ".spec.template.spec.containers[0].image = \"$IMAGE\"" etc-kubectl/appstore-deployment.json > etc-kubectl/appstore-deployment-update.json


echo "Image ready $IMAGE"
echo "kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appstore-deployment-update.json"
kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appstore-deployment-update.json
