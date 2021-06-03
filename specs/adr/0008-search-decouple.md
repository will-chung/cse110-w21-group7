# Decoupling search from navigation into its own page
* Status: accepted
* Deciders: Noah Teshima, Yuzi Lyu
* Date: 2021-06-03
* Technical Story: As a user, I want a way to search through my bullet journal so that I can quickly and easily navigate to past entries.
## Context and Problem Statement
From our high-fidelity wireframes, we addressed that search would be included directly from the navigation menu on each page. However, the navigation menu does not offer enough screen real estate to conduct search efficiently. How can we make search easier for the user?

## Decision Drivers <!-- optional -->
* Search should be as easy and accessible as every other navigation point in our application
* Search should have room for a form element, which helps with filtering searches by case sensetivity, daily logs/collections, etc.
## Considered Options
* Keeping the search functionality coupled inside of the navigation menu
* Decoupling search into a page `search.html`
## Decision Outcome
Chosen option: We decided to decouple search into a page `search.html`, since the navigation menu does not have enough screen real-estate to justify the use of a form to filter searches.
### Positive Consequences <!-- optional -->
* Search is now it's own page and has enough real estate to show search results across the entire page instead of the navigation menu.
* Search now has screen real estate to justify including a form for filtering searches (i.e. filter by daily-logs/collections, case-sensitive, etc.).
### Negative Consequences <!-- optional -->
* Search requires an additional click to access from anywhere in our application.
## Pros and Cons of the Options <!-- optional -->
### Keeping the search functionality coupled inside of the navigation menu
We considered keeping search inside of the navigation menu.
* Good, because search can be immediately accessed on every page of our application.
* Bad, because (due to the size of the navigation menu), search will not be able to include a form to filter search results.
### Decoupling search into a page `search.html`
We considered decoupling the functionality for search from the navigation menu into it's own page `search.html`.
* Good, because we now have the proper screen real estate in order to implement a form for filtering search results.
* Bad, because search is now an additional click away on every page of our bullet journal.
* Bad, because this change impacts our architecture (C4) diagrams. These will need changing before proceeding with implementation.
