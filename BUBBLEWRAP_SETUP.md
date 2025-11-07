# Bubblewrap Android App Setup Guide

This guide will help you create an Android app from this Next.js PWA using Bubblewrap.

## Prerequisites

1. **Node.js** (v20.9.0 or later) - Already installed
2. **Java JDK** (11 or later) - Required for Android build
3. **Android SDK** - Required for building Android apps

## Step 1: Install Java JDK

```bash
# On macOS (using Homebrew)
brew install openjdk@17

# Or download from: https://adoptium.net/
```

## Step 2: Install Android SDK

```bash
# Install Android Studio or Android SDK Command Line Tools
# Download from: https://developer.android.com/studio

# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Step 3: Install Bubblewrap CLI

```bash
npm install -g @bubblewrap/cli
```

## Step 4: Generate App Icons

You'll need to create app icons (192x192 and 512x512 PNG files).
Place them in the `public/` directory as:
- `public/icon-192.png`
- `public/icon-512.png`

## Step 5: Build and Start Your PWA

```bash
# Build the Next.js app
pnpm build

# Start the production server
pnpm start
```

The app should be accessible at `http://localhost:3000`

## Step 6: Initialize Bubblewrap Project

```bash
# Navigate to project root
cd /Users/vipulsharma/projects/automation

# Initialize Bubblewrap (interactive setup)
bubblewrap init --manifest=https://localhost:3000/manifest.json

# Or use local manifest
bubblewrap init --manifest=./public/manifest.json
```

During initialization, you'll be prompted for:
- **Package ID**: e.g., `com.indianroadlaws.game`
- **App Name**: Indian Road Laws Learning Game
- **App Version**: 1.0.0
- **App Version Name**: 1.0.0
- **Signing Key**: Create a new key or use existing

## Step 7: Build Android App

```bash
# Build the Android APK
bubblewrap build

# Or build AAB (Android App Bundle) for Play Store
bubblewrap build --release
```

## Step 8: Install on Device

```bash
# Install the generated APK on connected Android device
adb install app-release.apk

# Or use the generated APK from: ./twa-manifest.json directory
```

## Alternative: Quick Setup Script

A setup script is provided below for automated setup.

## Troubleshooting

1. **Java not found**: Install JDK and set JAVA_HOME
2. **Android SDK not found**: Install Android Studio or SDK tools
3. **Manifest errors**: Ensure manifest.json is accessible at the URL
4. **Build errors**: Check that the Next.js app is running and accessible

## Notes

- The app will be a Trusted Web Activity (TWA) wrapping your PWA
- All functionality will work as in the web version
- Offline support depends on service worker implementation
- The app will use the same URL structure with locale routing

