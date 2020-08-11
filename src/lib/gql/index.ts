import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client/core'
import type { Image } from '@lib/types'

const httpLink = createHttpLink({
    uri: 'https://localhost:4000/',
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink,
})

const IMAGE_FRAGMENT = `
    id
    labeller
    status
    github
    url
`

const UNCLAIMED_QUERY = gql`
    query {
        unclaimed {
            ${IMAGE_FRAGMENT}
        }
    }
`

const IMAGE_QUERY = gql`
    query image(id: ID!) {
        image(id: $id) {
            ${IMAGE_FRAGMENT}
        }
    }
`

export const getImage = async (id: string): Promise<Image> => {
    const { data, errors } = await client.query({ query: IMAGE_QUERY, variables: { id } })

    return data.image
}

export const getUnclaimed = async (): Promise<Image> => {
    const { data, errors } = await client.query({ query: UNCLAIMED_QUERY })

    return data.unclaimed
}