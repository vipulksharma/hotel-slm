# Android App Setup with Bubblewrap

This project is now configured to be converted into an Android app using Google's Bubblewrap tool.

## Quick Start

### 1. Prerequisites

Install the following:
- **Java JDK 11+**: `brew install openjdk@17` (macOS) or download from [Adoptium](https://adoptium.net/)
- **Android SDK**: Install [Android Studio](https://developer.android.com/studio) or Android SDK Command Line Tools
- Set environment variables:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  ```

### 2. Install Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

Or use the setup script:
```bash
pnpm run android:setup
```

### 3. Create App Icons

Create two PNG icons and place them in `public/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

You can use online tools like:
- [Favicon Generator](https://www.favicon-generator.org/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [AppIcon.co](https://www.appicon.co/)

### 4. Build and Start Your App

```bash
# Build the Next.js app
pnpm build

# Start the production server
pnpm start
```

The app will be available at `http://localhost:3000`

### 5. Initialize Bubblewrap

```bash
# Make sure your app is running on localhost:3000
pnpm start

# In another terminal, initialize Bubblewrap
pnpm run android:init
```

During initialization, you'll be asked for:
- **Package ID**: e.g., `com.indianroadlaws.game`
- **App Name**: Indian Road Laws Learning Game
- **App Version**: 1.0.0
- **Signing Key**: Create a new key or use existing

### 6. Build Android APK

```bash
pnpm run android:build
```

This will generate an APK file that you can install on Android devices.

### 7. Install on Device

```bash
# Connect your Android device via USB and enable USB debugging
adb install app-release.apk
```

Or transfer the APK file to your device and install it manually.

## Project Structure

After running `bubblewrap init`, a new directory structure will be created:
```
.
├── twa-manifest.json    # Bubblewrap configuration
├── app/                 # Android app source code
└── ...
```

## What is Bubblewrap?

Bubblewrap is a command-line tool that helps you create Android apps from Progressive Web Apps (PWAs). It uses Trusted Web Activities (TWA) to wrap your PWA in an Android app shell.

## Features

✅ **PWA Support**: Full PWA manifest configured  
✅ **Multi-language**: All 12 Indian languages supported  
✅ **Offline Ready**: Can work offline (with service worker)  
✅ **Native Feel**: Appears as a native Android app  
✅ **Play Store Ready**: Can be published to Google Play Store  

## Troubleshooting

### Java not found
```bash
# Install Java JDK
brew install openjdk@17

# Set JAVA_HOME
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
```

### Android SDK not found
```bash
# Install Android Studio or SDK tools
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Manifest not accessible
- Ensure the Next.js app is running on `localhost:3000`
- Check that `public/manifest.json` exists and is accessible
- Verify the manifest URL in the browser: `http://localhost:3000/manifest.json`

### Build errors
- Check that all prerequisites are installed
- Ensure Java and Android SDK are properly configured
- Review the error messages for specific issues

## Next Steps

1. **Customize App**: Edit `twa-manifest.json` to customize app settings
2. **Add Icons**: Replace placeholder icons with your design
3. **Test**: Install on multiple Android devices for testing
4. **Publish**: Build a release APK/AAB for Google Play Store

## Resources

- [Bubblewrap Documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- [PWA Builder](https://www.pwabuilder.com/)
- [Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/)

