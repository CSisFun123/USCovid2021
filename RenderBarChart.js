class RenderBarChart {
    constructor(props) {
        this.props = props;
        this.data = props.data;
    }

    render() {
        const that = this;
        const barChartConfig = BAR_CHART_CONFIG[window.visualmode];
        const mainEl = d3.select(barChartConfig.container);
        const h = mainEl.node().getBoundingClientRect().height;
        const w = mainEl.node().getBoundingClientRect().width;
        let data = this.data;
        const rederdata = this.props.rawdata;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = w - margin.left - margin.right;
        const height = h - margin.top - margin.bottom;
        const x = d3.scaleBand().range([0, width]).padding(0.1);
        const y = d3.scaleLinear().range([height, 0]);
        const barContainer = d3.select(barChartConfig.container);
        barContainer.select('svg').remove();
        const svg = barContainer
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')',
            );

        x.domain(data.map((d) => d[barChartConfig.xdata]));
        y.domain([0, d3.max(data, (d) => d[barChartConfig.ydata])]);

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'rect')
            .attr('x', (d) => x(d[barChartConfig.xdata]))
            .attr('width', x.bandwidth())
            .attr('height', (d) => height - y(0))
            .attr('y', (d) => y(0))
            .on('click', function (d) {
                d3.select('.side-panel')
                    .style('display', 'flex')
                    .style('opacity', '1');
                svg.selectAll('.rect').classed('active', false);
                d3.select(this).classed('active', true);
                const lineAreaProps = {
                    data: d['data'],
                    rawdata: d,
                };
                const lineArea = new RenderLineArea(lineAreaProps);
                lineArea.render();
                const heatmapProps = {
                    ...heatmapChartConfig,
                    data: d.countiesdata,
                    rawdata: d,
                };
                const heatmap = new RenderCountiesHeatmap(heatmapProps);
                heatmap.render();
            })
            .on('mouseover', (d) => that.createToolTip(d))
            .on('mouseout', function (d) {
                d3.select('.tooltip').style('display', 'none');
            });
        svg.selectAll('rect')
            .transition()
            .duration(1)
            .attr('y', (d) => y(d[barChartConfig.ydata]))
            .attr('height', (d) => height - y(d[barChartConfig.ydata]))
            .delay((d, i) => i * 20);
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));

        svg.append('g').call(
            d3.axisLeft(y).tickFormat((d) => formatYTickValue(d)),
        );

        const valueline = d3
            .line()
            .x((d) => x(d[LINE_CHART_CONFIG[window.visualmode].xdata]))
            .y((d) => y(d[LINE_CHART_CONFIG[window.visualmode].ydata]));

        svg.append('path')
            .data([data])
            .attr('class', 'averageline')
            .attr('d', valueline);
        const totalCaseString = `Total Cases: ${rederdata.totalCases}`;
        const totalDeathstring = `Total Deaths: ${rederdata.totalDeaths}`;
        d3.select('.total-cases-text').text(totalCaseString);
        d3.select('.total-death-text').text(totalDeathstring);
        let total = ``;
        if (barChartConfig.invert == 'deaths') {
            total = rederdata.totalCases;
        }
        if (barChartConfig.invert == 'cases') {
            total = rederdata.totalDeaths;
        }
        const totalString = `${barChartConfig.labelString} in ${window.month}: ${total}`;
        d3.select('.total-text').text(totalString);
        const labelString = `${rederdata.month} covid ${barChartConfig.mode} in by states`;
        d3.select('.bar-chart-top-label').text(labelString);
        d3.select('.bar-chart-x-label').text('States');
        const infoText = 'Please click on the bar to know more about state';

        d3.select('.bar-chart-info-label').text(infoText);
    }
    createToolTip(object) {
        const barChartConfig = BAR_CHART_CONFIG[window.visualmode];
        let left = 0;
        if(d3.event.pageX - 200 > 0 ){
            left =d3.event.pageX - 200
        }
        d3.select('.tooltip')
            .style('left', left + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');

        const selector = d3.select('.tooltip');
        const totalFieldName = barChartConfig.mode;
        selector.select('.state-name').text(object.state);
        selector
            .select('.totals')
            .text(`Total ${totalFieldName}: ${object[totalFieldName]}`);
    }
}
