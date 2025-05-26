export const charsets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export function generatePassword(options) {
    const {
        length = 16,
        includeUppercase = true,
        includeLowercase = true,
        includeNumbers = true,
        includeSpecial = true
    } = options;
    
    let charset = '';
    const requiredCharsets = [];
    
    if (includeUppercase) {
        charset += charsets.uppercase;
        requiredCharsets.push(charsets.uppercase);
    }
    if (includeLowercase) {
        charset += charsets.lowercase;
        requiredCharsets.push(charsets.lowercase);
    }
    if (includeNumbers) {
        charset += charsets.numbers;
        requiredCharsets.push(charsets.numbers);
    }
    if (includeSpecial) {
        charset += charsets.special;
        requiredCharsets.push(charsets.special);
    }
    
    if (charset === '') {
        throw new Error('At least one character type must be selected');
    }
    
    let password = '';
    const array = new Uint32Array(length);
    
    // Use crypto for browser environment, or Math.random for testing
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
    } else {
        // Fallback for testing environment
        for (let i = 0; i < length; i++) {
            password += charset[Math.floor(Math.random() * charset.length)];
        }
    }
    
    // Ensure at least one character from each selected type
    password = ensureRequiredCharacters(password, requiredCharsets);
    
    return password;
}

export function ensureRequiredCharacters(password, requiredCharsets) {
    const passwordArray = password.split('');
    
    requiredCharsets.forEach((charset, index) => {
        if (index < password.length) {
            // Check if password already contains a character from this charset
            const hasCharFromSet = passwordArray.some(char => charset.includes(char));
            
            if (!hasCharFromSet) {
                // Replace a random position with a character from this charset
                const randomPos = Math.floor(Math.random() * password.length);
                const randomChar = charset[Math.floor(Math.random() * charset.length)];
                passwordArray[randomPos] = randomChar;
            }
        }
    });
    
    return passwordArray.join('');
}

export function validatePasswordOptions(options) {
    if (options.length < 1 || options.length > 128) {
        throw new Error('Password length must be between 1 and 128');
    }
    
    const hasAtLeastOneOption = 
        options.includeUppercase || 
        options.includeLowercase || 
        options.includeNumbers || 
        options.includeSpecial;
    
    if (!hasAtLeastOneOption) {
        throw new Error('At least one character type must be selected');
    }
    
    return true;
}