class RenderLineArea {
    constructor(props) {
        this.props = props;
        this.data = props.data;
    }

    render() {
        const {data} = this.props
        const that =this;
        const barChartConfig = BAR_CHART_CONFIG[window.visualmode];
        const lineAreaConfig = LINE_CHART_CONFIG[window.visualmode]
        const mainEl = d3.select(lineAreaConfig.container);
        const h = mainEl.node().getBoundingClientRect().height;
        const w = mainEl.node().getBoundingClientRect().width;
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;

        // parse the date / time
        var parseTime = d3.timeParse('%d-%b-%y');
        //
        // // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
        //
        // // define the area
        // var area = d3
        //     .area()
        //     .x(function (d) {
        //         return x(d[barChartConfig.lineArea.xdata]);
        //     })
        //     .y0(height)
        //     .y1(function (d) {
        //         return y(d[barChartConfig.lineArea.ydata]);
        //     });
        //
        // // define the line
        var valueline = d3
            .line()
            .x(function (d) {
                return x(d[barChartConfig.lineArea.xdata]);
            })
            .y(function (d) {
                return y(d[barChartConfig.lineArea.ydata]);
            });
        //
        const lineContainer = d3.select(lineAreaConfig.container);
        lineContainer.select('svg').remove();
        var svg = lineContainer
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
                'transform',
                'translate(' + margin.left + ',' + margin.top + ')',
            );
        // // scale the range of the data
        x.domain(
            d3.extent(data, function (d) {
                return d[barChartConfig.lineArea.xdata];
            }),
        );
        y.domain([
            0,
            d3.max(data, function (d) {
                return d[barChartConfig.lineArea.ydata];
            }),
        ]);
        //
        // // add the area
        // svg.append('path')
        //     .data([data])
        //     .attr('class', 'highlight-area')
        //     .attr('d', area);
        //
        // // add the valueline path.
        // svg.append('path')
        //     .data([data])
        //     .attr('class', 'highlight-line')
        //     .attr('d', valueline);
        //
        // // add the X Axis
        // svg.append('g')
        //     .attr('transform', 'translate(0,' + height + ')')
        //     .call(d3.axisBottom(x));
        //
        // // add the Y Axis
        // svg.append('g').call(
        //     d3.axisLeft(y).tickFormat(function (d) {
        //         return formatYTickValue(d);
        //     }),
        // );
        //

        // scale the range of the data
        // x.domain(d3.extent(data, function(d) { return d.date; }));
        // y.domain([0, d3.max(data, function(d) { return d.close; })]);

        // add the valueline path.
        svg.append("path")
            .data([data])
            .attr("class", "highlight-line")
            .attr("d", valueline);

        // add the dots with tooltips
        const formatTime = d3.timeFormat("%B %d, %Y");

        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", 3)
            .attr("cx", function(d) { return x(d[barChartConfig.lineArea.xdata]); })
            .attr("cy", function(d) { return y(d[barChartConfig.lineArea.ydata]); })
            .on("mouseover", function(d) {
                that.createToolTip(d);
                // div.transition()
                //     .duration(200)
                //     .style("opacity", .9);
                // div.html(formatTime(d[barChartConfig.lineArea.xdata]) + "<br/>" + d[barChartConfig.lineArea.ydata])
                //     .style("left", (d3.event.pageX) + "px")
                //     .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                d3.select('.tooltip').style('display', 'none');
            });

        // add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        svg.append('g').call(
            d3.axisLeft(y).tickFormat(function (d) {
                return formatYTickValue(d);
            }))
        console.log(this.props,'s')
         const state = this.props.data[0]['state']
        const xlabel  = `Days of ${window.month}`
        const topLabel = `Trend of covid ${window.visualmode} by days in ${state}`
        d3.select('.line-area-top-label').text(topLabel)
        d3.select('.line-area-x-label').text(xlabel)


    }
    createToolTip(object) {
        console.log(object,'objs')
        const barChartConfig = BAR_CHART_CONFIG[window.visualmode];
        d3
            .select('.tooltip')
            .style('left', d3.event.pageX - 200 + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');

        const selector = d3.select('.tooltip');
        const totalFieldName = barChartConfig.mode
        selector.select('.state-name').text(object.state);
        selector
            .select('.totals')
            .text(`Total ${totalFieldName}: ${object[totalFieldName]}`);

        const formatTime = d3.timeFormat("%B %d, %Y");
        // "June 30, 2015"
        selector
            .select('.date')
            .text(`${formatTime(object.date)}`);
    }
}
