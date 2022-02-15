import { useRouter }  from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const { loading, error } = useMeQuery();

    const router = useRouter();

    useEffect(() => {
        if (!loading && error) {
            router.replace("/login?next=" + router.pathname);
        }
    }, [loading, error, router]);
}