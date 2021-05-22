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

IndexDB for our implementation of our website would work best because of it’s ease of use

### Positive Consequences

* Allows JS team to further implement feature of the website
* Implements critical feature of web app

### Negative Consequences

* Learning curve could end up slowing down team in general

### Pros and Cons of using IndexDB
* Good, because CS 110 staff can provide support using IndexDB
* Good because IndexDB is recommended by staff
* Good, because IndexDB will easier to learn than other options
* Bad, because indexDB uses local storage, thus the user can’t access journal from other devices
* Bad, because no one on Database team is comfortable with indexDB yet

