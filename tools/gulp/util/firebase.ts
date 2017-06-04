const firebaseAdmin = require('firebase-admin');
const firebase = require('firebase');
const cloudStorage = require('@google-cloud/storage');

// Firebase configuration for the Screenshot project. Use the config from the screenshot functions.
const screenshotFirebaseConfig = require('../../screenshot-test/functions/config.json');

/** Database URL of the dashboard firebase project.*/
const dashboardDatabaseUrl = 'https://flex-layout-board.firebaseio.com';

/** Opens a connection to the Firebase dashboard app using a service account. */
export function openFirebaseDashboardApp() {
  // Initialize the Firebase application with firebaseAdmin credentials.
  // Credentials need to be for a Service Account, which can be created in the Firebase console.
  return firebaseAdmin.initializeApp({
    databaseURL: dashboardDatabaseUrl,
    credential: firebaseAdmin.credential.cert({
      project_id: 'flex-layout-board',
      client_email: 'flex-layout-board@appspot.gserviceaccount.com',
      // In Travis CI the private key will be incorrect because the line-breaks are escaped.
      // The line-breaks need to persist in the service account private key.
      private_key: decode(process.env['FLEX_LAYOUT_BOARD_FIREBASE_SERVICE_KEY'])
    })
  });
}

/** Opens a connection to the Firebase dashboard app with no authentication. */
export function openFirebaseDashboardAppAsGuest() {
  return firebase.initializeApp({ databaseURL: dashboardDatabaseUrl });
}

/**
 * Open Google Cloud Storage for screenshots.
 * The files uploaded to google cloud are also available to firebase storage.
 */
export function openScreenshotsBucket() {
  let gcs = cloudStorage({
    projectId: 'flex-layout-screenshots',
    credentials: {
      client_email: 'firebase-adminsdk-t4209@flex-layout-screenshots.iam.gserviceaccount.com',
      private_key: decode(process.env['FLEX_LAYOUT_SCREENSHOT_FIREBASE_KEY'])
    },
  });

  // Reference the existing appspot bucket.
  return gcs.bucket('flex-layout-screenshots.appspot.com');
}

/** Decodes a Travis CI variable that is public in favor for PRs. */
export function decode(str: string): string {
  // In Travis CI the private key will be incorrect because the line-breaks are escaped.
  // The line-breaks need to persist in the service account private key.
  return (str || '').replace(/\\n/g, '\n');
}

/**
 * Open firebase connection for screenshot
 * This connection is client side connection with no credentials
 */
export function connectFirebaseScreenshots() {
  return firebase.initializeApp(screenshotFirebaseConfig.firebase);
}

