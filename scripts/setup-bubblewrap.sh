#!/bin/bash

# Bubblewrap Setup Script for Indian Road Laws Game
# This script helps set up Bubblewrap for Android app generation

set -e

echo "🚀 Setting up Bubblewrap for Android App Generation"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20.9.0 or later."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "⚠️  Java JDK is not installed."
    echo "   Please install Java JDK 11 or later:"
    echo "   macOS: brew install openjdk@17"
    echo "   Or download from: https://adoptium.net/"
    exit 1
fi

echo "✅ Java found: $(java -version 2>&1 | head -n 1)"

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME is not set."
    echo "   Please install Android Studio or Android SDK and set ANDROID_HOME:"
    echo "   export ANDROID_HOME=\$HOME/Library/Android/sdk"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/tools"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    exit 1
fi

echo "✅ Android SDK found at: $ANDROID_HOME"

# Install Bubblewrap CLI globally
echo ""
echo "📦 Installing Bubblewrap CLI..."
npm install -g @bubblewrap/cli

echo ""
echo "✅ Bubblewrap CLI installed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Create app icons (192x192 and 512x512 PNG) and place in public/ directory"
echo "2. Build your Next.js app: pnpm build"
echo "3. Start the server: pnpm start"
echo "4. Initialize Bubblewrap: bubblewrap init --manifest=https://localhost:3000/manifest.json"
echo "5. Build Android app: bubblewrap build"
echo ""
echo "For detailed instructions, see BUBBLEWRAP_SETUP.md"

