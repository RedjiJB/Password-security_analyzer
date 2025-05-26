import { 
    calculatePasswordStrength, 
    checkPasswordCriteria, 
    getStrengthInfo,
    commonPasswords 
} from '../../src/passwordAnalyzer.js';

describe('Password Analyzer', () => {
    describe('checkPasswordCriteria', () => {
        test('should return all criteria as false for empty password', () => {
            const criteria = checkPasswordCriteria('');
            expect(criteria).toEqual({
                length: false,
                uppercase: false,
                lowercase: false,
                numbers: false,
                special: false
            });
        });

        test('should check length criteria correctly', () => {
            expect(checkPasswordCriteria('1234567').length).toBe(false);
            expect(checkPasswordCriteria('12345678').length).toBe(true);
            expect(checkPasswordCriteria('123456789012345').length).toBe(true);
        });

        test('should check uppercase criteria correctly', () => {
            expect(checkPasswordCriteria('password').uppercase).toBe(false);
            expect(checkPasswordCriteria('Password').uppercase).toBe(true);
            expect(checkPasswordCriteria('PASSWORD').uppercase).toBe(true);
            expect(checkPasswordCriteria('pAsSwOrD').uppercase).toBe(true);
        });

        test('should check lowercase criteria correctly', () => {
            expect(checkPasswordCriteria('PASSWORD').lowercase).toBe(false);
            expect(checkPasswordCriteria('Password').lowercase).toBe(true);
            expect(checkPasswordCriteria('password').lowercase).toBe(true);
            expect(checkPasswordCriteria('pAsSwOrD').lowercase).toBe(true);
        });

        test('should check numbers criteria correctly', () => {
            expect(checkPasswordCriteria('password').numbers).toBe(false);
            expect(checkPasswordCriteria('password1').numbers).toBe(true);
            expect(checkPasswordCriteria('123456').numbers).toBe(true);
            expect(checkPasswordCriteria('p4ssw0rd').numbers).toBe(true);
        });

        test('should check special characters criteria correctly', () => {
            expect(checkPasswordCriteria('password123').special).toBe(false);
            expect(checkPasswordCriteria('password!').special).toBe(true);
            expect(checkPasswordCriteria('p@ssw0rd').special).toBe(true);
            expect(checkPasswordCriteria('!@#$%^&*').special).toBe(true);
            expect(checkPasswordCriteria('pass-word').special).toBe(true);
            expect(checkPasswordCriteria('pass_word').special).toBe(true);
            expect(checkPasswordCriteria('pass[word]').special).toBe(true);
        });

        test('should check all criteria for a strong password', () => {
            const criteria = checkPasswordCriteria('P@ssw0rd123!');
            expect(criteria).toEqual({
                length: true,
                uppercase: true,
                lowercase: true,
                numbers: true,
                special: true
            });
        });
    });

    describe('calculatePasswordStrength', () => {
        test('should return 0 for empty password', () => {
            expect(calculatePasswordStrength('')).toBe(0);
        });

        test('should return low strength for short passwords', () => {
            expect(calculatePasswordStrength('abc')).toBe(20); // only lowercase
            expect(calculatePasswordStrength('ABC')).toBe(20); // only uppercase
            expect(calculatePasswordStrength('123')).toBe(20); // only numbers
        });

        test('should calculate strength based on criteria met', () => {
            expect(calculatePasswordStrength('password')).toBe(40); // length + lowercase
            expect(calculatePasswordStrength('Password')).toBe(60); // length + lowercase + uppercase
            expect(calculatePasswordStrength('Password1')).toBe(80); // length + lowercase + uppercase + number
            expect(calculatePasswordStrength('Password1!')).toBe(100); // all criteria
        });

        test('should add bonus points for longer passwords', () => {
            // 12+ characters bonus
            expect(calculatePasswordStrength('passwordlong')).toBe(50); // 40 + 10 bonus
            // 16+ characters bonus
            expect(calculatePasswordStrength('passwordverylongpassword')).toBe(60); // 40 + 10 + 10 bonus
        });

        test('should penalize common passwords', () => {
            commonPasswords.forEach(commonPass => {
                const strength = calculatePasswordStrength(commonPass);
                expect(strength).toBeLessThanOrEqual(20);
            });
        });

        test('should penalize common passwords regardless of case', () => {
            expect(calculatePasswordStrength('PASSWORD')).toBeLessThanOrEqual(20);
            expect(calculatePasswordStrength('PaSsWoRd')).toBeLessThanOrEqual(20);
            expect(calculatePasswordStrength('QWERTY')).toBeLessThanOrEqual(20);
        });

        test('should cap strength at 100', () => {
            const veryStrongPassword = 'P@ssw0rd123!VeryLongAndComplex#2023';
            expect(calculatePasswordStrength(veryStrongPassword)).toBe(100);
        });
    });

    describe('getStrengthInfo', () => {
        test('should return weak info for strength < 40', () => {
            expect(getStrengthInfo(0)).toEqual({
                class: 'strength-weak',
                text: 'Weak',
                color: '#ff4757'
            });
            expect(getStrengthInfo(39)).toEqual({
                class: 'strength-weak',
                text: 'Weak',
                color: '#ff4757'
            });
        });

        test('should return fair info for strength 40-59', () => {
            expect(getStrengthInfo(40)).toEqual({
                class: 'strength-fair',
                text: 'Fair',
                color: '#ffa502'
            });
            expect(getStrengthInfo(59)).toEqual({
                class: 'strength-fair',
                text: 'Fair',
                color: '#ffa502'
            });
        });

        test('should return good info for strength 60-79', () => {
            expect(getStrengthInfo(60)).toEqual({
                class: 'strength-good',
                text: 'Good',
                color: '#ffd93d'
            });
            expect(getStrengthInfo(79)).toEqual({
                class: 'strength-good',
                text: 'Good',
                color: '#ffd93d'
            });
        });

        test('should return strong info for strength >= 80', () => {
            expect(getStrengthInfo(80)).toEqual({
                class: 'strength-strong',
                text: 'Strong',
                color: '#2ed573'
            });
            expect(getStrengthInfo(100)).toEqual({
                class: 'strength-strong',
                text: 'Strong',
                color: '#2ed573'
            });
        });
    });
});