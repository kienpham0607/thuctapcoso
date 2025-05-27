# Authentication API Documentation

## Base URL
`http://localhost:5000/api/auth`

## Endpoints

### Login
- **URL**: `/login`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: 
  ```json
  {
    "message": "Login successful",
    "token": "JWT_TOKEN",
    "user": {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```
- **Error Response**: 
  ```json
  {
    "message": "Invalid credentials"
  }
  ```

### Register
- **URL**: `/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "email": "string",
    "password": "string",
    "role": "string"
  }
  ```
- **Success Response**: 
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Error Response**: 
  ```json
  {
    "message": "Email already exists"
  }
  ```

## Test Credentials
```
Email: admin@gmail.com
Password: 123
Role: teacher
```

## Authentication Flow
1. The client sends login credentials to `/api/auth/login`
2. If credentials are valid, server returns JWT token and user data
3. Client stores JWT token in localStorage
4. Include JWT token in Authorization header for subsequent requests:
   ```
   Authorization: Bearer <token>
   ```

## Note
- All requests expect and return JSON data
- JWT tokens expire after 24 hours
- Passwords are hashed using bcrypt before storage