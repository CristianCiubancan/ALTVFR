#!/bin/bash

# Simple shell script wrapper for the create-plugin.js script
node "$(dirname "$0")/create-plugin.js" "$@"