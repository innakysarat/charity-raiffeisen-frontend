import {derived, writable, get} from "svelte/store";
import type {Jwt} from "../api/login";

type AuthState = {
    isAuth: boolean,
    jwt?: Jwt
};


const authStore = (function setupStore() {
    const initialJwt = (function () {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const type = localStorage.getItem("type");

        if (!accessToken || !refreshToken || type !== "Bearer") return null;

        return { accessToken, refreshToken, type } as const;
    })();

    const initialStoreValue = initialJwt ?
        {isAuth: true, jwt: initialJwt} as const :
        {isAuth: false};

    return writable<AuthState>(initialStoreValue);
})();

export const getJwt = () => get(authStore).jwt;
export const useIsAuth = derived(authStore, (state) => state.isAuth);
export const login = (jwt: Jwt) => {
    authStore.set({
        isAuth: true,
        jwt
    });

    localStorage.setItem("accessToken", jwt.accessToken);
    localStorage.setItem("refreshToken", jwt.refreshToken);
    localStorage.setItem("type", jwt.type);
}
export const logout = () => {
    authStore.set({
        isAuth: false
    });

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("type");
}