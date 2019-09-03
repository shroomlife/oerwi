#!/bin/bash
DEPLOY_BRANCH="$1"
echo "DEPLOY BRANCH NAME: $DEPLOY_BRANCH"
docker build . shroomlife/oerwi:$DEPLOY_BRANCH
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push shroomlife/oerwi:${DEPLOY_BRANCH}
