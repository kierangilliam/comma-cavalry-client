import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client/core'
import { DEV } from '@lib/constants'
import type { Image } from '@lib/types'

const httpLink = createHttpLink({
    uri: DEV
        ? 'http://192.168.1.70:4001/'
        : 'http://159.65.74.112:4001/'
    ,
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
    depthMapUrl
`

const UNCLAIMED_QUERY = gql`
    query {
        unclaimed {
            ${IMAGE_FRAGMENT}
        }
    }
`

const IMAGE_QUERY = gql`
    query image($id: ID!) {
        image(id: $id) {
            ${IMAGE_FRAGMENT}
        }
    }
`

const SUBMIT_MASK_MUTATION = gql`
    mutation submitMask($id: ID!, $name: String!, $email: String!, $mask: String!) {
        submitMask(name: $name, email: $email, mask: $mask, id: $id) 
    }
`

export const getImage = async (id: string): Promise<Image> => {
    const { data, errors } = await client.query({ query: IMAGE_QUERY, variables: { id } })

    return data.image
}

export const getUnclaimed = async (): Promise<Image> => {
    const { data } = await client.query({
        query: UNCLAIMED_QUERY,
        fetchPolicy: 'network-only',
    })

    return data.unclaimed
}

export const submitMask = async (id: string, name: string, email: string, mask: string): Promise<String> => {
    const { data } = await client.mutate({
        mutation: SUBMIT_MASK_MUTATION,
        variables: { name, email, mask, id }
    })

    return data.submitMask.message
}