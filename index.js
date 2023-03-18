const request = require("request");

// Set the JIRA API URL and authentication credentials
const jiraUrl = "https://tandem-chat.atlassian.net/rest/api/3";
const username = "tim@tandem.chat";
const password =
  "ATATT3xFfGF0pJmNeh0Z3mJfELd9yR5DL4ZLi_Lu85hfiIj-mPkHfoBwJwRKTUCdPHjlM8FpbnpczBdYhMMuVClrn-eO_2EuO5QYsvBigxFWar_GPhAJ5ZCWHVpIwZCTzPDzLBr7a4BlWaOiVmev8zkyf04tDNb0Rv5skYMrpFZBS-R-dYKzVyI=339B84F5";

// Define a function to make a GET request to the JIRA API
function getJiraData(endpoint, callback) {
  const options = {
    url: `${jiraUrl}/${endpoint}`,
    auth: {
      user: username,
      pass: password,
    },
    json: true,
  };
  console.log(options.url);

  request.get(options, (error, response, body) => {
    if (error) {
      callback(error);
    } else if (response.statusCode !== 200) {
      callback(new Error(`Unexpected status code: ${response.statusCode}`));
    } else {
      callback(null, body);
    }
  });
}

// Example usage: Get the list of issues in a JIRA project
console.log("getting...");

getJiraData("issue/TAN-1", (error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});
