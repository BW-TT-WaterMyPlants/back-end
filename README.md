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

### GET /api/users/:id/plants
**Parameters**  
_id:_ (integer) - a valid user ID

**Expects**  
_token_

**Returns**  
_an array of the user's plant objects_  
[{id (integer), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url)}, ...]


## Plants

### GET /api/plants/:id
**Parameters**  
_id:_ (integer) - a valid plant ID

**Expects**  
_token_

**Returns**  
_a plant object_  
{id (integer), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url)}

### POST /api/plants
**Parameters**
_none_

**Expects**
_an object containing the user's token and the plant details_
_except for token, these all have defaults if not provided_
{token (string), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url)}

**Returns**
_a plant object_  
{id (integer), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url)}

### PUT /api/plants/:id
**Parameters**  
_id:_ (integer) - a valid plant ID

**Expects**
_an object containing the user's token and the plant details_
_except for token, if these are not provided, they will remain unchanged_
{token (string), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url)}

**Returns**
_the updated plant object_  
{id (integer), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url)}

### DELETE /api/plants/:id
**Parameters**  
_id:_ (integer) - a valid plant ID

**Expects**
_token_

**Returns**
_a message: "Plant removed"_  
