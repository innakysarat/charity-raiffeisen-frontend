import {API_URL} from "../constants";

export type Jwt = {
    type: "Bearer",
    accessToken: string,
    refreshToken: string
}

export const login = async (login: string, password: string): Promise<Jwt> => {
    const url = API_URL + "/auth/login";
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json"
        },
        body: JSON.stringify({login, password})
    });

    if (response.status === 200) return response.json();

    throw new Error("unsuccessful login");


    /*return fetch(url, {
        method: "POST",
        headers: {
            'Accept': "application/json"
        },
        body: JSON.stringify({login, password})
    }).then(response => response.json());*/
};
