import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
  user: User;
};

export type IsOnlinePayload = {
  __typename?: 'IsOnlinePayload';
  lastTime?: Maybe<Scalars['String']>;
  userId: Scalars['Int'];
};

export type Link = {
  __typename?: 'Link';
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['Int'];
  postedBy: User;
  postedById: Scalars['Int'];
  url: Scalars['String'];
  voteValue?: Maybe<Scalars['Int']>;
  votesDown: Scalars['Int'];
  votesUp: Scalars['Int'];
};

export type LinksPayload = {
  __typename?: 'LinksPayload';
  hasMore: Scalars['Boolean'];
  posts: Array<Link>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Link;
  deletePost: Link;
  logWithValidToken: Scalars['Boolean'];
  login: AuthPayload;
  logout: Scalars['Boolean'];
  signup: AuthPayload;
  vote: Scalars['Boolean'];
};


export type MutationCreatePostArgs = {
  description: Scalars['String'];
  url: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Int'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};


export type MutationVoteArgs = {
  postId: Scalars['Int'];
  value: Scalars['Int'];
};

export type PostCreatedPayload = {
  __typename?: 'PostCreatedPayload';
  newPost: Link;
  userId: Scalars['Int'];
};

export type PostDeletedPayload = {
  __typename?: 'PostDeletedPayload';
  postId: Scalars['Int'];
  userId: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  allUsers: Array<User>;
  feed: LinksPayload;
  me: User;
  user: User;
};


export type QueryFeedArgs = {
  cursor?: Maybe<Scalars['String']>;
  filter?: Maybe<Scalars['String']>;
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id: Scalars['Int'];
};

export type Subscription = {
  __typename?: 'Subscription';
  postCreated: PostCreatedPayload;
  postDeleted: PostDeletedPayload;
  postVoted: VotePayload;
  userIsOnline: IsOnlinePayload;
};

export type Updoot = {
  __typename?: 'Updoot';
  postId: Scalars['Int'];
  userId: Scalars['Int'];
  value: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['Int'];
  lastTime?: Maybe<Scalars['String']>;
  links: Array<Link>;
  name: Scalars['String'];
};

export type VotePayload = {
  __typename?: 'VotePayload';
  postId: Scalars['Int'];
  userId: Scalars['Int'];
  value: Scalars['Int'];
};

export type RegularPostFragment = { __typename?: 'Link', id: number, description: string, createdAt: string, votesUp: number, votesDown: number, voteValue?: number | null | undefined, postedBy: { __typename?: 'User', id: number, name: string, lastTime?: string | null | undefined, email: string } };

export type CreatePostMutationVariables = Exact<{
  description: Scalars['String'];
  url: Scalars['String'];
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Link', id: number, description: string, createdAt: string, votesUp: number, votesDown: number, voteValue?: number | null | undefined, postedBy: { __typename?: 'User', id: number, name: string, lastTime?: string | null | undefined, email: string } } };

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['Int'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: { __typename?: 'Link', id: number } };

export type LogWithValidTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type LogWithValidTokenMutation = { __typename?: 'Mutation', logWithValidToken: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: number, name: string } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type SignupMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
}>;


export type SignupMutation = { __typename?: 'Mutation', signup: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: number, name: string } } };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  postId: Scalars['Int'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export type AllPostsQueryVariables = Exact<{
  feedTake?: Maybe<Scalars['Int']>;
  feedCursor?: Maybe<Scalars['String']>;
}>;


export type AllPostsQuery = { __typename?: 'Query', feed: { __typename?: 'LinksPayload', hasMore: boolean, posts: Array<{ __typename?: 'Link', id: number, description: string, createdAt: string, votesUp: number, votesDown: number, voteValue?: number | null | undefined, postedBy: { __typename?: 'User', id: number, name: string, lastTime?: string | null | undefined, email: string } }> } };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { __typename?: 'Query', allUsers: Array<{ __typename?: 'User', id: number, name: string, links: Array<{ __typename?: 'Link', description: string, createdAt: string }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, name: string, lastTime?: string | null | undefined } };

export type PostCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PostCreatedSubscription = { __typename?: 'Subscription', postCreated: { __typename?: 'PostCreatedPayload', newPost: { __typename?: 'Link', id: number, description: string, createdAt: string, votesUp: number, votesDown: number, voteValue?: number | null | undefined, postedBy: { __typename?: 'User', id: number, name: string, lastTime?: string | null | undefined, email: string } } } };

export type PostDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PostDeletedSubscription = { __typename?: 'Subscription', postDeleted: { __typename?: 'PostDeletedPayload', postId: number } };

export type PostVotedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type PostVotedSubscription = { __typename?: 'Subscription', postVoted: { __typename?: 'VotePayload', postId: number, value: number } };

export type UserIsOnlineSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserIsOnlineSubscription = { __typename?: 'Subscription', userIsOnline: { __typename?: 'IsOnlinePayload', userId: number, lastTime?: string | null | undefined } };

export const RegularPostFragmentDoc = gql`
    fragment RegularPost on Link {
  id
  description
  createdAt
  votesUp
  votesDown
  voteValue
  postedBy {
    id
    name
    lastTime
    email
  }
}
    `;
export const CreatePostDocument = gql`
    mutation CreatePost($description: String!, $url: String!) {
  createPost(description: $description, url: $url) {
    ...RegularPost
  }
}
    ${RegularPostFragmentDoc}`;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      description: // value for 'description'
 *      url: // value for 'url'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($postId: Int!) {
  deletePost(id: $postId) {
    id
  }
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const LogWithValidTokenDocument = gql`
    mutation LogWithValidToken {
  logWithValidToken
}
    `;
export type LogWithValidTokenMutationFn = Apollo.MutationFunction<LogWithValidTokenMutation, LogWithValidTokenMutationVariables>;

/**
 * __useLogWithValidTokenMutation__
 *
 * To run a mutation, you first call `useLogWithValidTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogWithValidTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logWithValidTokenMutation, { data, loading, error }] = useLogWithValidTokenMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogWithValidTokenMutation(baseOptions?: Apollo.MutationHookOptions<LogWithValidTokenMutation, LogWithValidTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogWithValidTokenMutation, LogWithValidTokenMutationVariables>(LogWithValidTokenDocument, options);
      }
export type LogWithValidTokenMutationHookResult = ReturnType<typeof useLogWithValidTokenMutation>;
export type LogWithValidTokenMutationResult = Apollo.MutationResult<LogWithValidTokenMutation>;
export type LogWithValidTokenMutationOptions = Apollo.BaseMutationOptions<LogWithValidTokenMutation, LogWithValidTokenMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      id
      name
    }
    token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const SignupDocument = gql`
    mutation Signup($email: String!, $password: String!, $name: String!) {
  signup(email: $email, password: $password, name: $name) {
    user {
      id
      name
    }
    token
  }
}
    `;
export type SignupMutationFn = Apollo.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: Apollo.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, options);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = Apollo.MutationResult<SignupMutation>;
export type SignupMutationOptions = Apollo.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;
export type VoteMutationFn = Apollo.MutationFunction<VoteMutation, VoteMutationVariables>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      value: // value for 'value'
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useVoteMutation(baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument, options);
      }
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<VoteMutation, VoteMutationVariables>;
export const AllPostsDocument = gql`
    query AllPosts($feedTake: Int, $feedCursor: String) {
  feed(take: $feedTake, cursor: $feedCursor) {
    posts {
      ...RegularPost
    }
    hasMore
  }
}
    ${RegularPostFragmentDoc}`;

/**
 * __useAllPostsQuery__
 *
 * To run a query within a React component, call `useAllPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPostsQuery({
 *   variables: {
 *      feedTake: // value for 'feedTake'
 *      feedCursor: // value for 'feedCursor'
 *   },
 * });
 */
export function useAllPostsQuery(baseOptions?: Apollo.QueryHookOptions<AllPostsQuery, AllPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, options);
      }
export function useAllPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllPostsQuery, AllPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, options);
        }
export type AllPostsQueryHookResult = ReturnType<typeof useAllPostsQuery>;
export type AllPostsLazyQueryHookResult = ReturnType<typeof useAllPostsLazyQuery>;
export type AllPostsQueryResult = Apollo.QueryResult<AllPostsQuery, AllPostsQueryVariables>;
export const AllUsersDocument = gql`
    query AllUsers {
  allUsers {
    id
    name
    links {
      description
      createdAt
    }
  }
}
    `;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a React component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
      }
export function useAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllUsersQuery, AllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, options);
        }
export type AllUsersQueryHookResult = ReturnType<typeof useAllUsersQuery>;
export type AllUsersLazyQueryHookResult = ReturnType<typeof useAllUsersLazyQuery>;
export type AllUsersQueryResult = Apollo.QueryResult<AllUsersQuery, AllUsersQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    name
    lastTime
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const PostCreatedDocument = gql`
    subscription PostCreated {
  postCreated {
    newPost {
      ...RegularPost
    }
  }
}
    ${RegularPostFragmentDoc}`;

/**
 * __usePostCreatedSubscription__
 *
 * To run a query within a React component, call `usePostCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePostCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostCreatedSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePostCreatedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PostCreatedSubscription, PostCreatedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PostCreatedSubscription, PostCreatedSubscriptionVariables>(PostCreatedDocument, options);
      }
export type PostCreatedSubscriptionHookResult = ReturnType<typeof usePostCreatedSubscription>;
export type PostCreatedSubscriptionResult = Apollo.SubscriptionResult<PostCreatedSubscription>;
export const PostDeletedDocument = gql`
    subscription PostDeleted {
  postDeleted {
    postId
  }
}
    `;

/**
 * __usePostDeletedSubscription__
 *
 * To run a query within a React component, call `usePostDeletedSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePostDeletedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostDeletedSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePostDeletedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PostDeletedSubscription, PostDeletedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PostDeletedSubscription, PostDeletedSubscriptionVariables>(PostDeletedDocument, options);
      }
export type PostDeletedSubscriptionHookResult = ReturnType<typeof usePostDeletedSubscription>;
export type PostDeletedSubscriptionResult = Apollo.SubscriptionResult<PostDeletedSubscription>;
export const PostVotedDocument = gql`
    subscription PostVoted {
  postVoted {
    postId
    value
  }
}
    `;

/**
 * __usePostVotedSubscription__
 *
 * To run a query within a React component, call `usePostVotedSubscription` and pass it any options that fit your needs.
 * When your component renders, `usePostVotedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePostVotedSubscription({
 *   variables: {
 *   },
 * });
 */
export function usePostVotedSubscription(baseOptions?: Apollo.SubscriptionHookOptions<PostVotedSubscription, PostVotedSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<PostVotedSubscription, PostVotedSubscriptionVariables>(PostVotedDocument, options);
      }
export type PostVotedSubscriptionHookResult = ReturnType<typeof usePostVotedSubscription>;
export type PostVotedSubscriptionResult = Apollo.SubscriptionResult<PostVotedSubscription>;
export const UserIsOnlineDocument = gql`
    subscription UserIsOnline {
  userIsOnline {
    userId
    lastTime
  }
}
    `;

/**
 * __useUserIsOnlineSubscription__
 *
 * To run a query within a React component, call `useUserIsOnlineSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserIsOnlineSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserIsOnlineSubscription({
 *   variables: {
 *   },
 * });
 */
export function useUserIsOnlineSubscription(baseOptions?: Apollo.SubscriptionHookOptions<UserIsOnlineSubscription, UserIsOnlineSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserIsOnlineSubscription, UserIsOnlineSubscriptionVariables>(UserIsOnlineDocument, options);
      }
export type UserIsOnlineSubscriptionHookResult = ReturnType<typeof useUserIsOnlineSubscription>;
export type UserIsOnlineSubscriptionResult = Apollo.SubscriptionResult<UserIsOnlineSubscription>;