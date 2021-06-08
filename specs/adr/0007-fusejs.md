# Including Fuse.js as a dependency for fuzzy search
* Status: accepted <!-- optional -->
* Deciders: Noah Teshima, Yuzi Lyu <!-- optional -->
* Date: 2021-06-02 <!-- optional -->
* Technical Story: As a developer for team RIVER, I want an easy and fast library for fuzzy search so that we can reduce the upfront cost for unit testing and integrate search functionality in one sprint <!-- optional -->
## Context and Problem Statement
During the design phase for our bullet journal, we included the ability to perform search queries against a user's daily logs and collections. We intend for this functionality to include the ability to perform "fuzzy searches", in which queries with some degree of similarity to our query will be included in our search results. Given that search functionality is a stretch goal during our final sprint, we are interested in using [Fuse.js](https://fusejs.io/), which is a client-sided fuzzy-search library for this exact purpose.

## Decision Drivers <!-- optional -->
* Search functionality has been a stretch goal for our bullet journal. While we included it in the last iteration of our design phase, we spent all but the final sprint focusing on refining our minimum-viable product, which included every aspect of the bullet journal except search.
* This feature must be designed and implemented in one sprint. Given that we are implementing this feature at the beginning of week 10, we must carefully take into consideration how much effort is invested into the fuzzy search algorithm itself (i.e. whether it should be built in-house by one of our team members or included as a dependency).
## Considered Options
* Develop our own search algorithm.
* Include Fuse.js as a dependency
* Remove search from our bullet journal
## Decision Outcome
Chosen option: We decided to include FuseJs, because of the time constraint imposed during the final sprint of this project, in addition to the cost imposed by developing and unit-testing our own search algorithm. Furthermore, since this decision makes search feasible in one sprint, we decided not to remove search from our bullet journal.
### Positive Consequences <!-- optional -->
* Fuse.js is a lightweight module. On the node package manager, Fuse.js [does not have any additional dependencies](https://www.npmjs.com/package/fuse.js/v/3.4.3). The cost in the added loading time can be further mitigated by adding minification to our build process.
* Using a dependency for a large feature during the last sprint helps us to manage scope creep. Due to the focus put into the other aspects of our bullet journal, we are now presented with the issue of wishing to include search in one sprint. Using Fuse.js mitigates a sigificant portion of the work we must include in order to include the intended search feature.
* Fuse.js reduces the amount of unit testing we need to do. Fuse.js is a well-tested library for client-sided search functionality. Since this part of our search feature is not being implemented in-house, the amount of unit testing needed reduces significantly.
### Negative Consequences <!-- optional -->
* Fuse.js is still a third party dependency. Nothing much beyond minification can be done in order to reduce the cost in loading times to the end user for including this library. This also means that if the recent build for Fuse.js fails, then the search feature on our application will be negatively impacted.
## Pros and Cons of the Options <!-- optional -->
### Develop our own search algorithm
Instead of resorting to a dependency, we considered writing our own search algorithm.
* Good, because in the instance where our build fails due to an issue with search, we won't be blocked by non-functional third party dependencies.
* Good, because writing our own search algorithm ensures we are only including the search functionality that is needed in our bullet journal.
* Bad, because this solution requires two sprints to design, implement, and unit test.
### Include Fuse.js as a dependency
To reduce the upfront costs of the search feature, we can include Fuse.js as a dependency to lighten the workload.
* Good, because the use of Fuse.js makes search feasible during the final sprint.
* Good, because Fuse.js does not require additional dependencies to function.
* Good, because Fuse.js is a relatively lightweight module at [~28kB unpacked](https://www.npmjs.com/package/fuse.js/v/3.4.3). This can be further optimized with minification, or caching with service workers.
* Bad, because Fuse.js is ultimately a dependency we are introducing to our end user. This dependency further compounds the loading time for
our web application.
* Bad, because we are presented with a blocking issue in the instance where the recent build for Fuse.js fails.
### Remove search from our bullet journal
We also considered just completely scrapping search from our bullet journal.
* Good, because this allows us to refine our minimum viable product. This means the core functionality we have can have more E2E testing, we can integrate responsive design into the styling, etc.
* Bad, because this contradicts the high-fidelity design we agreed on during our design phase.
