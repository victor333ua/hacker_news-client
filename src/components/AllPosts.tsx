import { Button, Flex, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { cache } from '../apolloClient';
import { Layout } from './Layout';
import { Post } from './post';
import { PostCreatedDocument, PostCreatedSubscription, PostCreatedSubscriptionVariables, useAllPostsQuery, UserIsOnlineDocument, UserIsOnlineSubscription } from '../generated/graphql';

const AllPosts = () => {
    const { loading, error, data, fetchMore, subscribeToMore } = useAllPostsQuery({
      variables: { feedCursor: undefined, feedTake: 5 },
      errorPolicy: 'all',
      // fetchPolicy: "cache-first",
      // nextFetchPolicy: "cache-only"
    });
   
    useEffect(() => {
      subscribeToMore<PostCreatedSubscription, PostCreatedSubscriptionVariables>({
        document: PostCreatedDocument,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          if (!prev) prev = { feed: { posts: [], hasMore: false } };
            const newFeed = {
            posts: [subscriptionData.data.postCreated.newPost, ...prev.feed.posts],
            hasMore: prev.feed.hasMore
          };
    // merge from cache will add newFeed to the end of list      
          cache.evict({ fieldName: 'feed' });       
          return { feed: newFeed };
        },
      
      });
    }, [subscribeToMore]);
  
    if (!data) {
      return (
        <>
          {loading && <div>loading...</div>}
          {!loading && error && <div>{`server error: ${error.name}`}</div>}
        </>
      );
    };
    
    return (
       <Layout>
          <Stack spacing={8} >
            {data.feed.posts.map( post => <Post key={post.id} post={post} /> )}
          </Stack>
          <br/>
          {data.feed.hasMore && 
                <Flex>
                  <Button 
                    m="auto" 
                    my={8}
                    border="2px"
                    isLoading={loading} 
                    onClick={() => fetchMore({ variables: {
                      feedTake: 5, 
                      feedCursor: data.feed.posts[data.feed.posts.length - 1].createdAt 
                    }})}
                  >
                    Load more
                  </Button> 
                </Flex> 
          }      
        </Layout>
    )
  }
  
  export default AllPosts
  