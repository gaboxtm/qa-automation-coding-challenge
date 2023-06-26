(Add your list of flows here)

The "Happy Path" or critical path is the main goal of the app, so this is the most important part of the validation because is what the app "should do".
Usualy this is where the value is generated for us and our users, that's why we always need to be sure that this works as expected.
Validating using the API response as the expected value we make sure that there is no "noise" introduce by our front end and that the data provided by the API is displayed correctly

Then we have the negative scenarios where we validate that our app can guide our users to use our app the "way should be used".
We need to validate that we handle unexpected responses/errors in a way that we provide enough feedback to the users so they know what to do next.
## Happy Path
1. Enter a valid github username and click `Go` button
    Test Data: `gaboxtm` 
    Expected: Should return 4 repos under this username and show briefly a `Success` message 
        Clicking on the first repo should open a new tab and redirect to github and the url should contain github.com and /${firstRepoName}
2. Enter a valid github username and press `Enter` Key
    Test Data: `tnass` 
    Expected: Should return 1 repo under this username and show briefly a `Success` message 
        Clicking on the first repo should open a new tab and redirect to github and the url should contain github.com and /${firstRepoName}
3. Call the API "https://api.github.com/users/${username}/repos" directly using the PW framework
    Test Data: `gaboxtm`
    Expected: The response properties `name`, `description`, `html-url` should match the values that are displayed on the result section and in the case of the `html-url` should be the one that is displayed after clicking on the repo name
## Negative Scenarios
1. Empty username provided and click "Go" button
    Test Data: Left empty
    Expected: Should briefly display the message `Github user not found` and show `No repos` on the result section
2. Turn internet off before clicking "Go" button
    Test Data: `gaboxtm`
    Expected: Should display the generic message `Something went wrong`



