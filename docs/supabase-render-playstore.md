# TaxZone Deployment: Supabase + Render + Play Store

## Architecture

- Supabase: PostgreSQL database, optional Auth, and document storage bucket.
- Render: NestJS backend API deployed as a Node web service.
- Android app: uploaded to Google Play as an Android App Bundle (`.aab`).

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/migrations/001_taxzone_core.sql`.
3. Create a private storage bucket named `taxzone-documents`.
4. Copy these values into Render environment variables:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

Supabase has a free tier for starting, but a real production tax app may need a paid plan as storage, database size, backups, and traffic grow.

## Render Setup

1. Push this repository to GitHub.
2. In Render, create a Blueprint from `render.yaml`, or create a Web Service manually.
3. Root directory: `backend`.
4. Build command: `npm install && npm run build`.
5. Start command: `node dist/main.js`.
6. Add the Supabase environment variables from `.env.example`.
7. Deploy and copy the public Render URL.

Render can be started cheaply, but production web services are normally paid if you need reliable always-on behavior.

## Android App Setup

1. Install the generated app.
2. Open Profile.
3. Enter the Render API URL, for example:
   `https://taxzone-api.onrender.com`
4. Enter a valid bearer token issued by your backend.
5. Save and refresh.

## Play Store Upload

Use this file for Play Console:

`C:\Project\TaxZone-main\TaxZone-owner-release.aab`

Play Store checklist:

- Google Play Developer account.
- App name, short description, full description.
- App icon, feature graphic, phone screenshots.
- Privacy policy URL.
- Data Safety form.
- App access instructions for reviewer login.
- Content rating questionnaire.
- Target audience selection.
- Production release uploaded with the `.aab`.

Before public launch, replace the generated handoff keystore with the owner's permanent Play App Signing upload key.

