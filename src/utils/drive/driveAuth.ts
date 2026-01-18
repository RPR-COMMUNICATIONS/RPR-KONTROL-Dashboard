/**
 * RPR-KONTROL Drive Auth Substrate
 * Role: Manages OAuth2 handshake for the Sovereign Vault.
 * Classification: TS-Λ3
<<<<<<< HEAD
=======
 * Protocol: GIS-BRIDGE-v1
>>>>>>> 0533ea7 (feat: RPR-KONTROL-PM v1.6.0 governance UI and drive substrate)
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

declare global {
  interface Window {
    google: any;
  }
}

/**
 * initializeDriveAuth
 * Loads the Google Identity Services substrate and prepares the token bridge.
 */
export const initializeDriveAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
<<<<<<< HEAD
    if (document.getElementById('gsi-client')) return resolve();

=======
    if (typeof document === 'undefined') return resolve();
    if (document.getElementById('gsi-client')) return resolve();
    
>>>>>>> 0533ea7 (feat: RPR-KONTROL-PM v1.6.0 governance UI and drive substrate)
    const script = document.createElement('script');
    script.id = 'gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('GIS_SUBSTRATE_LOAD_FAILED'));
    document.body.appendChild(script);
  });
};

/**
 * requestSovereignAccessToken
 * Triggers the OAuth2 flow to obtain a short-lived token for Vault access.
 */
export const requestSovereignAccessToken = (callback: (token: string) => void) => {
<<<<<<< HEAD
  if (!window.google) {
=======
  if (typeof window === 'undefined' || !window.google) {
>>>>>>> 0533ea7 (feat: RPR-KONTROL-PM v1.6.0 governance UI and drive substrate)
    console.error("⚠️ SENTINEL: GIS substrate not initialized.");
    return;
  }

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: any) => {
      if (response.access_token) {
        callback(response.access_token);
      }
    },
  });

  client.requestAccessToken();
};
