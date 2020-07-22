# back-end
______________________________________
## POST /api/auth/register

registers a new user

### data shape:

{

  username: string,   // UNIQUE   
  
  password: string,
  
  phoneNumber: string
  
}

### returns:

{

  userId,
  
  username,
  
  phoneNumber
  
}
______________________________________
* POST /api/auth/login
logs in a user and returns a json web token

data shape:
{
  username,
  password
}

returns:
{
  message,
  token
}
