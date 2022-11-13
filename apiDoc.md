# mBox API Documentation

The backend server api for Studio|Mellywood corporate website server

## Available API routes with methods

### Enable 'x-requestapp' before deploy

### All request to server must carry the app id

- App ID is to be set in request header as:
- 'x-requestapp' = 'New-Name'
- when x-requestapp is absent, error response if thrown. App IDs is set im environment variables.

### Account routes: /api/v2/accounts

- View account: GET:/
- Verify new account: GET:/verify
- Sign in: POST:/signin
- Sign in via 3rd party: GET:/signwith/{:app}
- Sign Out: DELETE:/signout
- Profile update: PATCH:/update
- Password update: PATCH:/update-password
- Reset password: PATCH:/reset-password

### Admin auth operation routes: /api/v2/auth/accounts/

- Dev available paths: POST:/paths
- Create new account: POST:/create-account

#### Note on authentication

- Default authorisation does not keep users signed In.
  -- However there are 2 options to manage authorisation:
  --- 1. 'session'. Save the user to browser session
  --- 2. 'bearer'. Generates JWT bearer token which can be saved in the frontend and used in request to server
- - To use either of both options, Simply set a key in request header as
    ---- {X-requestToken: 'option' // 'session'/'token'} to use.
    ---- '\*' can be used in place of 'session'
- - If X-requestToken is not set, authentication mechanism is discaded/auto-disabled.

### Admin managerial routes: /api/v1/admin/purview

- View Managerial Page: GET:/

# Managerial/Admin

Admin and/or managerial pages require privileged access and such access are controlled by eligibility using the Admin ROLE.

- Such Admin roles or ranks are defined in interger values.

  - 1 being the least and rank increases upward.
    a role of 3 automatically has the privileges of 1, 2 and 3.
  - Role definations: 0. inactive role/null

    1. probation
    2. staff (staff and client officers)
    3. manager
    4. executive
    5. dev

- Admin operations should have the url prefix 'purview' to the API endpoint.
  - /api/v1/admin/purview/page

## Pages and Blog

- All GET entities are fetched by uuid except where unspecific.
- Endpoints:
  - GET "/" | to fetch recent entities, and where QUERY params exist, to fetch query specific entities. Filtering, Sorting and Pagination are available for using Query.
  - GET "/:uuid" | to view entity
  - GET "/create" | to fetch references that may be needed to create new entity
  - POST "/create" | to create new entity
  - GET "/:uuid/edit" | to fetch references that may be needed to update existing entity
  - GET "/:uuid/delete" | to delete existing entity
  - GET "/:uuid/edit/alias" | to update alias of existing entity
  - GET "/:uuid/edit/state" | to update state/status of existing entity

## Queries

Queries should generally be attached behind the <code>?</code> notation.

- Queries should generally be attached behind the '?' notation.
- where the first character of the back_half of the router URL is '?' fineAll() querier is used.
  - But if there are other alphanumeric character before '?', treat as a single fineOne() where 'include' might be important and other query tags like filter, sort and pagination are not.

Available query tags include

1. filtering as <code>filter</code>
2. order or sort as <code>sort</code>
3. pagination, as <code>page</code>
4. relationships attachment as <code>include</code>

- Structure is contructed as:

  - filter:

  ```
  filter[firstName[START_WITH]=akin]&
  filter[address.city[EQUAL_TO]=ajah]
  ```

  - filter operators include:

  ```
  EQUAL_TO
  NOT_EQUAL_TO
  GREATER_THAN
  LESSER_THAN
  GREATER_THAN_EQUAL_TO
  LESS_THAN_EQUAL_TO
  START_WITH, END_WITH
  CONTAIN
  IN
  NOT_IN
  BETWEEN
  NOT_BETWEEN
  IS_NULL
  IS_NOT_NULL
  ```

  - sort:

  ```
  sort[created=ASC]&sort[date=DESC]
  ```

  - sort directions include:
    <code>ASC, DESC</code>
    its also possible to sort the field values by a foreign key/entity value.

    ```
    sort[created[author]=ASC]
    ```

  - page:

  ```
  page[limit=25]&page[offset=10]
  ```

  - include:

  ```
    include=post.author.rating,tag
  ```

  - Multiple query tags of same type should be join using '&' except for include which should be joined using comma ','. Query of different types shoild always be joined with '&'.

- Values:
  values maybe be quoted in double quotes or not "value". where values contain spaces, it should be quoted in "this is the value".
  Multiple values may be separated with comma ',' and this will be automatically treated as an 'or' filter.
  ```
  filter[firstName[START_WITH]=akin,"tunde"]
  ```
  However, when using 'or', 'between', 'notBetween', 'in', 'notIn', and 'any' operators, filters should be constructed specifically with ',' inbetween the ranges.
  ```
  filter[number[BETWEEN]=4,19]
  ```
  Optional filters should be preceded with '!' of the operator.
  ```
  filter[address.state[!END_WITH]="town"]
  ```
