# TaxZone Android APK

Native Android client application prepared for owner handoff.

## Build

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
gradle assembleRelease
```

The release APK is generated at:

`app/build/outputs/apk/release/app-release.apk`

## Signing

This project reads signing credentials from `release-signing.properties`. Replace the generated handoff keystore with the owner's Play Console keystore before publishing to Google Play.

