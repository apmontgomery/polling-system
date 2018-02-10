# polling-system

> A Sample Polling System for SCMP.com

# Assumptions
- users aren't logged in.  We'll use a device fingerprint to ensure people don't vote more than once on single type answers (I'm not sure how to test device fingerprints so will leave it out until end-- more research needed)

# Todos
[x] create mock data
[s] setup basic layouts
[] create local graphql server
[] add apollo for graphql client
[] add bulma for basic styling
[] customize bulmla to match target ui
[] draw graphs with canvas
[] test, test, test


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
