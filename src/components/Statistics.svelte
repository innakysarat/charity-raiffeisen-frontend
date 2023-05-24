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

    let widthAvg = 500;
    let heightAvg = 1000;

    function formatMobile(tick) {
        return "'" + tick.toString().slice(-2);
    }

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
                //xTicks = txData.map(item => item.date);
                //yTicks = txData.map(item => item.amount);
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
        //console.log(data.detail)
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
            <div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
                <svg>
                    <text x="250" y="15" text-anchor="middle" font-size="20" font-weight="bold" fill="black"
                          opacity="0.7">
                        {"Income"}
                    </text>
                    <!-- y axis -->
                    <g class="axis y-axis">
                        {#each yTicksIncome as tick}
                            <g class="tick tick-{tick}" transform="translate(0, {yScaleIncome(tick)})">
                                <line x2="100%"></line>
                                <text y="-4" font-size="10">{tick} {tick === 15000 ? ' RUB' : ''}</text>
                            </g>
                        {/each}
                    </g>

                    <!-- x axis -->
                    <g class="axis x-axis">
                        {#each fundIncome as point, i}
                            <g class="tick" transform="translate({barWidth / fundIncome.length - 25}, {height})">
                                <text x="{xScale(i) / fundIncome.length + 30}"
                                      y="-4">{width > 380 ? point.paymentDate : formatMobile(point.paymentDate)}</text>
                            </g>
                        {/each}
                    </g>

                    <g class='bars'>
                        {#each fundIncome as point, i}
                            <rect
                                    x="{xScale(i) / fundIncome.length + 30}"
                                    y="{yScaleIncome(point.amount)}"
                                    width="{barWidth / fundIncome.length}"
                                    height="{yScaleIncome(0) - yScaleIncome(point.amount)}"
                            ></rect>
                        {/each}
                    </g>
                </svg>
            </div>
            <div class="chart" bind:clientWidth={widthAvg} bind:clientHeight={heightAvg}>
                <svg class="svg">
                    <text x="250" y="15" text-anchor="middle" font-size="20" font-weight="bold" fill="black"
                          opacity="0.7">
                        {"Average Cheque"}
                    </text>
                    <!-- y axis -->
                    <g class="axis y-axis">
                        {#each yTicksAvgCheque as tick}
                            <g class="tick tick-{tick}" transform="translate(0, {yScaleAvgCheque(tick)})">
                                <line x2="100%"></line>
                                <text y="-4" font-size="10">{tick} {tick === 1500 ? ' RUB' : ''}</text>
                            </g>
                        {/each}
                    </g>

                    <!-- x axis -->
                    <g class="axis x-axis">
                        {#each averageCheque as point, i}
                            <g class="tick" transform="translate({barWidth / averageCheque.length - 25}, {height})">
                                <text x="{xScale(i) / averageCheque.length + 30}"
                                      y="-4">{width > 380 ? point.paymentDate : formatMobile(point.paymentDate)}</text>
                            </g>
                        {/each}
                    </g>

                    <g class='bars'>
                        {#each averageCheque as point, i}
                            <rect
                                    x="{xScale(i) / averageCheque.length + 30}"
                                    y="{yScaleAvgCheque(point.amount)}"
                                    width="{barWidth / averageCheque.length}"
                                    height="{yScaleAvgCheque(0) - yScaleAvgCheque(point.amount)}"
                            ></rect>
                        {/each}
                    </g>
                </svg>
            </div>
            <div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
                <svg>
                    <text x="250" y="15" text-anchor="middle" font-size="20" font-weight="bold" fill="black"
                          opacity="0.7">
                        {"Transaction Count"}
                    </text>
                    <!-- y axis -->
                    <g class="axis y-axis">
                        {#each yTicksCntTx as tick}
                            <g class="tick tick-{tick}" transform="translate(0, {yScaleCntTx(tick)})">
                                <line x2="100%"></line>
                                <text y="-4" font-size="10">{tick} {tick === 20 ? ' TRANSACTIONS' : ''}</text>
                            </g>
                        {/each}
                    </g>

                    <!-- x axis -->
                    <g class="axis x-axis">
                        {#each transactionCnt as point, i}
                            <g class="tick" transform="translate({barWidth / transactionCnt.length - 25}, {height})">
                                <text x="{xScale(i) / transactionCnt.length + 30}"
                                      y="-4">{width > 380 ? point.paymentDate : formatMobile(point.paymentDate)}</text>
                            </g>
                        {/each}
                    </g>

                    <g class='bars'>
                        {#each transactionCnt as point, i}
                            <rect
                                    x="{xScale(i) / transactionCnt.length + 30}"
                                    y="{yScaleCntTx(point.amount)}"
                                    width="{barWidth / transactionCnt.length}"
                                    height="{yScaleCntTx(0) - yScaleCntTx(point.amount)}"
                            ></rect>
                        {/each}
                    </g>
                </svg>
            </div>
            <div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
                <svg>
                    <text x="250" y="15" text-anchor="middle" font-size="20" font-weight="bold" fill="black"
                          opacity="0.7">
                        {"Subscription Count"}
                    </text>
                    <!-- y axis -->
                    <g class="axis y-axis">
                        {#each yTicksCntTx as tick}
                            <g class="tick tick-{tick}" transform="translate(0, {yScaleCntTx(tick)})">
                                <line x2="100%"></line>
                                <text y="-4" font-size="10">{tick} {tick === 20 ? ' SUBSCRIPTIONS' : ''}</text>
                            </g>
                        {/each}
                    </g>

                    <!-- x axis -->
                    <g class="axis x-axis">
                        {#each subscriptionCnt as point, i}
                            <g class="tick" transform="translate({barWidth / subscriptionCnt.length - 25}, {height})">
                                <text x="{xScale(i) / subscriptionCnt.length + 30}"
                                      y="-4">{width > 380 ? point.paymentDate : formatMobile(point.paymentDate)}</text>
                            </g>
                        {/each}
                    </g>

                    <g class='bars'>
                        {#each subscriptionCnt as point, i}
                            <rect
                                    x="{xScale(i) / subscriptionCnt.length + 30}"
                                    y="{yScaleCntTx(point.amount)}"
                                    width="{barWidth / subscriptionCnt.length}"
                                    height="{yScaleCntTx(0) - yScaleCntTx(point.amount)}"
                            ></rect>
                        {/each}
                    </g>
                </svg>
            </div>
            <div class="chart" bind:clientWidth={widthAvg} bind:clientHeight={heightAvg}>
                <svg class="svg">
                    <text x="250" y="15" text-anchor="middle" font-size="20" font-weight="bold" fill="black"
                          opacity="0.7">
                        {"Subscription Average Cheque"}
                    </text>
                    <!-- y axis -->
                    <g class="axis y-axis">
                        {#each yTicksAvgCheque as tick}
                            <g class="tick tick-{tick}" transform="translate(0, {yScaleAvgCheque(tick)})">
                                <line x2="100%"></line>
                                <text y="-4" font-size="10">{tick} {tick === 1500 ? ' RUB' : ''}</text>
                            </g>
                        {/each}
                    </g>

                    <!-- x axis -->
                    <g class="axis x-axis">
                        {#each subscriptionAvgCheque as point, i}
                            <g class="tick"
                               transform="translate({barWidth / subscriptionAvgCheque.length - 25}, {height})">
                                <text x="{xScale(i) / subscriptionAvgCheque.length + 30}"
                                      y="-4">{width > 380 ? point.paymentDate : formatMobile(point.paymentDate)}</text>
                            </g>
                        {/each}
                    </g>

                    <g class='bars'>
                        {#each subscriptionAvgCheque as point, i}
                            <rect
                                    x="{xScale(i) / subscriptionAvgCheque.length + 30}"
                                    y="{yScaleAvgCheque(point.amount)}"
                                    width="{barWidth / subscriptionAvgCheque.length}"
                                    height="{yScaleAvgCheque(0) - yScaleAvgCheque(point.amount)}"
                            ></rect>
                        {/each}
                    </g>
                </svg>
            </div>
            <div class="chart" bind:clientWidth={width} bind:clientHeight={height}>
                <svg>
                    <text x="250" y="15" text-anchor="middle" font-size="20" font-weight="bold" fill="black"
                          opacity="0.7">
                        {"Lost Income"}
                    </text>
                    <!-- y axis -->
                    <g class="axis y-axis">
                        {#each yTicksLostIncome as tick}
                            <g class="tick tick-{tick}" transform="translate(0, {yScaleLostIncome(tick)})">
                                <line x2="100%"></line>
                                <text y="-4" font-size="10">{tick} {tick === 100000 ? ' RUB' : ''}</text>
                            </g>
                        {/each}
                    </g>

                    <!-- x axis -->
                    <g class="axis x-axis">
                        {#each fundLostIncome as point, i}
                            <g class="tick" transform="translate({barWidth / fundLostIncome.length - 25}, {height})">
                                <text x="{xScale(i) / fundLostIncome.length + 30}"
                                      y="-4">{width > 380 ? point.paymentDate : formatMobile(point.paymentDate)}</text>
                            </g>
                        {/each}
                    </g>

                    <g class='bars'>
                        {#each fundLostIncome as point, i}
                            <rect
                                    x="{xScale(i) / fundLostIncome.length + 30}"
                                    y="{yScaleLostIncome(point.amount)}"
                                    width="{barWidth / fundLostIncome.length}"
                                    height="{yScaleLostIncome(0) - yScaleLostIncome(point.amount)}"
                            ></rect>
                        {/each}
                    </g>
                </svg>
            </div>
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
                        {point.amount} {i === 1 ? 'транзакций' : 'RUB'} </p>
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
        margin-left: 40px;
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

    .chart {
        width: 100%;
        /*width: 500px;*/
        display: block;
        float: left;
        margin-right: 20px;
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

    .tick {
        font-family: Helvetica, Arial;
        font-size: .725em;
        font-weight: 200;
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

