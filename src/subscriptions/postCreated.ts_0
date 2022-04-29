// import { ExecutionResult } from "graphql";
// import { cache, wsClient } from "../apolloClient";
// import { AllPostsDocument, AllPostsQuery, Link } from "../generated/graphql";

// export const postCreated = async () => {

//     const onNext = (result: ExecutionResult<Link, unknown>) => {
//         if (!result.data) return;
//         let cachedData = cache.readQuery<AllPostsQuery>({
//             query: AllPostsDocument
//         });
//         if (!cachedData) cachedData = { feed: { posts: [], hasMore: false } };

//         cache.writeQuery<AllPostsQuery>({
//             query: AllPostsDocument,
//             data: {
//                 feed: {
//                     posts: [result.data, ...cachedData.feed.posts],
//                     hasMore: cachedData.feed.hasMore
//                 }
//             },
//             overwrite: true
//         })
                           
//     };
  
//     let unsubscribe = () => {
//       /* complete the subscription */
//     };
  
//     await new Promise<void>((resolve, reject) => {
//       unsubscribe = wsClient.subscribe<Link>(
//         {
//           query: `subscription PostCreated {
//             postCreated {
//               createdAt
//               id
//               description
//               votesUp
//               votesDown
//               voteValue
//               postedBy {
//                 id
//                 name
//               }
//             }
//           }`,
//         },
//         {
//           next: onNext,
//           error: reject,
//           complete: resolve,
//         },
//       );
//     });
  
// };