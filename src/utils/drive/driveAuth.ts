/// <reference types="vite/client" />

/**
 * RPR-KONTROL Drive Auth Substrate
 * Role: Manages OAuth2 handshake for the Sovereign Vault.
 * Classification: TS-Λ3
 * Protocol: GIS-BRIDGE-v1
 * Status: CLEAN (Purged of merge conflict markers)
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

declare global {
  interface Window {
    google: any;
  }
}

export const initializeDriveAuth = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return resolve();
    if (document.getElementById('gsi-client')) return resolve();

    const script = document.createElement('script');
    script.id = 'gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('GIS_SUBSTRATE_LOAD_FAILED'));
    document.body.appendChild(script);
  });
};

export const requestSovereignAccessToken = (callback: (token: string) => void) => {
  if (typeof window === 'undefined' || !window.google) {
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
