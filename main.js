/* jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', () => {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

  function initialize(dataset) {
    // Set graph dimensions
    const margin = { top: 80, right: 30, bottom: 50, left: 100 };
    const width = 900 - margin.right - margin.left;
    const height = 600 - margin.top - margin.bottom;

    // Set tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    const textTooltip = (data) => {
      const doping = () => (data.Doping ? `<br><br>${data.Doping}` : '');

      return (
        `${data.Name}, ${data.Nationality}<br>
        Year: ${data.Year}, Time: ${data.Time}
        ${doping()}`
      );
    };

    // Format the date
    const formatTime = d3.timeFormat('%M:%S');

    // Set domains
    const xMin = d3.min(dataset, d => new Date(d.Year - 1, 0));
    const xMax = d3.max(dataset, d => new Date(d.Year + 1, 0));

    const yMin = d3.min(dataset, d => new Date((d.Seconds - 5) * 1000));
    const yMax = d3.max(dataset, d => new Date((d.Seconds + 5) * 1000));

    // Set scales
    const xScale = d3.scaleTime()
      .domain([xMin, xMax])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleTime()
      .domain([yMax, yMin])
      .range([height - margin.bottom, margin.top]);

    // Chart
    const svg = d3.select('body')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'graph');

    // Circles
    svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', d => d.Year)
      .attr('data-yvalue', d => formatTime(new Date(d.Seconds * 1000)))
      .attr('cx', d => xScale(new Date(d.Year, 0)))
      .attr('cy', d => yScale(new Date(d.Seconds * 1000)))
      .attr('r', 6)
      .style('fill', d => d.Doping ? 'blue' : 'orange')
      .on('mouseover', (d) => {
        tooltip.attr('data-year', d.Year);
        tooltip.transition()
          .duration(100)
          .style('opacity', 0.9);
        tooltip.html(textTooltip(d))
          .style('left', `${d3.event.pageX + 5}px`)
          .style('top', `${d3.event.pageY}px`);
      })
      .on('mouseout', (d) => {
        tooltip.transition()
          .duration(300)
          .style('opacity', 0);
      });

    // X axis
    const xAxis = d3.axisBottom(xScale);

    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    // Y axis
    const yAxis = d3.axisLeft(yScale);

    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis.tickFormat(formatTime));

    // Inline y-axis GDP
    svg.append('text')
      .attr('text-anchor', 'end')
      .attr('transform', `translate(${margin.left - 50}, ${margin.top}) rotate(-90)`)
      .text('Time in minutes');

    // Legend
    const leg = d3.select('svg')
      .append('g')
      .attr('id', 'legend');

    leg.append('rect')
      .attr('x', width - margin.right - 230)
      .attr('y', margin.top + 85)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', 'blue');

    leg.append('text')
      .attr('x', width - margin.right - 200)
      .attr('y', margin.top + 100)
      .attr('text-anchor', 'start')
      .text('Riders with doping allegations');

    leg.append('rect')
      .attr('x', width - margin.right - 230)
      .attr('y', margin.top + 110)
      .attr('width', 20)
      .attr('height', 20)
      .style('fill', 'orange');

    leg.append('text')
      .attr('x', width - margin.right - 200)
      .attr('y', margin.top + 125)
      .attr('text-anchor', 'start')
      .text('No doping allegations');

    // Title
    svg.append('text')
      .attr('x', (width / 2))
      .attr('y', (margin.top / 2))
      .attr('id', 'title')
      .attr('text-anchor', 'middle')
      .text('Doping in Professional Bicycle Racing');
    // Subtitle
    svg.append('text')
      .attr('x', (width / 2))
      .attr('y', (margin.top / 2 + 25))
      .attr('id', 'subtitle')
      .attr('text-anchor', 'middle')
      .text("35 Fastest times up Alpe d'Huez");
  }

  // Fetch data
  fetch(url)
    .then(res => res.json())
    .then(data => initialize(data))
    .catch(err => console.log(err));
});
