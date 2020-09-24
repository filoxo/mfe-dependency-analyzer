import data from "./data.json";

const d3 = window.d3

document.addEventListener("DOMContentLoaded", () => {
  const drag = (simulation) => {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const zoom = d3.zoom().scaleExtent([1, 40]).on("zoom", zoomed);

  function zoomed({ transform }) {
    g.attr("transform", transform);
  }

  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  const color = (d) => scale(d.group);

  const height = window.innerWidth;
  const width = window.innerHeight;

  const links = data.links.map(Object.create);
  const nodes = data.nodes.map(Object.create);

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .call(zoom);

  const g = svg.append("g");

  const link = g
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = g
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .call(drag(simulation));

  node.append("circle").attr("r", 5).attr("fill", color);

  node
    .append("text")
    .attr("dx", 8)
    .attr("dy", ".35em")
    .text((d) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  document.body.prepend(svg.node());

  document.getElementById("zoom-in").addEventListener("click", (e) => {
    svg.transition().call(zoom.scaleBy, 2);
  });

  document.getElementById("zoom-out").addEventListener("click", (e) => {
    svg.transition().call(zoom.scaleBy, 0.5);
  });
});
