#!/bin/bash

source ~/.profile

export PORT=4000
export TF_PORT=4100

mix phx.server
