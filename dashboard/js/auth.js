// ============================================================
//  Feranoz Owner Console — Authentication & Route Guard
// ============================================================

const AUTH_TOKEN_KEY = 'feranoz_owner_auth_token';
const AUTH_TIME_KEY  = 'feranoz_owner_auth_time';
const DEFAULT_PASSCODE = '1234';

// ── Check Active Session (Route Guard) ────────────────────────
function requireOwnerAuth() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY) || sessionStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    // Unauthenticated: Redirect back to login screen
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// ── Verify Login Passcode ─────────────────────────────────────
function validateOwnerLogin(inputPasscode, rememberMe = true) {
  const validPass = (typeof CAFE_CONFIG !== 'undefined' && CAFE_CONFIG.passcode) 
    ? CAFE_CONFIG.passcode 
    : DEFAULT_PASSCODE;

  if (inputPasscode === validPass) {
    const token = 'FRZ_OWNER_SESSION_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(AUTH_TOKEN_KEY, token);
    storage.setItem(AUTH_TIME_KEY, new Date().toISOString());

    return { success: true, token };
  } else {
    return { success: false, message: 'Invalid Admin Passcode. Please try again.' };
  }
}

// ── Lock Console / Destroy Session ─────────────────────────────
function lockConsole() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_TIME_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TIME_KEY);

  // Redirect to Admin Login page
  window.location.href = 'index.html';
}

// Expose functions globally
window.requireOwnerAuth = requireOwnerAuth;
window.validateOwnerLogin = validateOwnerLogin;
window.lockConsole = lockConsole;
