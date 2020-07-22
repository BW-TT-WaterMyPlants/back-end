# back-end
______________________________________
## GET /api/users
**Parameters:**  
_none_

**Expects:**  
_none_

**Returns:**  
_an array of users' ids and usernames_  
  [  
    {  
      id,  
      username  
    },  
    ...  
  ]

## GET /api/users/:id
**Parameters**  
_id_: (integer) - a valid, 1-based user ID

**Expects:**  
_none_

**Returns:**  
_an object containing a user's information_  
  {  
    id,  
    username  
  }

## POST /api/users
