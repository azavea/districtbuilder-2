# Serverless Technology ADR

## Context

District Builder 2 was designed to be a mostly-frontend version of the original tool. However, the tool must have user accounts and users must be able to save their maps. So even with the redesign, the app must support authentication and data persistence. Instead of deploying a long-lived service, the team was excited to build the backend using serverless technologies. This ADR details the options we evaluated and the final decision made. 

## Decision

* Option 1: AWS Amplify [aws-amplify.github.io](https://aws-amplify.github.io) - [Full evaluation](https://github.com/azavea/amplify-spa-example/blob/master/README.md)

AWS Amplify is a suite of tools created by Amazon to assist with initial setup of a serverless web application using AWS resources. It includes JavaScript libraries to abstract interaction with AWS resources as well as provides framework for local development testing using real AWS resources such as Cognito User Pools and DynamoDB storage. There is also an AWS Console service for automated CI/CD deployment from configured branches in a Github or other major Git service repository. AWS Amplify uses CloudFormation heavily, which has the benefit of portability should a project expand beyond the capabilities of AWS Amplify, but does mean that after the initial automated setup process AWS Amplify has a steep learning curve for customizing the resources beyond their default application.

* Option 2: Architect [arc.codes](https://arc.codes) - [Full evaluation](https://github.com/azavea/arc-notes-example/blob/master/README.md)

Architect is an opinionated framework that sits atop AWS. It values convention over configuration and has a declarative style. The basic idea of Architect is that you define a `.arc` file which describes the structure of your app. It is there that you define the app name, endpoints (API Gateway/Lambda functions), tables (DynamoDB), and static assets (S3 buckets). Once you've done that, you simply run `npx create` to build out your project directory structure and deploy to staging. To deploy changes, you use `npx deploy`.

* Option 3: Zeit Now [zeit.co/now](https://zeit.co/now) - [Full evaluation](https://github.com/shreshthkhilani/royal-squid/blob/master/README.md)

Ziet Now is the only option on the list that is not a framework to deploy to AWS. Rather, it is an IaaS tool (similar to Netlify). Now is a very sophisticated (and relatively new) tool that helps you host static web applications as well as lambdas (in pretty much any language*) in a single place. It integrates well with GitHub, allows for secure storing and using of app secrets, lets you scope deployments to a team or to a user, provides CI/CD, and also distributes the static bundles and lambdas globally on their CDN. 

|                                                                                            | Amplify                                                                                                                       | Architect                                                                                                                                                    | Zeit                                                                                                                          |
|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| How does the service work in a development environment?                                    | Amplify provides logic for using AWS cloud resources everywhere, including in a namespaced environment for local development. | Architect has nice support for local development via `npx sandbox`. This runs a Node server locally and simulates DynamoDB via an in-memory key-value store. | Currently we need to bootstrap our own local environment. `now dev`, a soon-to-be-released CLI command will make this simple. |
| Does the service scale well (Pricing, max capacity, etc)?                                  | Yes, Amplify uses AWS resources and has virtually unlimited capacity, and pricing is competitive.                             | Yes. If you’re just using Architect (the open source framework) there is no added cost beyond the price of AWS.                                              | Yes. Static assets and lambdas are available on all regions and the pricing model is pay-as-you go per invocation.            |
| Does the service provide/can it integrate with a key/value store like DynamoDB?            | Yes, Amplify has direct compatibility with DynamoDB, though integration can be complex                                        | Yes. Architect provides helper packages which wrap the AWS client for DynamoDB to make this interaction easy.                                                | The lambdas can work with any database through the database's driver for the language the lambda is written in. This would require passing the database secrets to the lambda.|
| Does the service provide a user authentication tool?                                       | Yes, Amplify has integration with AWS Cognito                                                                                 | No, not out of the box. There is support for sessions but you are responsible for authentication, though there are tutorials on how to do this.              | We would need to use 3rd-party tool like Auth0.                                                                               |
| How will the selection affect the front end code? Will compatibility require code changes? | Some code changes, but Amplify would generally sit beside static assets (So long as there is a build command)                 | The frontend code would just need to make calls to the API endpoints as it would for a typical “serverful” architecture.                                     | We would have to correctly configure the app to be deployed via Now, which doesn’t seem too complex.                          |


* Decision

Zeit Now was the serverless option picked. Amplify wasn’t picked because it is currently being tried out in a project at Azavea and we thought it would be best to try a new serverless technology as a company. Between Architect and Now, comparison seemed like comparing apples to oranges. Architect is a framework and Now is an IaaS tool. The final decision included considerations about Now seeming to be further along and more feature-complete: Architect is being built to be used by another IaaS service [Begin](https://begin.com), which is still currently in a private beta, and additionally, Zeit is a much larger company with other popular open-source offerings such as Next.JS. 

## Status

Accepted by GI Team

## Consequences

* Inexperience with Serverless and NoSQL databases 

As an organization (and a team), we don’t have any experience with technologies such as Serverless and NoSQL. These are tools we’d be using for the first time and though we’re excited to use them, there will be a learning curve to account for. 

* Build our own local environment (for now)

One of the worst things about Now is that we need to find a way to locally run the lambdas and the static code ourselves. A Now CLI command to do this is currently a WIP feature (although there is a pull request up and it seems very close) and until that becomes a reality, it’s our job to bootstrap. This involves writing some boilerplate, but is far from impossible. People in the community have scripts they use to do this for lambdas in Node. 

* Learn and figure out how user/team scoping works 

Another consequence is that unlike Amplify and Architect, we aren’t using AWS directly. This means that we need to do some work to figure out how Now deploys work for different users and different environments. This, again, seems to be something that Now has thought about––but is something we need to think about so we know the extent of what Now offers and how to implement it.

