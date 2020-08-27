import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core'
import { DEV } from '@lib/constants'
import type { Image, Images, PullRequest } from '@lib/types'
import { createUploadLink } from 'apollo-upload-client'

const httpLink = createUploadLink({
    credentials: 'include',
    uri: DEV
        ? 'http://192.168.1.70:4001/'
        : 'https://chompsberg.com/'
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

const PR_FRAGMENT = `
    id
    state
    url
    number
    files {
        id
        filename
        maskURL
        imageURL
    }
`

const UNCLAIMED_QUERY = gql`
    query {
        unclaimed {
            ${IMAGE_FRAGMENT}
        }
    }
`

const IN_PROGRESS_QUERY = gql`
    query inProgress($username: String!) {
        inProgress(username: $username) {
            images {
                ${IMAGE_FRAGMENT}
            }
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

const OPEN_PRS_QUERY = gql`
    {
        openPullRequests {
            pullRequests {
                ${PR_FRAGMENT}
            }
        }
    }
`

const PR_QUERY = gql`
    query pullRequest($number: Int!) {
        pullRequest(number: $number) {
            ${PR_FRAGMENT}
        }
    }
`

const GITHUB_TOKEN_QUERY = gql`
    query token($code: String!, $state: String!, $redirect_uri: String!) {
        githubToken(code: $code, state: $state, redirect_uri: $redirect_uri)
    }
`

const SUBMIT_MASK_MUTATION = gql`
    mutation submitMask($id: ID!, $name: String!, $email: String!, $mask: Upload!) {
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

export const getInProgress = async (username: string): Promise<Images> => {
    const { data } = await client.query({
        query: IN_PROGRESS_QUERY,
        variables: { username },
        fetchPolicy: 'network-only',
    })

    return data.inProgress
}

export const submitMask = async (id: string, name: string, email: string, mask: Blob): Promise<String> => {
    const { data } = await client.mutate({
        mutation: SUBMIT_MASK_MUTATION,
        variables: { name, email, mask, id }
    })

    return data.submitMask.message
}

export const getOpenPRs = async (): Promise<PullRequest[]> => {
    const { data } = await client.query({ query: OPEN_PRS_QUERY })

    return data.openPullRequests.pullRequests
}

// TODO Refactor gql requests to throw on errors automatically
export const getPR = async (number: number): Promise<PullRequest> => {
    const { data, errors } = await client.query({ query: PR_QUERY, variables: { number } })

    if (errors) {
        console.error(errors)
        throw Error(errors[0].message)
    }

    return data.pullRequest
}

export const getGithubToken = async (code: string): Promise<String> => {
    const state = window.localStorage.getItem('GITHUB_STATE')
    const redirect_uri = window.localStorage.getItem('GITHUB_REDIRECT')
    const { data } = await client.query({
        query: GITHUB_TOKEN_QUERY,
        variables: { code, state, redirect_uri },
    })

    return data.githubToken
}