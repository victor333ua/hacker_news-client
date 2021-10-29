import { client, getLink } from "../apolloClient"

export const changeWsConnection = () => {
    client.setLink(getLink());
}