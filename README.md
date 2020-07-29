# Water My Plants API Reference
## /api/users
### GET
Returns an array of all registered users.

### POST
Requires an object containing the new user's information.
| Parameters | |
|--|--|
| username | *string, required*. must be unique |
| password | *string, required*. |
| phoneNumber | *string. if set*, must be unique and conform to '(999)999-9999' format |

Returns an object containing information about the new user.

## /api/users/login
### POST
Requires an object containing the username and password of the user wishing to log in.
| Parameters | |
|--|--|
| username | *string, required* |
| password | *string, required* |

Returns an object containing the user's information and an auth token.

## /api/users/:userId
All endpoints require a valid auth token for the user matching userId sent as a header.
| Header ('token') | |
|--|--|
| username | *string, required* |
| password | *string, required* |

### GET
Returns the information of the user with the given userId.

### PUT
Requires an object containing the requested changes.
| Parameters | |
|--|--|
| phoneNumber | *string, optional*. if set, must be unique and conform to '(999)999-9999' format |
| newPassword | *string, optional*. the user's desired new password |
| password | *string, optional/required (if newPassword is set)*. the user's current password.

Returns the updated user.

## /api/users/:userId/plants
All endpoints require a valid auth token for the user matching userId sent as a header.
| Header ('token') | |
|--|--|
| username | *string, required* |
| password | *string, required* |

### GET
Returns an array of the user's plants.

### POST
Accepts an optional object containing information about the new plant. Any parameters not set will default to null.
| Parameters | |
|--|--|
| nickname | *string, optional* |
| species | *string, optional* |
| h2oFrequency | *integer, optional*. number of days between waterings. |
| lastWatered | *timestamptz, optional*. last date and time plant was watered. if set must conform to ISO standard format ('YYYY-MM-DDThh:mm:ss:sssZ'), which can be obtained from Date.toISOString()|
| imageUrl | *string, optional*. the url of the plant's image resource. |

Returns the newly created plant object.

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
{id (integer), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url), watered_at (datetime object), next_watering (datetime object)}

### PUT /api/plants/:id
**Parameters**  
_id:_ (integer) - a valid plant ID

**Expects**
_an object containing the user's token and the plant details_
_except for token, if these are not provided, they will remain unchanged_
{token (string), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url)}

**Returns**
_the updated plant object_  
{id (integer), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url), watered_at (datetime object), next_watering (datetime object)}

### DELETE /api/plants/:id
**Parameters**  
_id:_ (integer) - a valid plant ID

**Expects**
_token_

**Returns**
_a message: "Plant removed"_  

### PATCH /api/plants/:id/water
**Parameters**
_id:_ (integer) - a valid plant ID

**Expects**
_token_

**Does**
Updates _watered_at_ to current timestamp. Updates _next_watering_ to current timestamp + _h2oFrequency_ in days

**Returns**
_the updated plant object_   
{id (integer), nickname (string), species (string), h2oFrequency (integer, number of days between waterings), h2oTime (string, time: HH:MM), image_url (string, url), watered_at (datetime object), next_watering (datetime object)}
