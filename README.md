<h1><b>Sales Studio</b></h1>

we worked on implementing JWT authentication and a coupon management system in a full-stack MERN application. We integrated user login and registration with JWT, storing the token in localStorage for authentication. Users could fetch, display, claim, and edit coupons, but only logged-in users were allowed to edit them. Several issues arose, including JWT malformed errors, 401 Unauthorized responses, and token verification failures, which we resolved by ensuring proper token storage, formatting, and passing it correctly in request headers. We debugged the backend using console logs and JWT verification in Postman to ensure the token was correctly signed and verified. The PUT request for updating coupons was fixed by correctly sending the Bearer Token in the authorization header. Technologies used include React.js, Node.js, Express.js, MongoDB, JWT, bcrypt, and SweetAlert2 for interactive UI. Overall, this assignment strengthened our understanding of authentication, authorization, middleware debugging, and secure API communication. 🚀
<br>
<br>
<img src="frontend/public/sales.png" />
<br>
<br>
<h1>🚀 Setup Process for JWT Authentication & Coupon Management System</h1> 
1️⃣  Install Backend Dependencies<br> 
<ul>
  <li>express – Web framework for Node.js</li>
  <li>mongoose – MongoDB ODM for database handling</li>
  <li>dotenv – Loads environment variables</li>
  <li>jsonwebtoken – JWT authentication</li>
  <li>bcrypt – Secure password hashing</li>
  <li>cors – Enables CORS for frontend communication</li>
</ul>
2️⃣  
