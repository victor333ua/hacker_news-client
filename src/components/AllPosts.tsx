import { Button, Flex, Stack } from '@chakra-ui/react';
import React from 'react';
import { useAllPostsQuery, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { Post } from './post';

const AllPosts: React.FC = () => {
   
    const { loading, error, data, fetchMore } = useAllPostsQuery({
      variables: { feedCursor: undefined, feedTake: 5 },
      fetchPolicy: isServer() ? 'cache-first' : 'cache-only'
    });
    const { data: dataMe } = useMeQuery();

    if (!data) {
      return (
        <>
          {loading && <div>loading...</div>}
          {error && <div>{`server error: ${error.name}`}</div>}
        </>
      );
    };
    
    return (
       <div>
          <Stack spacing={8} >
            {data.feed.posts.map( post => <Post key={post.id} post={post} data={dataMe} /> )}
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
        </div>
    )
}
  
export default AllPosts
  