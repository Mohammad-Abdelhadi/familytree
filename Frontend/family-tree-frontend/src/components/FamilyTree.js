// FamilyTree.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './FamilyTree.css';

const FamilyTree = ({ familyMembers }) => {
  const svgRef = useRef();
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    if (!familyMembers || !familyMembers.length) return;

    d3.select(svgRef.current).selectAll("*").remove();

    // البحث عن الجد والجدة
    const grandfather = familyMembers.find(
      member => member._id === "671bf292deb985d0f9a43091"
    );
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
    const width = 1500;
    const height = 1200;
    const nodeWidth = 200;
    const nodeHeight = 100;
    const levelGap = 150;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g')
      .attr('transform', `translate(${width/2},50)`);

    // رسم الشخص مع زر التوسيع
    const drawPerson = (person, x, y, type) => {
      const group = g.append('g')
        .attr('transform', `translate(${x},${y})`);

      // المستطيل الأساسي
      group.append('rect')
        .attr('x', -nodeWidth/2)
        .attr('y', 0)
        .attr('width', nodeWidth)
        .attr('height', nodeHeight)
        .attr('rx', 10)
        .attr('class', `node ${person.gender} ${type}`);

      // معلومات الشخص
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

      // إضافة زر التوسيع إذا كان للشخص أبناء
      if (person.children && person.children.length > 0) {
        const expandButton = group.append('g')
          .attr('class', 'expand-button')
          .attr('transform', `translate(${nodeWidth/2 - 20}, ${nodeHeight - 20})`);

        expandButton.append('circle')
          .attr('r', 10)
          .attr('fill', '#fff')
          .attr('stroke', '#333');

        expandButton.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '0.3em')
          .text(() => expandedNodes.has(person._id) ? '-' : '+')
          .style('font-size', '16px');

        expandButton.on('click', () => {
          const newExpanded = new Set(expandedNodes);
          if (newExpanded.has(person._id)) {
            newExpanded.delete(person._id);
          } else {
            newExpanded.add(person._id);
          }
          setExpandedNodes(newExpanded);
        });
      }

      return group;
    };

    // رسم خط الربط
    const drawLink = (startX, startY, endX, endY) => {
      return g.append('path')
        .attr('d', `
          M${startX},${startY} 
          L${startX},${startY + 30}
          L${endX},${endY - 30}
          L${endX},${endY}
        `)
        .attr('class', 'link');
    };

    // رسم الجد والجدة
    drawPerson(grandfather, 0, 0, 'grandfather');
    drawPerson(grandmother, 0, levelGap, 'grandmother');
    
    // خط الزواج بين الجد والجدة
    g.append('path')
      .attr('d', `M0,${nodeHeight} L0,${levelGap}`)
      .attr('class', 'marriage-line');

    // رسم الأبناء وأزواجهم وأحفادهم
    children.forEach((child, index) => {
      const spacing = nodeWidth * 4;
      const totalWidth = spacing * (children.length - 1);
      const startX = -totalWidth / 2;
      const childX = startX + (index * spacing);
      const childY = levelGap * 2.5;
      
      drawLink(0, levelGap + nodeHeight, childX, childY);
      drawPerson(child, childX, childY, 'child');

      // عرض الزوج/الزوجة والأحفاد فقط إذا كان الفرع مفتوحاً
      if (expandedNodes.has(child._id)) {
        let spouse = null;
        if (child.children && child.children.length > 0) {
          const otherParentId = child.children[0].otherParent;
          spouse = familyMembers.find(m => m._id === otherParentId);
        }

        let currentY = childY;
        if (spouse) {
          const spouseY = childY + nodeHeight + 50;
          drawPerson(spouse, childX, spouseY, 'spouse');
          
          g.append('path')
            .attr('d', `M${childX},${childY + nodeHeight} L${childX},${spouseY}`)
            .attr('class', 'marriage-line');

          currentY = spouseY;
        }

        if (child.children && child.children.length > 0) {
          const grandchildrenY = currentY + nodeHeight + levelGap;
          
          child.children.forEach((grandchild, gIndex) => {
            const numGrandchildren = child.children.length;
            const grandchildX = childX + ((gIndex - (numGrandchildren-1)/2) * nodeWidth * 1.2);

            drawLink(childX, currentY + nodeHeight, grandchildX, grandchildrenY);

            const grandchildPerson = familyMembers.find(m => m._id === grandchild.child._id);
            if (grandchildPerson) {
              drawPerson(grandchildPerson, grandchildX, grandchildrenY, 'grandchild');
            }
          });
        }
      }
    });

    // إضافة خاصية التكبير/التصغير
    const zoom = d3.zoom()
      .scaleExtent([0.1, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      // تكملة الكود السابق...
      });

    svg.call(zoom);

  }, [familyMembers, expandedNodes]);

  return (
    <div className="family-tree-container">
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default FamilyTree;