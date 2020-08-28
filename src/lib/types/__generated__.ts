/* eslint-disable */
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  image: Image;
  inProgress: Images;
  openPullRequests: PullRequests;
  pullRequest: PullRequest;
  unclaimed: Image;
  githubToken: Scalars['String'];
};


export type QueryImageArgs = {
  id: Scalars['ID'];
};


export type QueryInProgressArgs = {
  username: Scalars['String'];
};


export type QueryPullRequestArgs = {
  number: Scalars['Int'];
};


export type QueryGithubTokenArgs = {
  code: Scalars['String'];
  state: Scalars['String'];
  redirect_uri: Scalars['String'];
};

export type Image = {
  __typename?: 'Image';
  id: Scalars['ID'];
  status: Status;
  labeller?: Maybe<Scalars['String']>;
  reviewedBy?: Maybe<Scalars['String']>;
  mergedBy?: Maybe<Scalars['String']>;
  /** Comment / Issue / PR link */
  github?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  depthMapUrl?: Maybe<Scalars['String']>;
};

export enum Status {
  Merged = 'Merged',
  InProgress = 'InProgress',
  PrSubmitted = 'PRSubmitted',
  Unclaimed = 'Unclaimed'
}

export type Images = {
  __typename?: 'Images';
  images: Array<Image>;
};

export type PullRequests = {
  __typename?: 'PullRequests';
  pullRequests: Array<PullRequest>;
};

export type PullRequest = {
  __typename?: 'PullRequest';
  id: Scalars['ID'];
  state: Scalars['String'];
  url: Scalars['String'];
  number: Scalars['Int'];
  files: Array<PullRequestFile>;
};

export type PullRequestFile = {
  __typename?: 'PullRequestFile';
  id: Scalars['ID'];
  filename: Scalars['String'];
  maskURL: Scalars['String'];
  imageURL: Scalars['String'];
  depthMapURL?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  submitMask: Scalars['String'];
};


export type MutationSubmitMaskArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  mask?: Maybe<Scalars['Upload']>;
};

