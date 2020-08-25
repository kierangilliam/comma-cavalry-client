/**
 * Largely stolen from https://github.com/erikbernheim/img-labeler/blob/master/src/app/git.service.ts
 */

import { get } from 'svelte/store'
import { DEV } from './constants'
import { git } from './storage'

const client_id = DEV
    ? 'b7fb9342f9d202afd914'
    : 'ea87f63cdaa5bb422e05'

interface MakeOpts {
    method?: 'GET' | 'POST' | 'PUT'
    body?: string
    token?: string
}

interface Repo {
    id: string
    html_url: string
    name: string
}

interface Branch {
    id: string
    name: string
    commit: { sha: string }
}

function makeOpts({ token, body, method }: MakeOpts): RequestInit {
    return {
        body,
        method: method ?? 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ?? get(git).token,
        },
    }
}

function makeParams(obj: Record<string, string>) {
    return new URLSearchParams(Object.entries(obj))
}

export function getGithubCode() {
    const state = `${Math.random()}`
    const redirect_uri = window.location.href
    const params = makeParams({
        client_id,
        state,
        scope: 'repo, read:user',
        redirect_uri,
    })

    window.localStorage.setItem('GITHUB_STATE', state)
    window.localStorage.setItem('GITHUB_REDIRECT', window.location.href)
    window.location.href = 'https://github.com/login/oauth/authorize?' + params
}

export async function getUsername(token: string): Promise<string> {
    const url = `https://api.github.com/user`
    const response = await fetch(url, makeOpts({ token }))
    return (await response.json()).login
}

export async function getRepos(): Promise<Repo[]> {
    const user = get(git).username
    const url = `https://api.github.com/users/${user}/repos`
    const response = await fetch(url, makeOpts({}))
    return response.json()
}

export async function getBranches(): Promise<Branch[]> {
    const { username, repo } = get(git)
    const url = `https://api.github.com/repos/${username}/${repo}/branches`
    const response = await fetch(url, makeOpts({}))
    return await response.json()
}

async function getTree(sha: string): Promise<any> {
    const { username, repo } = get(git)
    const url = `https://api.github.com/repos/${username}/${repo}/git/trees/${sha}`;
    const response = await fetch(url, makeOpts({}))

    return response.json()
}

async function getMaskSha(branchName: string, imageName: string): Promise<string> {
    try {
        const branches = await getBranches()
        const branch = branches.find(({ name }) => name === branchName)

        if (!branch) {
            throw Error(`Could not find branch ${branchName} on repo ${get(git).repo}`)
        }

        if (!branch.commit.sha) {
            throw Error(`Could not get sha from branch ${branchName}`)
        }

        const { tree: branchTree } = await getTree(branch.commit.sha)
        const { sha: masksSha } = branchTree.find(({ path }) => path === 'masks')
        const { tree } = await getTree(masksSha)
        const mask = tree.find(({ path }) => path === imageName)

        if (!mask) {
            // No need to pass github a sha if the file does not exist
            return null
        }

        return mask.sha
    } catch (error) {
        console.error(error)
        throw Error(`Could not get sha from branch ${branchName}`)
    }
}

export async function commitFile(message: string, content: string, imageName: string) {
    const { username, repo, branch } = get(git)
    const sha = await getMaskSha(branch, imageName)
    const body = JSON.stringify({ message, sha, branch, content })
    const url = `https://api.github.com/repos/${username}/${repo}/contents/masks/${imageName}`
    const response = await fetch(url, makeOpts({ body, method: 'PUT' }))
    const json = await response.json()

    if (response.ok) {
        return json
    }

    throw Error(`Could not commit file: ${json.message ?? json}`)
}