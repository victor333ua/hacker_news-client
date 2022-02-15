import router from "next/router";

export const pushToLogin = () => {
    // const router = useRouter();
    router.replace("/login?next=" + router.pathname);
};