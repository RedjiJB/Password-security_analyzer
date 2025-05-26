export const commonPasswords = ['password', '123456', 'password123', 'admin', 'qwerty', 'abc123', 'Password1', 'password1', '123456789', 'welcome'];

export function updateCriteria(criteriaId, isMet) {
    const criteriaItem = document.getElementById(criteriaId);
    if (!criteriaItem) return;
    
    const icon = criteriaItem.querySelector('.criteria-icon');
    if (!icon) return;
    
    if (isMet) {
        icon.classList.remove('criteria-not-met');
        icon.classList.add('criteria-met');
        icon.textContent = '✓';
    } else {
        icon.classList.remove('criteria-met');
        icon.classList.add('criteria-not-met');
        icon.textContent = '✗';
    }
}

export function checkPasswordCriteria(password) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
}

export function calculatePasswordStrength(password) {
    let strength = 0;
    const criteria = checkPasswordCriteria(password);

    // Calculate strength score
    if (criteria.length) strength += 20;
    if (criteria.uppercase) strength += 20;
    if (criteria.lowercase) strength += 20;
    if (criteria.numbers) strength += 20;
    if (criteria.special) strength += 20;

    // Bonus points for length
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;

    // Penalty for common passwords
    if (commonPasswords.includes(password.toLowerCase())) {
        strength = Math.min(strength, 20);
    }

    return Math.min(strength, 100);
}

export function getStrengthInfo(strength) {
    if (strength < 40) {
        return { class: 'strength-weak', text: 'Weak', color: '#ff4757' };
    } else if (strength < 60) {
        return { class: 'strength-fair', text: 'Fair', color: '#ffa502' };
    } else if (strength < 80) {
        return { class: 'strength-good', text: 'Good', color: '#ffd93d' };
    } else {
        return { class: 'strength-strong', text: 'Strong', color: '#2ed573' };
    }
}

export function updateStrengthMeter(strength) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    const info = getStrengthInfo(strength);
    
    strengthFill.style.width = strength + '%';
    strengthFill.className = `strength-meter-fill ${info.class}`;
    strengthText.textContent = info.text;
    strengthText.style.color = info.color;
}