#!/bin/bash

set -e

# Get the directory of the script as relative root path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

# Cluster secrets
kubectl delete secret postgres --ignore-not-found
kubectl create secret generic postgres --from-literal=user=${POSTGRES_USERNAME} --from-literal=db=${POSTGRES_DB} --from-literal=host=${POSTGRES_HOST} --from-literal=password=${POSTGRES_PASSWORD}

kubectl delete secret jwt --ignore-not-found
kubectl create secret generic jwt --from-literal=secret=${JWT_SECRET}

kubectl delete secret bucket --ignore-not-found
kubectl create secret generic bucket --from-literal=name=${AWS_BUCKET}
# Cluster environment variables
kubectl apply -f $DIR/env-config.yaml
# Cluster deployments and services: must be applied after secrets and config maps, as they rely on them
kubectl apply -f $DIR/backend-api-gateway.yaml
kubectl apply -f $DIR/backend-api-feed.yaml
kubectl apply -f $DIR/backend-api-user.yaml
kubectl apply -f $DIR/frontend.yaml
