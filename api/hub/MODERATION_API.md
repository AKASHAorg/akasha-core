# moderation-api
The API that powers the AWF moderation features

Endpoint: `https://moderation.ethereum.world`.

# Reporting

## Report some content

**contentId** - content identifier (defined by app)
**contentType** - content type (defined by app)
**explanation** - short text to provide additional comments
**reason** - reason for reporting
**user** - identifier of the user who reports the content
**signature** - signature over the "data" attribute

```
POST https://api.ethereum.world/api/moderation/reports/new
Content-Type: application/json
{
  "contentId": "01fdys08e4psf1g95a5mdazjne",
  "contentType": "post",
  "data": {
    "explanation": "This is really toxic.",
    "reason": "Hate speech",
    "user": "bbyareibr3twqugilmczodsqc53l6s7wlwq4suckv2oclnmuh3x5irpdbjy"
  },
  signature: "o4Bt2an...KqeH9A=="
}
```

**Response codes:**
 * HTTP 201 (Created) for a successful reporting request.
 * HTTP 400 (Bad request) if missing attributes from the JSON object in the request.
 * HTTP 409 (Conflict) if the user has already reported this content.
 * HTTP 500 (Internal server error) for any other backend-related errors.

## List reports for a given content ID

When listing report requests for a given content, you can specify a period of time
using `start` and `end` attributes, in UTC date format. You can optionally omit the
dates in order to get all results at once.

```
POST https://api.ethereum.world/api/moderation/reports/list/01fdys08e4psf1g95a5mdazjne

Returns an array of report requests:
[
  {
    "_id": "01ff7c3e8nrq8nvzpe720sa2mg",
    "author": "bbyareibr3twqugilmczodsqc53l6s7wlwq4suckv2oclnmuh3x5irpdbjy",
    "creationDate": "1631261407167",
    "contentId": "01fdys08e4psf1g95a5mdazjne",
    "contentType": "post",
    "explanation": "This is really toxic.",
    "reason": "Hate speech"
  }
]
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 400 (Bad request) if missing content identifier from the request URL.
 * HTTP 404 (Not found) if trying to use a content identifier that doesn't have any reports.
 * HTTP 500 (Internal server error) for any other backend-related errors.


# Status

## Batch check if a list of specific contentIDs have been reported and delisted

Checks if a certain user (or none in case there is no user current logged in) has reported a 
list of content ids, and if they were delisted or not. This is used in the feed-app to 
display/hide content that has been reported or delisted.

Content can be moderated and NOT delisted (=false), in the case of posts that have been kept!

```
POST https://api.ethereum.world/api/moderation/status
Content-Type: application/json
{
  "user": "bbyareibr3twqugilmczodsqc53l6s7wlwq4suckv2oclnmuh3x5irpdbjy",
  "contentIds": ["01fdys08e4psf1g95a5mdazjne", "01ewahejdexjcgjwvb605zg4ew"]
}

Returns an array of data for each contentID:
[
  {
    "contentId": "01fdys08e4psf1g95a5mdazjne",
    "reported": true,
    "delisted": false,
    "moderated": false
  },
  {
    "contentId": "01ewahejdexjcgjwvb605zg4ew",
    "reported": false,
    "delisted": true,
    "moderated: true
  }
]
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 400 (Bad request) if missing `contentIds` from the JSON object in the request.
 * HTTP 500 (Internal server error) for any other backend-related errors.


## Get total number of pending / delisted / kept requests

Returns counters with the total number of pending requests, moderated (delisted) and 
moderated (kept) decisions.

```
GET https://api.ethereum.world/api/moderation/status/counters

Returns an object with three counters:
{
  "pending": 89,
  "delisted": 31,
  "kept": 2
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 500 (Internal server error) for any other backend-related errors.


# Moderation

Moderation is very similar to how reporting works, except that it uses the content identifier
instead of unique identifiers when performing requests.

## Moderate some content

**contentId** - content identifier (defined by app)
**contentType** - content type (defined by app)
**data** - contains data coming from the moderator (`delisted`, `explanation` , `modeartor`)
**explanation** - short text to provide additional comments
**delisted** - delisted status (boolean)
**moderator** - identifier of the user who moderated the content
**signature** - signature over the `data` attribute

```
POST https://api.ethereum.world/api/moderation/decisions/moderate
Content-Type: application/json
{
  "contentId": "01fdyq8kgde9q7kvpp6nxka0s7",
  "contentType": "post",
  "data": {
    "explanation": "This had to be moderated.",
    "delisted": true,
    "moderator": "bbyareibr3twqugilmczodsqc53l6s7wlwq4suckv2oclnmuh3x5irpdbjy"
  },
  signature: "rBCFHo/3X...w8vZL0/bBQ=="
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful moderation request.
 * HTTP 400 (Bad request) if missing attributes from the JSON object in the request.
 * HTTP 500 (Internal server error) for any other backend-related errors.


## View moderation decision for a given content ID

```
GET https://api.ethereum.world/api/moderation/decisions/01fdyq8kgde9q7kvpp6nxka0s7

Returns:
{
  "_id": "01ff04ss22w3xmeerrarsnkjg5",
  "_mod": 1631262938322819000,
  "contentID": "01fdyq8kgde9q7kvpp6nxka0s7",
  "contentType": "post",
  "creationDate": 1631018869481,
  "delisted": true,
  "explanation": "This had to be moderated.",
  "moderated": true,
  "moderatedDate": 1631262937970,
  "moderator": "byareibr3tw...lnmuh3x5irpdbjy",
  "moderatorProfile": {
    "ethAddress": "0x350F72...EBE98dA",
    "pubKey": "byareibr3tw...lnmuh3x5irpdbjy",
    "name": "Andrei",
    "userName": "andrei",
    "avatar": "bafkreifuecywu6ecazo...5pu6tj3t5bb66te7bzbkwj3sm2xajme"
  },
  "reports": 1,
  "reportedBy": "byareibr3tw...lnmuh3x5irpdbjy",
  "reportedDate": 1631018870060,
  "reportedByProfile": {
    "ethAddress": "0xfD44B4450F03...c646aA75838b",
    "pubKey": "bbyareibr3tw...lnmuh3x5irpdbjy",
    "name": "Chukwuebuka",
    "userName": "josenriagu",
    "avatar": "bafkreifuecywu6ecazo...5pu6tj3t5bb66te7bzbkwj3sm2xajme"
  },
  "reasons": [
    "This is really toxic."
  ]
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 400 (Bad request) if missing content identifier (i.e. `QmABC`) from the request URL.
 * HTTP 404 (Not found) if trying to use a content identifier that hasn't been moderated.
 * HTTP 500 (Internal server error) for any other backend-related errors.

## List content pending moderation

Returns the list of content that has been reported and is pending moderation.
You can specify an `offset` and a `limit` to paginate through the results.

**offset** - the id of the content to use as offset
**limit** - the number of results to return

```
POST https://moderation.ethereum.world/decisions/pending
Content-Type: application/json
{
  "offset": "01ff7d06fte44r49hvs68gyx1c",
  "limit": 1
}

Returns an object containg the results as an array of content pending moderation,
the `nextIndex` identifier as well as the total number of results through that can be paged.
The default page size is set to 10 results.

{
  "results": [
    {
      "_id": "01ff7d06fte44r49hvs68gyx1c",
      "_mod": 1631262349820273400,
      "contentID": "bbaareiebw3dh365abxibz7mtpiwytdvx5sgwzrtknaudcqbfqp3j5iv344",
      "contentType": "account",
      "creationDate": 1631262349471,
      "delisted": false,
      "moderated": false,
      "explanation": "",
      "reports": 1,
      "reportedBy": "bbaareib5zzx7kelta4...yi6xicpn4avslcb5rl4e",
      "reportedDate": 1631262350059,
      "reportedByProfile": {
        "ethAddress": "0xfD44B4450...c646aA75838b",
        "pubKey": "bbaareib5zzx7kelta4...yi6xicpn4avslcb5rl4e",
        "name": "John Doe",
        "userName": "johndoe",
        "avatar": "bafkreiaw7psxov...mzj4l6qj3r4zrnrzlve"
      },
      "reasons": [
        "Privacy and copyright infringement"
      ]
    },
  ],
  "nextIndex": "",
  "total": 38
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 500 (Internal server error) for any other backend-related errors.

## List moderated content

When listing moderated content, you **MUST** also specify if you want to get `delisted` 
content or not. Setting `delisted` to false is useful when looking at content thas been
reviewed and has been deemed OK.

```
POST https://api.ethereum.world/api/moderation/decisions/moderated
Content-Type: application/json
{
  "delisted": true
}

Same as above, only this time with a moderation decision structure as a result type:

{
  "results": [
    {
      "_id": "01ff04ss22w3xmeerrarsnkjg5",
      "_mod": 1631262938322819000,
      "contentID": "01fdyq8kgde9q7kvpp6nxka0s7",
      "contentType": "post",
      "creationDate": 1631018869481,
      "delisted": true,
      "explanation": "This had to be moderated.",
      "moderated": true,
      "moderatedDate": 1631262937970,
      "moderator": "byareibr3tw...lnmuh3x5irpdbjy",
      "moderatorProfile": {
          "ethAddress": "0x350F72...EBE98dA",
          "pubKey": "byareibr3tw...lnmuh3x5irpdbjy",
          "name": "Moderator ",
          "userName": "mod1",
          "avatar": "bafkreifuecywu6ecazo...5pu6tj3t5bb66te7bzbkwj3sm2xajme"
      },
      "reports": 1,
      "reportedBy": "byareibr3tw...lnmuh3x5irpdbjy",
      "reportedDate": 1631018870060,
      "reportedByProfile": {
        "ethAddress": "0xfD44B4450...c646aA75838b",
        "pubKey": "bbaareib5zzx7kelta4...yi6xicpn4avslcb5rl4e",
        "name": "John Doe",
        "userName": "johndoe",
        "avatar": "bafkreiaw7psxov...mzj4l6qj3r4zrnrzlve"
      },
      "reasons": [
          "This is really toxic."
      ]
    },
  ],
  "nextIndex": "",
  "total": 1
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 400 (Bad request) if missing attributes (i.e. `delisted`) from the JSON object in the request.
 * HTTP 500 (Internal server error) for any other backend-related errors.

## Transparency log

Get a public log of all content that has been moderated, for transparency purposes.

```
POST https://api.ethereum.world/api/moderation/decisions/log
Content-Type: application/json
{
  "moderated": true,
  "delisted": false
}

Returns a results set with information about the moderation decision:

{
  "results": [
    {
      "contentID": "01fdyq8kgde9q7kvpp6nxka0s7",
      "contentType": "post",
      "moderatedDate": 1631262937970,
      "moderator":  {
          "ethAddress": "0x350F72...EBE98dA",
          "pubKey": "byareibr3tw...lnmuh3x5irpdbjy",
          "name": "Moderator ",
          "userName": "mod1",
          "avatar": "bafkreifuecywu6ecazo...5pu6tj3t5bb66te7bzbkwj3sm2xajme"
      },
      "delisted": true,
      "reasons": [
        "This is really toxic."
      ],
      "reports": 1,
      "explanation": "This had to be moderated."
    },
  ],
  "nextIndex": "",
  "total": 1
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 500 (Internal server error) for any other backend-related errors.

## Actions log

Get a log (history) of all moderation actions for a given content identifier.

```
GET https://api.ethereum.world/api/moderation/decisions/actions/01fdyq8kgde9q7kvpp6nxka0s7

{
  "_id": "01ff04ss22w3xmeerrarsnkjg5",
  "_mod": 1631262938322819000,
  "actions": [
    {
      "delisted": true,
      "explanation": "This had to be moderated.",
      "moderatedDate": 1631262937970,
      "moderator": "byareibr3tw...lnmuh3x5irpdbjy"
    },
    {
      "delisted": false,
      "explanation": "Is this free speech?",
      "moderatedDate": 1631261136242,
      "moderator": "byareibaf214...lnmuh3qwkej1"
    }
  ],
  "contentID": "01fdyq8kgde9q7kvpp6nxka0s7",
  "contentType": "post",
  "creationDate": 1631018869481,
  "delisted": true,
  "explanation": "This had to be moderated.",
  "moderated": true,
  "moderatedDate": 1631262937970,
  "moderator": "byareibr3tw...lnmuh3x5irpdbjy"
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 500 (Internal server error) for any other backend-related errors.


## Add a moderator

This feature requires admin priviledges (currently token-based). It assigns moderator status 
(and optionally admin status) to the provided user.

**secret** - a secret token to authenticate the request
**data** - the request (`user`, `admin`, `active`)
**user** - the user identifier
**admin** - whether to make this user an admin (boolean)
**active** - whether to make this user active immediately (boolean)

```
POST https://api.ethereum.world/api/moderation/moderators/new
Content-Type: application/json
{
  "secret": "foo",
  "data": { 
    "user": "byareibr3tw...lnmuh3x5irpdbjy",
    "admin": true,
    "active": true 
  }
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 400 (Bad request) if missing `data` or `secret` from the request.
 * HTTP 403 (Forbidden) if the user is not allowed (the secret does not match).
 * HTTP 500 (Internal server error) for any other backend-related errors.

## Update a moderator

The following attributes can be updated:

 * `admin` (true|false)- whether the user has admin status
 * `active` (true|false) - whether the account is active or not


```
POST https://api.ethereum.world/api/moderation/moderators/byareibr3tw...lnmuh3x5irpdbjy
Content-Type: application/json
{
  "secret": "foo",
  "data": { 
    "admin": true,
    "active": false 
  }
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 400 (Bad request) if missing `user`, `data` or `secret` from the request.
 * HTTP 403 (Forbidden) if the user is not allowed (the secret does not match).
 * HTTP 500 (Internal server error) for any other backend-related errors.


## Check if the given user is _currently_ a moderator

Easily check if the user is a moderator.

```
HEAD https://api.ethereum.world/api/moderation/moderators/status/byareibr3tw...lnmuh3x5irpdbjy
```

**Response codes:**
 * HTTP 200 (OK) for a successful request stating that the user is indeed a moderator.
 * HTTP 404 (Not found) if the user is not a moderator or is a disabled account.

## Get data for a given moderator.

```
GET https://api.ethereum.world/api/moderation/moderators/status/byareibr3tw...lnmuh3x5irpdbjy

{
  "_id": "byareibr3tw...lnmuh3x5irpdbjy",
  "_mod": 1628581547366119200,
  "active": true,
  "admin": true,
  "creationDate": 1628581547020
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request stating that the user is indeed a moderator.
 * HTTP 404 (Not found) if the ETH address owner is not a moderator or is a disabled account.


# Reporting reasons

## Add a new reporting reason

This feature requires admin priviledges (currently token-based). It adds a new reason to the
list of reporting reasons.

**secret** - a secret token to authenticate the request
**data** - the request (`label`, `description`, `active`)
**label** - a short label for the reason (one sentence)
**description** - a longer description of this reason (optional)
**active** - whether to make this reason active immediately (boolean)

```
POST https://api.ethereum.world/api/moderation/reasons/new
Content-Type: application/json
{
  "secret": "foo",
  "data": {
    "label": "Threats of violence and incitement",
    "description": "Content or actions that threaten, encourage, glorify, etc etc.",
    "active": true
  }
}
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 500 (Internal server error) for any other backend-related errors.

## List existing reasons

This feature requires admin priviledges (currently token-based). It adds a new reason to the
list of reporting reasons.

**active** - return only active reasons or only inactive (boolean)

```
POST https://api.ethereum.world/api/moderation/reasons
Content-Type: application/json
{
  "active": true
}

[
  {
    "_id": "01fampb52kykthx0cdpb4rny14",
    "_mod": 1626339644501677000,
    "active": true,
    "creationDate": 1626339644135,
    "description": "Content or actions that threaten, encourage, glorify, etc etc.",
    "label": "Threats of violence and incitement"
  },
  {
    "_id": "01famp9szbdsw9803fq3er4pvz",
    "_mod": 1626339600365797400,
    "active": true,
    "creationDate": 1626339599985,
    "description": "Intimate or explicit images without consent. Violation of other's privacy.",
    "label": "Privacy and copyright infringement"
  }
]
```

**Response codes:**
 * HTTP 200 (OK) for a successful request.
 * HTTP 500 (Internal server error) for any other backend-related errors.

