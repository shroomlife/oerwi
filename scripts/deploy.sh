#!/bin/bash
export DEPLOY_BRANCH="$1"
docker build --tag shroomlife/oerwi:$DEPLOY_BRANCH .
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push shroomlife/oerwi:${DEPLOY_BRANCH}
