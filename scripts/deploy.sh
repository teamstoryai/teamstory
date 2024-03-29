#!/bin/bash

cd assets && yarn tsc && cd ..
git push -f origin HEAD:production

LIVE_VERSION=$(curl -s -w "\n" "https://teamstory.ai/deployment_id")

if [ "$LIVE_VERSION" = "blue" ]; then
  DEPLOY_VERSION="green"
else
  DEPLOY_VERSION="blue"
fi

echo "Deploying "$DEPLOY_VERSION

set -e

DIR=sites/$DEPLOY_VERSION

# build & start new server
gcloud compute ssh teamstory-00 --command "cd $DIR; git fetch && git reset --hard origin/production && \
  ./scripts/build.sh && \
  sudo systemctl restart teamstory-$DEPLOY_VERSION && \
  sleep 5 && \
  sudo ln -sf /etc/nginx/sites-available/$DEPLOY_VERSION /etc/nginx/sites-enabled/teamstory && \
  sudo systemctl reload nginx &&
  sleep 5 && \
  sudo systemctl stop teamstory-$LIVE_VERSION"
