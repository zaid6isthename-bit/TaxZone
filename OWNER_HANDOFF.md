# TaxZone Owner Handoff

## APK

Release APK:

`C:\Project\TaxZone-main\TaxZone-owner-release.apk`

Play Store App Bundle:

`C:\Project\TaxZone-main\TaxZone-owner-release.aab`

Build output:

`C:\Project\TaxZone-main\mobile\android\app\build\outputs\apk\release\app-release.apk`

## App Details

- App name: TaxZone
- Package name: `com.taxzone.owner`
- Version: `1.0.0`
- Version code: `1`
- Minimum Android version: Android 6.0
- Target Android SDK: 36
- Signing: release signed with the generated TaxZone owner handoff keystore
- Backend hosting: Render
- Database/storage: Supabase

## Included Client App Screens

- Dashboard with pending actions and assigned consultant
- Documents with upload, rejected, approved, and verification states
- Filing timeline and upcoming GST deadlines
- Notifications and reminders
- Client profile and verification status
- Owner API configuration for production base URL and bearer token

## API Integration

The APK is wired to live REST endpoints and does not render mock records. Configure the production API from the Profile tab. The exact contract is documented in:

`C:\Project\TaxZone-main\docs\mobile-api-contract.md`

Supabase + Render + Play Store deployment steps are documented in:

`C:\Project\TaxZone-main\docs\supabase-render-playstore.md`

## Important Release Note

This APK is suitable for owner review and direct installation. Before publishing on Google Play, replace the generated handoff keystore with the owner's official Play Console upload key.
