export const validateRegistration = (preferredName, email, password, phoneNumber) => {
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

    if (errors.length > 0) {
        return { errors };
    }
};

export const validateSubscription = (user, course, courseId) => {
    const errors = [];

    if (!course) {
        errors.push("Course not found!");
      }

      if (user.subscriptions.some(subscription => subscription._id.equals(courseId))) {
        errors.push("You're already subscribed to the course.");
    }

    if (errors.length > 0) {
        console.log(errors)
        return { errors };
    }  
};

export const validateUnsubscription = (user, course, courseId) => {
    const errors = [];

    if (!course) {
        errors.push("Course not found!");
      }

    if (!user.subscriptions.some(subscription => subscription._id.equals(courseId))) {
        errors.push("You're not subscribed to the course.");
    }

    if (errors.length > 0) {
        return { errors };
    }  
}

export const validateUserUpdateInfo = (preferredName, phoneNumber) => {
    const errors = [];

    console.log(preferredName, phoneNumber)
    if (preferredName.trim().length < 2 || preferredName.trim().length > 50) {
        errors.push("Preferred name is not valid");
    }

    if (!/^[A-Za-z]+$/.test(preferredName)) {
        errors.push("Preferred name contains invalid characters");
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
        errors.push("Phone number is not valid");
    }

    if (errors.length > 0) {
        console.log(errors)
        return { errors };
    }
};