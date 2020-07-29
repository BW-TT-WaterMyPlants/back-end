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
| Headers | |
|--|--|
| token | json web token |

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
| Headers | |
|--|--|
| token | json web token |

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

### /api/plants/:plantId
All endpoints require a valid auth token for the user matching the userId of the plant.
| Headers | |
|--|--|
| token | json web token |

### GET
Returns the plant object

### PUT
Accepts an object containing updated information about the specified plant. Any parameters not set will not be changed.
| Parameters | |
|--|--|
| nickname | *string, optional* |
| species | *string, optional* |
| h2oFrequency | *integer, optional*. number of days between waterings. |
| lastWatered | *timestamptz, optional*. last date and time plant was watered. if set must conform to ISO standard format ('YYYY-MM-DDThh:mm:ss:sssZ'), which can be obtained from Date.toISOString()|
| imageUrl | *string, optional*. the url of the plant's image resource. |

Returns the updated plant object.

### PATCH
Accepts an optional 'lastWatered' object indicating the last date and time plant was watered. if set must conform to ISO standard format ('YYYY-MM-DDThh:mm:ss:sssZ'), which can be obtained from Date.toISOString()
If not set, server defaults to `new Date(Date.now()).toISOString()` and sets the timestamp to the current server time and date.

### DELETE
Removes the plant resource from the database and returns a message that the plant was removed.
