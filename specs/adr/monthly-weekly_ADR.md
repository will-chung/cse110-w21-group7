# Monthly/Weekly Index Format
- status: [proposed] 
- Deciders: Rachel Doron, Katherine Baker 

## context and problem statement 
the following is documenting the decisions we made about how the monthly and weekly index page will be designed and te reasons behind it. 

## Decisions drivers 
want the monthly and weekly index to be an overview page so that the user can easily navigate to a more specific page

## considered options 
- only having monthly log 
- only having weekly log 
- having a monthly log and weekly log 

## Decision outcome 
- have the monthly log and weekly log side by side 
- monthly log will not show events and TODO's
- weekly log will display events and TODO's 

### Postive consequences 
- easy to nagivate monthly and weekly index 
-  monthly calendar provides easy date navigation
-  weekly calendar gives user ability to see tasks and to-do's for each day in a given week

### Negative Consequences 
- user cannot see how busy their schedule looks like a whole throughout the month 

### Viewing Events and TODO's 
- This enables the user to view their set plans and what they have to do on each day. Users are able to view their events and TODO's in their weekly log 
  
- good, because users can see what their week schedule looks like a a whole 
- bad, because user may want to edit their event or TODO's on the weekly log but to do so they have to click the date on top of the weekly log to redirect them to the daily log 
- good, becuase user can view their events and TODO's for each day 

### Toggling To-Do's
- Each to-do is a button that enables the user to toggle between complete and incomplete.
  
- good, because we don't allow for direct modification of the To-Do itself as this page is meant to be easy to view and modification elements would make viewing harder.
- good, because if you want to modify you are able to navigate to the daily log so this is not a loss of functionality
​
### Daily Log Navigation
- We put this at the top where (Day MM/DD) is written as it is intuitive that the date leads to itself
  
- good, beucase we do not want clicking the To-Do to lead to modification because doing so would making toggling harder
  - You would have to click the small bullet to toggle if we used this method
- good, because having this button makes it reasonable to make the weekly log primarily view only
​
### Monthly Log Date Buttons
- This enables you to easily navigate to the week of any day in a month
  
- good, beucase we always navigate (Sun-Sat) because most people operate their plans on a start to end of week basis
  
### Monthly Forward and Backward
- This enables you to easily navigate further in the past of future
  
- good, because this is essential for planning bigger projects, plans (fast and future) for reference, and to-do's that can be set later
- bad, because user cannot easily skip to a month very far ahead in the future, they have to have to go through every month
  - ex: currently looking at Jan 2020 and want to see Dec 2020 have to click through all the months in between 
​
### Automatic Migration
- At the end of the day if a to-do is not marked as completed it is assigned to the following day


- good, because this is because it is worse to forget to do a task than for a task that is no longer needed to show up on a given day 
- good, because with migration the to-do will not get lost when we get to the next week so the user is reminded that something has not been done 



