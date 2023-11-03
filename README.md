# Backend Structure

1. The client makes a request to the server.
2. The server (index.ts) receives the request and sends it to the router (routes folder), depending on the type of request.
3. The router sends the request to a specific controller function.
4. The controller function(s) will then interact with the database (db folder) and send a response back to the client.

How Google Auth Works:

1. User Interaction: The user decides they want to integrate their Google Calendar with the app. They click a "Connect Google Calendar" button on the frontend.
2. Request for Auth URL: The frontend sends a request to the backend to get the Google authorization URL.
3. Backend Generates Auth URL: The backend runs the oauth2Client.generateAuthUrl() function and returns the URL to the frontend.
4. Redirect to Google: The frontend redirects the user to the Google authorization URL.
5. User Consents: On Google's page, the user reviews the permissions the app is requesting and either approves or denies them.
6. Callback to Backend: If the user approves, Google redirects them to the callback URL specified in oauth2Client (http://localhost:8080/api/auth/google-auth/login-callback). The URL will include an authorization code as a query parameter (Google automatically populates the query parameter).
7. Exchange Code for Tokens: The googleAuthCallback function is invoked, exchanging the authorization code (req.query.code) for access and refresh tokens.
8. Save Tokens and User Info: The tokens, along with any user information like email, are saved to the database.
9. Final Redirect or Response: The frontend is finally notified of the successful authentication, possibly by redirecting the user to a dashboard or by some other method.
10. Ongoing Interaction: With the stored tokens, the backend can now interact with Google services on behalf of the user, refreshing the tokens as necessary.
