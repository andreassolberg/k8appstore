#! /bin/bash

VERSION="1.0.8"
IMAGE="uninettno/k8appstore:$VERSION"

echo "Building $IMAGE"

# docker build -t andreassolberg/smedstua -t gcr.io/solberg-cluster/ .
docker build -t $IMAGE .
#docker push $IMAGE
#gcloud docker push $IMAGE

echo "Image ready $IMAGE"
echo "kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appstore-deployment.json"
#kubectl --context daas --namespace appenginecore replace -f etc-kubectl/appstore-deployment.json
