//required dimensions
var margin = { top:10, right:20, bottom:40, left:20 };
const width = 700;
const height = 500;

d3.csv('./data.csv').then(data => {
    console.log(data);
    //column names
    let columns = data.columns.slice();

    //data manipulation
    let perc_val=[];
    let pesticide_val=[];
    let cat=[];
    data.map(d => (
        perc_val.push(+d['% of Total']),
        pesticide_val.push(+d['Lbs. Pesticides Used in USA Agriculture']),
        cat.push(d['Category'])
    ))

    //required category names for plotting
    const plot_cat = cat.slice(1,4);
    console.log(plot_cat);

    let plot_data = [];
    data.map(val => {
        let row = Object.values(val);
        plot_cat.map(cat => {
            if(row.includes(cat)){
                const filt = {};
                filt[cat] = row.slice(1);
                plot_data.push(filt);
            } 
        })
        }
    )

    //adjustment values
    const gap = 50;
    const threshold=20; 
    const axis_range = 100;
    const minor = 5;

    //define x-axis scale
    const xScale = d3.scaleLinear()
                    .domain([0, d3.max(perc_val)])
                    .range([margin.left, width-margin.right-2*axis_range])
    
    //call xScale to define x-axis
    const xAxis = d3.axisBottom(xScale)
                    .ticks(5);

    //define y-axis scale
    const padding = 0.4;               
    const yScale = d3.scaleBand()
                    .domain(plot_cat)
                    .range([height-margin.bottom-2*axis_range, margin.top+gap])
                    .paddingInner(padding)
                
    //call yScale to define y-axis
    const yAxis = d3.axisLeft(yScale)
                    .ticks(3);

    //define svg
    const svg = d3.select('.svg-container')
                    .append('svg')
                    .attr('width', width+margin.left+margin.right)
                    .attr('height', height+margin.top+margin.bottom)
    
    //call the x-axis on the svg                
    svg.append('g')
        .call(xAxis)
        .attr('class', 'x-axis')
        .attr('transform', `translate(${margin.left+axis_range+threshold}, ${height-margin.bottom-2*axis_range+minor})`)

    //call the y-axis on the svg
    svg.append('g')
        .call(yAxis)
        .attr('class', 'y-axis')
        .attr('transform', `translate(${margin.left+axis_range+threshold}, 0)`)
        .call(g => g.select(".domain").remove());

    //modify the font-size of the y-axis text   
    d3.selectAll(".y-axis>.tick>text")
    .each(function(d, i){
        d3.select(this).style("font-size","13px");
    });

    //functions to return the rectangle dimension ans position
    const rect_pos = (d) => {
        return yScale(Object.keys(d)[0]);
    }

    const rect_width = (d) => {
        return xScale(Object.values(d)[0][1]);
    }

    // svg.selectAll('.bars')
    //     .data(plot_data)
    //     .join('rect')
    //     .attr('class', 'bars')
    //     .attr('x', margin.left+axis_range+2*threshold)
    //     .attr('y', d => rect_pos(d))
    //     .attr('width', d => xScale(100))
    //     .attr('height', yScale.bandwidth())
    //     .attr('fill', '#F4EEEB') 

    //rectangle svg
    svg.selectAll('.bars')
        .data(plot_data)
        .join('rect')
        .attr('class', 'bars')
        .attr('x', margin.left+axis_range+2*threshold)
        .attr('y', d => rect_pos(d))
        .attr('width', d => rect_width(d))
        .attr('height', yScale.bandwidth())
        .attr('fill', '#D87B49')

    //text svg    
    svg.selectAll('.bar-text')
        .data(plot_data)
        .join('text')
        .attr('class', 'bar-text')
        .attr('y', d => rect_pos(d)+yScale.bandwidth()/2)
        .attr('x', d => rect_width(d)+minor)
        .attr('fill', '#333')
        .text(d => `${Object.values(d)[0][1]} %`)
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12.5)
        .attr('transform', `translate(${margin.left+axis_range+2*threshold},0)`)


});
