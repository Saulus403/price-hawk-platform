
import * as React from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip as ChartTooltip,
  ArcElement,
  ChartData,
  ChartOptions,
  ScriptableContext,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ChartContainer } from "./chart";

// Register the required chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

// Default styling options for both charts
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 4,
    },
  },
};

interface BarChartProps {
  data: {
    name: string;
    value: number;
  }[];
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}: BarChartProps) {
  // Transform the data into Chart.js format
  const chartData: ChartData<'bar'> = {
    labels: data.map(item => item[index as keyof typeof item] as string),
    datasets: [
      {
        label: categories[0],
        data: data.map(item => item.value),
        backgroundColor: colors[0] || '#1E3A8A',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  // Configure options for the bar chart
  const barOptions = {
    ...defaultOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number) {
            return valueFormatter(value);
          }
        }
      },
    },
    plugins: {
      ...defaultOptions.plugins,
      tooltip: {
        ...defaultOptions.plugins?.tooltip,
        callbacks: {
          label: function(context: any) {
            return valueFormatter(context.parsed.y);
          }
        }
      }
    }
  };

  return (
    <ChartContainer className={className} config={{}}>
      <Bar data={chartData} options={barOptions as any} />
    </ChartContainer>
  );
}

interface PieChartProps {
  data: {
    name: string;
    value: number;
    fill?: string;
  }[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function PieChart({
  data,
  index,
  colors,
  valueFormatter = (value) => `${value}`,
  className,
}: PieChartProps) {
  // Transform the data into Chart.js format
  const chartData: ChartData<'pie'> = {
    labels: data.map(item => item[index as keyof typeof item] as string),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map((item, i) => item.fill || colors?.[i] || `hsl(${i * 50}, 70%, 50%)`),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  // Configure options for the pie chart
  const pieOptions = {
    ...defaultOptions,
    plugins: {
      ...defaultOptions.plugins,
      tooltip: {
        ...defaultOptions.plugins?.tooltip,
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${valueFormatter(value)}`;
          }
        }
      }
    }
  };

  return (
    <ChartContainer className={className} config={{}}>
      <Pie data={chartData} options={pieOptions as any} />
    </ChartContainer>
  );
}
