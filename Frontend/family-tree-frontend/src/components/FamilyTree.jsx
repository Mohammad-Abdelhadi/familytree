// FamilyTree.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './FamilyTree.css';

const FamilyTree = ({ familyMembers }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!familyMembers.length) return;

    const width = 1200;
    const height = 800;
    const nodeRadius = 50;

    // Clear previous SVG
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create tree layout
    const treeLayout = d3.tree()
      .size([width - 100, height - 100]);

    // Create hierarchy from data
    const root = d3.hierarchy(buildFamilyTree(familyMembers)[0]);

    // Generate tree data
    const treeData = treeLayout(root);

    // Create group element for zoom/pan
    const g = svg.append('g')
      .attr('transform', `translate(50, 50)`);

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Draw links
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y));

    // Create node groups
    const nodes = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Add circles for nodes
    nodes.append('circle')
      .attr('r', nodeRadius)
      .attr('class', 'node-circle');

    // Add images for nodes
    nodes.append('clipPath')
      .attr('id', d => `clip-${d.data._id}`)
      .append('circle')
      .attr('r', nodeRadius - 2);

    nodes.append('image')
      .attr('xlink:href', d => d.data.imageUrl || 'default-avatar.png')
      .attr('x', -nodeRadius)
      .attr('y', -nodeRadius)
      .attr('width', nodeRadius * 2)
      .attr('height', nodeRadius * 2)
      .attr('clip-path', d => `url(#clip-${d.data._id})`);

    // Add text labels
    nodes.append('text')
      .attr('dy', nodeRadius + 20)
      .attr('text-anchor', 'middle')
      .text(d => `${d.data.firstName} ${d.data.lastName}`);

  }, [familyMembers]);

  const buildFamilyTree = (members) => {
    const memberMap = {};
    members.forEach((member) => {
      memberMap[member._id] = { ...member, children: [] };
    });

    const rootNodes = [];
    Object.values(memberMap).forEach((member) => {
      if (member.parentId && memberMap[member.parentId]) {
        memberMap[member.parentId].children.push(member);
      } else {
        rootNodes.push(member);
      }
    });

    return rootNodes;
  };

  return (
    <div className="family-tree-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default FamilyTree;