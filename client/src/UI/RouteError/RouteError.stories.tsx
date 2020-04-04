import { ApolloError } from "apollo-client"
import React from "react"
import RouteError from "./RouteError"
import RouteGraphQLError from "./RouteGraphQLError"
import RouteNotFound from "./RouteNotFound"

export default {
  title: "Route/Error",
}

export const Default = () => <RouteError />

export const NotFound = () => <RouteNotFound />

export const QueryError = () => (
  <RouteGraphQLError error={new ApolloError({})} />
)

export const NetworkError = () => (
  <RouteGraphQLError error={new ApolloError({ networkError: new Error() })} />
)