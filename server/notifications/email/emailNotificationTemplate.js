export function emailNotificationTemplate(user, course, numOpen) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Class Available</title>
    </head>
    <body style="font-family: Arial, sans-serif; text-align: center;">
        <h1 style="color: #444;"><b>Hello ${user.preferredName}</b>,</h1>
        <h2 style="color: #0066cc;">A seat just opened up in ${course.title}!</h2>
        <p style="font-size: 16px; color: #444;">Click the button below to naviaget to UW-Madison's Enrollment Portal and claim your seat! Thank you for using EnrollChecker! </p>
        <h2 style="color: #0066cc; font-size: 18px;"><b>Hurry!</b> There ${numOpen === 1 ? 'is <b>1</b> seat' : `are <b>${numOpen}</b> seats`} available.</h2>
        <h2 style="font-size: 18px;">There ${course.subscribed === 2 ? 'is <b>1</b> other person' : `are <b>${course.subscribed - 1}</b> other people`} waiting for a seat to open.</h2>
        <p style="font-size: 18px;">
            <a href="https://enroll.wisc.edu/search" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">ENROLL NOW!</a>
        </p>
        <p style="font-size: 14px; color: #777;">Powered by UW Enroll Checker</p>
        <p style="font-size: 12px; color: #999;">Made by <a href="https://www.linkedin.com/in/jonathan-schluesche-7a1a94252/" style="color: #0066cc; text-decoration: none;">Jonathan Schluesche</a></p>
    </body>
    </html>
    `
};
