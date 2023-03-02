import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState } from 'react';
import { useEffect } from 'react';
import { useMemo } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function ChartJs({ data }) {

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Bar Chart',
            },
        },
    };

    const newData = useMemo(() => {
        const labels = Object.keys(data[0]);
        const newData = {};
        data.forEach((item, i) => {
            Object.keys(item).forEach(key => {
                if (newData[key]) {
                    newData[key].push(item[key])
                } else {
                    newData[key] = [item[key]]
                }
            })
        })
        return ({
            labels,
            datasets: Object.keys(newData).map((label) =>
            ({
                label,
                data: newData[label],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            })
            )
        })
    }, [data])


    return <Bar options={options} data={newData} />;
}
