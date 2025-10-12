#!/bin/bash

up() {
  echo "Starting service..."
}

down() {
  echo "Stopping service..."
}

# Call the function based on argument
"$@"
