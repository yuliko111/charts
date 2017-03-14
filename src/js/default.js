	// import * as d3 from 'd3';
(function () {
	var margin = {top: 20, right: 100, bottom: 30, left: 100},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var dataset = [
		{x: 0, y: 0},
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
		{x: 15, y: 0},
	];

	// возвращасет значение примерно в 3 раза больше (для X)

	var xScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function (d) {
			return d.x;
		})])
		.range([0, width]);

	var yScale = d3.scale.linear()
		.domain([0, d3.max(dataset, function (d) {
			return d.y;
		})])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.innerTickSize(-height)
		.outerTickSize(0)
		.tickPadding(10);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.innerTickSize(-width)
		.outerTickSize(0)
		.tickPadding(10);

	var line = d3.svg.line()
		.x(function (d) {
			return xScale(d.x);
		})
		.y(function (d) {
			return yScale(d.y);
		});

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");// устанавливает позицию отображения свг


	var svgDefs = svg.append('defs');

	var mainGradient = svgDefs.append('linearGradient')
		.attr('id', 'mainGradient')
		.attr('x1', '0')
		.attr('x2', '0')
		.attr('y1', '0')
		.attr('y2', '1');

	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);

	mainGradient.append('stop')
		.attr('class', 'stop-left')
		.attr('offset', '0');
	mainGradient.append('stop')
		.attr('class', 'stop-right')
		.attr('offset', '1');


	// вертикальные линии сетки
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	// горизонтальные линии сетки
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	// график
	svg.append("path")
		.data([dataset])
		.attr("class", "filled")
		.attr("fill", "#000")
		.attr("d", line);

	// console.log(d.x);

	svg.selectAll("dot")
		.data(dataset)
		.enter().append("circle")
		.attr("r", 5)
		.attr("cx", function(d) { return xScale(d.x); })
		.attr("cy", function(d) { return yScale(d.y); })
		.on("mouseover", function(d) {
			console.log('left', (d3.event.pageX));
			console.log('top', (d3.event.pageY));
			tooltip.transition()
				.duration(200)
				.style("opacity", .9);
			tooltip.html(d.x + "<br/>"  + d.y)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			console.log('2 mouseout');
			tooltip.transition()
				.duration(500)
				.style("opacity", 0);
		});


})();

