import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './FamilyTree.css';

const FamilyTree = ({ familyMembers }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!familyMembers || !familyMembers.length) return;

    // تنظيف SVG السابق
    d3.select(svgRef.current).selectAll("*").remove();

    // البحث عن محمد العمري (الجد)
    const grandfather = familyMembers.find(
      member => member._id === "671bf292deb985d0f9a43091"
    );

    // البحث عن فاطمة (الجدة)
    const grandmother = familyMembers.find(
      member => member._id === "671bf2a8deb985d0f9a43093"
    );

    // البحث عن الأبناء
    const children = familyMembers.filter(member => 
      member.parents && 
      member.parents.some(parent => 
        parent._id === grandfather._id || 
        parent._id === grandmother._id
      )
    );

    // إعداد SVG
    const width = 1200;
    const height = 800;
    const nodeWidth = 200;
    const nodeHeight = 100;
    const levelGap = 150;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${width/2},50)`);

    // رسم الشخص
    const drawPerson = (person, x, y, type) => {
      const group = g.append('g')
        .attr('transform', `translate(${x},${y})`);

      group.append('rect')
        .attr('x', -nodeWidth/2)
        .attr('y', 0)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 10)
        .attr('class', `node ${person.gender} ${type}`);

      group.append('text')
        .attr('x', 0)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('class', 'name')
        .text(`${person.firstName} ${person.lastName}`);

      group.append('text')
        .attr('x', 0)
        .attr('y', 45)
        .attr('text-anchor', 'middle')
        .attr('class', 'info')
        .text(person.profession);

      group.append('text')
        .attr('x', 0)
        .attr('y', 65)
        .attr('text-anchor', 'middle')
        .attr('class', 'info')
        .text(`${new Date(person.birthday).getFullYear()}`);

      return group;
    };

    // رسم الجد
    drawPerson(grandfather, 0, 0, 'grandfather');

    // رسم الجدة تحت الجد
    drawPerson(grandmother, 0, levelGap, 'grandmother');

    // رسم خط يربط بين الجد والجدة
    g.append('path')
      .attr('d', `M0,${nodeHeight} L0,${levelGap}`)
      .attr('class', 'marriage-line');

    // رسم الأبناء
    children.forEach((child, index) => {
      const childX = ((index - (children.length-1)/2) * nodeWidth * 1.5);
      const childY = levelGap * 2.5;

      // رسم خط الربط من الجدة للأبناء
      g.append('path')
        .attr('d', `
          M0,${levelGap + nodeHeight} 
          L0,${levelGap + nodeHeight + 30}
          L${childX},${childY - 30}
          L${childX},${childY}
        `)
        .attr('class', 'link');

      drawPerson(child, childX, childY, 'child');
    });

    // إضافة خاصية التكبير/التصغير
    const zoom = d3.zoom()
      .scaleExtent([0.1, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

  }, [familyMembers]);

  return (
    <div className="family-tree-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default FamilyTree;