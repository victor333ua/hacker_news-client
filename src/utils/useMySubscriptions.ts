import { useApolloClient } from "@apollo/client/react/hooks";
import { useEffect } from "react";
import { PostCreatedDocument, PostCreatedSubscription, PostCreatedSubscriptionVariables, PostDeletedDocument, PostDeletedSubscription, PostDeletedSubscriptionVariables, PostVotedDocument, PostVotedSubscription, PostVotedSubscriptionVariables, UserIsOnlineDocument, UserIsOnlineSubscription, UserIsOnlineSubscriptionVariables } from "../generated/graphql";
import { modifyCacheAddPost, modifyCacheDeletePost, modifyCacheUserIsOnline, modifyCacheVotePost } from './cache';

export const useMySubscriptions = (userId: number | undefined) => {
    const client = useApolloClient();

    // if (!userId) userId = 0;

    useEffect(() => {
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
            modifyCacheAddPost(data?.postCreated.newPost);
        }); 
        
        const subscriptionPostDeleted = observerPostDeleted.subscribe(({ data }) => {
            modifyCacheDeletePost(data?.postDeleted.postId);
        });

        const subscriptionPostVoted = observerPostVoted.subscribe(({ data }) => {
            if (!data) return;
            const { value, postId } = data.postVoted;
            modifyCacheVotePost({ value, postId });
        });

        const subscriptionUserIsOnline = observerUserIsOnline.subscribe(({ data }) => {
            if (!data) return;
            const { userId, lastTime } = data.userIsOnline;
            modifyCacheUserIsOnline({ lastTime, userId });
        });

        return () => {
            subscriptionPostCreated.unsubscribe();
            subscriptionPostDeleted.unsubscribe();
            subscriptionPostVoted.unsubscribe();
            subscriptionUserIsOnline.unsubscribe();
        }
    }, [userId]);
}