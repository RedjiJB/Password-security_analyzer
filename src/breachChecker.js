export async function sha1(message) {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex.toUpperCase();
    } else {
        // Fallback for testing - simple hash simulation
        // In real tests, you'd mock this function
        return 'MOCK_HASH_' + message.toUpperCase();
    }
}

export async function checkPasswordBreach(password, fetchFunction = fetch) {
    try {
        const hash = await sha1(password);
        const prefix = hash.substring(0, 5);
        const suffix = hash.substring(5);

        const response = await fetchFunction(`https://api.pwnedpasswords.com/range/${prefix}`);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.text();
        
        const breached = data.split('\n').some(line => {
            const [hashSuffix] = line.split(':');
            return hashSuffix === suffix;
        });

        return {
            breached,
            error: null
        };
    } catch (error) {
        return {
            breached: null,
            error: error.message
        };
    }
}

export function updateBreachCheckUI(result) {
    const breachCheck = document.getElementById('breachCheck');
    if (!breachCheck) return;
    
    breachCheck.style.display = 'block';
    
    if (result.error) {
        breachCheck.className = 'breach-check breach-checking';
        breachCheck.textContent = 'Unable to check breach status';
    } else if (result.breached) {
        breachCheck.className = 'breach-check breach-compromised';
        breachCheck.textContent = '⚠️ This password has been found in data breaches!';
    } else {
        breachCheck.className = 'breach-check breach-safe';
        breachCheck.textContent = '✓ This password has not been found in known breaches';
    }
}