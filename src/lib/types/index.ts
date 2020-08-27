import type { Path } from './editor';

export * from './editor';
export * from './__generated__';

export type User = { name: string, email: string }

// TODO Rename?
// Used when working on a one-off mask
export interface Entry {
    version?: number
    paths?: Path[]
    archived?: boolean
}

export interface GitInfo {
    username: string
    // Authorization token
    token: string
    // Personal repo
    repo: string
    // Branch to commit to
    branch: string
}
