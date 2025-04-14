#!/bin/bash

# Linux setup script for alt:V React Framework

# Check if running as root (not recommended)
if [ "$(id -u)" -eq 0 ]; then
  echo "Warning: It's not recommended to run this script as root."
  echo "Press Ctrl+C to abort or Enter to continue..."
  read -r
fi

# Make scripts executable
echo "Setting executable permissions on scripts..."
chmod +x scripts/*.sh

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Please install Node.js 16 or higher."
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
if [ "$NODE_MAJOR" -lt 16 ]; then
  echo "Node.js version $NODE_VERSION is too old. Please install Node.js 16 or higher."
  exit 1
fi

echo "Using Node.js $NODE_VERSION"

# Install dependencies
echo "Installing dependencies..."
npm install

# Create necessary directories
echo "Creating directories..."
npm run ensure-dirs

# Create plugins directory if it doesn't exist
if [ ! -d "plugins" ]; then
  mkdir -p plugins
fi

echo ""
echo "Setup complete! You can now:"
echo "1. Create a plugin: ./scripts/create-plugin.sh my-plugin"
echo "2. Start development: npm run dev"
echo "3. Build for production: npm run build"
echo ""
echo "For more information, see README.md"