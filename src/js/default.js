// import * as d3 from 'd3';
(function () {
    let buildChart = function (data, typeChart, nameChart) {

        let options, chartNodeClass;
        let chart, area;
        let rawData = data;

        switch (typeChart) {
            case 'balanceChart':
                options = {
                    title: '',
                    units: 'Р.',
                    zoom: true,
                    dots: true,
                    axisX: true,
                    tooltip: true
                };
                chartNodeClass = '.chart-balance';
                break;
            case 'accumulatorChart':
                options = {
                    zoom: false,
                    dots: false,
                    axisX: false,
                    tooltip: false
                };
                switch (nameChart) {
                    case 'traffic':
                        options = {
                            title: 'Трафик',
                            units: 'Gb' // or Mb
                        };
                        chartNodeClass = '.chart-traffic';
                        break;
                    case 'minutes':
                        options = {
                            title: 'Минуты',
                            units: 'мин.'
                        };
                        chartNodeClass = '.chart-minutes';
                        break;
                    case 'sms':
                        options = {
                            title: 'СМС',
                            units: 'шт.'
                        };
                        chartNodeClass = '.chart-sms';
                        break;
                    default:
                    // console.log('I don`t know 1!!!');
                }
                break;
            default:
            // console.log('I don`t know 2!!!');
        }


        let baseNodeClass = chartNodeClass;
        let baseNode = document.querySelector(baseNodeClass);

        //очистка старого графика если он был
        baseNode.innerHTML = '';

        let baseNodeWidth = parseInt(window.getComputedStyle(baseNode).width);
        let baseNodeHeigth = parseInt(window.getComputedStyle(baseNode).height);

        let margin = {top: 20, right: 100, bottom: 30, left: 100};
        let width = baseNodeWidth - margin.left - margin.right;
        let height = baseNodeHeigth - margin.top - margin.bottom;

        let parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%SZ");

        let dataset1 = [];
        let prepareDataIn = function (dataIn) {
            dataIn.forEach(function (item) {
                // console.log('newProcessDate', newProcessDate);//TODO время на 3 часа больше исходного - разобраться

                let monthNameFormat = d3.timeFormat("%d.%m.%y, %H:%M");
                let eventStartDate = monthNameFormat(new Date(item.eventStartDate));
                let eventFinishDate = monthNameFormat(new Date(item.eventFinishDate));
                let processDate = monthNameFormat(new Date(item.processDate));

                // TODO добавить словарь (?) для metricUnit

                dataset1.push({
                    x: parseTime(item.processDate),
                    y: item.balance,
                    eventStartDate: eventStartDate,
                    eventFinishDate: eventFinishDate,
                    processDate: processDate,
                    eventName: item.eventName,
                    amount: item.amount,
                    metricUnit: item.metricUnit,
                    cost: item.cost,
                    balance: item.balance
                });
            });

            let yMin, yMax;
            dataset1 = dataset1.sort(function (a, b) {
                yMin = a;
                yMin = a;
                // console.log(yMin);
                // console.log(yMin);
                return new Date(a.x) - new Date(b.x);
            });
        };
        prepareDataIn(rawData);

        let minValY, maxValY, minValX, maxValX, minY, maxY;
        let prepareDataAxis = function () {
            minValY = d3.min(dataset1, function (d) {//интервал значений по оси Y
                return minY = d.y;
            });
            maxValY = d3.max(dataset1, function (d) {//интервал значений по оси Y
                return maxY = d.y;
            });
            minValX = d3.min(dataset1, function (d) {//интервал значений по оси X
                return d.x;
            });
            maxValX = d3.max(dataset1, function (d) {//интервал значений по оси X
                return d.x;
            });
            dataset1.unshift({x: minValX, y: minValY, disabled: true});//TODO !!! вместо minValX раньше был 0. minValX делает чтобы пр большом зуме не пропадала область, но тогда появляется сдвиг
            dataset1.push({x: maxValX, y: minValY, disabled: true});
        };


        let xScale = d3.scaleTime()
            .domain(d3.extent(dataset1, function (d) {
                return d.x;
            }))
            .range([0, width]);// растянуть по ширине всей свг X и оси и график и всё

        let kPadding;// коэффициент для запаса по Y
        kPadding = (d3.max(dataset1, function (d) {
                return d.y
            }) - d3.min(dataset1, function (d) {
                return d.y
            })) / 10;
        // console.log('коэфф. = ', kPadding);
        let yScale = d3.scaleLinear()
            .domain([
                d3.min(dataset1, function (d) {
                    return d.y - kPadding;
                }),
                d3.max(dataset1, function (d) {
                    return d.y + kPadding;
                })])
            .range([height, 0]);

        let xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSizeInner(0)// раньше было значение -height. 0 скрывает вертикальные линии
            .tickSizeOuter(0)
            .tickFormat(d3.timeFormat("%d.%m"))
            .tickPadding(15);// отступ значений от оси Х

        let yAxis = d3.axisLeft()
            .ticks(10)//разбиение, то есть какой интервал между двумя осями
            .scale(yScale)
            .tickSizeInner(-width)// отображение горизонтальных линий вправо от оси У
            .tickSizeOuter(0)// не понимаю на что влияет
            .tickPadding(25);// отступ слева до тиков от левой оси

        let line = d3.line()// на выходе строка типа  M0,327.27272727272725L0,286.3636363636364L23.75, ...
            .x(function (d) {
                return xScale(d.x);
            })
            .y(function (d) {
                return yScale(d.y);
            });

        let svg = d3.select(baseNodeClass).append('svg')
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
            .attr('pointer-events', 'all')
            .attr('fill', '#fff');

        let mainGradient = svgDefs.append('linearGradient')
            .attr('id', 'mainGradient')
            .attr('x1', '0')
            .attr('x2', '0')
            .attr('y1', '0')
            .attr('y2', '1');

        function tooltipInner(d) {
            return `<div class='tooltip-inner'>
					<div class='tooltip_date'>${d.processDate}</div>
					<div class='tooltip_title'>Добавлена услуга "${d.eventName}" - ${d.cost} Р/мес.</div>
					<div class='tooltip_period'>
						<div class='tooltip_period-label'>Период деяствия</div>
						<div class='tooltip_period-value'>${d.eventStartDate} - ${d.eventFinishDate}</div>
					</div>
					<div class='tooltip_time'>${d.amount} м.</div>
					<div class='tooltip_balance'>Баланс:
						<span>${d.balance}</span> Р
					</div> 
				</div>`;
        }

        mainGradient.append('stop')
            .attr('class', 'stop-left')
            .attr('offset', '0');
        mainGradient.append('stop')
            .attr('class', 'stop-right')
            .attr('offset', '1');

        let tipId = 'tip' + Date.now();
        let tip = d3.tip()
            .attr('id', tipId)
            .attr('class', 'd3-tip tooltip')
            .html(function (d) {
                return tooltipInner(d);
            })
            .offset([-10, 0])
            .direction(function (d) {//TODO в первой итерации высота тултипа неправильно считается
                let tipNode = document.querySelector('#' + tipId);
                let tipHeigth = tipNode.getBoundingClientRect().top - tipNode.getBoundingClientRect().bottom;
                let parentPosTop = this.closest('.main-chart g').getBoundingClientRect().top;
                let dotPosTop = this.getBoundingClientRect().top;

                if ((dotPosTop - parentPosTop) < -tipHeigth) {
                    // console.log((dotPosTop - parentPosTop) + '<' + -tipHeigth);
                    return 's';
                } else {
                    // console.log((dotPosTop - parentPosTop) + '>' + -tipHeigth);
                    return 'n';
                }
            });

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

        // график в точках
        let buildChart = function () {
            let viewBoxSize = '0 0' + ' ' + width + ' ' + height;//TODO некрасиво написано

            chart = svg
                .append('svg')
                .attr('class', 'svg-chart-area')
                .attr('viewBox', viewBoxSize)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', width)
                .attr('height', height)
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

            // .transition() // Анимация. Wait one second. Then brown, and remove.
            //     .ease(d3.easeElastic)
            //     .delay(1000)
            //     .style("fill", "brown");
            // .remove();

        };

        let zoom = d3.zoom()
            .scaleExtent([1, 40])// 40 - максимальное количество раз, в которое можно увеличить, 1 - минимальное
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on('zoom', zoomed);

        function zoomed() {

            let transform = d3.event.transform;

            gX.call(xAxis.scale(transform.rescaleX(xScale)));
            // gY.call(yAxis.scale(transform.rescaleY(yScale)));//не зумить ось Y
            // gY.call(yAxis.scale(yScale));//не зумить ось Y

            // после перерисовки осей, получаем новые данные и перестраиваем график - chart и line

            chart
                .attr('cx', function (d) {
                    return transform.applyX(xScale(d.x));
                })
                .attr('cy', function (d) {
                    // return transform.applyY(yScale(d.y));//чтобы зумилось и по оси Y
                    return yScale(d.y);//чтобы не зумилось по оси  Y
                });


            let line = d3.line()// на выходе строка типа  M0,327.27272727272725L0,286.3636363636364L23.75, ...
                .x(function (d) {
                    return transform.applyX(xScale(d.x));
                })
                .y(function (d) {
                    // return transform.applyY(yScale(d.y));//чтобы зумилось и по оси Y
                    return yScale(d.y);//чтобы не зумилось по оси  Y
                });

            area.attr('d', line);
        }

        prepareDataAxis();
        buildOsX();
        buildOsY();
        buildChart();
        buildArea();

        if (typeChart !== 'accumulatorChart') {
            // console.log('это НЕ аккумулятор');
        } else {
            // console.log('это аккумулятор');
        }

        svg.call(zoom.transform, d3.zoomIdentity);
        svg.call(zoom);

        return {
            destroy: function () {
                let tip = document.querySelector('#' + tipId);

                if (tip) {
                    tip.parentNode.removeChild(tip);
                }
                baseNode.innerHTML = '';
            }
        };

    };

    let dataTraffic = [{
        "counterName": "Ultra3700",
        "changes": [{
            "processDate": "2017-03-10T08:33:43Z",
            "initialValue": 100,
            "amount": 3,
            "balance": 20,
        }, {
            "processDate": "2017-03-10T08:49:43Z",
            "initialValue": 100,
            "amount": 2,
            "balance": 22,
        }, {
            "processDate": "2017-03-10T14:29:43Z",
            "initialValue": 100,
            "amount": 6,
            "balance": 28,
        }, {
            "processDate": "2017-03-11T12:09:43Z",
            "initialValue": 100,
            "amount": 4,
            "balance": 32,
        }, {
            "processDate": "2017-03-11T14:57:43Z",
            "initialValue": 100,
            "amount": 1,
            "balance": 33,
        }, {
            "processDate": "2017-03-11T16:54:43Z",
            "initialValue": 100,
            "amount": 10,
            "balance": 43,
        }, {
            "processDate": "2017-03-12T11:14:43Z",
            "initialValue": 100,
            "amount": 6,
            "balance": 49,
        }, {
            "processDate": "2017-03-12T11:15:43Z",
            "initialValue": 100,
            "amount": 2,
            "balance": 51,
        }
        ]
    }];

    let dataBalance = [{
        "eventStartDate": "2017-03-10T08:32:43Z",
        "eventFinishDate": "2017-03-10T08:34:43Z",
        "processDate": "2017-03-10T08:47:43Z",
        "eventName": "0 Связь. Исходящая (_Сотовые операторы)",
        "amount": 20,
        "metricUnit": 4,
        "cost": 3,
        "balance": 3115.55
    }, {
        "eventStartDate": "2017-03-10T12:06:49Z",
        "eventFinishDate": "2017-03-10T12:06:49Z",
        "processDate": "2017-03-10T12:08:49Z",
        "eventName": "1 Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 100,
        "balance": 3215.55
    }, {
        "eventStartDate": "2017-03-10T21:31:14Z",
        "eventFinishDate": "2017-03-10T21:30:54Z",
        "processDate": "2017-03-10T21:36:49Z",
        "eventName": "2 Связь. Исходящая (_Международная, СНГ)",
        "amount": 9,
        "metricUnit": 4,
        "cost": 2.50,
        "balance": 3213.05
    }, {
        "eventStartDate": "2017-03-10T06:15:24Z",
        "eventFinishDate": "2017-03-10T06:30:54Z",
        "processDate": "2017-03-10T06:30:49Z",
        "eventName": "3 Связь. Входящая (_Сотовые операторы)",
        "amount": 15,
        "metricUnit": 4,
        "cost": 0,
        "balance": 3213.05
    }, {
        "eventStartDate": "2017-03-10T06:30:24Z",
        "eventFinishDate": "2017-03-10T06:31:54Z",
        "processDate": "2017-03-10T06:31:49Z",
        "eventName": "4 Связь. Входящая (_Сотовые операторы)",
        "amount": 1,
        "metricUnit": 4,
        "cost": 0,
        "balance": 3213.05
    }, {
        "eventStartDate": "2017-03-10T10:53:59Z",
        "eventFinishDate": "2017-03-10T10:53:59Z",
        "processDate": "2017-03-10T10:53:49Z",
        "eventName": "5 Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 50,
        "balance": 3255.55
    }, {
        "eventStartDate": "2017-03-10T10:55:59Z",
        "eventFinishDate": "2017-03-10T10:57:49Z",
        "processDate": "2017-03-10T10:57:49Z",
        "eventName": "6 Связь. Исходящая (_Международная, СНГ)",
        "amount": 2,
        "metricUnit": 4,
        "cost": 6.50,
        "balance": 3206.55
    }, {
        "eventStartDate": "2017-03-10T16:05:54Z",
        "eventFinishDate": "2017-03-10T16:07:49Z",
        "processDate": "2017-03-10T16:08:49Z",
        "eventName": "7 Связь. Исходящая (_Международная, СНГ)",
        "amount": 4,
        "metricUnit": 4,
        "cost": 4.90,
        "balance": 3204.12
    }, {
        "eventStartDate": "2017-03-10T23:05:54Z",
        "eventFinishDate": "2017-03-10T23:05:59Z",
        "processDate": "2017-03-10T23:05:49Z",
        "eventName": "8 SMS. Исходящая",
        "amount": 1,
        "metricUnit": 4,
        "cost": 3,
        "balance": 3201.12
    }, {
        "eventStartDate": "2017-03-11T00:01:59Z",
        "eventFinishDate": "2017-03-11T00:01:59Z",
        "processDate": "2017-03-11T00:02:59Z",
        "eventName": "9 SMS. Входящая",
        "amount": 1,
        "metricUnit": 4,
        "cost": 0,
        "balance": 3201.12
    }, {
        "eventStartDate": "2017-03-11T01:06:54Z",
        "eventFinishDate": "2017-03-11T01:12:54Z",
        "processDate": "2017-03-11T01:13:49Z",
        "eventName": "10 Связь. Исходящая (_Международная, СНГ)",
        "amount": 6,
        "metricUnit": 4,
        "cost": 5,
        "balance": 3199.12
    }, {
        "eventStartDate": "2017-03-11T14:32:54Z",
        "eventFinishDate": "2017-03-11T14:32:54Z",
        "processDate": "2017-03-11T14:32:49Z",
        "eventName": "11 Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 25,
        "balance": 3224.12
    }, {
        "eventStartDate": "2017-03-11T16:57:54Z",
        "eventFinishDate": "2017-03-11T17:19:54Z",
        "processDate": "2017-03-11T17:19:49Z",
        "eventName": "12 Связь. Исходящая (_Международная, СНГ)",
        "amount": 22,
        "metricUnit": 4,
        "cost": 87,
        "balance": 3137.12
    }, {
        "eventStartDate": "2017-03-11T20:07:54Z",
        "eventFinishDate": "2017-03-11T21:57:54Z",
        "processDate": "2017-03-11T17:19:59Z",
        "eventName": "13 GPRS",
        "amount": 114,
        "metricUnit": 4,
        "cost": 3601.14,
        "balance": -464.02
    }, {
        "eventStartDate": "2017-03-11T22:09:54Z",
        "eventFinishDate": "2017-03-11T22:12:54Z",
        "processDate": "2017-03-11T22:13:54Z",
        "eventName": "14 Связь. Исходящая (_Международная, СНГ)",
        "amount": 4,
        "metricUnit": 4,
        "cost": 17.4,
        "balance": -481.42
    }, {
        "eventStartDate": "2017-03-11T22:34:54Z",
        "eventFinishDate": "2017-03-11T22:36:54Z",
        "processDate": "2017-03-11T22:36:59Z",
        "eventName": "15 Связь. Исходящая (_Международная, СНГ)",
        "amount": 2,
        "metricUnit": 4,
        "cost": 7.3,
        "balance": -488.72
    }, {
        "eventStartDate": "2017-03-12T10:32:54Z",
        "eventFinishDate": "2017-03-12T10:32:54Z",
        "processDate": "2017-03-12T10:32:54Z",
        "eventName": "16 Пополнение баланса",
        "amount": 1,
        "metricUnit": 1,
        "cost": 500,
        "balance": 11.28
    }, {
        "eventStartDate": "2017-03-12T11:03:54Z",
        "eventFinishDate": "2017-03-12T11:10:54Z",
        "processDate": "2017-03-12T11:10:54Z",
        "eventName": "17 - Связь. Входящая (_Сотовые операторы)",
        "amount": 2,
        "metricUnit": 4,
        "cost": 1.3,
        "balance": 9.98
    }];

    // buildChart(dataTraffic, 'accumulatorChart', 'traffic');
    let balanceChart = buildChart(dataBalance, 'balanceChart');
    let minutesChart = buildChart(dataBalance, 'accumulatorChart', 'minutes');
    let smsChart = buildChart(dataBalance, 'accumulatorChart', 'sms');


    window.onresize = function (event) {
        balanceChart.destroy();
        minutesChart.destroy();
        smsChart.destroy();

        balanceChart = buildChart(dataBalance, 'balanceChart');
        minutesChart = buildChart(dataBalance, 'accumulatorChart', 'minutes');
        smsChart = buildChart(dataBalance, 'accumulatorChart', 'sms');
    };


    /* --------- */


    let steps = [{
        code: 'step1',
        name: 'Шаг 1',
        active: true
    }, {
        code: 'step2',
        name: 'Шаг 2',
        active: true
    }, {
        code: 'step3',
        name: 'Шаг 3',
        active: true
    }, {
        code: 'step4',
        name: 'шаг 4',
        active: false
    }, {
        code: 'step5',
        name: 'шаг 5',
        active: false
    }, {
        code: 'step6',
        name: 'шаг 6',
        active: false
    }, {
        code: 'step7',
        name: 'шаг 7',
        active: false
    }, {
        code: 'step8',
        name: 'шаг 8',
        active: false
    }];

    console.log('steps', steps);

    function templateStep(step, number) {
        let tmpl = '';

        if (step.active == true) {
            tmpl += `<div class='wizard-steps__item' w-step-id='${step.code}'>`;
        } else {
            tmpl += `<div class='wizard-steps__item wizard-steps__item_disable' w-step-id='${step.code}'>`;
        }
        tmpl += `<div class="wizard-steps__item-circle">`;
        if (step.active == true) {
            tmpl += `<i class="i-material">check</i>`;
        } else {
            tmpl += `<div class="wizard-steps__item-circle-number">${number}</div>`;
        }
        tmpl += `</div>`;
        tmpl += `</div>`;

        return tmpl;
    }

    function renderSteps(steps) {
        let parentNode = $('.wizard-steps');

        $.each(steps, function (i, item) {
            parentNode.append(templateStep(item, i));
        });
    }

    renderSteps(steps);
    /* --------- */
})();