# Collections Format

* Status: proposed 
* Deciders: Brett Herbst, Alvin Wang, Rachel Doron
* Date: 2021-05-21


## Context and Problem Statement

The following is documenting the decisions we made about what package the database team would use to implement the database for the website

## Decision Drivers

* Storing user’s data is critical to the function of the website, without memory all the user’s logs would be deleted, thus we must find a way to store the user’s data

## Considered Options

* MongoDB
* NeDB

## Decision Outcome

IndexDB for our implementation of our website would work best because of it’s ease of use, in addition to the fact that it can be introduced during some of the labs for this course.

### Positive Consequences

* Allows frontend team to further implement feature of the website
* Implements critical feature of web app

### Negative Consequences

* Spike task: we would have to dedicate some of the people in our group to learning indexedDB. This could take at least one sprint to get comfortable with, and consequently cause blocking issues for everyone else.

### Pros and Cons of using IndexDB
* Good, since indexedDB is introduced during some of the labs for this course, the CS110 staff can provide support for any indexedDB-related questions
* Good because IndexDB is recommended by staff for those new to database programming
* Good, because (due to the added support from the CSE110 staff) IndexDB will be easier to learn than other options. indexedDB also includes a great guide to [getting started](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
* Bad, because indexedDB uses local storage, thus the user can’t access journal from other devices
* Bad, because no one on Database team is comfortable with indexDB yet. This will introduct a spike task for a couple group members

