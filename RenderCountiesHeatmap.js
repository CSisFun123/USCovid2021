class RenderCountiesHeatmap {
    constructor(pros) {
    this.props = pros;
    this.data = pros.data;
    }




    render(){
        const that = this;
        console.log(this.props,'prop')
        const mainEl = d3.select(this.props.container);
        mainEl.select('svg').remove();
        const h = mainEl.node().getBoundingClientRect().height;
        const w = mainEl.node().getBoundingClientRect().width;
        console.log(this.props)
        var margin = { top: 20, right: 20, bottom: 20, left: 40 },
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;
        var svg = mainEl
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        const sorted = this.data.slice().sort((a, b)=>b.cases-a.cases)
        const daysNumeric = [...new Set(this.data.map((item) => item.dateNumeric))];
        const topTenCounties = sorted.filter(s=>s.dateNumeric==daysNumeric[0]).slice(0,10)
        const counties = [...new Set(topTenCounties.map((item) => item.county))];
        console.log(daysNumeric,counties)
        // set the dimensions and margins of the graph



// Labels of row and columns
        var myGroups = counties
        var myVars = daysNumeric

// Build X scales and axis:
        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(myVars)
            .padding(0.01);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))

// Build X scales and axis:
        var y = d3.scaleBand()
            .range([ height, 0 ])
            .domain(myGroups)
            .padding(0.01);
        svg.append("g")
            .call(d3.axisLeft(y));
     const   min = d3.min(this.data, function (d) {
         return d['cases'];
     })
   const     max =      d3.max(this.data, function (d) {
       return d['cases'];
   })
// Build color scale
        var myColor = d3.scaleLinear()
            .range(["#FFE0E0", "#FF0000"])
            .domain([min,max])

        svg.selectAll()
            .data(this.data, function(d) {return d.dateNumeric+':'+d.county;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.dateNumeric) })
            .attr("y", function(d) { return y(d.county) })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.cases)} )
            .on('mouseover', function(d) {
                that.createToolTip(d);
            })
            .on('mouseout', function(d) {
                d3.select('.tooltip').style('display', 'none');
            });
              const xlabel  = `Days of ${window.month}`
            d3.select('.heatmap-y-label').text('County')
            d3.select('.heatmap-x-label').text(xlabel)
        const state = this.props.data[0]['state']
        const topLabel = `Top 10 counties of ${state}`
            d3.select('.heatmap-top-label').text(topLabel)

    }
    createToolTip(object) {

        const barChartConfig = BAR_CHART_CONFIG[window.visualmode];
        d3
            .select('.tooltip')
            .style('left', d3.event.pageX - 200 + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');

        const selector = d3.select('.tooltip');
        const totalFieldName = barChartConfig.mode
        selector.select('.state-name').text(object.county);
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