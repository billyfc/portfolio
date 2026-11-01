import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const projectsTitle = document.querySelector('.projects-title')
projectsTitle.textContent = `Projects (${projects.length})`

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let selectedIndex = -1;

function renderPieChart(projectsGiven) {
    let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
    );
    let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
    });
    let sliceGenerator = d3.pie().value((d) => d.value);
    let arcData = sliceGenerator(data);
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
    let arcs = arcData.map((d) => arcGenerator(d));
    // Select and clear existing chart
    let svg = d3.select('#projects-pie-plot');
    svg.selectAll('path').remove();
    arcs.forEach((arc, i) => {
        svg
            .append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

        svg
            .selectAll('path')
            .attr('class', (_, idx) =>
                idx === selectedIndex ? 'selected' : ''
            );

        legend
            .selectAll('li')
            .attr('class', (_, idx) =>
            idx === selectedIndex ? 'legend-item selected' : 'legend-item'
        );

        if (selectedIndex === -1) {
            renderProjects(projects, projectsContainer, 'h2');
        } else {
            let selectedYear = data[selectedIndex].label;

            let filteredProjects = projects.filter(
            (project) => project.year === selectedYear
        );

        renderProjects(filteredProjects, projectsContainer, 'h2');
    }

    });
});
    // Select and clear existing legend
    let legend = d3.select('.legend');
    legend.selectAll('li').remove();
    data.forEach((d, idx) => {
    legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
        .attr('class', 'legend-item')
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    });
}

renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // update query value
  query = event.target.value;
  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});