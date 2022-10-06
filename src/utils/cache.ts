import { ApolloCache, gql } from '@apollo/client';
import { RegularPostFragment, RegularPostFragmentDoc } from '../generated/graphql';

export const modifyCacheDeletePost = 
    (cache: ApolloCache<Object>, postId: number | undefined) => {
        if (!postId) return;
        cache.evict({ id: `Link:${postId}`});
        cache.modify({
            fields: {
                feed(cached, { readField }) {
                    return {
                        posts: cached.posts.filter(
                            (p: any) => postId != readField('id', p)
                        ),
                        hasMore: cached.hasMore
                    };        
                }
            },
        })         
};

export const modifyCacheVotePost = 
    (cache: ApolloCache<Object>, 
    { value, postId }: { value: number, postId: number}) => { 

    cache.modify({
        id: `Link:${postId}`,
        fields: {
            votesUp(cached) {
                if (value === 1 || value === 2) return cached + 1;
                if (value === -2 ) return cached - 1;
                return cached;
            },
            votesDown(cached) {
                if (value === -1 || value === -2) return cached + 1;
                if (value === 2 ) return cached - 1;
                return cached;
            }
        }
    });

    // cache.modify({
    //     fields: {
    //         feed(_, { INVALIDATE }) {
    //             return INVALIDATE; 
    //         }
    //     }       
    // });
};

export const modifyCacheAddPost = 
    (cache: ApolloCache<Object>,
     newPost: RegularPostFragment | undefined) => {

    if (!newPost) return;
    cache.modify({
        fields: {
            feed(cached = { posts: [], hasMore: false }) {
                const newPostRef = cache.writeFragment({
                    data: newPost,
                    fragment: RegularPostFragmentDoc
                });
                return ({
                    posts: [newPostRef, ...cached.posts],
                    hasMore: cached.hasMore
                });           
            }
        }
    });
};

export const  modifyCacheUserIsOnline = 
    (cache: ApolloCache<Object>,     
    { lastTime, userId }: {lastTime: string | null | undefined, userId: number | undefined }) => {
       
        if (!userId) return;
        cache.writeFragment({
            id: `User:${userId}`,
            fragment: gql`
                fragment LastT on User {
                    lastTime
                }
            `,
            data: {
                lastTime
            }
        });
    };

export const modifyCacheChangeAvatar = 
({ cache, userId, link, deletehash }:
     { cache: ApolloCache<Object>, userId: number, link: string, deletehash: string
}) => {
    return cache.modify({
        id: `User:${userId}`,
        fields: {
            imageLink() {
                return link;
            },
            deletehash() {
                return deletehash;
            }                    
        },
        // broadcast: false 
    });
    // if (!userId) return;
    // cache.writeFragment({
    //     id: `User:${userId}`,
    //     fragment: gql`
    //         fragment Image on User {
    //             imageLink, deletehash
    //         }
    //     `,
    //     data: {
    //         imageLink: link,
    //         deletehash
    //     }
    // });
};


                    