
Description:
In this frontend app I have implemented Crud operations on the policy entity, I have used jwt token for authentication, I have configured the app to use one role (‘User’) since there is no admin role, and I have created the entities (Policy Type, Policy Member, Member Claims) for design only and did not implement crud on it, I have used it to make relations between the tables.

This front-end application is built using **Angular** and serves as the user interface for Policy-Backend. It allows users to interact with the backend API and manage policies. The app is designed to be responsive, intuitive, and user-friendly, providing a seamless experience across different devices.


## Technologies Used

- **[Language]**: TypeScript
- **[Framework]**: Angular 19

---
### Installation

Dependencies: run npm install to install all the project dependecies    

Steps to run the APP locally: 
1. run npm install to install all required dependecies
2. verify the environments files that they include the correct api for the backend
3. check if bootstrap is installed by running (npm install bootstrap
) and configured successfully if not install it and :

#You need to make sure Bootstrap’s CSS file is included in your Angular app. In your angular.json file, locate the "styles" array under the "build" options and add the path to Bootstrap’s CSS file.

For example, it should look like this:
"styles": [
  "src/styles.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css"
],

and for the scripts :
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]
