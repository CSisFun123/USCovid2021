class RenderMap {
    constructor(props) {
        this.props = props;
        this.data = props.data;
    }

    update(newData) {
        this.data = newData.data;

        d3.select('.map-wrapper').selectAll('svg').remove();
        this.render();
    }

    render() {
        const totalFieldName = this.props.fields.find((f) => f.isTotal).label;

        const that = this;
        const mapWidth = this.props.width - this.props.legendOffset;
        const projection = d3
            .geoAlbersUsa()
            .translate([mapWidth / 2, this.props.height / 2])
            .scale([1000]);

        const path = d3.geoPath().projection(projection);
        d3.select(this.props.selector).select('svg').remove();
        this.svg = d3
            .select(this.props.selector)
            .append('svg')
            .attr('width', this.props.width)
            .attr('height', this.props.height);

        const dataArray = [];
        for (let d = 0; d < this.data.length; d++) {
            dataArray.push(parseFloat(this.data[d][totalFieldName]));
        }

        const minVal = d3.min(this.data, (d) => d[totalFieldName]);
        const maxVal = d3.max(this.data, (d) => d[totalFieldName]);

        const ramp = d3
            .scaleLinear()
            .domain([minVal, maxVal])
            .range([this.props.color.min, this.props.color.max]);

        for (let i = 0; i < this.data.length; i++) {
            const dataState = this.data[i].state;
            const putDataToMap = this.props.fields.map((gt) => ({
                ...gt,
                value: parseFloat(this.data[i][gt.label]),
            }));

            for (let j = 0; j < this.props.map.features.length; j++) {
                let jsonState = this.props.map.features[j].properties.name;

                if (dataState == jsonState) {
                    putDataToMap.forEach((item) => {
                        this.props.map.features[j].properties[item.label] =
                            item.value;
                    });

                    break;
                }
            }
        }

        const states = this.svg.append('g').classed('states-group', true);

        states
            .selectAll('path')
            .data(this.props.map.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('class', 'map-path')
            .attr('stroke', '#fff')
            .attr('stroke-width', '1')
            .attr('fill', '#fff')
            .on('mouseover', function (d) {
                that.createToolTip(d);
            })
            .on('mouseout', function (d) {
                d3.select('.tooltip-map').style('display', 'none');
            });
        states
            .selectAll('path')
            .transition()
            .duration(1)
            .attr('fill', function (d) {
                return d.properties[totalFieldName]
                    ? ramp(d.properties[totalFieldName])
                    : 'lightgray';
            })
            .delay(function (d, i) {
                return i * 20;
            });
        this.createLegend(minVal, maxVal);
    }

    createLegend(minVal, maxVal) {
        const legendSVG = this.svg
            .append('g')
            .attr('class', 'legend')
            .attr(
                'transform',
                `translate(${this.props.width - this.props.legendOffset},100)`,
            );
        const legendString = `Total ${this.props.legend}`;
        legendSVG
            .append('text')
            .text(legendString)
            .attr('transform', `translate(0,-15)`);

        const legend = legendSVG
            .append('defs')
            .append('svg:linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '100%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '100%')
            .attr('spreadMethod', 'pad');

        legend
            .append('stop')
            .attr('offset', '0%')
            .attr('stop-color', this.props.color.max)
            .attr('stop-opacity', 1);

        legend
            .append('stop')
            .attr('offset', '100%')
            .attr('stop-color', this.props.color.min)
            .attr('stop-opacity', 1);

        legendSVG
            .append('rect')
            .attr('width', this.props.legendWidth - 100)
            .attr('height', this.props.legendHeight)
            .style('fill', 'url(#gradient)');

        const y = d3
            .scaleLinear()
            .range([this.props.legendHeight, 0])
            .domain([minVal, maxVal]);
        const formatYTickValue = d3.format('.2s');
        const yAxis = d3.axisRight(y).tickFormat(function (d) {
            return formatYTickValue(d);
        });

        legendSVG
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', 'translate(41,0)')
            .call(yAxis);

        const labelString = `U.S map showing covid ${this.props.legend} in by states on ${this.props.month}`;
        d3.select('.map-chart-top-label').text(labelString);
    }

    createToolTip(object) {
        d3.select('.tooltip')
            .style('left', d3.event.pageX - 200 + 'px')
            .style('top', d3.event.pageY + 20 + 'px')
            .style('display', 'flex');

        const selector = d3.select('.tooltip');
        const totalFieldName = this.props.fields.find((f) => f.isTotal).label;
        selector.select('.state-name').text(object.properties.name);
        selector
            .select('.totals')
            .text(`Total : ${object.properties[totalFieldName]}`);
    }
}
