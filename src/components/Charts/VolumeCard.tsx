import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { PeriodeProps } from "../../common/react-props";
import { useAuth } from "../../store/AuthContext";
import { getdailyChart } from "../../common/api/chart-api";

const VolumeCard = ({ periode, startDate, endDate }: PeriodeProps) => {
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const { customerId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getdailyChart(
          periode,
          startDate,
          endDate,
          customerId,
        );

        const chartData: { [key: string]: number[] } = {};
        const cardIdentifiers: string[] = [];

        data.forEach(
          (entry: { cardIdentifier: string; sum: number; date: string }) => {
            if (!cardIdentifiers.includes(entry.cardIdentifier)) {
              cardIdentifiers.push(entry.cardIdentifier);
            }

            if (!chartData[entry.date]) {
              chartData[entry.date] = new Array(cardIdentifiers.length).fill(0);
            }

            const cardIndex = cardIdentifiers.indexOf(entry.cardIdentifier);
            chartData[entry.date][cardIndex] = entry.sum;
          },
        );

        const seriesData = cardIdentifiers.map((identifier, index) => ({
          name: `${identifier}`,
          data: Object.keys(chartData).map((date) => chartData[date][index]),
        }));

        const dates = Object.keys(chartData);

        setCategories(dates);
        setSeries(seriesData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [periode, startDate, endDate, customerId]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [
      "#FEB019",
      "#775DD0",
      "#8D5B4C",
      "#F86624",
      "#546E7A",
      "#D4526E",
      "#008FFB",
      "#00E396",
      "#FF4560",
      "#3F51B5",
    ],
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
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      curve: "straight",
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: {
        sizeOffset: 2,
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {},
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
        type="line"
        height={450}
      />
    </div>
  );
};

export default VolumeCard;
