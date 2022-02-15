import { gql } from '@apollo/client';
import { cache } from '../apolloClient';
import { RegularPostFragment } from '../generated/graphql';

export const modifyCacheDeletePost = (postId: number | undefined) => {
    if (!postId) return;
    cache.evict({ id: `Link:${postId}`});
    cache.modify({
        fields: {
            feed(cached, { readField }) {
                return ({
                    posts: cached.posts.filter(
                        (p: any) => postId !== readField('id', p)
                    ),
                    hasMore: cached.hasMore
                });        
            }
        },
     })         
};

export const modifyCacheVotePost = ({ value, postId }: { value: number, postId: number}) => {   
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

export const modifyCacheAddPost = (newPost: RegularPostFragment | undefined) => {
    if (!newPost) return;
    cache.modify({
        fields: {
            feed(cached = { posts: [], hasMore: false }) {
                const newFeed = {
                    posts: [newPost, ...cached.posts],
                    hasMore: cached.hasMore
                };           
                cache.evict({ fieldName: 'feed' });       
                return newFeed;
            }
        }
    });
};

export const  modifyCacheUserIsOnline = 
    ({ lastTime, userId }: {lastTime: string | null, userId: number | undefined }) => {
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
        // cache.modify({
        //     id: `User:${userId}`,
        //     fields: {
        //          lastTime() {
        //              return lastTime;
        //          }
        //     }
        // });
    };

export const modifyCacheLogout = () => {
// to prevent refetching queryMe
    cache.modify({
        fields: {
            me() {
                return {__ref: null}
            }
        }
    })
};


                    