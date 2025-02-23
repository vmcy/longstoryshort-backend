# longstoryshort-backend
Backend for Long Story Short (https://lss99.org), a simple and minimalist URL shortener.

## About
- Built with Node.js
- Infrastructure: AWS Serverless Application Model (SAM)
  - Lambda (function)
  - API Gateway (API endpoint)
  - DynamoDB (database)
  - Cognito (OAuth2 authentication)
 
## Code Summary
The backend contains two main functions which is located in the file `app.mjs`.

<br/>The first function is `shortenUrl`:
- Expect body parameter `url` which represents the original URL that needs to be shorten
- Checks if `url` is a valid URL format
- Using `randomBytes` function, it generates a 8-characters base36 (a-z, 0-9) ID to represent the shorten URL
- Lastly, inserts a row into DynamoDB for future extraction. Each row consists the following data:
  - Unique 8-character base36 ID
  - Original URL
  - Created Timestamp
  - Expiry Timestamp (Utilising DynamoDB's TTL feature, row will be automatically deleted after 30 days)

<br/>The second function is `expandUrl`:
- Expect query parameter `shortid`
- Query DynamoDB to retrieve the original URL

<br/>Unit testing is located in the file `tests/units/test-handler.mjs`
- Mock data is located in the folder `events`
 
## Usages
Initial development setup
- [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Install AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- Run `aws configure` to setup your AWS admin access credentials
- Run `npm install` to install development dependencies such as mocha and chai for unit testing


<br/>Unit testing
```
cd longstoryshort
npm test
```
<img width="342" alt="Screenshot 2025-02-20 at 12 01 01 AM" src="https://github.com/user-attachments/assets/dde85e89-db70-4b86-99d9-fe5c36222eb9" />

<br/>Deployment to AWS using SAM
```
sam build
sam deploy
```

## Architecture Diagram
![longstoryshort-backend-dark](https://github.com/user-attachments/assets/a967d08b-be33-489a-8c04-1a9ddebca529)

## API Security
- CORS policy to only allow origin from https://lss99.org
- OAuth2 authentication whereby access token will expire after 1 hour

## Considerations During Design Phase
EC2 or Serverless?
- While it is easier to develop for deployment in an EC2, Serverless was chosen for it's performance, cost, and scalability.
- Assuming the website traffic is low, Serverless will cost significantly lesser due to on-demand usage pricing, whereas EC2 will incur billing even when it is idling.

PostgreSQL (relational) or DynamoDB (non-relational)?
- Since this url shortener application uses a simple key-value lookup, utilising DynamoDB's performance and scalability is a better approach.
- DynamoDB handles high volume of read/write operations more efficiently.
- If there is traffic surge, DynamoDB can be configured to scale up automatically without any downtime.

8-character short URL ID
- Initially, there is concern where 8-character base36 short URL ID is not sufficient to avoid duplicates.
- Increasing the number of character is not an ideal solution because it defeats the purpose of url shortener.
- After analysing, with 30-days data expiry and 2.82 trillion possible combination for the ID, the chances of duplicate is highly unlikely.

## Potential Enhancements
- Use Redis to store and extract frequently accessed short URLs
- Implement short URL visit counter for analytic purposes
- Enable AWS Web Application Firewall (WAF) for cyber attack prevention, especially DDOS attack
- Allow user to create account and view historic short URLs creation
- Allow user to input alias to represent the short URL ID (instead of random 8-character)
