import { User } from '../types';

export interface AccountIdentityProfile {
  accountKey: string;
  userId: string;
  fullName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  aadhaarNumber: string;
  aadhaarMasked: string;
  panNumber: string;
  panMasked: string;
  address: string;
  addressState: string;
  pincode: string;
  occupation: string;
  credentialId: string;
  proofId: string;
  qrVerificationRef: string;
  txHash: string;
  verifiedAt: string;
  completed: boolean;
}

/**
 * Derives a standardized account key for the 4 accounts (Krishnesh, Midhun, Arif, Kishore)
 * or falls back to user ID / email.
 */
export function getAccountProfileKey(user: { id?: string; email?: string; name?: string } | null): string {
  if (!user) return 'anonymous';

  const email = (user.email || '').toLowerCase();
  const name = (user.name || '').toLowerCase();
  const id = (user.id || '').toLowerCase();

  if (id.includes('krishnesh') || email.includes('krishnesh') || name.includes('krishnesh')) {
    return 'krishnesh';
  }
  if (id.includes('midhun') || email.includes('midhun') || name.includes('midhun')) {
    return 'midhun';
  }
  if (id.includes('arif') || email.includes('arif') || name.includes('arif')) {
    return 'arif';
  }
  if (id.includes('kishore') || email.includes('kishore') || name.includes('kishore')) {
    return 'kishore';
  }

  return (user.id || user.email || 'default_user').toLowerCase().replace(/[^a-z0-9_-]/g, '_');
}

/**
 * Checks if the specified account has already completed its identity profile.
 */
export function isAccountProfileCompleted(user: User | null): boolean {
  if (!user) return false;
  try {
    const key = getAccountProfileKey(user);
    const raw = localStorage.getItem(`trustchain_identity_profile_${key}`);
    if (!raw) return false;
    const profile = JSON.parse(raw);
    return Boolean(profile && profile.completed === true && profile.credentialId);
  } catch (e) {
    return false;
  }
}

/**
 * Retrieves the saved profile for the account, or null if not yet completed.
 */
export function getSavedAccountProfile(user: User | null): AccountIdentityProfile | null {
  if (!user) return null;
  try {
    const key = getAccountProfileKey(user);
    const raw = localStorage.getItem(`trustchain_identity_profile_${key}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

/**
 * Saves the completed profile specifically for that account and returns the finalized profile.
 */
export function saveAccountIdentityProfile(
  user: User,
  data: {
    fullName: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other';
    phone: string;
    email: string;
    aadhaarNumber: string;
    panNumber: string;
    address: string;
    addressState: string;
    pincode: string;
    occupation: string;
  }
): { profile: AccountIdentityProfile; updatedUser: User } {
  const key = getAccountProfileKey(user);

  // Format masked identifiers
  const cleanAadhaar = data.aadhaarNumber.replace(/\D/g, '');
  const aadhaarLast4 = cleanAadhaar.slice(-4) || '7712';
  const aadhaarMasked = `XXXX-XXXX-${aadhaarLast4}`;

  const cleanPan = data.panNumber.trim().toUpperCase();
  const panMasked = cleanPan.length === 10
    ? `${cleanPan.slice(0, 5)}****${cleanPan.slice(-1)}`
    : `${cleanPan.slice(0, 3)}****`;

  // Generate verifiable cryptographic anchors
  const randomHex = (len: number) =>
    Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');

  const credentialId = `TC-CRED-${key.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const proofId = `ZKP-PRF-0x${randomHex(16)}`;
  const qrVerificationRef = `TC-QR-REF-${key.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const txHash = `0x${randomHex(40)}`;

  const profile: AccountIdentityProfile = {
    accountKey: key,
    userId: user.id,
    fullName: data.fullName.trim(),
    dob: data.dob,
    gender: data.gender,
    phone: data.phone.trim(),
    email: data.email.trim(),
    aadhaarNumber: cleanAadhaar,
    aadhaarMasked,
    panNumber: cleanPan,
    panMasked,
    address: data.address.trim(),
    addressState: data.addressState.trim(),
    pincode: data.pincode.trim(),
    occupation: data.occupation.trim(),
    credentialId,
    proofId,
    qrVerificationRef,
    txHash,
    verifiedAt: new Date().toISOString(),
    completed: true,
  };

  // Persist to account-specific key
  localStorage.setItem(`trustchain_identity_profile_${key}`, JSON.stringify(profile));

  // Also update user profile state
  const updatedUser: User = {
    ...user,
    name: profile.fullName,
    phone: profile.phone,
    dob: profile.dob,
    aadhaarMasked: profile.aadhaarMasked,
    panMasked: profile.panMasked,
    addressState: profile.addressState,
    kycStatus: 'verified',
    did: user.did || `did:trustchain:0x${randomHex(24)}`,
  };

  localStorage.setItem('trustchain_user', JSON.stringify(updatedUser));

  return { profile, updatedUser };
}
