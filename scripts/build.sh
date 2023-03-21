#!/bin/bash

set -e

. $HOME/.profile
cd assets
yarn
yarn build
cd ..
mix deps.get > /dev/null
mix ecto.migrate
mix phx.digest
