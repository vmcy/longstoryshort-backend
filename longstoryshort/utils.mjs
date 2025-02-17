import { randomBytes } from 'crypto';

// Check if a string is a valid URL
export function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (error) {
        return false;
    }
}

// Check if a required property is present in the body
export function hasRequiredProperty(body, property) {
    return body && body.hasOwnProperty(property);
}

// Generate an 8-character Base62 ID
export function generateUniqueID() {
    // Generate 8 random bytes (64 bits)
    const randomBuffer = randomBytes(8);

    // Convert to Base36 (alphanumeric characters and small alphabet only)
    const base36Chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let byte of randomBuffer) {
        id += base36Chars[byte % 36]; // Use each byte's value to index into Base62 characters
    }

    return id;
}