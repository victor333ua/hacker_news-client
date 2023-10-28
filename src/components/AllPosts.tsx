import { Button, Stack } from '@chakra-ui/react';
import React from 'react';
import { useAllPostsQuery, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { Post } from './post';

const AllPosts: React.FC = () => {
   
    const { loading, error, data, fetchMore } = useAllPostsQuery({
      variables: { feedCursor: undefined, feedTake: 5 },
      fetchPolicy: isServer() ? 'network-only' : 'cache-only'
    });
    const { loading: loadingMe, data: dataMe } = useMeQuery({ fetchPolicy: 'cache-only'});
    if (loadingMe) return null;
    
    if (!data) {
      return (
        <div>
          {loading && <div>loading...</div>}
          {error && <div>{`server error: ${error.name}`}</div>}
          {!loading && !error && 'no data from cache for allPosts'}
        </div>
      );
    };
    
    return (
      <>
        <Stack spacing={4} mt='10px' overflow='auto'>
          {data.feed.posts.map( post => <Post key={post.id} post={post} data={dataMe} /> )}
        </Stack>
        <br/>
        {data.feed.hasMore && 
          <Button 
            size='lg'
            my={3}
            p={2}
            border="2px"
            isLoading={loading} 
            onClick={() => fetchMore({ variables: {
              feedTake: 5, 
              feedCursor: data.feed.posts[data.feed.posts.length - 1].createdAt 
            }})}
          >
            Load more
          </Button> 
        }      
      </>
    )
}
  
export default AllPosts
  