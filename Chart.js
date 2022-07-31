class Chart {
    constructor(props) {
        this.props = props;
        this.data = props.data;
    }

    update() {
        const { data, usMapData } = this.props;
        const barChartProps = {
            data: data,
            rawdata: this.props.rawdata,
        };
        const barChart = new RenderBarChart(barChartProps);
        barChart.render();
        const mainEl = d3.select(mapChartConfig.container);
        const h = mainEl.node().getBoundingClientRect().height;
        const w = mainEl.node().getBoundingClientRect().width;
        const mapFields = [
            {
                label: window.visualmode,
                isTotal: true,
            },
        ];
        const mapProps = {
            map: usMapData,
            data,
            height: h,
            width: w,
            legendOffset: 100,
            legendWidth: 140,
            legendHeight: 300,
            color: {
                min: '#f9f9f9',
                max: '#bc2a66',
            },
            selector: '.map-chart',
            fields: mapFields,
            legend: BAR_CHART_CONFIG[window.visualmode].mode,
            month: window.month,
        };

        const createMap = new RenderMap(mapProps);
        createMap.render();
    }
}
