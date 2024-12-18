
// Function to add padding to the Base64 string
export function addBase64Padding(base64String) {
    const padding = base64String.length % 4 === 0 ? 0 : 4 - (base64String.length % 4);
    return base64String + '='.repeat(padding);
}

// Function to decode the Base64 string and parse it as JSON
export function decodeBase64Credentials(base64Credentials) {
    const base64CredentialsWithPadding = addBase64Padding(base64Credentials);
    const credentialsJson = Buffer.from(base64CredentialsWithPadding, 'base64').toString('utf8');
    return JSON.parse(credentialsJson);
}
