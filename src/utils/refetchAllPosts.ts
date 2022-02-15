import { ApolloClient } from "@apollo/client";

// don't work if component unmounted (observeless query), 
// despite closed issue by @benjamn

export  const refetch = async (client: ApolloClient<object>) => {
    await client.refetchQueries({
       include: ['AllPosts'],
      
    //    onQueryUpdated(observableQuery) {
    //        console.log(observableQuery.queryName);
    //        switch (observableQuery.queryName) {
    //         case 'AllPosts': 
    //             return true;
    //        }
    //        return false;
    //    }
   });
};