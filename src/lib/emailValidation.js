import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// List of common disposable/temporary email domains to block
const DISPOSABLE_DOMAINS = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'yopmail.com',
  'sharklasers.com',
  'guerrillamail.org',
  'guerrillamail.net',
  'guerrillamail.biz',
  'guerrillamail.de',
  'grr.la',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'tempail.com',
  'tempinbox.com',
  'tempmailo.com',
  'tempmailaddress.com',
  '20minutemail.com',
  '33mail.com',
  'dispostable.com',
  'fakeinbox.com',
  'hidemail.de',
  'mytrashmail.com',
  'mailnesia.com',
  'trashmail.net',
  'trashinbox.com'
];

/**
 * Basic email format validation using regex
 * @param {string} email 
 * @returns {boolean}
 */
function isValidEmailFormat(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if email domain is a disposable/temporary email service
 * @param {string} email 
 * @returns {boolean}
 */
function isDisposableEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

/**
 * Validate email domain has MX records (can receive emails)
 * @param {string} email 
 * @returns {Promise<boolean>}
 */
async function hasMxRecord(email) {
  try {
    const domain = email.split('@')[1];
    const mxRecords = await resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    console.log(`MX record check failed for ${email}:`, error.message);
    return false;
  }
}

/**
 * Comprehensive email validation
 * @param {string} email 
 * @returns {Promise<{isValid: boolean, reason?: string}>}
 */
export async function validateEmail(email) {
  // 1. Basic format check
  if (!isValidEmailFormat(email)) {
    return {
      isValid: false,
      reason: 'Invalid email format'
    };
  }

  // 2. Check for disposable email
  if (isDisposableEmail(email)) {
    return {
      isValid: false,
      reason: 'Temporary/disposable email addresses are not allowed'
    };
  }

  // 3. Check if domain can receive emails (has MX records)
  const hasValidMx = await hasMxRecord(email);
  if (!hasValidMx) {
    return {
      isValid: false,
      reason: 'Email domain does not exist or cannot receive emails'
    };
  }

  // 4. Additional checks for common typos in popular domains
  const domain = email.split('@')[1]?.toLowerCase();
  const popularDomains = {
    'gmail.com': ['gmai.com', 'gmial.com', 'gmaill.com', 'gamil.com'],
    'yahoo.com': ['yahooo.com', 'yaho.com', 'yahoo.co'],
    'hotmail.com': ['hotmial.com', 'hotmali.com', 'hotmai.com'],
    'outlook.com': ['outlok.com', 'outloo.com', 'outlook.co']
  };

  for (const [correct, typos] of Object.entries(popularDomains)) {
    if (typos.includes(domain)) {
      return {
        isValid: false,
        reason: `Did you mean ${email.replace(domain, correct)}?`
      };
    }
  }

  return {
    isValid: true
  };
}

/**
 * Quick email validation (without MX check for faster response)
 * @param {string} email 
 * @returns {boolean}
 */
export function isEmailValid(email) {
  return isValidEmailFormat(email) && !isDisposableEmail(email);
}