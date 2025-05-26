import { 
    generatePassword, 
    ensureRequiredCharacters, 
    validatePasswordOptions,
    charsets 
} from '../../src/passwordGenerator.js';

describe('Password Generator', () => {
    describe('generatePassword', () => {
        test('should generate password of specified length', () => {
            const password = generatePassword({ length: 10 });
            expect(password).toHaveLength(10);
            
            const longPassword = generatePassword({ length: 32 });
            expect(longPassword).toHaveLength(32);
        });

        test('should use default length of 16 if not specified', () => {
            const password = generatePassword({});
            expect(password).toHaveLength(16);
        });

        test('should include only uppercase when specified', () => {
            const password = generatePassword({
                length: 20,
                includeUppercase: true,
                includeLowercase: false,
                includeNumbers: false,
                includeSpecial: false
            });
            expect(password).toMatch(/^[A-Z]+$/);
        });

        test('should include only lowercase when specified', () => {
            const password = generatePassword({
                length: 20,
                includeUppercase: false,
                includeLowercase: true,
                includeNumbers: false,
                includeSpecial: false
            });
            expect(password).toMatch(/^[a-z]+$/);
        });

        test('should include only numbers when specified', () => {
            const password = generatePassword({
                length: 20,
                includeUppercase: false,
                includeLowercase: false,
                includeNumbers: true,
                includeSpecial: false
            });
            expect(password).toMatch(/^[0-9]+$/);
        });

        test('should include only special characters when specified', () => {
            const password = generatePassword({
                length: 20,
                includeUppercase: false,
                includeLowercase: false,
                includeNumbers: false,
                includeSpecial: true
            });
            expect(password).toMatch(/^[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$/);
        });

        test('should include all character types when all are enabled', () => {
            const password = generatePassword({
                length: 50,
                includeUppercase: true,
                includeLowercase: true,
                includeNumbers: true,
                includeSpecial: true
            });
            
            // Check that password contains at least one of each type
            expect(password).toMatch(/[A-Z]/);
            expect(password).toMatch(/[a-z]/);
            expect(password).toMatch(/[0-9]/);
            expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
        });

        test('should throw error when no character types are selected', () => {
            expect(() => {
                generatePassword({
                    includeUppercase: false,
                    includeLowercase: false,
                    includeNumbers: false,
                    includeSpecial: false
                });
            }).toThrow('At least one character type must be selected');
        });

        test('should generate different passwords on consecutive calls', () => {
            const options = { length: 16 };
            const password1 = generatePassword(options);
            const password2 = generatePassword(options);
            const password3 = generatePassword(options);
            
            expect(password1).not.toBe(password2);
            expect(password2).not.toBe(password3);
            expect(password1).not.toBe(password3);
        });

        test('should handle minimum length passwords', () => {
            const password = generatePassword({ length: 1 });
            expect(password).toHaveLength(1);
        });
    });

    describe('ensureRequiredCharacters', () => {
        test('should add missing character types', () => {
            // Password with only lowercase
            const password = 'abcdefghijk';
            const requiredCharsets = [
                charsets.uppercase,
                charsets.numbers
            ];
            
            const updated = ensureRequiredCharacters(password, requiredCharsets);
            
            // Should contain at least one uppercase and one number
            expect(updated).toMatch(/[A-Z]/);
            expect(updated).toMatch(/[0-9]/);
            expect(updated).toHaveLength(password.length);
        });

        test('should not modify password if all required characters are present', () => {
            const password = 'Abc123!@#';
            const requiredCharsets = [
                charsets.uppercase,
                charsets.lowercase,
                charsets.numbers,
                charsets.special
            ];
            
            const updated = ensureRequiredCharacters(password, requiredCharsets);
            
            // Should still contain all character types
            expect(updated).toMatch(/[A-Z]/);
            expect(updated).toMatch(/[a-z]/);
            expect(updated).toMatch(/[0-9]/);
            expect(updated).toMatch(/[!@#$%^&*]/);
        });

        test('should handle empty required charsets', () => {
            const password = 'testpassword';
            const updated = ensureRequiredCharacters(password, []);
            expect(updated).toBe(password);
        });

        test('should handle password shorter than required charsets', () => {
            const password = 'ab';
            const requiredCharsets = [
                charsets.uppercase,
                charsets.lowercase,
                charsets.numbers,
                charsets.special
            ];
            
            const updated = ensureRequiredCharacters(password, requiredCharsets);
            expect(updated).toHaveLength(2);
            // At least 2 different character types should be present
            const hasUppercase = /[A-Z]/.test(updated);
            const hasLowercase = /[a-z]/.test(updated);
            const hasNumbers = /[0-9]/.test(updated);
            const hasSpecial = /[!@#$%^&*]/.test(updated);
            
            const typeCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecial].filter(Boolean).length;
            expect(typeCount).toBeGreaterThanOrEqual(2);
        });
    });

    describe('validatePasswordOptions', () => {
        test('should accept valid options', () => {
            expect(validatePasswordOptions({
                length: 16,
                includeUppercase: true,
                includeLowercase: true,
                includeNumbers: true,
                includeSpecial: true
            })).toBe(true);
        });

        test('should accept minimum length', () => {
            expect(validatePasswordOptions({
                length: 1,
                includeUppercase: true
            })).toBe(true);
        });

        test('should accept maximum length', () => {
            expect(validatePasswordOptions({
                length: 128,
                includeUppercase: true
            })).toBe(true);
        });

        test('should reject length below minimum', () => {
            expect(() => {
                validatePasswordOptions({
                    length: 0,
                    includeUppercase: true
                });
            }).toThrow('Password length must be between 1 and 128');
        });

        test('should reject length above maximum', () => {
            expect(() => {
                validatePasswordOptions({
                    length: 129,
                    includeUppercase: true
                });
            }).toThrow('Password length must be between 1 and 128');
        });

        test('should reject when no character types are selected', () => {
            expect(() => {
                validatePasswordOptions({
                    length: 16,
                    includeUppercase: false,
                    includeLowercase: false,
                    includeNumbers: false,
                    includeSpecial: false
                });
            }).toThrow('At least one character type must be selected');
        });

        test('should accept when at least one character type is selected', () => {
            expect(validatePasswordOptions({
                length: 16,
                includeUppercase: false,
                includeLowercase: true,
                includeNumbers: false,
                includeSpecial: false
            })).toBe(true);
        });
    });

    describe('charsets', () => {
        test('should contain correct uppercase characters', () => {
            expect(charsets.uppercase).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        });

        test('should contain correct lowercase characters', () => {
            expect(charsets.lowercase).toBe('abcdefghijklmnopqrstuvwxyz');
        });

        test('should contain correct number characters', () => {
            expect(charsets.numbers).toBe('0123456789');
        });

        test('should contain expected special characters', () => {
            expect(charsets.special).toContain('!@#$%^&*');
            expect(charsets.special).toContain('()_+-=[]{}|;:,.<>?');
        });
    });
});