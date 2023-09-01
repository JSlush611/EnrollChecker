export const validateSubscription = (user, course, courseId) => {
    const errors = [];

    if (!course) {
        errors.push("Course not found!");
      }

      if (user.subscriptions.some(subscription => subscription._id.equals(courseId))) {
        errors.push("You're already subscribed to the course.");
    }

    if (errors.length > 0) {
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
        return { errors };
    }
};