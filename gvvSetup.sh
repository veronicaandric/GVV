#!/bin/sh

# Install node modules
npm install

# Check if node_modules folder exists
if [ -d "node_modules" ]
then
  
  # Remove incompatible tuio
  rm -rf node_modules/tuio

  # Replace with compatible tuio version
  cp -avR src/assets/tuio node_modules/tuio
fi
