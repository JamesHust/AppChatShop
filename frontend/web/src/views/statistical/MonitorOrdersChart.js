import React from "react";
import { CChartLine } from "@coreui/react-chartjs";
import COLORS from "../../constants/colors";

const MonitorOrdersChart = (attributes) => {
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const defaultDatasets = (() => {
    let elements = 27;
    const total = [];
    const success = [];
    const failed = [];
    // Khởi tạo giá trị ngẫu nhiên
    for (let i = 0; i <= elements; i++) {
      total.push(random(50, 200));
      success.push(random(80, 100));
      failed.push(random(15, 100));
    }
    return [
      {
        label: "Đơn đặt hàng",
        backgroundColor: COLORS.blue_1,
        borderColor: COLORS.light_blue_13,
        pointHoverBackgroundColor: COLORS.light_blue_13,
        borderWidth: 2,
        data: total,
      },
      {
        label: "Đơn thành công",
        backgroundColor: "transparent",
        borderColor: COLORS.green_13,
        pointHoverBackgroundColor: COLORS.green_13,
        borderWidth: 2,
        data: success,
      },
      {
        label: "Đơn thất bại",
        backgroundColor: "transparent",
        borderColor: COLORS.red_12,
        pointHoverBackgroundColor: COLORS.red_12,
        borderWidth: 2,
        data: failed,
      },
    ];
  })();

  //   Config option cho biểu đồ
  const defaultOptions = (() => {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              drawOnChartArea: false,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 5,
              stepSize: Math.ceil(250 / 5),
              max: 250,
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        },
      },
    };
  })();

  // render
  return (
    <CChartLine
      {...attributes}
      datasets={defaultDatasets}
      options={defaultOptions}
      labels={[
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "CN",
        "T2",
        "T3",
        "T4",
        "T5",
        "T6",
        "T7",
        "CN",
      ]}
    />
  );
};

export default MonitorOrdersChart;
