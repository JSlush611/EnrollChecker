export class SubscriptionValidation{
    static validateSubscription = ({user, course, courseId}) => {
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

    static validateUnsubscription = ({user, course, courseId}) => {
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
    };
};