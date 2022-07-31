class RenderLineArea {
    constructor(props) {
        this.props = props;
        this.data = props.data;
    }

    render() {
        const { data } = this.props;
        const that = this;
        const barChartConfig = BAR_CHART_CONFIG[window.visualmode];
        const lineAreaConfig = LINE_CHART_CONFIG[window.visualmode];
        const mainEl = d3.select(lineAreaConfig.container);
        const h = mainEl.node().getBoundingClientRect().height;
        const w = mainEl.node().getBoundingClientRect().width;
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };
        const width = w - margin.left - margin.right;
        const height = h - margin.top - margin.bottom;
        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleLinear().range([height, 0]);
        const valueline = d3
            .line()
            .x((d) => x(d[barChartConfig.lineArea.xdata]))
            .y((d) => y(d[barChartConfig.lineArea.ydata]));

        const lineContainer = d3.select(lineAreaConfig.container);
        lineContainer.select('svg').remove();
        const svg = lineContainer
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')',
            );

        x.domain(d3.extent(data, (d) => d[barChartConfig.lineArea.xdata]));
        y.domain([0, d3.max(data, (d) => d[barChartConfig.lineArea.ydata])]);

        svg.append('path')
            .data([data])
            .attr('class', 'highlight-line')
            .attr('d', valueline);

        svg.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', 3)
            .attr('cx', (d) => x(d[barChartConfig.lineArea.xdata]))
            .attr('cy', (d) => y(d[barChartConfig.lineArea.ydata]))
            .on('mouseover', (d) => that.createToolTip(d))
            .on('mouseout', function (d) {
                d3.select('.tooltip').style('display', 'none');
            });

        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x).ticks(5));

        svg.append('g').call(
            d3.axisLeft(y).tickFormat(function (d) {
                return formatYTickValue(d);
            }),
        );

        const state = this.props.data[0]['state'];
        const xlabel = `Days of ${window.month}`;
        const topLabel = `Trend of covid ${window.visualmode} by days in ${state}`;
        d3.select('.line-area-top-label').text(topLabel);
        d3.select('.line-area-x-label').text(xlabel);
    }
    createToolTip(object) {
        const barChartConfig = BAR_CHART_CONFIG[window.visualmode];
        d3.select('.tooltip')
            .style('left', d3.event.pageX - 200 + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');
        const selector = d3.select('.tooltip');
        const totalFieldName = barChartConfig.mode;
        selector.select('.state-name').text(object.state);
        selector
            .select('.totals')
            .text(`Total ${totalFieldName}: ${object[totalFieldName]}`);
        const formatTime = d3.timeFormat('%B %d, %Y');
        selector.select('.date').text(`${formatTime(object.date)}`);
    }
}
