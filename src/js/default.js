// import * as d3 from 'd3';
(function () {

    class LineChart {
        constructor() {
            // super();

            this.root = document.body;
        }

        notify(eventName, detail) {
            this.dispatchEvent(new CustomEvent(eventName, {
                bubbles: true,
                composed: true,
                detail: detail
            }));
        }

        clearChart() {
            //очистка старого графика если он был
            this.baseNode.innerHTML = '';

        }

        calcDimensions() {
            this.baseNodeWidth = parseInt(window.getComputedStyle(this.baseNode).width);
            this.baseNodeHeigth = parseInt(window.getComputedStyle(this.baseNode).height);

            this.margin = {top: 20, right: 20, bottom: 30, left: 100};
            this.width = this.baseNodeWidth - this.margin.left - this.margin.right;
            this.height = this.baseNodeHeigth - this.margin.top - this.margin.bottom;
        }

        preBuild(data) {
            this.rawData = data;
            this.parseTime = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
        }

        prepareDataIn(dataIn) {
            this.dataset1 = [];// dataset1 вроде вообще нужен только для графика типа Баланс, точнее где есть тултип

            dataIn.forEach((item)=>{

                let monthNameFormat = d3.timeFormat("%d.%m.%y, %H:%M");
                let eventStartDate = monthNameFormat(new Date(item.eventStartDate));
                let eventFinishDate = monthNameFormat(new Date(item.eventFinishDate));
                let processDate = monthNameFormat(new Date(item.processDate));

                // TODO добавить словарь (?) для metricUnit

                this.dataset1.push({
                    x: this.parseTime(item.processDate),
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

            this.dataset1 = this.dataset1.sort((a, b) => {
                return new Date(a.x) - new Date(b.x);
            });
        }

        getYMin() {
            return d3.min(this.dataset1, (d) => {
                return d.y;
            });
        }

        getYMax() {
            return d3.max(this.dataset1, (d) => {
                return d.y;
            });
        }

        yInitialValueMax() {
            return d3.max(this.rawData, (d) => {
                return d.initialValue;
            });
        }

        kPadding() {
            let yMin = this.getYMin();
            let yMax = this.getYMax();
            return (yMax - yMin) / 10; // коэффициент для запаса по Y
        }

        buildXScale(){
             return d3.scaleTime()
                .domain(d3.extent(this.dataset1, (d) => {
                    return d.x;
                }))
                .range([0, this.width]);// растянуть по ширине всей свг X и оси и график и всё
        }

        // if (options.type === 'accumulatorChart')
  /*      buildYScale(){
            return d3.scaleLinear()
                .domain([
                    d3.min(this.dataset1, (d) => {
                        return d.y - this.kPadding();
                    }),
                    d3.max(this.dataset1, (d) => {
                        if (this.getYMax() > this.yInitialValueMax()) {
                            return this.getYMax() + this.kPadding();
                        } else {
                            return this.yInitialValueMax() + this.kPadding();
                        }
                    })])
                .range([this.height, 0]);
        }*/

        // if (options.type === 'balanceChart')
        buildYScale(){
            return d3.scaleLinear()
                .domain([
                    d3.min(this.dataset1, (d) => {
                        return d.y - this.kPadding();
                    }),
                    d3.max(this.dataset1, (d) => {
                        return this.getYMax() + this.kPadding();
                    })])
                .range([this.height, 0]);
        }

        buildXAxis(){
            return d3.axisBottom()
                .scale(this.xScale)
                .tickSizeInner(0)// раньше было значение -height. 0 скрывает вертикальные линии
                .tickSizeOuter(0)
                .tickFormat(d3.timeFormat("%d.%m"))
                .tickPadding(15);// отступ значений от оси Х
        }

        buildYAxis(){ // return undefind :(
            return d3.axisLeft()
                .ticks(10)//разбиение, то есть какой интервал между двумя осями
                .scale(this.yScale)
                .tickSizeInner(-this.width)// отображение горизонтальных линий вправо от оси У
                .tickSizeOuter(0)// не понимаю на что влияет
                .tickPadding(25);// отступ слева до тиков от левой оси
        }

        buildOsX() {
            // вертикальные линии сетки, кроме первой и ось Х

            this.gX = this.svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(this.xAxis);
        }

        buildOsY() {
            // горизонтальные линии сетки, кроме первой и ось У
            this.gY = this.svg.append('g')
                .attr('class', 'y axis')
                .call(this.yAxis);
        }

        buildLine() {
            return d3.line()// на выходе строка типа  M0,327.27272727272725L0,286.3636363636364L23.75, ...
                .x((d) => {
                    return this.xScale(d.x);
                })
                .y((d) => {
                    return this.yScale(d.y);
                });
        }

        buildSvg() {
            return d3.select(this.root).select(this.baseNodeClass).append('svg')
                .attr('class', 'main-chart')
                .attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');// устанавливает позицию отображения свг
        }

        addBackground() {
            this.svg.append('rect')
                .attr('class', 'background')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('pointer-events', 'all')
                .attr('fill-opacity', 0)
                .attr('fill', '#fff');
        }

        getYZeroValue() {
            d3.scaleLinear()
                .domain([
                    d3.min(this.dataset1, (d) => {
                        return d.y - this.kPadding();
                    }),
                    d3.max(this.dataset1, (d) => {
                        return d.y + this.kPadding();
                    })])
                .range([100, 0]);
        }

        tooltipInner(d) {
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

        createTip() {
            let self = this;
            this.tipId = 'tip' + Date.now();
            this.tip = d3.tip()
                .attr('id', this.tipId)
                .attr('class', 'd3-tip tooltip')
                .html((d) => {
                    return this.tooltipInner(d);
                })
                .offset([-10, 0])
                .direction(() => {//TODO в первой итерации высота тултипа неправильно считается
                    let tipNode = document.querySelector('#' + this.tipId);
                    let tipHeigth = tipNode.getBoundingClientRect().top - tipNode.getBoundingClientRect().bottom;
                    let parentPosTop = self.root.closest('.main-chart g').getBoundingClientRect().top;
                    let dotPosTop = self.root.getBoundingClientRect().top;

                    if ((dotPosTop - parentPosTop) < -tipHeigth) {
                        // console.log((dotPosTop - parentPosTop) + '<' + -tipHeigth);
                        return 's';
                    } else {
                        // console.log((dotPosTop - parentPosTop) + '>' + -tipHeigth);
                        return 'n';
                    }
                });

            this.svg.call(this.tip);
        }

        prepareDataAxis() {
            this.minValY = d3.min(this.dataset1, (d) => {//интервал значений по оси Y
                return this.minY = d.y;
            });
            this.maxValY = d3.max(this.dataset1, (d) => {//интервал значений по оси Y
                return this.maxY = d.y;
            });
            this.minValX = d3.min(this.dataset1, (d) => {//интервал значений по оси X
                return d.x;
            });
            this.maxValX = d3.max(this.dataset1, (d) => {//интервал значений по оси X
                return d.x;
            });
            this.dataset1.unshift({x: this.minValX, y: this.minValY - this.kPadding(), disabled: true});
            this.dataset1.push({x: this.maxValX, y: this.minValY - this.kPadding(), disabled: true});
        }

        buildArea() {
            // график, в смысле залитая область
            let viewBoxSize = '0 0' + ' ' + this.width + ' ' + this.height;//TODO некрасиво написано

            this.area = this.svg
                .append('svg')
                .attr('class', 'svg-chart-area')
                .attr('viewBox', viewBoxSize)
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', this.width)
                .attr('height', this.height)

                // .selectAll('svg')
                .append('path')
                .data([this.dataset1])
                .attr('class', 'filled')
                .attr('fill', '#000')
                .attr('d', this.line);

        }

        maxValueLine() { // красная линия (график) - критическое значение по аккумуляторам

            let maxLine = this.svg
                .append('g')
                .attr('class', 'maxLine')
                .append('polyline')
                .data([this.rawData])
                .attr('points', (d) => {
                    return d.map((d) => {
                        let monthNameFormat = d3.timeFormat("%d.%m.%y, %H:%M");
                        let processDate = monthNameFormat(new Date(d.processDate));
                        return [this.xScale(parseTime(d.processDate)), this.yScale(d.initialValue)].join(",");
                    }).join(" ");
                })
                .attr('fill', 'none')
                .attr('stroke', 'red');
        }

        buildChartDots () {
            // график в точках

            this.chart = this.svg
                .selectAll('svg')
                .selectAll('.dot')
                .data(this.dataset1.filter((item) => {
                    return !item.disabled;
                }))
                .enter()
                .append('circle')
                .attr('class', 'dot')
                .attr('r', 7)
                .attr('stroke', '#12aaeb')
                .attr('stroke-width', '5')
                .attr('fill', '#fff')
                .attr('cx', (d) => {
                    return this.xScale(d.x);
                })
                .attr('cy', (d) => {
                    return this.yScale(d.y);
                });
                // .on('mouseenter', this.tip.show)
                // .on('mouseout', this.tip.hide);

            let self = this;
            this.svg.selectAll('.dot').each((d) => {
                if (d.y < 0) {
                    self.setAttribute('stroke', 'red');
                }
            });
        }

        addAccumulatorLegend() {
            let legendAccum = this.svg
                .append('g')
                .attr('transform', 'translate(0,-20)')
                .attr('class', 'legend');

            let legendPadTop = 10;

            legendAccum.append('text')
                .text(() =>{
                    return options.title;
                })
                .attr('class', 'legend-title')
                .attr('fill', '#546e7a')
                .attr('style', 'font-weight: 500;')
                .attr('dy', legendPadTop);

            let legendTitle = this.svg.selectAll('.legend-title');
            // let legendTitleWidth = parseInt(legendTitle.style("width"));
            let legendTitleWidth = this.svg.selectAll('.legend-title')._groups[0][0].scrollWidth;// !! потому что в ie11 .clientWidth = 0
            let countItem = '3,57 Gb';
            let countTime = '10 дней';
            let legendInnerText = ' - осталось ' + countItem + ' на ' + countTime;

            legendAccum.append('text')
                .text(() => {
                    return legendInnerText;
                })
                .attr('fill', '#9e9e9e')
                .attr('dy', legendPadTop)
                .attr('dx', legendTitleWidth + 7);
        }

        buildZoom() {
            let zoomed = this.zoomed.bind(this);

             return d3.zoom()
                .scaleExtent([1, 50]) // 50 - максимальное количество раз, в которое можно увеличить, 1 - минимальное
                .translateExtent([[0, 0], [this.width, this.height]])
                .extent([[0, 0], [this.width, this.height]])
                .on('zoom', zoomed);
        }

        zoomed() {
            let transform = d3.event.transform;

            this.gX.call(this.xAxis.scale(transform.rescaleX(this.xScale)));
            // this.gY.call(this.yAxis().scale(transform.rescaleY(this.yScale())));//не зумить ось Y
            // this.gY.call(this.yAxis().scale(this.yScale()));//не зумить ось Y

            // после перерисовки осей, получаем новые данные и перестраиваем график - chart и line

            this.chart
                .attr('cx', (d) => {
                    return transform.applyX(this.xScale(d.x));
                })
                .attr('cy', (d) => {
                    // return transform.applyY(this.yScale(d.y));//чтобы зумилось и по оси Y
                    return this.yScale(d.y);//чтобы не зумилось по оси  Y
                });


             let line = d3.line()// на выходе строка типа  M0,327.27272727272725L0,286.3636363636364L23.75, ...
                .x((d) => {
                    return transform.applyX(this.xScale(d.x));
                })
                .y((d) => {
                    // return transform.applyY(yScale(d.y));//чтобы зумилось и по оси Y
                    return this.yScale(d.y);//чтобы не зумилось по оси  Y
                });

            this.area.attr('d', line);
        }

        destroy() {
            this.tip = document.querySelector('#' + this.tipId);
            if (this.tip) {
                this.tip.parentNode.removeChild(this.tip);
            }
            this.baseNode.innerHTML = '';
        }

    }

    class BalanceChart extends LineChart {
        constructor(data) {
            super();
            // this.appendChild(template.content.cloneNode(true));

            let buildChartResult = this.buildChart(data);

            window.addEventListener('resize', () => {
                buildChartResult.destroy();
                this.buildChart(data);
            });
        }

        addBackground() {
            this.svg.append('rect')
                .attr('class', 'background')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('pointer-events', 'all')
                .attr('fill-opacity', 0)
                .attr('fill', '#fff');
        }

        setGradient(zeroValueColor) {
            let svgDefs = this.svg.append('defs');

            let mainGradient = svgDefs.append('linearGradient')
                .attr('id', 'mainGradient')
                .attr('x1', '0')
                .attr('x2', '0')
                .attr('y1', '0')
                .attr('y2', '1');

            zeroValueColor = 0;//TODO убрать эту строку потом
            mainGradient.append('stop')
                .attr('class', 'stop-top')
                .attr('offset', '0');
            mainGradient.append('stop')
                .attr('class', 'stop-center')
                .attr('offset', zeroValueColor + '%');
            mainGradient.append('stop')
                .attr('class', 'stop-bottom-balance')
                .attr('offset', '1');
        }

        buildChart(data) {

            this.chartNodeClass = '.chart-area';
            this.baseNodeClass = this.chartNodeClass;
            this.baseNode = this.root.querySelector(this.baseNodeClass);


            this.clearChart();
            this.calcDimensions();
            this.preBuild(data);

            this.prepareDataIn(this.rawData);

            this.xScale = this.buildXScale();
            this.yScale = this.buildYScale();
            this.xAxis = this.buildXAxis();
            this.yAxis = this.buildYAxis();

            // this.xScale();//TODO возможно не надо их явно вызывать, они передаются в xAxis и line
            // this.yScale();//TODO возможно не надо их явно вызывать, они передаются в yAxis и line

            // this.xAxis();//TODO возможно не надо их явно вызывать, они передаются в buildOsX и zoom
            // this.yAxis();//TODO возможно не надо их явно вызывать, они передаются в buildOsY и zoom

            // this.line();//TODO возможно не надо явно вызывать, передается в buildArea и zoom

            this.line = this.buildLine();
            this.svg = this.buildSvg();
            this.addBackground();

            // this.getYZeroValue();// TODO возможно надо разкоментить
            this.setGradient(this.getYZeroValue(0));
            // this.createTip();

            this.buildOsX();
            this.buildOsY();

            this.prepareDataAxis();
            this.buildArea();
            this.buildChartDots();

            this.zoom = this.buildZoom();
            this.svg.call(this.zoom.transform, d3.zoomIdentity);
            this.svg.call(this.zoom);
        }
    }

    let data = [
        {
            "amount": 0,
            "cost": null,
            "balance": 5260.0283,
            "processDate": "2017-04-25T06:39:26.000Z",
            "eventName": "Регистрация платежа",
            "eventTypeName": "Прочее",
            "eventFinishDate": "2017-04-25T06:39:24.000Z",
            "eventType": "Прочее",
            "metricUnitName": "не определено",
            "eventStartDate": "2017-04-25T06:39:24.000Z",
            // "initialValue": 5200,
            "metricUnit": "0"
        },
        {
            "amount": 0,
            "cost": null,
            "balance": 3793.422,
            "processDate": "2017-04-21T13:26:15.000Z",
            "eventName": "Регистрация платежа",
            "eventTypeName": "Прочее",
            "eventFinishDate": "2017-04-21T13:26:15.000Z",
            "eventType": "Прочее",
            "metricUnitName": "не определено",
            "eventStartDate": "2017-04-21T13:26:15.000Z",
            // "initialValue": 5200,
            "metricUnit": "0"
        }, {
            "amount": 0,
            "cost": null,
            "balance": 2682.839663,
            "processDate": "2017-04-21T11:08:12.000Z",
            "eventName": "Запрос баланса (Муравьева Елена )",
            "eventTypeName": "Прочее",
            "eventFinishDate": "2017-04-21T11:08:12.000Z",
            "eventType": "Прочее",
            "metricUnitName": "не определено",
            "eventStartDate": "2017-04-21T11:08:12.000Z",
            // "initialValue": 5200,
            "metricUnit": "0"
        }, {
            "amount": 0,
            "cost": null,
            "balance": 10000,
            "processDate": "2017-04-13T11:25:00.000Z",
            "eventName": "Регистрация платежа",
            "eventTypeName": "Прочее",
            "eventFinishDate": "2017-04-13T11:24:59.000Z",
            "eventType": "Прочее",
            "metricUnitName": "не определено",
            "eventStartDate": "2017-04-13T11:24:59.000Z",
            // "initialValue": 5200,
            "metricUnit": "0"
        },
        {
            "amount": 0,
            "cost": 11.8,
            "balance": 9953.6614,
            "processDate": "2017-01-27T14:45:33.000Z",
            "eventName": "Продажа SIM карты",
            "eventTypeName": "Прочее",
            "eventFinishDate": "2017-01-27T14:45:31.000Z",
            "eventType": "Прочее",
            "metricUnitName": "штука",
            "eventStartDate": "2017-01-27T14:45:31.000Z",
            // "initialValue": 5200,
            "metricUnit": "8"
        },
        {
            "amount": 0,
            "cost": 33.04,
            "balance": 9965.4614,
            "processDate": "2017-01-27T14:45:33.000Z",
            "eventName": "Добавление услуги Переадресация вызова (периодическая)",
            "eventTypeName": "Звонки",
            "eventFinishDate": "2017-01-27T14:45:31.000Z",
            "eventType": "calls",
            "metricUnitName": "факт",
            "eventStartDate": "2017-01-27T14:45:31.000Z",
            // "initialValue": 5200,
            "metricUnit": "7"
        },
        {
            "amount": 0,
            "cost": 1.4986,
            "balance": 9998.5014,
            "processDate": "2017-01-27T14:45:33.000Z",
            "eventName": "Добавление услуги Мобильный помощник",
            "eventTypeName": "Интернет",
            "eventFinishDate": "2017-01-27T14:45:31.000Z",
            "eventType": "internet",
            "metricUnitName": "факт",
            "eventStartDate": "2017-01-27T14:45:31.000Z",
            // "initialValue": 5200,
            "metricUnit": "7"
        }

    ];
    let options1 = {
        type: 'balanceChart',
        zoom: true,
        dots: true,
        axisX: true,
        tooltip: true,
        title: '',
        units: 'Р.'
    };

    let options2 = {
        type: 'accumulatorChart',
        zoom: false,
        dots: false,
        axisX: false,
        tooltip: false,
        title: 'lsa;dk',
        units: 'Р.'
    };

    let chart = new BalanceChart(data);

    // buildChart(data, options1);
    // buildChart(data, options2);


})();