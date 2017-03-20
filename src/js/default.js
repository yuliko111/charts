// import * as d3 from 'd3';
(function () {
    let baseNode = '.content';
    let baseNodeWidth = parseInt(window.getComputedStyle(document.querySelector(baseNode)).width);
    let baseNodeHeigth = parseInt(window.getComputedStyle(document.querySelector(baseNode)).height);

    let margin = {top: 20, right: 100, bottom: 30, left: 100};
    let width = baseNodeWidth - margin.left - margin.right;
    let height = baseNodeHeigth - margin.top - margin.bottom;

    let chart, area;

    let dataset1 = [
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
        {x: 31, y: 38}
    ];

    let dataset2 = [{
        "eventStartDate": "2017-02-20T08:32:432Z",
        "eventFinishDate": "2017-02-20T08:34:434Z",
        "processDate": "2017-02-20T08:47:436Z",
        "eventName": "Связь. Исходящая (_Сотовые операторы)",
        "amount": 20,
        "metricUnit": 4,
        "cost": 3,
        "balance": 3115.55
    }, {
        "eventStartDate": "2017-02-20T12:06:499Z",
        "eventFinishDate": "2017-02-20T12:06:499Z",
        "processDate": "2017-02-21T12:08:649Z",
        "eventName": "Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 100,
        "balance": 3215.55
    }, {
        "eventStartDate": "2017-02-20T21:31:649Z",
        "eventFinishDate": "2017-02-20T21:30:549Z",
        "processDate": "2017-02-22T21:36:949Z",
        "eventName": "Связь. Входящая (_Международная, СНГ)",
        "amount": 9,
        "metricUnit": 4,
        "cost": 2.50,
        "balance": 3213.05
    }];

    let dataset3 = [{
        "eventStartDate": "2017-03-10T08:32:43Z",
        "eventFinishDate": "2017-03-10T08:34:43Z",
        "processDate": "2017-03-10T08:47:43Z",
        "eventName": "Связь. Исходящая (_Сотовые операторы)",
        "amount": 20,
        "metricUnit": 4,
        "cost": 3,
        "balance": 3115.55
    }, {
        "eventStartDate": "2017-03-10T12:06:49Z",
        "eventFinishDate": "2017-03-10T12:06:49Z",
        "processDate": "2017-03-10T12:08:49Z",
        "eventName": "Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 100,
        "balance": 3215.55
    }, {
        "eventStartDate": "2017-03-10T21:31:64Z",
        "eventFinishDate": "2017-03-10T21:30:54Z",
        "processDate": "2017-03-10T21:36:49Z",
        "eventName": "Связь. Исходящая (_Международная, СНГ)",
        "amount": 9,
        "metricUnit": 4,
        "cost": 2.50,
        "balance": 3213.05
    }, {
        "eventStartDate": "2017-03-10T06:15:84Z",
        "eventFinishDate": "2017-03-10T06:30:54Z",
        "processDate": "2017-03-10T06:30:49Z",
        "eventName": "Связь. Входящая (_Сотовые операторы)",
        "amount": 15,
        "metricUnit": 4,
        "cost": 0,
        "balance": 3213.05
    }, {
        "eventStartDate": "2017-03-10T06:30:84Z",
        "eventFinishDate": "2017-03-10T06:31:54Z",
        "processDate": "2017-03-10T06:31:49Z",
        "eventName": "Связь. Входящая (_Сотовые операторы)",
        "amount": 1,
        "metricUnit": 4,
        "cost": 0,
        "balance": 3213.05
    }, {
        "eventStartDate": "2017-03-10T10:53:59Z",
        "eventFinishDate": "2017-03-10T10:53:59Z",
        "processDate": "2017-03-10T10:53:49Z",
        "eventName": "Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 50,
        "balance": 3255.55
    }, {
        "eventStartDate": "2017-03-10T10:55:59Z",
        "eventFinishDate": "2017-03-10T10:57:89Z",
        "processDate": "2017-03-10T10:57:49Z",
        "eventName": "Связь. Исходящая (_Международная, СНГ)",
        "amount": 2,
        "metricUnit": 4,
        "cost": 6.50,
        "balance": 3206.55
    }, {
        "eventStartDate": "2017-03-10T16:05:54Z",
        "eventFinishDate": "2017-03-10T16:07:89Z",
        "processDate": "2017-03-10T16:08:49Z",
        "eventName": "Связь. Исходящая (_Международная, СНГ)",
        "amount": 4,
        "metricUnit": 4,
        "cost": 4.90,
        "balance": 3204.12
    }, {
        "eventStartDate": "2017-03-10T23:05:54Z",
        "eventFinishDate": "2017-03-10T23:05:59Z",
        "processDate": "2017-03-10T23:05:49Z",
        "eventName": "SMS. Исходящая",
        "amount": 1,
        "metricUnit": 4,
        "cost": 3,
        "balance": 3201.12
    }, {
        "eventStartDate": "2017-03-11T00:01:59Z",
        "eventFinishDate": "2017-03-11T00:01:59Z",
        "processDate": "2017-03-11T00:02:59Z",
        "eventName": "SMS. Входящая",
        "amount": 1,
        "metricUnit": 4,
        "cost": 0,
        "balance": 3201.12
    }, {
        "eventStartDate": "2017-03-11T01:06:54Z",
        "eventFinishDate": "2017-03-11T01:12:54Z",
        "processDate": "2017-03-11T01:13:49Z",
        "eventName": "Связь. Исходящая (_Международная, СНГ)",
        "amount": 6,
        "metricUnit": 4,
        "cost": 5,
        "balance": 3199.12
    }, {
        "eventStartDate": "2017-03-11T14:32:54Z",
        "eventFinishDate": "2017-03-11T14:32:54Z",
        "processDate": "2017-03-11T14:32:49Z",
        "eventName": "Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 25,
        "balance": 3224.12
    }, {
        "eventStartDate": "2017-03-11T16:57:54Z",
        "eventFinishDate": "2017-03-11T17:19:54Z",
        "processDate": "2017-03-11T17:19:49Z",
        "eventName": "Связь. Исходящая (_Международная, СНГ)",
        "amount": 22,
        "metricUnit": 4,
        "cost": 87,
        "balance": 3137.12
    }, {
        "eventStartDate": "2017-03-11T20:07:54Z",
        "eventFinishDate": "2017-03-11T21:57:54Z",
        "processDate": "2017-03-11T17:19:59Z",
        "eventName": "GPRS",
        "amount": 114,
        "metricUnit": 4,
        "cost": 3601.14,
        "balance": -464.02
    }, {
        "eventStartDate": "2017-03-11T22:09:54Z",
        "eventFinishDate": "2017-03-11T22:12:54Z",
        "processDate": "2017-03-11T22:13:54Z",
        "eventName": "Связь. Исходящая (_Международная, СНГ)",
        "amount": 4,
        "metricUnit": 4,
        "cost": 17.4,
        "balance": -481.42
    }, {
        "eventStartDate": "2017-03-11T22:34:54Z",
        "eventFinishDate": "2017-03-11T22:36:54Z",
        "processDate": "2017-03-11T22:36:59Z",
        "eventName": "Связь. Исходящая (_Международная, СНГ)",
        "amount": 2,
        "metricUnit": 4,
        "cost": 7.3,
        "balance": -488.72
    }, {
        "eventStartDate": "2017-03-12T10:32:54Z",
        "eventFinishDate": "2017-03-12T10:32:54Z",
        "processDate": "2017-03-12T10:32:54Z",
        "eventName": "Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 500,
        "balance": 11.28
    }, {
        "eventStartDate": "2017-03-12T11:03:54Z",
        "eventFinishDate": "2017-03-12T11:10:54Z",
        "processDate": "2017-03-12T11:10:54Z",
        "eventName": "Связь. Входящая (_Сотовые операторы)",
        "amount": 2,
        "metricUnit": 4,
        "cost": 1.3,
        "balance": 9.98
    }];

    let newDataArr = [];
    let prepareDataIn = function (dataIn) {
        dataIn.forEach(function (item) {

            let DateFormatted = item.processDate.split('T');
            let year = +DateFormatted[0].split('-')[0];
            let month = +DateFormatted[0].split('-')[1];
            let day = +DateFormatted[0].split('-')[2];
            let hour = +DateFormatted[1].split(':')[0];
            let minute = +DateFormatted[1].split(':')[1];
            let second = +DateFormatted[1].split(':')[2].split('Z')[0];
            let millisecond = +DateFormatted[1].split(':')[2].split('Z')[0];

            let newProcessDate = new Date(year, month, day, hour, minute, second);
            let newProcessDate2 = newProcessDate.getDay() + '.' + newProcessDate.getMonth() + '  ' + newProcessDate.getHours() + ':' + newProcessDate.getMinutes();
            // console.log(newProcessDate2);

            // console.log('oldProcessDate', item.processDate);
            // console.log('newProcessDate', newProcessDate);
            let otherProcessDate = new Date(item.processDate);
            // console.log('otherProcessDate', otherProcessDate);
            // oldProcessDate совпадает с newProcessDate, но они не совпадают с otherProcessDate

            newDataArr.push({x: newProcessDate, y: item.balance});
        });
        return newDataArr;

    };

    let xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset1, function (d) {//интервал значений по оси Х
            return d.x;
        })])
        .range([0, width]);//типа растянуть по ширине всей свг X и оси и график и всё

    let yScale = d3.scaleLinear()
        .domain([
            d3.min(dataset1, function (d) {
                return d.y;
            }),
            d3.max(dataset1, function (d) {
                return d.y;
            })])
        .range([height, 0]);

    let xAxis = d3.axisBottom()
        .scale(xScale)
        .tickSizeInner(0)// раньше было значение -height. 0 скрывает вертикальные линии
        .tickSizeOuter(0)
        .tickPadding(25);// отступ значений от оси Х TODO сюда значение = min(data.x) * scale

    let yAxis = d3.axisLeft()
        .ticks(10)//разбиение, то есть какой интервал между двумя осями
        .scale(yScale)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(25);

    let line = d3.line()// как я понимаю на выходе строка типа  M0,327.27272727272725L0,286.3636363636364L23.75, ... , то есть
        .x(function (d) {
            return xScale(d.x);
        })
        .y(function (d) {
            return yScale(d.y);
        });

    let svg = d3.select(baseNode).append('svg')
        .attr('class', 'main-chart')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');// устанавливает позицию отображения свг


    let svgDefs = svg.append('defs');

    let svgBackground = svg.append('rect')
        .attr('class', 'background')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#fff');

    let mainGradient = svgDefs.append('linearGradient')
        .attr('id', 'mainGradient')
        .attr('x1', '0')
        .attr('x2', '0')
        .attr('y1', '0')
        .attr('y2', '1');

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

    mainGradient.append('stop')
        .attr('class', 'stop-left')
        .attr('offset', '0');
    mainGradient.append('stop')
        .attr('class', 'stop-right')
        .attr('offset', '1');

    let tip = d3.tip()
        .attr('class', 'd3-tip tooltip')
        .html(function (d) {
            return tooltipInner();
        })
        .offset([-10, 0]);
    svg.call(tip);

    let gY, gX;
    // вертикальные линии сетки, кроме первой и ось Х
    let buildOsX = function () {

        gX = svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
    };

    // горизонтальные линии сетки, кроме первой и ось У
    let buildOsY = function () {
        gY = svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        d3.selectAll('g.tick').each(function (d) {
            if (d === 0) {
                this.classList.add('zero-tick');
            }
        })

    };

    let prepareDataAxis = function () {
        let minValY = d3.min(dataset1, function (d) {//интервал значений по оси Х
            return d.y;
        });
        let maxValX = d3.max(dataset1, function (d) {//интервал значений по оси Х
            return d.x;
        });
        dataset1.unshift({x: 0, y: minValY, disabled: true});
        dataset1.push({x: maxValX, y: minValY, disabled: true});
    };

    // график в точках
    let buildChart = function () {

        chart = svg
            .append('svg')
            .attr('class', 'chart-area')
            .selectAll('.dot')
            .data(dataset1.filter(function (item) {
                return !item.disabled;
            }))
            .enter()
            .append('circle')
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

        svg.selectAll('.dot').each(function (d) {
            if (d.y < 0) {
                this.setAttribute('stroke', 'red');
            }
        });
    };

    // график, в смысле залитая область
    let buildArea = function () {
        area = svg.selectAll('svg')
            .append('path')
            .data([dataset1])
            .attr('class', 'filled')
            .attr('fill', '#000')
            .attr('d', line);

        // .transition() // Wait one second. Then brown, and remove.
        //     .ease(d3.easeElastic)
        //     .delay(1000)
        //     .style("fill", "brown");
        // .remove();

    };

    let zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-100, -100], [width + 90, height + 100]])
        .on('zoom', zoomed);

    function zoomed() {

        let transform = d3.event.transform;

        gX.call(xAxis.scale(transform.rescaleX(xScale)));
        gY.call(yAxis.scale(transform.rescaleY(yScale)));

        chart
            .attr('cx', function (d) {
                return transform.applyX(xScale(d.x));
            })
            .attr('cy', function (d) {
                return transform.applyY(yScale(d.y));
            });

        let line = d3.line()// как я понимаю на выходе строка типа  M0,327.27272727272725L0,286.3636363636364L23.75, ... , то есть
            .x(function (d) {
                return transform.applyX(xScale(d.x));
            })
            .y(function (d) {
                return transform.applyY(yScale(d.y));
            });

        area.attr('d', line);


        // TODO после перерисовки осей, получать новые даныне и перестраивать график

    }


    prepareDataAxis();
    buildOsX();
    buildOsY();
    buildChart();
    buildArea();


    svg.call(zoom.transform, d3.zoomIdentity);
    svg.call(zoom);


    console.log('newDataArr', newDataArr);
    console.log('dataset1', dataset1);

})();