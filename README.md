# back-end
______________________________________
## Users

### GET /api/users
**Parameters:**  
_none_

**Expects:**  
_none_

**Returns:**  
_an array of users' ids and usernames_  
[{id, username}, ...]


### GET /api/users/:id
**Parameters**  
_id:_ (integer) - a valid, 1-based user ID

**Expects:**  
_none_

**Returns:**  
_an object containing a user's information_  
{id, username}


### POST /api/users
**Parameters**  
_none_

**Expects**  
_an object containing a new user's username and password_
* _username:_ string, must be unique
* _password:_ string
* _phoneNumber:_ string, format '(999)999-9999', must be unique

**Returns**  
_an object containing the new users's id, username, and phoneNumber_  
{id, username, phoneNumber}
