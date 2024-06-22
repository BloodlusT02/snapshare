SnapShare

## Description
This is a simple social media application built using Node.js, Express, MongoDB, Mongoose, 
Passport.js for authentication, and Multer for handling file uploads. Users can register, log in, upload 
profile pictures, create posts with images, view their profile, and see a feed of all posts.

1. Clone the repository :
   - git clone https://github.com/yourusername/social-media-app.git
   - cd social-media-app
  
2. Install dependencies :
   - npm install
  
3. Set up environment variables : Create a .env file in the root directory and add the following :
    - DATABASE_URL=mongodb://localhost:27017/social_media_app
    - SESSION_SECRET=your_session_secret
  
4. Run the application :
   - npm start

# Usage
Routes = User Authentication

* Register
- POST /register
- Registers a new user.
- Request body: { "name": "Name", "username": "username", "email": "email", "password": "password" }

* Login
- POST /login
- Logs in an existing user.
- Request body: { "username": "username", "password": "password" }

* Logout
- GET /logout
- Logs out the current user.

* Profile Page
- GET /profile
- Displays the profile of the logged-in user.

# File Upload

* Upload Profile Image
- POST /fileupload
- Uploads a profile image for the logged-in user.
- Request body: Form-data with image field containing the image file.

* Create Post
- POST /createpost
- Creates a new post with an image.
- Request body: Form-data with postimage, posttitle, and description fields.

# Posts

* Feed
- GET /feed
- Displays all posts from all users.

* Post Details
- GET /post/details
- Displays details of a specific post.
- Request query parameters: postId and userId

# Middleware

* isLoggedIn
- A middleware function that checks if a user is authenticated.
- If not, redirects to the home page.

# Error Handling
- All routes include error handling to catch and respond to internal server errors with a status code of 500.

# Models

* User Model (users.js)
- Fields: name, username, email, profileImage, posts
- Methods: Uses Passport's register method for user registration.

* Post Model (post.js)
- Fields: user, title, postImage, description

* Views
- index.ejs: Home page
- register.ejs: User registration page
- login.ejs: User login page
- profile.ejs: User profile page
- feed.ejs: Feed displaying all posts
- postform.ejs: Form for creating a new post
- details.ejs: Details of a specific post

* Dependencies
- express: Fast, unopinionated, minimalist web framework for Node.js
- mongoose: Elegant MongoDB object modeling for Node.js
- passport: Simple, unobtrusive authentication for Node.js
- passport-local: Local username and password authentication strategy for Passport
- multer: Node.js middleware for handling multipart/form-data
- dotenv: Loads environment variables from .env file
- connect-flash: Flash messages for Express

  # License
  This project is licensed under the MIT License - see the LICENSE file for details.

# Acknowledgments
- Thanks to the creators of the libraries and frameworks used in this project.
- Special thanks to the community for their continuous support and contributions.

# Directory Structure
/snapshare-media-app
│
├── models
│   ├── users.js
│   └── post.js
│
├── routes
│   └── index.js
│
├── views
│   ├── index.ejs
│   ├── register.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── feed.ejs
│   ├── postform.ejs
│   └── details.ejs
│
├── .env
├── app.js
├── multer.js
├── package.json
└── README.md
