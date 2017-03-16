// import * as d3 from 'd3';
(function () {
    const baseNode = '.content';
    var baseNodeWidth = parseInt(window.getComputedStyle(document.querySelector(baseNode)).width);
    var baseNodeHeigth = parseInt(window.getComputedStyle(document.querySelector(baseNode)).height);

    var margin = {top: 20, right: 100, bottom: 30, left: 100};
    var width = baseNodeWidth - margin.left - margin.right;
    var height = baseNodeHeigth - margin.top - margin.bottom;

    var dataset = [
        {x: 0, y: 0, disabled: true},
        {x: 0, y: 5},
        {x: 1, y: 8},
        {x: 2, y: 13},
        {x: 3, y: 12},
        {x: 4, y: 16},
        {x: 5, y: 21},
        {x: 6, y: 18},
        {x: 7, y: 23},
        {x: 8, y: 24},
        {x: 9, y: 28},
        {x: 10, y: 35},
        {x: 11, y: 30},
        {x: 12, y: 32},
        {x: 13, y: 36},
        {x: 14, y: 40},
        {x: 15, y: 38},
        {x: 16, y: 20},
        {x: 17, y: 12},
        {x: 18, y: 5},
        {x: 19, y: 10},
        {x: 20, y: -3},
        {x: 21, y: -8},
        {x: 22, y: -15},
        {x: 23, y: -5},
        {x: 24, y: 5},
        {x: 25, y: 28},
        {x: 26, y: 35},
        {x: 27, y: 30},
        {x: 28, y: 32},
        {x: 29, y: 36},
        {x: 30, y: 40},
        {x: 31, y: 38},
        {x: 32, y: 0, disabled: true}
    ];

    var xx = d3.scaleLinear()
        .domain([-1, width + 1])
        .range([-1, width + 1]);

    var yy = d3.scaleLinear()
        .domain([-1, height + 1])
        .range([-1, height + 1]);

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function (d) {//интервал значений по оси Х
            return d.x;
        })])
        .range([0, width]);//типа растянуть по ширине всей свг X и оси и график и всё

    var yScale = d3.scaleLinear()
        .domain([
            d3.min(dataset, function (d) {
                return d.y;
            }),
            d3.max(dataset, function (d) {
                return d.y;
            })])
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .tickSizeInner(0)// раньше было значение -height. 0 укрывает вертикальные линии
        .tickSizeOuter(0)
        .tickPadding(10);// отступ значений от оси Х

    var yAxis = d3.axisLeft()
        .ticks(10)//разбиение, то есть какой интервал между двумя осями
        .scale(yScale)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(10);

    var line = d3.line()
        .x(function (d) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });

    var svg = d3.select(baseNode).append('svg')
        .attr('class', 'main-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');// устанавливает позицию отображения свг


    var svgDefs = svg.append('defs');
    var svgBackground = svg.append('rect')
        .attr('class', 'background')
        .attr('x',0)
        .attr('y',0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#fff');

    var mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient')
        .attr('x1', '0')
        .attr('x2', '0')
        .attr('y1', '0')
        .attr('y2', '1');

    var zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-100, -100], [width + 90, height + 100]])
        .on('zoom', zoomed);

    var tooltip = d3.select(baseNode).append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    function tooltipInner(x, y) {
        return `<div class='tooltip-inner'>
					<div class='tooltip_date'>13.01.16, 10:35</div>
					<div class='tooltip_title'>Добавлена услуга 'Везде как дома Россия' - 255 Р/мес.</div>
					<div class='tooltip_period'>
						<div class='tooltip_period-label'>Период деяствия</div>
						<div class='tooltip_period-value'>13.01.16 - 13.01.16</div>
					</div>
					<div class='tooltip_time'>25:41м.</div>
					<div class='tooltip_balance'>Баланс:
						<span>555</span> Р
					</div> 
				</div>`;
    }

    function tooltipLeft(x) {
        let tooltipNode = document.querySelector('.tooltip');
        // let svgLeft = margin.left;
        // let svgRight = width - margin.left;
        let tooltipWidth = parseInt(window.getComputedStyle(tooltipNode).width);
        let halfTooltip = (tooltipWidth) / 2;
        let toLeft;

        // if (x - halfTooltip - 6 < svgLeft) {
        //console.log('слева');
        ////set :before coord for tooltip
        //toLeft = svgLeft;
        //} else if (x > svgRight) {
        //console.log('справа');
        //// set :before coord for tooltip
        //toLeft = svgRight - (halfTooltip) / 2 + 9;
        // } else {
        console.log('в центре');
        toLeft = x - halfTooltip;
        // }

        return toLeft;
    }

    function tooltipTop(y) {
        let tooltipNode = document.querySelector('.tooltip');
        let tooltipHeight = parseInt(window.getComputedStyle(tooltipNode).height);
        let toTop = y - tooltipHeight - 23;
        return toTop;
    }


    mainGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0');
    mainGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1');

    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function(d) {
            return tooltipInner();
        })
    .offset([-10, 0]);
    svg.call(tip);

    // вертикальные линии сетки, кроме первой и ось Х
    var buildOsX = function () {
        var gX = svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')//TODO вместо height надо записать такое значение чтобы ось Х встала на свое место
            .call(xAxis);
    };

    // горизонтальные линии сетки, кроме первой и ось У
    var buildOsY = function () {
        var gY = svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    };

    // график, в смысле залитая область
    var buildArea = function () {
        svg.append('path')
            .data([dataset])
            .attr('class', 'filled')
            .attr('fill', '#000')
            .attr('d', line);
    };

    // график в точках
    var buildChart = function () {

        console.log('TADA!');

        svg.selectAll('.dot')
            .data(dataset.filter(function (item) {
                return !item.disabled;
            }))
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 7)
            .attr('stroke', '#12aaeb')
            .attr('stroke-width', '5')
            .attr('fill', '#fff')
            .attr('cx', function (d) {
                return xScale(d.x);
            })
            .attr('cy', function (d) {
                return yScale(d.y);
            })
            .on('mouseenter', tip.show)
            .on('mouseout', tip.hide);
    };

    buildOsX();
    buildOsY();
    buildChart();
    buildArea();
    svg.call(zoom);

    function zoomed() {
        // buildChart();
        console.log();
        // svg.selectAll('.dot')
        //     .attr('cx', function (d) {
        //         return xScale(d.x);
        //     })
        //     .attr('cy', function (d) {
        //         return yScale(d.y);
        //     });


        svg.attr('transform', d3.event.transform);
        // gX.call(xAxis.scale(d3.event.transform.rescaleX(xx)));	// непонятно, при движении в зуме у графика и осей рассинхрон
        // gY.call(yAxis.scale(d3.event.transform.rescaleY(yy)));
    }

    function resetted() {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
    }

})();

