class RenderMonthsButton {
    constructor(props) {
        this.props = props;
        this.data = props.data;
    }

    render() {
        const { usMapData, month } = this.props;

        const data = this.data;
        d3.select('.bar-chart-controls')
            .selectAll('button')
            .data(MONTH_STRING)
            .enter()
            .append('button')
            .attr('class', 'month-btn')
            .text((d) => d)
            .classed('active', (d) => d == month)
            .on('click', function (d) {
                window.month = d;
                d3.selectAll('.loader-wrapper').style('display', 'flex');
                d3.selectAll('.bar-chart-wrapper').classed('loading', true);
                d3.selectAll('.map-container').classed('loading', true);
                setTimeout(() => {
                    const utils = new Utils();
                    const monthData = utils.filterMonthData(data, d);
                    const chartProps = {
                        data: monthData['data'],
                        rawdata: monthData,
                        usMapData,
                    };
                    const chart = new Chart(chartProps);
                    chart.update();
                    d3.selectAll('.month-btn').classed('active', false);
                    d3.select(this).classed('active', true);
                    d3.selectAll('.loader-wrapper').style('display', 'none');
                    d3.selectAll('.bar-chart-wrapper').classed(
                        'loading',
                        false,
                    );
                    d3.selectAll('.map-container').classed('loading', false);
                }, 500);
            });
    }
}
