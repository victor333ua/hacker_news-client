import router from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const { loading, error } = useMeQuery();

    useEffect(() => {
        if (!loading && error) {
            router.replace("/login?next=" + router.pathname);
        }
    }, [loading, error, router]);
}