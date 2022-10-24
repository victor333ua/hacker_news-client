import { ApolloCache, ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { useEffect } from "react";
import { PostCreatedDocument, PostCreatedSubscription, PostCreatedSubscriptionVariables, PostDeletedDocument, PostDeletedSubscription, PostDeletedSubscriptionVariables, PostVotedDocument, PostVotedSubscription, PostVotedSubscriptionVariables, UserIsOnlineDocument, UserIsOnlineSubscription, UserIsOnlineSubscriptionVariables } from "../generated/graphql";
import { modifyCacheAddPost, modifyCacheDeletePost, modifyCacheUserIsOnline, modifyCacheVotePost } from '../utils/cache';
import { isServer } from "../utils/isServer";

export const useMySubscriptions = (userId: number | undefined, client: ApolloClient<object>) => {
    const cache = client.cache as ApolloCache<NormalizedCacheObject>;
  
    useEffect(() => {
        if (isServer()) return;
        
        const observerPostCreated = 
            client.subscribe<PostCreatedSubscription, PostCreatedSubscriptionVariables>({
                query: PostCreatedDocument     
            });

        const observerPostDeleted = 
            client.subscribe<PostDeletedSubscription, PostDeletedSubscriptionVariables>({
                query: PostDeletedDocument,
            });

        const observerPostVoted = 
            client.subscribe<PostVotedSubscription, PostVotedSubscriptionVariables>({
                query: PostVotedDocument     
            });

        const observerUserIsOnline = 
            client.subscribe<UserIsOnlineSubscription, UserIsOnlineSubscriptionVariables>({
                query: UserIsOnlineDocument     
            });

        const subscriptionPostCreated = observerPostCreated.subscribe(({ data }) => {
            modifyCacheAddPost(cache, data?.postCreated.newPost);
        }); 
        
        const subscriptionPostDeleted = observerPostDeleted.subscribe(({ data }) => {
            modifyCacheDeletePost(cache, data?.postDeleted.postId);
        });

        const subscriptionPostVoted = observerPostVoted.subscribe(({ data }) => {
            if (!data) return;
            const { delta, postId } = data.postVoted;
            modifyCacheVotePost(cache, { delta, postId, isSubscription: true });
        });

        const subscriptionUserIsOnline = observerUserIsOnline.subscribe(({ data }) => {
            if (!data) return;
            const { userId, lastTime } = data.userIsOnline;
            modifyCacheUserIsOnline(cache, { lastTime, userId });
        });

        return () => {
            subscriptionPostCreated.unsubscribe();
            subscriptionPostDeleted.unsubscribe();
            subscriptionPostVoted.unsubscribe();
            subscriptionUserIsOnline.unsubscribe();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
}