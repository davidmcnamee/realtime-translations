#!/bin/bash

brew install ffmpeg opus libvpx pkg-config
pip install peerjs

cd extension
yarn
cd ..
