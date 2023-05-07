import type {Jwt} from "./login";
import {API_URL} from "../constants";

export const refresh = async (refreshToken: string): Promise<Jwt> => {
    const url = API_URL + "/auth/access";
    return fetch(url, {
        method: "POST",
        headers: {
            'Accept': "application/json"
        },
        body: JSON.stringify({refreshToken})
    }).then(response => response.json());
};
