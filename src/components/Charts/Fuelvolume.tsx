import React from "react";
import ReactApexChart from "react-apexcharts";

const Fuelvolume = () => {
  const series = [
    {
      name: "Gasoil",
      data: [10, 20, 30],
    },
    {
      name: "Super sans plomb",
      data: [50, 60, 70],
    },
    {
      name: "Gasoil sans soufre",
      data: [26, 90, 50],
    },
  ];
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      title: {
        text: "IDs des cartes",
      },
      categories: ["FR01", "FR02", "FR03"],
    },
    yaxis: {
      title: {
        text: "Volume de carburant consommé",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={450}
      />
    </div>
  );
};

export default Fuelvolume;
