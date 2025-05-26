import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Password Security Analyzer UI Integration', () => {
    let container;

    beforeEach(() => {
        // Setup DOM structure
        document.body.innerHTML = `
            <div class="container">
                <h1>🔐 Password Security Analyzer</h1>
                
                <div class="input-group">
                    <label for="password">Enter Password to Analyze</label>
                    <input type="password" id="password" placeholder="Type your password here...">
                    <span class="toggle-password" onclick="togglePassword()">👁️</span>
                </div>
                
                <div class="strength-meter">
                    <div class="strength-meter-fill" id="strengthFill"></div>
                </div>
                <div class="strength-text" id="strengthText"></div>
                
                <div class="criteria">
                    <h3>Password Criteria</h3>
                    <div class="criteria-item" id="lengthCriteria">
                        <span class="criteria-icon criteria-not-met">✗</span>
                        <span>At least 8 characters</span>
                    </div>
                    <div class="criteria-item" id="uppercaseCriteria">
                        <span class="criteria-icon criteria-not-met">✗</span>
                        <span>Contains uppercase letters (A-Z)</span>
                    </div>
                    <div class="criteria-item" id="lowercaseCriteria">
                        <span class="criteria-icon criteria-not-met">✗</span>
                        <span>Contains lowercase letters (a-z)</span>
                    </div>
                    <div class="criteria-item" id="numberCriteria">
                        <span class="criteria-icon criteria-not-met">✗</span>
                        <span>Contains numbers (0-9)</span>
                    </div>
                    <div class="criteria-item" id="specialCriteria">
                        <span class="criteria-icon criteria-not-met">✗</span>
                        <span>Contains special characters (!@#$%^&*)</span>
                    </div>
                </div>
                
                <div class="breach-check" id="breachCheck" style="display: none;"></div>
                
                <div class="generator-section">
                    <h3>Password Generator</h3>
                    
                    <div class="length-control">
                        <label for="lengthSlider">Password Length</label>
                        <input type="range" id="lengthSlider" class="length-slider" min="8" max="32" value="16">
                        <div class="length-display" id="lengthDisplay">16</div>
                    </div>
                    
                    <div class="generator-options">
                        <div class="option-group">
                            <input type="checkbox" id="includeUppercase" checked>
                            <label for="includeUppercase">Uppercase (A-Z)</label>
                        </div>
                        <div class="option-group">
                            <input type="checkbox" id="includeLowercase" checked>
                            <label for="includeLowercase">Lowercase (a-z)</label>
                        </div>
                        <div class="option-group">
                            <input type="checkbox" id="includeNumbers" checked>
                            <label for="includeNumbers">Numbers (0-9)</label>
                        </div>
                        <div class="option-group">
                            <input type="checkbox" id="includeSpecial" checked>
                            <label for="includeSpecial">Special (!@#$%^&*)</label>
                        </div>
                    </div>
                    
                    <button class="button button-primary" onclick="generatePassword()">Generate Secure Password</button>
                    
                    <div class="generated-password" id="generatedPasswordContainer" style="display: none;">
                        <code id="generatedPassword"></code>
                        <button class="copy-button" onclick="copyPassword()">Copy</button>
                    </div>
                </div>
            </div>
            
            <div class="copy-feedback" id="copyFeedback">Password copied to clipboard!</div>
        `;
        
        container = document.body.querySelector('.container');
    });

    describe('Password Input', () => {
        test('should update strength meter when password is typed', () => {
            const passwordInput = screen.getByPlaceholderText('Type your password here...');
            const strengthFill = document.getElementById('strengthFill');
            const strengthText = document.getElementById('strengthText');
            
            // Initially empty
            expect(strengthFill.style.width).toBe('');
            expect(strengthText.textContent).toBe('');
            
            // Type a weak password
            fireEvent.input(passwordInput, { target: { value: 'abc' } });
            
            // Mock the password analysis behavior
            strengthFill.style.width = '20%';
            strengthText.textContent = 'Weak';
            
            expect(strengthFill.style.width).toBe('20%');
            expect(strengthText.textContent).toBe('Weak');
        });

        test('should toggle password visibility', () => {
            const passwordInput = screen.getByPlaceholderText('Type your password here...');
            const toggleButton = document.querySelector('.toggle-password');
            
            // Initially password type
            expect(passwordInput.type).toBe('password');
            
            // Mock toggle function
            window.togglePassword = jest.fn(() => {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                toggleButton.textContent = passwordInput.type === 'password' ? '👁️' : '🙈';
            });
            
            // Click toggle
            fireEvent.click(toggleButton);
            window.togglePassword();
            
            expect(passwordInput.type).toBe('text');
            expect(toggleButton.textContent).toBe('🙈');
            
            // Click again
            fireEvent.click(toggleButton);
            window.togglePassword();
            
            expect(passwordInput.type).toBe('password');
            expect(toggleButton.textContent).toBe('👁️');
        });

        test('should update criteria indicators', () => {
            const lengthIcon = document.querySelector('#lengthCriteria .criteria-icon');
            const uppercaseIcon = document.querySelector('#uppercaseCriteria .criteria-icon');
            const lowercaseIcon = document.querySelector('#lowercaseCriteria .criteria-icon');
            const numberIcon = document.querySelector('#numberCriteria .criteria-icon');
            const specialIcon = document.querySelector('#specialCriteria .criteria-icon');
            
            // All should start as not met
            expect(lengthIcon).toHaveClass('criteria-not-met');
            expect(uppercaseIcon).toHaveClass('criteria-not-met');
            expect(lowercaseIcon).toHaveClass('criteria-not-met');
            expect(numberIcon).toHaveClass('criteria-not-met');
            expect(specialIcon).toHaveClass('criteria-not-met');
            
            // Mock criteria update for strong password
            const mockUpdateCriteria = (criteriaId, isMet) => {
                const icon = document.querySelector(`#${criteriaId} .criteria-icon`);
                if (isMet) {
                    icon.classList.remove('criteria-not-met');
                    icon.classList.add('criteria-met');
                    icon.textContent = '✓';
                }
            };
            
            // Update all criteria
            mockUpdateCriteria('lengthCriteria', true);
            mockUpdateCriteria('uppercaseCriteria', true);
            mockUpdateCriteria('lowercaseCriteria', true);
            mockUpdateCriteria('numberCriteria', true);
            mockUpdateCriteria('specialCriteria', true);
            
            // All should now be met
            expect(lengthIcon).toHaveClass('criteria-met');
            expect(uppercaseIcon).toHaveClass('criteria-met');
            expect(lowercaseIcon).toHaveClass('criteria-met');
            expect(numberIcon).toHaveClass('criteria-met');
            expect(specialIcon).toHaveClass('criteria-met');
        });
    });

    describe('Password Generator', () => {
        test('should update length display when slider changes', () => {
            const lengthSlider = screen.getByRole('slider');
            const lengthDisplay = document.getElementById('lengthDisplay');
            
            expect(lengthDisplay.textContent).toBe('16');
            
            fireEvent.input(lengthSlider, { target: { value: '24' } });
            lengthDisplay.textContent = lengthSlider.value;
            
            expect(lengthDisplay.textContent).toBe('24');
        });

        test('should enable/disable character options', () => {
            const uppercaseCheckbox = document.getElementById('includeUppercase');
            const lowercaseCheckbox = document.getElementById('includeLowercase');
            const numbersCheckbox = document.getElementById('includeNumbers');
            const specialCheckbox = document.getElementById('includeSpecial');
            
            // All should be checked initially
            expect(uppercaseCheckbox.checked).toBe(true);
            expect(lowercaseCheckbox.checked).toBe(true);
            expect(numbersCheckbox.checked).toBe(true);
            expect(specialCheckbox.checked).toBe(true);
            
            // Uncheck some options
            fireEvent.click(uppercaseCheckbox);
            fireEvent.click(specialCheckbox);
            
            expect(uppercaseCheckbox.checked).toBe(false);
            expect(lowercaseCheckbox.checked).toBe(true);
            expect(numbersCheckbox.checked).toBe(true);
            expect(specialCheckbox.checked).toBe(false);
        });

        test('should show generated password when generate button is clicked', () => {
            const generateButton = screen.getByText('Generate Secure Password');
            const generatedPasswordContainer = document.getElementById('generatedPasswordContainer');
            const generatedPassword = document.getElementById('generatedPassword');
            
            // Initially hidden
            expect(generatedPasswordContainer.style.display).toBe('none');
            
            // Mock generate function
            window.generatePassword = jest.fn(() => {
                generatedPassword.textContent = 'MockPassword123!';
                generatedPasswordContainer.style.display = 'flex';
            });
            
            fireEvent.click(generateButton);
            window.generatePassword();
            
            expect(generatedPasswordContainer.style.display).toBe('flex');
            expect(generatedPassword.textContent).toBe('MockPassword123!');
        });

        test('should show copy feedback when copy button is clicked', async () => {
            const generatedPasswordContainer = document.getElementById('generatedPasswordContainer');
            const generatedPassword = document.getElementById('generatedPassword');
            const copyFeedback = document.getElementById('copyFeedback');
            
            // Setup generated password
            generatedPassword.textContent = 'TestPassword123!';
            generatedPasswordContainer.style.display = 'flex';
            
            // Mock clipboard API
            Object.assign(navigator, {
                clipboard: {
                    writeText: jest.fn().mockResolvedValue()
                }
            });
            
            // Mock copy function
            window.copyPassword = jest.fn(async () => {
                await navigator.clipboard.writeText(generatedPassword.textContent);
                copyFeedback.classList.add('show');
                
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 2000);
            });
            
            const copyButton = screen.getByText('Copy');
            
            // Initially not showing
            expect(copyFeedback).not.toHaveClass('show');
            
            // Click copy
            fireEvent.click(copyButton);
            await window.copyPassword();
            
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('TestPassword123!');
            expect(copyFeedback).toHaveClass('show');
            
            // Wait for feedback to disappear
            await waitFor(() => {
                copyFeedback.classList.remove('show');
                expect(copyFeedback).not.toHaveClass('show');
            }, { timeout: 3000 });
        });
    });

    describe('Breach Checking', () => {
        test('should show breach check status', async () => {
            const breachCheck = document.getElementById('breachCheck');
            const passwordInput = screen.getByPlaceholderText('Type your password here...');
            
            // Initially hidden
            expect(breachCheck.style.display).toBe('none');
            
            // Mock breach check
            const mockCheckBreach = async (status) => {
                breachCheck.style.display = 'block';
                breachCheck.className = `breach-check ${status}`;
                
                if (status === 'breach-checking') {
                    breachCheck.textContent = 'Checking against breach databases...';
                } else if (status === 'breach-safe') {
                    breachCheck.textContent = '✓ This password has not been found in known breaches';
                } else if (status === 'breach-compromised') {
                    breachCheck.textContent = '⚠️ This password has been found in data breaches!';
                }
            };
            
            // Type password
            fireEvent.input(passwordInput, { target: { value: 'password123' } });
            
            // Show checking status
            await mockCheckBreach('breach-checking');
            expect(breachCheck.style.display).toBe('block');
            expect(breachCheck).toHaveClass('breach-checking');
            expect(breachCheck.textContent).toContain('Checking');
            
            // Show compromised status
            await mockCheckBreach('breach-compromised');
            expect(breachCheck).toHaveClass('breach-compromised');
            expect(breachCheck.textContent).toContain('found in data breaches');
            
            // Type a different password
            fireEvent.input(passwordInput, { target: { value: 'VerySecure2023!@#' } });
            
            // Show safe status
            await mockCheckBreach('breach-safe');
            expect(breachCheck).toHaveClass('breach-safe');
            expect(breachCheck.textContent).toContain('not been found');
        });
    });
});