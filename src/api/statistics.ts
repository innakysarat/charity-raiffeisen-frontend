import {API_URL} from "../constants";
import {getJwt} from "../store/auth";

interface Metric {
    paymentDate: string;
    amount: number;
}

interface ServerResponse {
    [date: string]: number;
}

export async function getFundIncome(): Promise<Metric[]> {
    const url = API_URL + "/fund/income";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    });
    const serverResponse: ServerResponse = await response.json();
    const fundIncome: Metric[] = [];
    Object.entries(serverResponse).forEach(([paymentDate, amount]) => {
        const [year, month, day] = paymentDate.split('-');
        const trimmedDate = `${month}-${day}`;

        // fundIncome.push({paymentDate: trimmedDate, amount});
        fundIncome.push({paymentDate, amount});
    });
    return fundIncome;
}

export async function getFundLostIncome(): Promise<Metric[]> {
    const url = API_URL + "/fund/lost-income";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    });
    const serverResponse: ServerResponse = await response.json();
    const fundLostIncome: Metric[] = [];

    Object.entries(serverResponse).forEach(([paymentDate, amount]) => {
        const [year, month, day] = paymentDate.split('-');
        const trimmedDate = `${month}-${day}`;
        fundLostIncome.push({paymentDate, amount});
    });
    return fundLostIncome;
}

export async function getFundAverageCheque(): Promise<Metric[]> {

    const url = API_URL + "/fund/average-cheque";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    });
    const serverResponse: ServerResponse = await response.json();
    const averageCheque: Metric[] = [];
    Object.entries(serverResponse).forEach(([paymentDate, amount]) => {
        const [year, month, day] = paymentDate.split('-');
        const trimmedDate = `${month}-${day}`;

        // averageCheque.push({paymentDate: trimmedDate, amount});
        averageCheque.push({paymentDate, amount});
    });
    return averageCheque;
}

export async function getTransactionCnt(): Promise<Metric[]> {

    const url = API_URL + "/fund/transaction/count";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    });
    const serverResponse: ServerResponse = await response.json();
    const cntTransactions: Metric[] = [];
    Object.entries(serverResponse).forEach(([paymentDate, amount]) => {
        const [year, month, day] = paymentDate.split('-');
        const trimmedDate = `${month}-${day}`;

        // cntTransactions.push({paymentDate: trimmedDate, amount});
        cntTransactions.push({paymentDate, amount});
    });
    return cntTransactions;
}

export async function getSubscriptionCnt(): Promise<Metric[]> {

    const url = API_URL + "/fund/subscription/count";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    });
    const serverResponse: ServerResponse = await response.json();
    const subscriptionCnt: Metric[] = [];
    Object.entries(serverResponse).forEach(([paymentDate, amount]) => {
        const [year, month, day] = paymentDate.split('-');
        const trimmedDate = `${month}-${day}`;

        // subscriptionCnt.push({paymentDate: trimmedDate, amount});
        subscriptionCnt.push({paymentDate, amount});
    });
    return subscriptionCnt;
}

export async function getSubscriptionAverageCheque(): Promise<Metric[]> {

    const url = API_URL + "/fund/subscription/average-cheque";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    });
    const serverResponse: ServerResponse = await response.json();
    const subscriptionAvgCheque: Metric[] = [];
    Object.entries(serverResponse).forEach(([paymentDate, amount]) => {
        const [year, month, day] = paymentDate.split('-');
        const trimmedDate = `${month}-${day}`;

        // subscriptionAvgCheque.push({paymentDate: trimmedDate, amount});
        subscriptionAvgCheque.push({paymentDate, amount});
    });
    return subscriptionAvgCheque;
}

export const statisticRequest = async (store: string): Promise<Metric[]> => {
    const url = API_URL + "/fund/statistics/" + store;
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json",
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
    });
    const serverResponse: ServerResponse = await response.json();
    const oneDayStatData: Metric[] = [];

    Object.entries(serverResponse).forEach(([paymentDate, amount]) => {
        oneDayStatData.push({paymentDate, amount});
    });

    return oneDayStatData;
};

export const statisticDateRangeRequest = async (startDate: string, endDate: string): Promise<Metric[][]> => {
    const url = API_URL + "/fund/statistics/date-range";
    const jwt = getJwt();
    if (!jwt) throw new Error("Невозможно получить статистику неавторизованным");
    const response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': "application/json",
            'Authorization': `${jwt.type} ${jwt.accessToken}`
        },
        body: JSON.stringify({startDate, endDate})
    });
    const serverResponse: ServerResponse[] = await response.json();
    const dateRangeData: Metric[][] = [];

    // Iterate through the serverResponse and map the values to dateRangeData
    for (const item of serverResponse) {
        const metricList: Metric[] = Object.entries(item).map(([paymentDate, amount]) => ({
            paymentDate,
            amount,
        }));

        dateRangeData.push(metricList);
    }
    // Alternatively
    // const dateRangeData = serverResponse.map(item =>
    //     Object.entries(item).map(([paymentDate, amount]) => ({
    //         paymentDate,
    //         amount,
    //     }))
    // );

    console.log(serverResponse);
    return dateRangeData;
};