import { OnSubscriptionDataOptions } from "@apollo/client";
import { PostDeletedSubscription, PostVotedSubscription, usePostDeletedSubscription, usePostVotedSubscription, UserIsOnlineSubscription, useUserIsOnlineSubscription } from "../generated/graphql";
import { modifyCacheDeletePost, modifyCacheUserIsOnline, modifyCacheVotePost } from "./cache";

// callbacks to perform after subscription's response recieved
const onPostDeleted = 
    ({ subscriptionData }: OnSubscriptionDataOptions<PostDeletedSubscription>) => {
      if (!subscriptionData?.data) return;
      const { postId } = subscriptionData.data?.postDeleted;
      modifyCacheDeletePost(postId);
    };
const onPostVoted = 
    ({ subscriptionData }: OnSubscriptionDataOptions<PostVotedSubscription>) => {
      if (!subscriptionData?.data) return;
      const { postId, value } = subscriptionData.data.postVoted;
      modifyCacheVotePost({ value, postId });
    };
const  onUserIsOnline =  
    ({ subscriptionData }: OnSubscriptionDataOptions<UserIsOnlineSubscription>) => {
        if (!subscriptionData?.data) return;
        const { userId, lastTime } = subscriptionData.data.userIsOnline;
        modifyCacheUserIsOnline({ lastTime, userId });
    };

export const performSubscriptions = () => {
// this hook performs subscriptions and 
// automatically unsubscribe when component unmounting

        usePostDeletedSubscription({ 
            onSubscriptionData: onPostDeleted,
            // fetchPolicy:"cache-only"
        });
        usePostVotedSubscription({
             onSubscriptionData: onPostVoted,
        });
        useUserIsOnlineSubscription({
            onSubscriptionData: onUserIsOnline
        });
};