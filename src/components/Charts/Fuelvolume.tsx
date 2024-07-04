import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { PeriodeProps } from "../../common/react-props";
import { useAuth } from "../../store/AuthContext";
import { getChartByFuelCartPeriod } from "../../common/api/chart-api";

const FuelvolumeCart = ({ periode, startDate, endDate }: PeriodeProps) => {
  const [chartData, setChartData] = useState<{
    series: any[];
    categories: string[];
  }>({ series: [], categories: [] });
  const { customerId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChartByFuelCartPeriod(
          periode,
          startDate,
          endDate,
          customerId,
        );
        processChartData(data);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [periode, startDate, endDate, customerId]);

  const processChartData = (data: any[]) => {
    const seriesData: { [key: string]: { [key: string]: number } } = {};
    const categories: Set<string> = new Set();

    // Collect data and cardIdentifiers
    data.forEach((transaction) => {
      if (!seriesData[transaction.fuelGrade]) {
        seriesData[transaction.fuelGrade] = {};
      }
      seriesData[transaction.fuelGrade][transaction.cardIdentifier] =
        transaction.sum;
      categories.add(transaction.cardIdentifier);
    });

    const allCategories = Array.from(categories);

    const series = Object.keys(seriesData).map((fuelGrade) => ({
      name: fuelGrade,
      data: allCategories.map((cardId) => seriesData[fuelGrade][cardId] || 0),
    }));

    setChartData({
      series: series,
      categories: allCategories,
    });
  };

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    legend: {
      position: "right",
      horizontalAlign: "center",
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "inherit",
      markers: {
        width: 8,
        height: 8,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 8,
      },
      labels: {
        colors: "black",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    colors: [
      "#008FFB",
      "#00E396",
      "#FEB019",
      "#FF4560",
      "#775DD0",
      "#3F51B5",
      "#546E7A",
      "#D4526E",
      "#8D5B4C",
      "#F86624",
    ],
    dataLabels: {
      enabled: true,
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
      labels: {
        style: {
          fontSize: "12px",
          colors: "#000000",
        },
        offsetY: 0,
      },
      categories: chartData.categories,
      axisBorder: {
        show: true,
        color: "#000000",
      },
      axisTicks: {
        show: true,
        color: "#000000",
        height: 6,
      },
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
        series={chartData.series}
        type="bar"
        height={450}
      />
    </div>
  );
};

export default FuelvolumeCart;
