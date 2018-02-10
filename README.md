# polling-system

> A Sample Polling System for SCMP.com
> I'm at the 4 hour mark.  

# Assumptions
- users aren't logged in.  We'll use a device fingerprint to ensure people don't vote more than once on single type answers (I'm not sure how to test device fingerprints so will leave it out until end-- more research needed)

# Todos
[x] create mock data
[x] setup basic layouts
[x] create local graphql server
[x] add apollo for graphql client
[x] add bulma for basic styling
[] customize bulma to match target ui (in progres)
[] draw graphs with canvas
[] test, test, test half done


# Next Steps

## Build Setup

``` bash
# install graphcool

# start local Graphcool cluster
$ graphcool local up

# deploy graphql locally
$ cd server
$ graphcool deploy
# select local

# add simple API uri to apollo/client-configs/default.js on line 11
```

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```
