# Iconic Prints — Polaroid Photo Upload Website

A premium, mobile-first website for **Iconic Prints** — a Meesho-based Polaroid photo printing business. Customers upload their order photos, and those photos are automatically saved to Google Drive organized by Order ID.

## Features

- **6-step upload flow** — Phone → Order ID → Pack & Qty → Photos → Preview → Submit
- **OCR screenshot detection** — customer uploads a Meesho order screenshot and the Order ID is automatically read
- **Polaroid frame preview** — optional per-photo preview with drag-to-position
- **Photo quality check** — warns if a photo is too low-resolution for good prints
- **WhatsApp confirmation popup** — pre-filled message with all order details
- **Google Drive integration** — photos saved per order in a private Drive folder
- **Dark / Light theme** toggle
- **Hindi / English** language toggle
- **Extra pages** — Tutorial, Contact, Legal & Policy

## File Structure

```
index.html              Main upload page (6-step flow)
tutorial.html           How-to guide with video placeholder
contact.html            WhatsApp, Instagram, shop links
legal.html              Terms & Conditions + Privacy Policy
style.css               Shared premium CSS design system
shared.js               Theme, language, side-nav, toast utilities
main.js                 Upload flow logic (OCR, compression, Drive upload)
google-apps-script.gs   Google Apps Script backend (deploy to Google)
```

## Setup

### 1. Deploy the Google Apps Script backend

1. Go to [script.google.com](https://script.google.com) → New Project
2. Paste the contents of `google-apps-script.gs`
3. Click **Deploy → New Deployment → Web App**
4. Execute as: **Me** | Who has access: **Anyone**
5. Copy the Web App URL

### 2. Configure the frontend

Open `main.js` and update the `CONFIG` object at the top:

```js
const CONFIG = {
  UPLOAD_ENDPOINT: 'https://script.google.com/macros/s/YOUR_ID/exec',
  WHATSAPP_NUMBER: '919876543210',   // your number with country code, no +
  ...
};
```

Also update links in `contact.html`:
- Replace `YOUR_WHATSAPP_NUMBER` with your number (e.g. `919876543210`)
- Replace `YOUR_INSTAGRAM_HANDLE` with your Instagram username
- Replace `YOUR_SHOP` with your Meesho shop link

### 3. Host the website

Upload all files to any static hosting:
- **GitHub Pages** — push to a repo and enable Pages
- **Netlify** — drag and drop the folder
- **Any web host** — upload via FTP

## Demo Mode

If `UPLOAD_ENDPOINT` is not configured, the app runs in **demo mode** — it simulates the upload and still shows the WhatsApp confirmation popup. This lets you test the full flow without a backend.
 
