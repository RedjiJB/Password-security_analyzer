import { 
    calculatePasswordStrength, 
    checkPasswordCriteria,
    updateCriteria,
    updateStrengthMeter 
} from './passwordAnalyzer.js';

import { generatePassword as generatePasswordCore } from './passwordGenerator.js';
import { checkPasswordBreach, updateBreachCheckUI } from './breachChecker.js';

let isPasswordVisible = false;
let checkBreachTimeout;

window.togglePassword = function() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (isPasswordVisible) {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    } else {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    }
    
    isPasswordVisible = !isPasswordVisible;
}

window.generatePassword = function() {
    const length = parseInt(document.getElementById('lengthSlider').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSpecial = document.getElementById('includeSpecial').checked;
    
    try {
        const password = generatePasswordCore({
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSpecial
        });
        
        document.getElementById('generatedPassword').textContent = password;
        document.getElementById('generatedPasswordContainer').style.display = 'flex';
        
        // Also analyze the generated password
        document.getElementById('password').value = password;
        const event = new Event('input');
        document.getElementById('password').dispatchEvent(event);
    } catch (error) {
        alert(error.message);
    }
}

window.copyPassword = function() {
    const password = document.getElementById('generatedPassword').textContent;
    navigator.clipboard.writeText(password).then(() => {
        const feedback = document.getElementById('copyFeedback');
        feedback.classList.add('show');
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    });
}

// Password input handler
document.getElementById('password').addEventListener('input', function(e) {
    const password = e.target.value;
    
    if (password.length === 0) {
        document.getElementById('strengthFill').style.width = '0';
        document.getElementById('strengthText').textContent = '';
        document.getElementById('breachCheck').style.display = 'none';
        
        // Reset all criteria
        ['lengthCriteria', 'uppercaseCriteria', 'lowercaseCriteria', 'numberCriteria', 'specialCriteria'].forEach(id => {
            updateCriteria(id, false);
        });
        return;
    }
    
    // Calculate and display strength
    const strength = calculatePasswordStrength(password);
    updateStrengthMeter(strength);
    
    // Update criteria UI
    const criteria = checkPasswordCriteria(password);
    updateCriteria('lengthCriteria', criteria.length);
    updateCriteria('uppercaseCriteria', criteria.uppercase);
    updateCriteria('lowercaseCriteria', criteria.lowercase);
    updateCriteria('numberCriteria', criteria.numbers);
    updateCriteria('specialCriteria', criteria.special);
    
    // Debounce breach check
    clearTimeout(checkBreachTimeout);
    checkBreachTimeout = setTimeout(async () => {
        const breachCheck = document.getElementById('breachCheck');
        breachCheck.style.display = 'block';
        breachCheck.className = 'breach-check breach-checking';
        breachCheck.textContent = 'Checking against breach databases...';
        
        const result = await checkPasswordBreach(password);
        updateBreachCheckUI(result);
    }, 500);
});

// Length slider handler
document.getElementById('lengthSlider').addEventListener('input', function(e) {
    document.getElementById('lengthDisplay').textContent = e.target.value;
});

// Initialize with a sample password for demonstration
window.addEventListener('load', () => {
    document.getElementById('password').value = 'Password123!';
    document.getElementById('password').dispatchEvent(new Event('input'));
});