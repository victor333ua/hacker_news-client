import { cache } from '../apolloClient';
import { Link } from '../generated/graphql';

export const modifyCacheDeletePost = (postId: number) => {
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

    cache.modify({
        fields: {
            feed(_, { INVALIDATE }) {
                return INVALIDATE; 
            }
        }       
    });
};

export const modifyCacheAddPost = (newPost: Link) => {
    cache.modify({
        fields: {
            feed(cached = { posts: [], hasMore: false }) {
                // merge from fieldPolicy will add newFeed to the end of list, so       
                const newFeed = {
                    posts: [newPost, ...cached.posts],
                    hasMore: cached.hasMore
                };           
                cache.evict({ fieldName: 'feed' });       
                return { feed: newFeed };
            }
        }
    });
};

export const  modifyCacheUserIsOnline = 
    ({ lastTime, userId }: {lastTime: string, userId: number}) => {
        cache.modify({
            id: `User:${userId}`,
            fields: {
                 lastTime() {
                     return lastTime
                 }
            }
        });
        cache.modify({
            fields: {
                feed(_, { INVALIDATE }) {
                    return INVALIDATE; 
                }
            }       
        });
    }