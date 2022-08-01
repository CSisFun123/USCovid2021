d3.selectAll('.loader-wrapper-data').style('display', 'flex');

queue()
    .defer(d3.csv, 'us.csv')
    .defer(d3.csv, 'us-states.csv')
    .defer(d3.csv, 'us-counties.csv')
    .defer(d3.csv, 'statecode.csv')
    .defer(d3.json, 'us-states.json')
    .awaitAll(ready);
const parseTime = d3.timeParse('%Y-%m-%d');
const MONTH_STRING = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const MONTH_START = MONTH_STRING[0];

const BAR_CHART_CONFIG = {
    cases: {
        xdata: 'statecode',
        ydata: 'cases',
        container: '.bar-chart',
        invert: 'deaths',
        labelString: 'Total Covid-19 cases',
        mode: 'cases',
        lineArea: {
            xdata: 'date',
            ydata: 'cases',
        },
    },
    deaths: {
        xdata: 'statecode',
        ydata: 'deaths',
        container: '.bar-chart',
        invert: 'cases',
        labelString: 'Total Covid-19 deaths',
        mode: 'deaths',
        date: 'date',
        lineArea: {
            xdata: 'date',
            ydata: 'deaths',
        },
    },
};
const LINE_CHART_CONFIG = {
    cases: {
        xdata: 'statecode',
        ydata: 'avgeragecases',
        container: '.line-area',
    },
    deaths: {
        xdata: 'statecode',
        ydata: 'avgeragedeaths',
        container: '.line-area',
    },
};
const lineAreaConfig = {};
const mapChartConfig = {
    container: '.map-chart',
};
const heatmapChartConfig = {
    container: '.heatmap-chart',
};
const formatYTickValue = d3.format('.2s');

const attachEventToInvert = (dataByMonth, usMapData) => {
    d3.select('.bar-invert').on('click', function () {
        const invertTo = d3.select(this).attr('invert');
        console.log('ddd');
        const utils = new Utils();
        const monthData = utils.filterMonthData(dataByMonth, window.month);
        window.visualmode = invertTo;
        const chartProps = {
            data: monthData['data'],
            rawdata: monthData,
            usMapData,
        };
        const chart = new Chart(chartProps);
        chart.update();

        const invertText = `View ${BAR_CHART_CONFIG[invertTo]['invert']}`;
        d3.select('.bar-invert')
            .attr('invert', BAR_CHART_CONFIG[invertTo]['invert'])
            .text(invertText);
    });
};
function ready(err, results) {
    console.log(results);
    const statesdata = results[1];
    const countiesdata = results[2];
    const statecodes = results[3];
    const usMapData = results[4];
    const utils = new Utils();
    const dataByMonth = utils.formatStateDateByMonth(
        statesdata,
        countiesdata,
        statecodes,
    );
    const monthData = utils.filterMonthData(dataByMonth, MONTH_START);


    attachEventToInvert(dataByMonth, usMapData);
    window.visualmode = BAR_CHART_CONFIG.cases.mode;
    window.month = MONTH_START;
    const monthsButtonProps = {
        data: dataByMonth,
        month: MONTH_START,
        usMapData,
    };
    const monthButtons = new RenderMonthsButton(monthsButtonProps);
    monthButtons.render();
    const chartProps = {
        data: monthData['data'],
        rawdata: monthData,
        usMapData,
    };

    const chart = new Chart(chartProps);
    chart.update();
    d3.selectAll('.loader-wrapper-data').style('display', 'none');
    const invertText = `View ${BAR_CHART_CONFIG[window.visualmode].invert}`;
    d3.select('.bar-invert')
        .attr('invert', BAR_CHART_CONFIG[window.visualmode].invert)
        .text(invertText);
    d3.select('.close-side-panel').on('click', function () {
        d3.select('.side-panel').style('display', 'none');
    });
}
