// Init parameters
var ast = [];
ast.data = new Array();
ast.width = 900;
ast.height = 500;
ast.maxYear = 2018;
ast.minYear = 2012;
ast.maxItems = 20;
ast.table;

// Init dynamic components
ast.init = () => {

	// Load main ComboBox
	var yearList = [2018, 2017, 2016, 2015, 2014, 2013, 2012];
	ast.addComboBoxData("#cmdYearFrom", yearList, yearList[1]);
	ast.addComboBoxData("#cmdYearCurr", yearList, yearList[1]);
	
	// Fire main event
	ast.loadData();
}

// Load yearly data and charts
ast.loadData = () => {
	let filepath = "https://raw.githubusercontent.com/ansegura7/Entradas-Extranjeros-Colombia-2012-2018/master/data/";
	let filename = filepath + "entradas_extranjeros_colombia_con_fecha.csv";
	
	d3.csv(filename).then(
		function(data) {

			// Load and parse data
			data.forEach(function(d, i) {
				d.date = d.date;
				d.year = +d.year; 
				d.month = d.month;
				d.nationality = d.nationality;
				d.female = +d.female;
				d.male = +d.male;
				d.undefined = +d.undefined;
				d.total = +d.total;
				ast.data.push(d);
			});

			ast.createTemporalChart();
			ast.createBarChart();
		},
		function(error) {
			// Error log message
			console.log(error);
		}
	);
}

// Create all of Line Charts
ast.createTemporalChart = () => {

	// Get Filter
	let yearFrom = d3.select("#cmdYearFrom").node().value.trim();

	// Filtering data
	let filterData = ast.data.filter(function (d) {
		return (d.year >= yearFrom);
	});
	// console.log("Filted Data");	console.log(filterData);

	// Create agregated data
	let aggData = ast.aggregateData(filterData, "date");
	// console.log("Aggregated Data");	console.log(aggData);

	// Create stacked data
	let stackedData = filterData.map(({nationality, total, date}) => ({name: nationality, value: total, date: new Date(date)}));
	// console.log("Stacked Data"); console.log(stackedData);

	// Charts variables
	let xVar = "date";
	let yVar = "pop_income";
	let xTitle = "Date";
	let yTitle = "Población";
	let cTitle;

	// Chart 1 - Line chart
	let svgLineChart1 = d3.select("#svgLineChart1");
	let varList = ["female", "male", "undefined", "total"];
	cTitle = "Histórico de Ingresos por Género";
	ast.doMSLineChart(aggData, svgLineChart1, ast.maxItems, xVar, yVar, varList, xTitle, yTitle, cTitle);

	// Chart 2 - Stacked Area
	let svgStackedArea1 = d3.select("#svgStackedArea1");
	cTitle = "Histórico de Ingresos por Países";
	ast.doStackedArea(stackedData, svgStackedArea1, xVar, yVar, xTitle, yTitle, cTitle, cTitle);
}

// Create all of Bar Charts
ast.createBarChart = () => {
	
	// Filters
	let yearCurr = d3.select("#cmdYearCurr").node().value.trim();
	let chartType = d3.select("#cmdChartType").node().value.trim();
	let multiple = (1 / chartType);
	
	// Filter data
	let filterData = ast.data.filter(function (d) {
		return (d.year == yearCurr);
	});

	// Aggregate data
	let aggData = ast.aggregateDataByField(filterData, "nationality", "total", multiple);
	let sortData = ast.getTableData(aggData);

	// Chart 2 - Horizontal chart
	let svgBarChart1 = d3.select("#svgBarChart1");
	let xVar = "total";
	let yVar = "nationality";
	let xTitle = "Población";
	let yTitle = "País";
	let cTitle = "Top 20 Paises con Más Migración hacia Colombia";
	let sColor = "steelblue";
	let cutValue = 0;
	ast.doHorzBarChart(aggData, svgBarChart1, ast.maxItems, xVar, yVar, xTitle, yTitle, cTitle, sColor);

	// Create table
	if (ast.table) {
		ast.table.destroy();
	}
	ast.table = $('#tbPopByCountry').DataTable({
		data: sortData,
        columns: [
            { title: "Top" },
            { title: "País" },
            { title: "Población Mensual" },
            { title: "Población Anual" }
        ]
	});
}

// Create Multi-Series chart
ast.doMSLineChart = (rawdata, svg, maxItems, xVar, yVar, varList, xTitle, yTitle, cTitle) => {
	svg.html("");
	if (rawdata == undefined || rawdata.length == 0)
		return;

	const margin = {top: 50, right: 20, bottom: 50, left: 50},
		iwidth = ast.width - margin.left - margin.right,
		iheight = ast.height - margin.top - margin.bottom;

	// Manipulate data
	const lineData = rawdata.slice(0, rawdata.length);
	const varData = varList.map(function(id) {
		return {
			id: id,
			values: lineData.map(function(d) {
				return {date: d.date, pop_income: +d[id]};
			})
		};
	});

	const x = d3.scaleBand()
		.domain(lineData.map( d => d[xVar]))
		.range([0, iwidth]);

	const y = d3.scaleLinear()
		.domain([
			d3.min(varData, (c) => { return d3.min(c.values, (d) => { return d.pop_income; }); }),
			d3.max(varData, (c) => { return d3.max(c.values, (d) => { return d.pop_income; }); })
		])
		.range([iheight, 0]);

	const z = d3.scaleOrdinal(d3.schemeCategory10)
		.domain(varData.map(function(c) { return c.id; }))

	var line = d3.line()
	    .curve(d3.curveBasis)
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(+d.pop_income); });

	const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	g.append("g")
		.attr("class", "axis axis--x")
		.attr("transform", "translate(0," + iheight + ")")
		.call(d3.axisBottom(x));
	
	// text label for the y axis
	g.append("g")
    	.attr("class", "axis axis--y")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -(iheight / 2))
		.attr("y", -margin.left)
		.attr("dy", "1em")
		.attr("fill", "#000")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(yTitle);
	
	// text label for the x axis
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", iheight + (margin.bottom / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(xTitle); 
	
	// add title
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", (10 - margin.top))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "16pt")
		.text(cTitle)
		.style("color", "steelblue");
	
	var vars = g.selectAll(".vars")
		.data(varData)
		.enter().append("g")
		.attr("class", "vars");
	
	vars.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return z(d.id); })
		.style("fill", "none");
	
	vars.append("text")
		.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.pop_income) + ")"; })
		.attr("x", 2)
		.attr("dy", "0.35em")
		.style("font-family", "sans-serif")
		.style("font-size", "10pt")
		.text(function(d) { return d.id; });

	return svg.node();
}

// Create a Linear chart into a SVG tag
ast.doLinearChart = (rawdata, svg, maxItems, xVar, yVar, xTitle, yTitle, cTitle, sColor) => {
	svg.html("");

	const margin = {top: 50, right: 20, bottom: 50, left: 50},
		iwidth = ast.width - margin.left - margin.right,
		pwidth = 30,
		iheight = ast.height - margin.top - margin.bottom;

	// Manipulate data
	const lineData = rawdata
		.sort( (a,b) => d3.descending(+a[xVar], +b[xVar]))
		.slice(0, maxItems);
	
  	const x = d3.scaleBand()
		.domain(lineData.map( d => d[xVar]))
		.range([0, iwidth]);
	
	let yMin = d3.min(lineData, d => d[yVar]);
	const y = d3.scaleLinear()
		.domain( [(yMin > 0? 0 : yMin), d3.max(lineData, d => d[yVar])] )
		.range([iheight, 0]);

	const g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.style("text-anchor", "middle")
		.style("color", "black")
   
	g.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", `translate(0, ${iheight})`);
  
	g.append("g")
		.call(d3.axisLeft(y));

	// text label for the x axis
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", iheight + (margin.bottom / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(xTitle); 

	// text label for the y axis
	g.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -(iheight / 2))
		.attr("y", -margin.left)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(yTitle); 

	// add title
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", (10 - margin.top))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "16pt")
		.text(cTitle)
		.style("color", "steelblue");

	// add points
	const line = d3.line()
		.x( d=> x(d[xVar]))
		.y( d=> y(d[yVar]));

	// add line between points
	g.append("path")
		.style("stroke", sColor)
		.style("fill", "none")
		.attr("d", line(lineData))
		.attr("transform", `translate(${pwidth})`);
  
	let tooltip, yValue;
	g.selectAll("circle")
		.data(lineData).enter()
		.append("circle")
		.attr("cx", d => x(d[xVar]))
		.attr("cy", d => y(d[yVar])) 
		.attr("r", 4)
		.style("fill", sColor)
		.attr("transform", `translate(${pwidth})`)
		.on("mouseover", function (d) {
     		yValue = d3.format(".2f")(d[yVar]);
        	tooltip.attr("x", (30 + x(d[xVar])))
				.attr("y", (15 + y(d[yVar])))
				.text(`[${d[xVar]}, ${yValue}]`);
    
			d3.select(this)
				.transition()
				.duration(500);
		});  
  
	tooltip = g.append("text")
		.style("font-family", "sans-serif")
		.style("font-size", "10pt")
		.style("color", "steelblue")
		.attr("x", -100);
  
	return svg.node();
}

// Create a Bar chart into a SVG tag
ast.doVertBarChart = (rawdata, svg, xVar, yVar, xTitle, yTitle, cTitle, sColor) => {
	svg.html("");

	const margin = {top: 50, right: 20, bottom: 50, left: 60},
		iwidth = ast.width - margin.left - margin.right,
		iheight = ast.height - margin.top - margin.bottom;
	
	// Manipulate data
	const barData = rawdata;
  	
  	const x = d3.scaleBand()
		.domain(barData.map( d => d[xVar]))
		.range([0, iwidth]);
	
	let yMin = d3.min(barData, d => d[yVar]);
	const y = d3.scaleLinear()
		.domain( [(yMin > 0? 0 : yMin), d3.max(barData, d => d[yVar])] )
		.range([iheight, 0]);

	const g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.style("text-anchor", "middle")
		.style("color", "black")

	g.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", `translate(0, ${iheight})`);
  
	g.append("g")
		.call(d3.axisLeft(y));

	// text label for the x axis
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", iheight + (margin.bottom / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(xTitle); 

	// text label for the y axis
	g.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -(iheight / 2))
		.attr("y", -margin.left)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(yTitle); 

	// add title
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", (10 - margin.top))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "16pt")
		.text(cTitle)
		.style("color", "steelblue");

	// add points
	const rects = svg.selectAll(".bar")
		.data(barData);
  
	rects.enter()
    	.append("rect")
		.attr("class", "bar")
		.attr("x", (d) => (x(d[xVar]) + margin.left + 20))
		.attr("y", (d) => (y(d[yVar]) + margin.top))
		.attr("width", 20)
		.attr("height", (d) => (iheight - y(d[yVar])))
		.style("fill", sColor);

	return svg.node();	
}

// Create a Bar chart into a SVG tag
ast.doHorzBarChart = (rawdata, svg, maxItems, xVar, yVar, xTitle, yTitle, cTitle, sColor) => {
	svg.html("");

	const margin = {top: 50, right: 20, bottom: 50, left: 200},
		iwidth = ast.width - margin.left - margin.right,
		iheight = ast.height - margin.top - margin.bottom;
	
	// Manipulate data
	const barData = rawdata
		.sort( (a,b) => d3.descending(+a[xVar], +b[xVar]))
		.slice(0, maxItems);
  
	const x = d3.scaleLinear()
		.domain([0, d3.max(barData, d => d[xVar])])
		.range([0, iwidth]);

	const y = d3.scaleBand()
		.domain(barData.map( d => d[yVar]))
		.range([0, iheight]);

	const g = svg.append("g")
		.attr("transform", `translate(${margin.left}, ${margin.top})`)
		.style("text-anchor", "middle")
		.style("color", "black")

	g.append("g")
		.call(d3.axisBottom(x))
		.attr("transform", `translate(0, ${iheight})`);
  
	g.append("g")
		.call(d3.axisLeft(y));

		// text label for the x axis
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", iheight + (margin.bottom / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(xTitle); 

	// text label for the y axis
	g.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -(iheight / 2))
		.attr("y", -margin.left)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(yTitle); 

	// add title
	g.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", (10 - margin.top))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "16pt")
		.text(cTitle)
		.style("color", "steelblue");

	// add points
	const rects = svg.selectAll(".bar")
		.data(barData);

	rects.enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", margin.left)
		.attr("y", (d) => (y(d[yVar])) + margin.top + 3)
		.attr("width", d => x(d[xVar]))
		.attr("height", 15)
		.style("fill", sColor);

	return svg.node();	
}

// Create a Stacked Area chart into a SVG tag
ast.doStackedArea = (data, svg, xVar, yVar, xTitle, yTitle, cTitle, sColor) => {
	svg.html("");

	const margin = {top: 40, right: 35, bottom: 50, left: 15},
		iwidth = ast.width - margin.left - margin.right,
		iheight = ast.height - margin.bottom;

	// Function: multisum data
	var multisum = function(entries) {
		return multimap(entries, (p, v) => p + v, () => 0);
	}

	// Function: Multimap
	var multimap = function(entries, reducer = (p, v) => (p.push(v), p), initializer = () => []) {
		const map = new Map();
		for (const [key, value] of entries) {
	    	map.set(key, reducer(map.has(key) ? map.get(key) : initializer(), value));
		}
		return map;
	}

	// Function: Create Legend
	var legend = function(svg) {
		const g = svg
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.selectAll("g")
			.data(color.domain().slice().reverse())
			.enter().append("g")
			.attr("transform", (d, i) => `translate(0,${i * 16})`);

		g.append("rect")
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", color);

		g.append("text")
			.attr("x", 20)
			.attr("y", 8)
			.attr("dy", "0.35em")
			.text(d => d);
	}

	// Compute the top nine countries, plus an “Other” category
	const top = [...multisum(data.map(d => [d.name, d.value]))]
		.sort((a, b) => b[1] - a[1])
		.slice(0, 9)
		.map(d => d[0])
		.concat("Other");

	// Group the data by industry, then re-order the data by descending value.
	const series = multimap(data.map(d => [d.name, d]));
	data = [].concat(...top.map(name => series.get(name)));
	data.pop()

	// Fold any removed (non-top) countries into the Other category
	const other = [];
	series.get(top[0]).forEach(function(d){
		other.push({name:"Other", value: 0, date: d.date});
	});

	for (const [name, data] of series) {
		if (!top.includes(name)) {
	    	for (let i = 0, n = data.length; i < n; ++i) {
	        	if (i < other.length && +other[i].date == +data[i].date)
	        		other[i].value += data[i].value;
			}
		}
	}
	data = data.concat(other);

	// Compute the stack offsets
	const stack = d3.stack()
		.keys(top)
	    .value((d, key) => d.get(key).value)
	    (Array.from(
	    	multimap(
	        	data.map(d => [+d.date, d]),
	        	(p, v) => p.set(v.name, v),
	        	() => new Map
			).values()
		));

	// Copy the offsets back into the data
	for (const layer of stack) {
		for (const d of layer) {
	    	d.data.get(layer.key).values = [d[0], d[1]];
		}
	}

	// Color scale
	let color = d3.scaleOrdinal(d3.schemeCategory10)
		.domain(data.map(d => d.name));

	// X scale (time)
	let x = d3.scaleTime()
		.domain(d3.extent(data, d => d.date))
		.range([margin.left, iwidth]);

	// Y scale (linear)
	let y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d.values[1])])
		.range([iheight, margin.top]);
	
	// X axis function
	xAxis = (g) => g
		.attr("transform", `translate(0,${iheight})`)
		.call(d3.axisBottom(x).ticks(iwidth / 80).tickSizeOuter(0));
	
	// Y axis function
	yAxis = (g) => g
		.attr("transform", `translate(${iwidth},0)`)
		.call(d3.axisRight(y))
		.call(g => g.select(".domain").remove());
	
	let area = d3.area()
		.curve(d3.curveStep)
	    .x(d => x(d.date))
	    .y0(d => y(d.values[0]))
	    .y1(d => y(d.values[1]));

	// Adding areas
	svg.append("g")
		.selectAll("path")
		.data([...multimap(data.map(d => [d.name, d]))])
		.enter().append("path")
	    	.attr("fill", ([name]) => color(name))
			.attr("d", ([, values]) => area(values))
		.append("title")
	    	.text(([name]) => name);

	// Adding X axis
	svg.append("g")
		.call(xAxis);

	// Adding Y axis
	svg.append("g")
		.call(yAxis);

	// Adding Legend
	svg.append("g")
		.attr("transform", `translate(${10},${10})`)
	    .call(legend);

	// Adding title
	svg.append("g")
		.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", 10)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "16pt")
		.text(cTitle)
		.style("color", "steelblue");

	// Adding text label for the x axis
	svg.append("g")
		.append("text")
		.attr("x", (iwidth / 2))
		.attr("y", iheight + (margin.bottom / 2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.style("font-family", "sans-serif")
		.style("font-size", "11pt")
		.text(xTitle);

	return svg.node();
}

// Adding a line to chart
ast.addLineToChart = (rawdata, svg, maxItems, xVar, yVar, cutValue, chartType) => {
	const margin = {top: 50, right: 20, bottom: 50, left: 50},
		iwidth = ast.width - margin.left - margin.right,
		iheight = ast.height - margin.top - margin.bottom;

	// Manipulate data
	const n = rawdata.length;
	const lineData = rawdata.slice((n - maxItems), n);
	const varList = ["Glob", "NHem", "SHem"];
	const x = d3.scaleBand();
	const y = d3.scaleLinear();
	var warnLine;
	var varData = [];
	
	if (chartType.indexOf("series") >= 0) {
		
		varData = varList.map(function(id) {
			return {
				id: id,
				values: lineData.map(function(d) {
					return {year: d.Year, temp: +d[id]};
				})
			};
		});
		
		x.domain(lineData.map( d => d[xVar]))
		 .range([0, iwidth]);
		
		y.domain([
			d3.min(varData, (c) => { return d3.min(c.values, (d) => { return d.temp; }); }),
			d3.max(varData, (c) => { return d3.max(c.values, (d) => { return d.temp; }); })
		])
		.range([iheight, 0]);
		
		warnLine = {
			label: 'Punto de corte',
			x1: x(d3.min(lineData, (d) => d[xVar])),
			x2: x(d3.max(lineData, (d) => d[xVar])) * 1.01,
			y1: (y(cutValue)),
			y2: (y(cutValue))
		};
	}
	else if (chartType.indexOf("single") >= 0) {
		
		varData = rawdata;
		
		x.domain(varData.map( d => d[xVar]))
		 .range([0, iwidth]);
		
		let yMin = d3.min(varData, d => d[yVar]);
		y.domain([
			(yMin > 0? 0 : yMin),
			d3.max(varData, d => d[yVar])
		])
		.range([iheight, 0]);
		
		warnLine = {
			label: 'Punto de corte',
			x1: x(varData[0][xVar]) + 10,
			x2: x(varData[11][xVar]) + margin.left,
			y1: (y(cutValue)),
			y2: (y(cutValue))
		};
	}
	
	const g = svg.append('g')
		.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
	
	g.append('line')
		.attr('x1', warnLine.x1)
		.attr('y1', warnLine.y1)
		.attr('x2', warnLine.x2)
		.attr('y2', warnLine.y2)
		.attr('class', 'zeroline');
}

// Aggregate data by gender
ast.aggregateData = (data, varName) => {

	// Aggregate data
	let aggData = [];
	data.reduce(function (res, value) {
		let key = value[varName];
		if (!res[key]) {
			res[key] = {
				female: 0,
				male: 0,
				undefined: 0,
				total: 0,
				date: key
			};
			aggData.push(res[key])
		}
		res[key].female += value.female
		res[key].male += value.male
		res[key].undefined += value.undefined
		res[key].total += value.total
		return res;
	}, {});

	// console.log(data);
	// console.log(aggData);
	return aggData
}

// Aggregate data by nationality
ast.aggregateDataByField = (data, varName, varValue, multiple) => {
	let aggData = [];
	let listItem = [];
	let lookup = {};

	// Aggregate data
	for (var item, i = 0; item = data[i++];) {
		let name = item[varName];
		let value = item[varValue];

		if (!(name in lookup)) {
			lookup[name] = value;
			listItem.push(name);
		}
		else
			lookup[name] += value;
	};

	listItem.forEach(function(d) {
		var node = {};
		node[varName] = d;
		node[varValue] = (lookup[d] * multiple);
		aggData.push(node);
	})

	//console.log(data);
	//console.log(aggData);
	return aggData
}

// Create table data
ast.getTableData = (data) => {
	let tbData = [];

	data.forEach(function(d) {
		let monthlyValue = +ast.toFixedNumber(d.total, (1/12), 2);
		let yearlyValue  = +ast.toFixedNumber(d.total, 1, 2);
		let n = [0, d.nationality, monthlyValue, yearlyValue];
		tbData.push(n);
	});

	// Manipulate data
	const sortData = tbData
		.sort( (a,b) => d3.descending(a[3], b[3]))


	for(var i=0; i < sortData.length; i++)
		sortData[i][0] = (i+1);

	return sortData;
}

/********* Start Utility Functions *********/

// Add data types to ComboBox
ast.addComboBoxData = (cmbID, varList, defValue) => {
	var options = d3.select(cmbID);

	const addItem = (d, i) => options
		.append("option")
		.text(d)
		.attr("value", d)
		.property("selected", (d == defValue));

	// Calls addLi for each item on the array
	// console.log(varList);
	varList.forEach(addItem);
}

// Get Fixed Number
ast.toFixedNumber = (value, mult, dec) => {
	if(ast.isNumeric(value))
		return (mult * value).toFixed(dec);
	return 0;
}

// IsNumeric function in Javascript
ast.isNumeric = (n) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Get distinct values from JSON array
ast.getDistinctValues = (items, field) => {
	var lookup = {};
	var result = [];

	for (var item, i = 0; item = items[i++];) {
		var name = item[field];

		if (!(name in lookup)) {
			lookup[name] = 1;
			result.push(name);
		}
	}

	return result.sort();
}

// Clone a JSON object
ast.cloneJSON = (obj) => {
	if(obj == undefined)
		return {};
	return JSON.parse(JSON.stringify(obj)); 
}

/********** End Utility Functions **********/