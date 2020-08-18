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
};

export type Query = {
  __typename?: 'Query';
  image: Image;
  unclaimed: Image;
};


export type QueryImageArgs = {
  id: Scalars['ID'];
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

export type Mutation = {
  __typename?: 'Mutation';
  submitMask: Scalars['String'];
};


export type MutationSubmitMaskArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  mask: Scalars['String'];
};
