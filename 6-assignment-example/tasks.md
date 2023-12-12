
# Task 1

Create and export a new function named verifyAdmin() in the authenticate.js file.

Check for admin property: This function will check if a user has admin privileges. In order to perform this check, recall that all user documents include a field called admin set to Boolean true or false, false by default. When a user is authenticated in the verifyUser() function, Passport will load a user property to the req object. This will be available to you as long as the verifyAdmin() middleware follows after the verifyUser() middleware when they are executed in the Express routing methods. Then from the req object, you will be able to obtain the value of the admin flag by using the following expression: 

req.user.admin
You can use this to find out if the user is an administrator. 

Allow admins to pass to the next middleware: You will have the verifyAdmin() function return next(); if the user is an admin. If not, create a new Error object with the message "You are not authorized to perform this operation!", set its status property to 403, and return next(err).

Note: See the assignment video on how to set up an Admin account.

# Task 2 

Protect resources: Update all REST API endpoints for the campsiteRouter, partnerRouter, and promotionRouter to authorize only admin accounts to access the following endpoints:

POST and DELETE operations on /campsites, /promotions, /partners

PUT and DELETE operations on /campsites/:campsiteId, /partners/:partnerId, /promotions/:promotionsId

DELETE operation on /campsites/:campsiteId/comments (for deleting all comments)
When thinking about how to do this, consider what you have learned about how routing methods permit multiple middleware to be used, and also consider what was mentioned in Task 2 about how to make sure that the req.user object is available to the verifyAdmin() middleware.

# Task 3

Allow admins to access users documents: Activate the /users path for GET requests in the usersRouter (/routes/users.js). When a GET request is sent to the /users path, respond by checking if the request is from an admin user. If so, then return the details of all existing user documents. Ordinary users should be unable to reach the GET /users endpoint.

# Task 4

Updating/deleting comments: Allow logged-in users to update or delete any comments that they themselves submitted. 
Recall that the comment already stores the author's _id field as an ObjectId. 
When a user attempts to perform a PUT or DELETE operation on the campsites/:campsiteId/comments/:commentId path, check to ensure that the user is that particular comment's author. 
If so, then allow the operation to proceed.
If not, then respond with a 403 status code.
Recall that the user's _id field is available from the req.user object. Also ObjectIDs behave like Strings, and hence when comparing two ObjectIDs, you should use the id1.equals(id2) syntax (substituting id1 and id2 appropriately).

# Testing

Confirm that while logged in as an admin user, you are able to post/put/delete to the /campsites and /campsites/:campsiteId/comments endpoints, and the same endpoints for promotions and partners. Confirm that you cannot as a regular user, or while not logged in.
Confirm that as an admin, you have access to DELETE all comments. Confirm that you cannot as a regular user, or while not logged in.
Confirm that as an admin, you can get a list of all user documents with a GET request to the /users path. Confirm that you cannot as a regular user, or while not logged in.
Confirm that as an admin or regular user, you are able to PUT or DELETE to a comment that you yourself submitted. You will first need to submit a comment while logged in for this, using a POST request from Postman. Then try to update or delete that same comment using its ID, while logged in with the same account. Confirm that you cannot update or delete that comment while not logged in, or logged into a different account. 