#!/bin/bash

DIR=$1
DEPLOYMENT=$2
TESTS=$3
RESULTS=$4
export PATH=$PATH:$DIR
export APP_DIR=$DIR
export NODE_ENV_DEPLOYMENT=$DEPLOYMENT
node $DIR/node_modules/mocha/bin/mocha --reporter JSON $TESTS > $RESULTS
