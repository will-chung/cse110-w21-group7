# Collections Format

* Status: accepted 
* Deciders: Alvin Wang, Zhiyuan Zhang, Yuzi Lyu
* Date: 2021-05-04


## Context and Problem Statement

The following is documenting the decisions we made about how the collections page will be designed and the reasons behind it.  
* Collections are places to track various activities (i.e. exercise, water, etc.) 

## Decision Drivers

* Implementing a clean interface for collections

## Considered Options

* Various options in the [Miro Fat-Marker Sketches](https://miro.com/app/board/o9J_lLcA_EQ=/)
* Post-It Notes

## Decision Outcome

Grid of Post-It Notes, each linking to a different collection

### Positive Consequences

* Organized and structured collection interface
* The collection selector is not cluttered

### Negative Consequences

* No preview of each collection before entering it

### Collections Home Page

Allows users to quickly navigate into collections and add collections with the button on the bottom right corner of the screen.

* Good, because users can easily add new collections and navigate into collections
* Good, because the design incorporates the idea of minimalism so the whole display is neat.
* Bad, It can only display a few collections at one time, so it can be hard to find the one collection you are looking for if there are many collections.


### Collections Individual View

This enables the users to view all their collections they created. There will be three collections in a row with a certain gap to each other so that it is easier for the users to spot the collection they need. The users can navigate to the collections by simply clicking on the collection.
* Good, because users can zoom in to individual collections to view the information for that collection easily.
* Bad, because users can’t view collections side by side.

### NavBar

Home button that can take the user back to the index page of the website. Settings button that is used to modify the collections' names or delete collections. Navigate button that can take the user to the daily log page. These functions are all necessary in the collection homepage but having so many buttons on the page contradicts our idea of minimalism. Therefore there is a navigation bar on the right side of the screen where the user can expand the navigation bar themselves and find all the buttons above.
* Good, because the navigation bar includes the buttons for all the functions necessary and it preserves minimalism.
* Bad, because there are only icons of the buttons but not names, so it might be a bit confusing for the users to use at first.

### Upload image button / upload video button

These are the two buttons on the bottom of the page in the image / video sections where the users can upload their images and videos onto the collection.
* Good, because it’s easy to use the buttons to upload relevant images and videos
* Bad, having two buttons with similar functionalities on the screen kind of contradicts the ideal of minimalism.


## Automatic Migration  
When a user creates a collection, will automatically create new Post-It and allow users to fill out information and upload files.
* Good, because it allows users to easily create new collections.
* Bad, because the users cannot see the information other than the name from the Home page view after they created a new collection.
