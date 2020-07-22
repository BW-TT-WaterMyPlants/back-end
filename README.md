# back-end
______________________________________
## Users
### GET /api/users
**Parameters:**
* None

**Expects:**
* None

**Returns:**
an array containing users
* id
* username

### GET /api/users/:id
**Parameters**
* id: *integer* - a valid, 1-based user ID

**Expects:**
* None

**Returns:**
an object containing a user's
* id
* username
* phoneNumber
