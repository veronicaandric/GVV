#!/bin/sh

# Check if Parcel has re-installed node_modules for tuio
if [ -d "node_modules/tuio/node_modules" ]
then
    # If so, then delete because it conflicts with latest version of socket.io
    rm -rf node_modules/tuio/node_modules
fi

# Start GVV server
node server/main.js
