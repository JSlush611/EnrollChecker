export class RegistrationValidation {
    static validate({ preferredName, email, password, phoneNumber }) {
        const errors = [];

        if (!preferredName || !email || !password) {
            errors.push("Missing required fields");
        }
    
        if (password.length < 2) {
            errors.push("Password should be at least 2 characters long");
        }
    
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            errors.push("Invalid email format");
        }
    
        if (preferredName.length < 2 || preferredName.length > 50) {
            errors.push("Preferred name should be between 2 and 50 characters long");
        }
    
        const phoneNumberRegex = /^\d{10}$/; 
        if (phoneNumber && !phoneNumberRegex.test(phoneNumber)) {
            errors.push("Invalid phone number format");
        }
    
        return { passed: errors.length === 0, errors };
    }
}