# polling-system

> A Sample Polling System for SCMP.com
> I'm at the 4 hour mark.  
> did a little more cleanup this morning.  The assignment is now close to feature complete.  Of course there are plenty of next steps, including writing many more tests. 
> Thanks for taking the time to look at my work.  I look forward to speaking with you about it.

# Assumptions
- users aren't logged in.  We'll use a device fingerprint to ensure people don't vote more than once on single type answers (I'm not sure how to test device fingerprints so will leave it out until end-- more research needed)

# Todos
[x] create mock data
[x] setup basic layouts
[x] create local graphql server
[x] add apollo for graphql client
[x] add bulma for basic styling
[x] customize bulma to match target ui (in progres)
[x] draw graphs with svg
[] test, test, test half done


# Next Steps
I'd like to spend more time on tests.  I'd also like to build a more robust system for tracking previous votes.  

## Build Setup

``` bash
# install graphcool

# start local Graphcool cluster
$ graphcool local up

# deploy graphql locally
$ cd server
$ graphcool deploy
# select local

# add simpleAPI uri as 'SIMPLE_API' to environment variable
```

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

seed initial data by loading the grapql playground in the browser and sending the mutations
```
