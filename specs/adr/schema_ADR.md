# Schema Format

* Status: proposed 
* Deciders: Alvin Wang
* Date: 2021-05-20 


## Context and Problem Statement

The following is documenting the decisions we made about how we formatted the schema and the reasons behind it

## Decision Drivers

* Implementing a schema model to account for all the information we need for the bullet journal

## Considered Options

* Current schema

## Decision Outcome

* Current schema

### Positive Consequences

* Schema includes all information required for bullet journal, including name, collections, and daily logs.

### Negative Consequences

* May be a bit large as there are lots of moving parts.

### 1. Collections

An array of objects with three properties: type, images, and videos.

* Good, because users can have a description, image, and video for each collection.
* Good, because there is an array of collections so it's easy to add more collections.
* Bad, because you can only have up to one image and one video per collection.

### 2. Daily Logs

An array of objects for daily logs, each with properties representing the events, tasks, notes, and mood for that day.

* Good, implemented events, tasks, notes, and mood, which are needed for daily logs.
* Good, because there is an array of daily logs so it's easy to add more daily logs.
* Bad, schema for this part is a bit on the messy side, might be a bit harder to understand but includes all the information needed.

## Automatic Migration  
When a user starts a new bullet journal, will automaticaly create an empty schema object and can eventually be filled out by users through the bullet journal.
* Good, because allows user to start with a blank bullet journal and add whatever they need.