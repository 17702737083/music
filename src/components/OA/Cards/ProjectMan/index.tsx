import React, { useState, useEffect } from "react";
import { Pie, Bar } from "@ant-design/charts";
import ProCard from "@ant-design/pro-card";

const ProjectMan: React.FC = () => {
  var data = [
    {
      type: "P1",
      value: 27
    },
    {
      type: "P5",
      value: 25
    },
    {
      type: "財務",
      value: 18
    },
    {
      type: "行政",
      value: 15
    },
    {
      type: "IT",
      value: 10
    },
    {
      type: "其他",
      value: 5
    }
  ];
  var config = {
    appendPadding: 10,
    data: data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
      }
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        },
        content: "總人數\n88"
      }
    }
  };

  var bardata = [
    {
      year: 'P1',
      value: 3,
      type: '前端',
    },
    {
      year: 'P5',
      value: 4,
      type: '前端',
    },
    {
      year: 'Site',
      value: 3.5,
      type: '前端',
    },
    {
      year: '其他',
      value: 5,
      type: '前端',
    },
    {
      year: 'P1',
      value: 3,
      type: '後端',
    },
    {
      year: 'P5',
      value: 4,
      type: '後端',
    },
    {
      year: 'Site',
      value: 3.5,
      type: '後端',
    },
    {
      year: '其他',
      value: 5,
      type: '後端',
    }
  ];
  var barconfig = {
    data: bardata.reverse(),
    isStack: true,
    xField: 'value',
    yField: 'year',
    seriesField: 'type',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
  };

  return <>
    <ProCard split="horizontal">
      <ProCard split="vertical">
        <Pie {...config} />
      </ProCard>
      {/* <ProCard split="vertical">
        <Bar {...barconfig} />
      </ProCard> */}
    </ProCard>
  </>;
};

export default ProjectMan;
