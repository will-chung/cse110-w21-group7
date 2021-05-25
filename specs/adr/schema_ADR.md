# Schema Format

* Status: proposed 
* Deciders: Alvin Wang, Noah Teshima
* Date: 2021-05-20 


## Context and Problem Statement

The following is documenting the decisions we made about how we formatted the schema and the reasons behind it. We have included sections regarding the technical tradeoffs presented in our decisions, in addition to how this potentially impacts us in future sprints.

## Decision Drivers

* Implementing a schema model to account for all the information we need for the bullet journal. Having a schema provides a layout for how we can perform read/write transactions with a user's bullet journal data. Consequently, including an ADR will promote transparency for everyone on our team and subsequently make handing responses from our backend much easier.

## Considered Options

* Current schema

## Decision Outcome

* Current schema

### Positive Consequences

* Schema includes all information required for bullet journal, including name, collections, and daily logs.
* The schema has been minimized to only the core components required to make our bullet journal work; this implies that the ramp up time for people making transactions with indexedDB will not have as many questions about the structure of our schema

### Negative Consequences

* Intended to be used as a batch response from indexedDB. Note that our schema contains all the bullet journal information regarding a single user. Performing read/write trasnactions with indexedDB will consequently happen on all the bullet journal information for a user, regardless of which part of the schema we actually need to read/write to.
* No way to preserve order. With the way we are storing tasks/notes/events for this schema, there is currently no easy way to preserve the order in which entries were written onto the comprehensive view of the daily log. This is due to the fact that only events are intended to have a UNIX timestamp field (labeled `time`) associated with them.

### 1. Collections

An array of objects with three properties: type, images, and videos. Below is an example of the structure of a response for collection data:

```
"collections": [{
  "type": "array",
  "name": "Collection one",
  "items": [
    {
      "type": "string",
      "images": "image",
      "videos": "video"
    }]},
   { "type": "array",
   "name": "Collection two",
   "items": [
   {
    "type": "string",
    "images": "image",
    "videos": "video"
    }]},
    {
      "type": "array",
      "name": "Collection three",
      "items": [
        {
          "type": "string",
          "images": "image",
          "videos": "video"
        }]
  }
]
```

* Good, because users can have a description, image, and video for each collection.
* Good, because there is an array of collections so it's easy to add more collections.
* Bad, because you can only have up to one image and one video per collection.
* Bad, this introduces a spike task for one of our teammates that will have to figure out how to add images/video to an indexedDB database. [This](https://developers.google.com/web/updates/2014/07/Blob-support-for-IndexedDB-landed-on-Chrome-Dev) is an example with Blobs that can be used for guidance once we start working on the related issue.

### 2. Daily Logs

An array of objects for daily logs, each with properties representing the events, tasks, notes, and mood for that day. From our schema, the manner in which we structure daily logs is as follows:
```
"daily-logs": [
        {
          "type": "object",
          "required": [ "date", "description" ],
          "properties": {
            "date": {
              "type": "string",
              "time": "1621721543299",
              "description": "The date of the event."
            },
            "events": [
              {
                "description": "Get groceries",
                "logType": "event",
                "time": "1621718384658"
              },
              {
                "description": "Walk dog",
                "logType": "event",
                "time": "1621729208633"
              }
            ],
            "tasks": [
                {
                  "description": "Study for midterm",
                  "logType": "task",
                  "finished": true
                },
                {
                  "description": "Weeknight meal prep",
                  "logType": "task",
                  "finished": false
                }
            ],
            "notes": [
              {
                "description": "I should send a card for Jordan's birthday.",
                "logType": "note"
            }
          ],
          "reflection": [
            {
              "description": "Today was a good day. I got a lot of work done.",
              "logType": "reflection"
            }
          ],
            "mood": {
              "type": "number",
              "multipleOf": 1,
              "minimum": 0,
              "exclusiveMaximum": 100,
              "value": 20,
              "description": "Daily mood on a range of 0-99."
            }
          }
      }]
```

In this response, we have that the field labeled by the key `time` denote a UNIX timestamp corresponding to the instance in which a daily log was created. For the log presented here, the value for `time` would indicate that the daily log was created with a UNIX timestamp of `1621721543299`

* Good, since all the necessary components for the daily log (tasks, notes, events, reflection) are compartmentalized and easy to access
* Good, because daily logs are stored inside an array with the same structure, allowing us to sort with routines such as [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
* 
* Bad, schema for this part is a bit on the messy side, might be a bit harder to understand but includes all the information needed.
* Bad, since there is no easy way for us to set up key/value mappings with object stores in indexedDB. This puts a lot more pressure on us to sort entries ourselves.
