# Indexing Format

* Status: proposed 
* Deciders: Thanh Tong, Brett Herbst
* Date: 2021-04-30 


## Context and Problem Statement

The following is documenting the decisions we made about how the indexing page will be designed and the reasons behind it

## Decision Drivers

* Implementing a clean interface for index

## Considered Options

* See options on Miro
* Bookshelf
* Calendar view
* Indexing by year (past, present, future)

## Decision Outcome

Thanh’s fat market sketch

### Positive Consequences

* Clean/simple index interface

### Negative Consequences

* No qualitative indexing on the direct home screen (on the navbar instead)

### 1. NavBar

Allows users to quickly view their settings, or find logs, collections, and upcoming tasks.

* Good, because users are able to easily access their settings
* Good, because users can easily see what their upcoming tasks are, or find specific logs/collections/tasks using the search bar 
* Bad, because users may not think about using the navigation bar on the index page. Their first instinct is probably to use the bookshelf.

### 2. Bookshelf

See point 2 in index png. Storing monthly indexes as “Books” on a shelf. When you click on a given book’s month, it will access that month’s 1st weekly log().

* Good, Easy to read/understand
* Good, Immersion of using a real book
* Bad, need lots of logs or else shelf looks empty

### 3. “Jump to” Button

See point 3 in index png. Allows user to quickly view weekly or daily log for today’s date

* Good, allows user to rapidly see current tasks/events
* Bad, User could confuse this with the Rapid log button

### 4. Rapid Log Button

See point 4 in index png. Allows users to create a new daily log easily.

* Good, because users don’t need to go through multiple steps to create a daily log.
* Good, because it is right on the index page for users to see and use.
* Bad, because users could confuse this with the “Jump to” button and may accidentally click on this when they actually just mean to go to their daily/weekly log that they have already created.
* Bad, because users could accidentally click on this button without meaning to create a new daily log

### 5. Collections Button

See point 5 in index png. Allows users to quickly access their custom collections page.

* Good, if user wants to quickly add something to their collections for today, this button allows for that
* Good, simplifies the path to collections page


## Automatic Migration  
When a user creates a log for a new month, will automaticaly create new book for that month  
* good, because allows user to access logs for this new month

