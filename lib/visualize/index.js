import data from './data.json'

const { d3 } = window

document.addEventListener('DOMContentLoaded', () => {
  const links = data.links.map(Object.create)
  const nodes = data.nodes.map(Object.create)

  // distributed force graph
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d) => d.id)
    )
    .force('charge', d3.forceManyBody())
    .force('x', d3.forceX())
    .force('y', d3.forceY())

  // zoom
  const zoom = d3
    .zoom()
    .scaleExtent([1, 10])
    .on('zoom', function zoomed({ transform }) {
      g.attr('transform', transform)
    })

  // outer container
  const height = window.innerWidth
  const width = window.innerHeight
  const svg = d3
    .create('svg')
    .attr('viewBox', [-width / 2, -height / 2, width, height])
    .call(zoom)

  // elements container
  const g = svg.append('g')

  // lines between circles
  const link = g
    .append('g')
    .attr('stroke', '#999')
    .attr('stroke-opacity', 0.5)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.sqrt(d.value))

  // drag behavior
  const drag = (simulation) =>
    d3
      .drag()
      .on('start', function dragstarted({ active, x, y }, d) {
        if (!active) simulation.alphaTarget(0.3).restart()
        d.fx = x
        d.fy = y
      })
      .on('drag', function dragged({ x, y }, d) {
        d.fx = x
        d.fy = y
      })
      .on('end', function dragended({ active }, d) {
        if (!active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
      })

  // circles and binding drag behavior
  const node = g
    .selectAll('.node')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .call(drag(simulation))

  // circle styles
  const scale = d3.scaleOrdinal(d3.schemeCategory10)
  const color = (d) => scale(d.group)
  node.append('circle').attr('r', 5).attr('fill', color)

  // circle label
  node
    .append('text')
    .attr('dx', 8)
    .attr('dy', '.35em')
    .text((d) => d.id)

  simulation.on('tick', () => {
    // connect lines between nodes
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
    // move nodes to ends of lines
    node.attr('transform', (d) => `translate(${d.x},${d.y})`)
  })

  document.body.prepend(svg.node())

  // zoom in button
  document.getElementById('zoom-in').addEventListener('click', (e) => {
    svg.transition().call(zoom.scaleBy, 2)
  })

  // zoom out button
  document.getElementById('zoom-out').addEventListener('click', (e) => {
    svg.transition().call(zoom.scaleBy, 0.5)
  })
})
