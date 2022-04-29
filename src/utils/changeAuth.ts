import { ApolloClient } from '@apollo/client';
import { getLink } from './getLink';

export const changeAuth = (client: ApolloClient<object>) => {
    client.setLink(getLink());
}