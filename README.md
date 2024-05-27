API Documentation

Example Seeded Users

Master Admin

Email: masteradmin@example.com

Password: Aa12345!

Regular Admin

Email: admin@example.com

Password: Aa12345!

Base URL: http://localhost:3000

Registration (Admin Only)

Endpoint: POST /onlyAdmin/signup

Requires Master Admin authentication

Example Request Body:

json

{
  "name": { "first": "John", "last": "Doe" },
  "phone": "1234567890",
  "email": "john.doe@example.com",
  "password": "Aa12345!"
}

Login

Endpoint: POST /onlyAdmin/login

Example Request Body:

json

{
  "email": "admin@example.com",
  "password": "Aa12345!"
}

Example Response:

json
{
  "token": "jwt_token_here"
}

Get Current Admin

Endpoint: GET /onlyAdmin/me

Requires Authentication (Use the token from login)

Get All Admins

Endpoint: GET /onlyAdmin


Requires Authentication

Get Admin by ID

Endpoint: GET /onlyAdmin/:id

Requires Authentication

Update Admin by ID

Endpoint: PUT /onlyAdmin/:id

Requires Authentication

Example Request Body:

json

{
  "name": { "first": "Jane", "last": "Doe" },
  "phone": "0987654321"
}
Delete Admin by ID

Endpoint: DELETE /onlyAdmin/:id

Requires Authentication (Master Admin or Self)

About the project

My project is a system for rating and managing plumbing professionals who work with a certain settlement company and/or insurance company.
It is necessary to choose a professional who will come to their apartment and reflect information before inviting a professional to their apartment.

work methods:
Professionals page -
On this page you should view the list of all registered professionals, filter them by region, sort by rating and more.

User Management -
There are 3 user levels -
1. Master
2. Admin
3. Customer
A master can create a new admin for the site and add/edit professionals.
Admin users can add, edit and delete professionals from the system as needed, for this purpose there is a membership option for administrators registered in the system.

the plumber page -
Any user can view the professional's personal page, see his rating and the opinions written about him by other users.

Adding an opinion -
Each user can add a new opinion on a specific professional, in theory and planning, the intention is to connect him to the interface that, as soon as a visit to a customer's apartment is finished, the link to the form for adding an opinion is already built in to the professional who visited his apartment, as soon as the survey is filled out, the opinion will be added to the plumber.