"use client";

// Simple web crypto for demo hashing
async function hashString(message: string) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface UserAccount {
  username: string;
  password_hash: string;
  security_pin_hash?: string | null;  // Only for Anonymous
  email?: string | null;              // Only for Stakeholder
  actual_name?: string | null;        // Only for Stakeholder
  session_type: 'anonymous_local' | 'verified_stakeholder';
  analysis_count: number;
  verified_count: number;
}

const STORAGE_KEY = 'gumpwiser_accounts';
const SESSION_KEY = 'gump_session';

// Helper to get accounts from localStorage
function getAccounts(): Record<string, UserAccount> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Helper to save accounts
function saveAccounts(accounts: Record<string, UserAccount>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

// ── Registration ─────────────────────────────────────────────────────────────
export async function registerUser(username: string, pass: string, pin: string, email: string, actualName: string, isAnonymous: boolean) {
  const accounts = getAccounts();
  
  if (accounts[username]) {
    throw new Error('Username already exists.');
  }

  const passHash = await hashString(pass);

  let newUser: UserAccount = {
    username,
    password_hash: passHash,
    session_type: isAnonymous ? 'anonymous_local' : 'verified_stakeholder',
    analysis_count: 0,
    verified_count: 0,
  };

  if (isAnonymous) {
    if (!pin || pin.length !== 4) throw new Error('4-Digit PIN required for Anonymous Accounts.');
    newUser.security_pin_hash = await hashString(pin);
    // Email is traced during registration but NOT stored.
  } else {
    // Stakeholder route
    if (!email || !email.includes('@')) throw new Error('Valid email required for Stakeholder Accounts.');
    if (!actualName || actualName.trim().length < 2) throw new Error('Actual Name is required for Stakeholders.');
    newUser.email = email;
    newUser.actual_name = actualName;
    newUser.security_pin_hash = null;
  }

  accounts[username] = newUser;
  saveAccounts(accounts);
  
  // Auto-login after registration
  localStorage.setItem(SESSION_KEY, username);
  return newUser;
}

// ── Login ────────────────────────────────────────────────────────────────────
export async function loginUser(username: string, pass: string) {
  const accounts = getAccounts();
  const user = accounts[username];
  
  if (!user) throw new Error('Account not found.');

  const passHash = await hashString(pass);
  if (user.password_hash !== passHash) {
    throw new Error('Incorrect password.');
  }

  localStorage.setItem(SESSION_KEY, username);
  return user;
}

// ── Password Reset (Dual Path) ──────────────────────────────────────────
export async function resetPassword(username: string, newPass: string, authSecret: string) {
  const accounts = getAccounts();
  const user = accounts[username];
  
  if (!user) throw new Error('Account not found.');

  if (user.session_type === 'anonymous_local') {
    // authSecret is the PIN
    const pinHash = await hashString(authSecret);
    if (user.security_pin_hash !== pinHash) {
      throw new Error('Access Denied: Immutable PIN is incorrect.');
    }
  } else {
    // authSecret is the Email
    if (user.email !== authSecret) {
      throw new Error('Access Denied: Recovery Email does not match stakeholders account.');
    }
  }

  const newPassHash = await hashString(newPass);
  user.password_hash = newPassHash;
  accounts[username] = user;
  saveAccounts(accounts);
  
  return true;
}

// ── OTP Simulation ──────────────────────────────────────────────────────────
const OTP_STORE: Record<string, string> = {};

export async function requestOTP(email: string) {
  // Simulate delay
  await new Promise(r => setTimeout(r, 600));
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  OTP_STORE[email] = otp;
  
  console.log(`[AUTH] Simulated OTP for ${email}: ${otp}`);
  // In a real app, this would trigger an email.
  return true;
}

export async function verifyOTP(email: string, otp: string) {
  await new Promise(r => setTimeout(r, 400));
  if (OTP_STORE[email] === otp) {
    return true;
  }
  throw new Error('Invalid OTP.');
}

// ── Session Checking ────────────────────────────────────────────────────────
export function getSessionUsername() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

export function getSessionProfile(): UserAccount | null {
  const username = getSessionUsername();
  if (!username) return null;
  const accounts = getAccounts();
  return accounts[username] || null;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function incrementAnalysisCount(isVerified: boolean = false) {
  const username = getSessionUsername();
  if (!username) return;
  const accounts = getAccounts();
  const user = accounts[username];
  if (user) {
    user.analysis_count = (user.analysis_count || 0) + 1;
    if (isVerified) {
      user.verified_count = (user.verified_count || 0) + 1;
    }
    accounts[username] = user;
    saveAccounts(accounts);
  }
}

// ── Geofence Logic ──────────────────────────────────────────────────────────
export const MONTGOMERY_COORDS = { lat: 32.3668, lng: -86.3000 };
export const GEOFENCE_RADIUS_KM = 35; // 35km radius around Montgomery

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function checkGeofence(lat: number, lng: number): boolean {
  const dist = getDistanceKm(lat, lng, MONTGOMERY_COORDS.lat, MONTGOMERY_COORDS.lng);
  return dist <= GEOFENCE_RADIUS_KM;
}
