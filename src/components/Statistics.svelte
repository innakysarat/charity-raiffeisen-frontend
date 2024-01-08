<script lang="ts">
    import {onMount} from "svelte";
    import {scaleLinear} from 'd3-scale';
    import {
        getFundAverageCheque,
        getFundIncome,
        getFundLostIncome,
        getSubscriptionAverageCheque,
        getSubscriptionCnt,
        getTransactionCnt,
        statisticDateRangeRequest,
        statisticRequest
    } from "../api/statistics";
    import LinearProgress from '@smui/linear-progress';
    import {Text} from '@smui/list';
    import {InlineCalendar} from 'svelte-calendar';
    import dayjs from "dayjs";
    import {Label} from "@smui/snackbar";
    import Fab from "@smui/fab";
    import DateRangeSelect from "svelte-date-range-select";
    import Plotly from 'plotly.js-dist-min'

    interface Metric {
        paymentDate: string;
        amount: number;
    }

    let loading: boolean = true;
    let fundIncome: Metric[];
    let fundLostIncome: Metric[];
    let averageCheque: Metric[];
    let transactionCnt: Metric[];
    let oneDayData: Metric[];
    let subscriptionCnt: Metric[];
    let subscriptionAvgCheque: Metric[];
    let dateRangeData: Metric[][];
    const xTicks = [2022, 2023]
    const yTicksIncome = [0, 5000, 10000, 15000];
    const yTicksLostIncome = [0, 10000, 50000, 100000];
    const yTicksAvgCheque = [0, 500, 1000, 1500];
    const yTicksCntTx = [0, 10, 20];

    const padding = {top: 20, right: 15, bottom: 20, left: 25};

    let width = 500;
    let height = 200;


    $: xScale = scaleLinear()
        .domain([0, xTicks.length])
        .range([padding.left, width - padding.right]);

    $: yScaleIncome = scaleLinear()
        .domain([0, Math.max.apply(null, yTicksIncome)])
        .range([height - padding.bottom, padding.top]);

    $: yScaleAvgCheque = scaleLinear()
        .domain([0, Math.max.apply(null, yTicksAvgCheque)])
        .range([height - padding.bottom, padding.top]);

    $: yScaleCntTx = scaleLinear()
        .domain([0, Math.max.apply(null, yTicksCntTx)])
        .range([height - padding.bottom, padding.top]);

    $: yScaleLostIncome = scaleLinear()
        .domain([0, Math.max.apply(null, yTicksLostIncome)])
        .range([height - padding.bottom, padding.top]);

    $: innerWidth = width - (padding.left + padding.right);
    $: barWidth = innerWidth / xTicks.length;

    let store;

    onMount(async () => {
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(1500);

        await getFundIncome().then(
            data => {
                fundIncome = data;
                console.log(fundIncome);
            });
        await getFundAverageCheque().then(data => {
            averageCheque = data;
            console.log(averageCheque);
        });
        await getTransactionCnt().then(data => {
            transactionCnt = data;
            console.log(transactionCnt);
        });
        await getSubscriptionCnt().then(data => {
            subscriptionCnt = data;
            console.log(subscriptionCnt);
        });
        await getSubscriptionAverageCheque().then(data => {
            subscriptionAvgCheque = data;
            console.log(subscriptionAvgCheque);
        });
        await getFundLostIncome().then(
            data => {
                fundLostIncome = data;
                console.log(fundLostIncome);
                loading = false;
            });

        await Plotly.newPlot(
            document.getElementById('revenue'),
            [{
                x: fundIncome.map(item => item.paymentDate),
                y: fundIncome.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Выручка'}
        );

        await Plotly.newPlot(
            document.getElementById('average-order-value'),
            [{
                x: averageCheque.map(item => item.paymentDate),
                y: averageCheque.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Средний чек платежа'}
        );


        await Plotly.newPlot(
            document.getElementById('transaction-count'),
            [{
                x: transactionCnt.map(item => item.paymentDate),
                y: transactionCnt.map(item => item.amount),
                type: 'bar',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Количество платежей'}
        );

        await Plotly.newPlot(
            document.getElementById('subscription-count'),
            [{
                x: subscriptionCnt.map(item => item.paymentDate),
                y: subscriptionCnt.map(item => item.amount),
                type: 'bar',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                },
                name: 'Оформленные подписки'
            },
                {
                    x: subscriptionCnt.map(item => item.paymentDate),
                    y: [6, 7, 13, 25, 43, 50],
                    type: 'bar',
                    marker: {
                        color: 'red', //  цвет второго графика на красный
                        opacity: 0.6 //  прозрачность ключевых точек
                    },
                    line: {
                        color: 'red' //  цвет линии второго графика на красный
                    },
                    name: 'Активные подписки'
                }],
            {title: 'Количество подписок'}
        );
        await Plotly.newPlot(
            document.getElementById('subscription-avg-cheque'),
            [{
                x: subscriptionAvgCheque.map(item => item.paymentDate),
                y: subscriptionAvgCheque.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Средний чек оформленной подписки'}
        );
        await Plotly.newPlot(
            document.getElementById('lost-revenue'),
            [{
                x: fundLostIncome.map(item => item.paymentDate),
                y: fundLostIncome.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Упущенная выгода'}
        );

    });


    const theme = {
        calendar: {
            width: '400px',
            shadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
            float: 'right',
            background: 'darkblue',
            opacity: '0.6',
        }
    };
    let step: "stata" | "noStata" = "noStata";
    const getStatistics = () => {
        statisticRequest(dayjs($store?.selected).format('YYYY-MM-DD'))
            .then(data => {
                oneDayData = data;
                console.log(oneDayData);
                step = "stata";
            })
            .catch(() => {
            });
    }
    const cancel = () => {
        step = "noStata";
    }

    const heading = 'Укажите промежуток времени, за который хотите посмотреть статистику';
    const endDateMax = new Date();
    const startDateMin = new Date(
        new Date().setFullYear(endDateMax.getFullYear(), endDateMax.getMonth() - 36)
    );

    const labels = {
        notSet: 'не установлен',
        greaterThan: 'больше чем',
        lessThan: 'меньше чем',
        range: 'Указан промежуток: ',
        day: 'день',
        days: 'дня/дней',
        apply: 'OK'
    }

    // form post ids
    const startDateId = 'start_date_id'
    const endDateId = 'end_date_id'

    async function handleStatisticsDateRange(data) {
        await statisticDateRangeRequest(data.detail.startDate, data.detail.endDate)
            .then(data => {
                dateRangeData = data;
                fundIncome = dateRangeData[0];
                averageCheque = dateRangeData[1];
                transactionCnt = dateRangeData[2];
                subscriptionCnt = dateRangeData[3];
                subscriptionAvgCheque = dateRangeData[4];
                fundLostIncome = dateRangeData[5];
                console.log(dateRangeData);
            })
            .catch((e) => {
                console.log(e);
            });
        await Plotly.newPlot(
            document.getElementById('revenue'),
            [{
                x: fundIncome.map(item => item.paymentDate),
                y: fundIncome.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Выручка'}
        );

        await Plotly.newPlot(
            document.getElementById('average-order-value'),
            [{
                x: averageCheque.map(item => item.paymentDate),
                y: averageCheque.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Средний чек платежа'}
        );
        await Plotly.newPlot(
            document.getElementById('transaction-count'),
            [{
                x: transactionCnt.map(item => item.paymentDate),
                y: transactionCnt.map(item => item.amount),
                type: 'bar',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Количество платежей'}
        );

        await Plotly.newPlot(
            document.getElementById('subscription-count'),
            [
                {
                    x: subscriptionCnt.map(item => item.paymentDate),
                    y: subscriptionCnt.map(item => item.amount),
                    type: 'bar',
                    marker: {
                        color: 'blue', // Установите цвет графика на синий
                        opacity: 0.6 // Установите прозрачность ключевых точек
                    },
                    line: {
                        color: 'blue' // Установите цвет линии графика на синий
                    },
                    name: 'Оформленные подписки'
                },
                {
                    x: subscriptionCnt.map(item => item.paymentDate),
                    y: [6, 7, 13, 25, 43, 50],
                    type: 'bar',
                    marker: {
                        color: 'red', //  цвет второго графика на красный
                        opacity: 0.6 //  прозрачность ключевых точек
                    },
                    line: {
                        color: 'red' //  цвет линии второго графика на красный
                    },
                    name: 'Активные подписки'
                }],
            {title: 'Количество подписок'}
        );
        await Plotly.newPlot(
            document.getElementById('subscription-avg-cheque'),
            [{
                x: subscriptionAvgCheque.map(item => item.paymentDate),
                y: subscriptionAvgCheque.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Средний чек оформленной подписки'}
        );
        await Plotly.newPlot(
            document.getElementById('lost-revenue'),
            [{
                x: fundLostIncome.map(item => item.paymentDate),
                y: fundLostIncome.map(item => item.amount),
                type: 'scatter',
                marker: {
                    color: 'blue', // Установите цвет графика на синий
                    opacity: 0.6 // Установите прозрачность ключевых точек
                },
                line: {
                    color: 'blue' // Установите цвет линии графика на синий
                }
            }],
            {title: 'Упущенная выгода'}
        );
    }


</script>

{#if loading}
    <Text style="justify-content: center; align-items: center;"
    > {"Идет загрузка"}
        <LinearProgress progress={0.5} buffer={0.75}/>
    </Text>
{:else}
    <div class="container">
        <div class="chart-container">

            <div class="custom-daterange">
                <DateRangeSelect
                        {startDateMin}
                        {endDateMax}
                        {heading}
                        {labels}
                        {startDateId}
                        {endDateId}
                        on:onApplyDateRange={handleStatisticsDateRange}/>
            </div>
            <script type="text/javascript" src="https://cdn.plot.ly/plotly-2.14.0.min.js"></script>

            <div id="revenue"></div>
            <div id="average-order-value"></div>
            <div id="transaction-count"></div>
            <div id="subscription-avg-cheque"></div>
            <div id="subscription-count"></div>
            <div id="lost-revenue"></div>

        </div>
        <div class="calendar-container">
            <h1>{"Посмотреть статистику за день"}</h1>
            <InlineCalendar class="custom-color" bind:store {theme}/>
            <div class="grid">
                <button class="date-button" on:click={() => store.add(-1, 'year')}>-1y</button>
                <button class="date-button" on:click={() => store.add(-1, 'month')}>-1m</button>
                <button class="date-button" on:click={() => store.add(-1, 'day')}>-1d</button>
                <button class="date-button" on:click={() => store.add(1, 'year')}>+1y</button>
                <button class="date-button" on:click={() => store.add(1, 'month')}>+1m</button>
                <button class="date-button" on:click={() => store.add(1, 'day')}>+1d</button>
            </div>
            <h2>Выбран день: {dayjs($store?.selected).format('DD/MM/YYYY')}</h2>
            <div class="container">
                <Fab class="custom-fab" on:click={getStatistics} extended>
                    <Label>Посмотреть</Label>
                </Fab>
                <Fab class="custom-fab" on:click={cancel} extended>
                    <Label>Сбросить</Label>
                </Fab>
            </div>
        </div>
        {#if (step === "stata")}
            <div class="stat-container">
                {#each oneDayData as point, i}
                    <p class="calendar-text">{point.paymentDate}:<br>
                        {point.amount} {i === 1 ? 'подписок' : i === 3 ? 'платежей' : 'RUB'} </p>
                    <br>
                {/each}
            </div>
        {:else}

        {/if}
    </div>
{/if}

<style>
    :root {
        --dateSelectWidth: 135px;
    }

    h1 {
        font-size: 22px;
        text-align: center;
    }

    h2 {
        font-size: 20px;
        text-align: center;
    }

    * :global(.custom-daterange) {
        font-size: 25px;
        align-items: center;
        justify-content: center;
    }

    * :global(.custom-color) {
        background-color: darkblue;
        opacity: 0.6;
    }

    * :global(.custom-fab) {
        font-size: 20px;
        background-color: darkblue;
        opacity: 0.6;
    }

    .container {
        display: flex;
        gap: 10px;
        backdrop-filter: blur(2px);
    }

    .chart-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 700px;
        gap: 50px;
    }

    .calendar-container {
        display: flex;
        flex-direction: column;
        margin-left: 200px;
        gap: 10px;
        width: 300px;
        height: 100px;
        align-items: center;
    }

    .stat-container {
        flex-direction: column;
        margin-left: 60px;
        margin-top: 200px;
        height: 100vh;
        width: 80%;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(3, auto);
        justify-content: flex-end;
        gap: 10px;
        align-items: center;
        /*margin-top: 250px;*/
    }

    .date-button {
        font-size: 15px;
        padding: 10px 22px;
        background-color: darkblue;
        opacity: 0.6;
        color: white;
    }

    .calendar-text {
        /*position: absolute;*/
        font-size: 20px;
        /*top: 40%;*/
        /*right: 50%;*/
        /*transform: translate(0, -50%);*/
    }

    svg {
        position: relative;
        width: 100%;
        height: 200px;
    }


    .tick line {
        stroke: #e2e2e2;
        stroke-dasharray: 2;
    }

    .tick text {
        /*fill: #ccc;*/
        text-anchor: start;
        color: black;
        opacity: 0.7;
    }

    .tick.tick-0 line {
        stroke-dasharray: 0;
    }

    .x-axis .tick text {
        text-anchor: middle;
    }

    .bars rect {
        fill: darkblue;
        stroke: none;
        opacity: 0.6;
    }
</style>

