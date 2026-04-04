/**
 * ══════════════════════════════════════════════════════════
 *  ICONIC PRINTS — Google Apps Script Backend
 * ══════════════════════════════════════════════════════════
 *
 *  HOW TO DEPLOY:
 *  1. Go to script.google.com → New Project → paste this code
 *  2. Click "Deploy" → "New Deployment"
 *  3. Type: "Web App"
 *  4. Execute as: "Me"
 *  5. Who has access: "Anyone"  ← important!
 *  6. Click "Deploy" → copy the Web App URL
 *  7. Paste the URL into main.js → CONFIG.UPLOAD_ENDPOINT
 *
 *  REQUIRED PERMISSIONS:
 *  - Google Drive (to create folders and files)
 *  - You will be asked to authorize on first run.
 */

// ── CONFIGURATION ──────────────────────────────────────────
const DRIVE_FOLDER_NAME = 'Iconic Prints Orders';

// ── ENTRY POINT ────────────────────────────────────────────
function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = data.action;

    let result;
    if      (action === 'init')   result = handleInit(data);
    else if (action === 'upload') result = handleUpload(data);
    else throw new Error('Unknown action: ' + action);

    return buildResponse(result);
  } catch (err) {
    return buildResponse({ success: false, error: err.message }, 500);
  }
}

// Allow preflight CORS requests
function doGet() {
  return ContentService
    .createTextOutput('Iconic Prints API is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── INIT ORDER ─────────────────────────────────────────────
/**
 * Called first to create the order folder and metadata file.
 * Returns: { success, folderId, folderUrl }
 */
function handleInit(data) {
  const { phone, orderId, packSize, quantity, timestamp } = data;

  if (!phone || !orderId) throw new Error('Missing phone or orderId');

  // Get or create the main "Iconic Prints Orders" folder
  const mainFolder = getOrCreateFolder(DRIVE_FOLDER_NAME, null);

  // Create an order sub-folder: "OrderID_Phone"
  const folderName  = orderId + '_' + phone;
  const orderFolder = mainFolder.createFolder(folderName);

  // Create a metadata text file inside the order folder
  const meta = [
    '══════════════════════════════',
    '  ICONIC PRINTS ORDER DETAILS',
    '══════════════════════════════',
    'Order ID  : ' + orderId,
    'Phone     : ' + phone,
    'Pack Size : ' + packSize + ' photos',
    'Quantity  : ' + quantity,
    'Timestamp : ' + timestamp,
    '',
    'Status    : Photos received — awaiting printing',
    '══════════════════════════════',
  ].join('\n');

  orderFolder.createFile('order_info.txt', meta, MimeType.PLAIN_TEXT);

  return {
    success:   true,
    folderId:  orderFolder.getId(),
    folderUrl: orderFolder.getUrl(),
  };
}

// ── UPLOAD PHOTO ───────────────────────────────────────────
/**
 * Called once per photo. Saves the photo into the order folder.
 * Returns: { success }
 */
function handleUpload(data) {
  const { folderId, filename, mimeType, data: base64Data } = data;

  if (!folderId || !base64Data) throw new Error('Missing folderId or data');

  const folder   = DriveApp.getFolderById(folderId);
  const decoded  = Utilities.base64Decode(base64Data);
  const blob     = Utilities.newBlob(decoded, mimeType || 'image/jpeg', filename || 'photo.jpg');

  folder.createFile(blob);

  return { success: true };
}

// ── HELPERS ────────────────────────────────────────────────
function getOrCreateFolder(name, parent) {
  const search = parent
    ? parent.getFoldersByName(name)
    : DriveApp.getFoldersByName(name);

  if (search.hasNext()) return search.next();

  return parent
    ? parent.createFolder(name)
    : DriveApp.createFolder(name);
}

function buildResponse(data, statusCode) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}
