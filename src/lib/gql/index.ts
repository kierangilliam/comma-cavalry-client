import { ApolloClient, createHttpLink, gql, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
    uri: 'https://api.github.com/graphql',
})

const authLink = setContext((_, { headers }) => {
    // TODO Remove
    const token = '0eb657cadca8ab1876f249bc040715adaafa1370'

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
})


const REPO_QUERY = gql`
    query {
        repository(name: "comma10k", owner: "commaai") {
            defaultBranchRef {
            name
            target {
                ... on Commit {
                id
                tree {
                    entries {
                    name
                    type
                    object {
                        ... on Tree {
                        id
                        entries {
                            name
                            type
                        }
                        }
                    }
                    }
                    id
                }
                }
            }
            }
        }
    }
`

export const getImages = async (): Promise<string[]> => {
    const cached = JSON.parse(localStorage.getItem('images'))

    if (cached) {
        console.log('Getting images from cache')
        return cached
    }

    const { data, errors } = await client.query({ query: REPO_QUERY })
    const files = data.repository.defaultBranchRef.target.tree.entries
    const imagesFolder = files.find(({ name }) => name === 'imgs')
    const images: string[] = imagesFolder.object.entries.map(({ name }) => name)

    localStorage.setItem('images', JSON.stringify(images))

    return images
}