// Here are your GraphQL Endpoints:
//   Simple API:        http://localhost:60000/simple/v1/cjdh1zc4x00040166ffqq0fgc
//   Relay API:         http://localhost:60000/relay/v1/cjdh1zc4x00040166ffqq0fgc
//   Subscriptions API: ws://localhost:60000/subscriptions/v1/cjdh1zc4x00040166ffqq0fgc

import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default (ctx) => {
  const httpLink = new HttpLink({ uri: 'http://localhost:60000/simple/v1/cjdh1zc4x00040166ffqq0fgc' })

  return {
    link: httpLink,
    cache: new InMemoryCache()
  }
}
