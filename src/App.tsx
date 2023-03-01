import React from 'react';
import ReactEChart from 'echarts-for-react';
import { data } from './data';

function App() {
  const getMonthes = (): string[] => {
    const rightMonthes: string[] = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
    const monthes = new Set<string>();

    for (let item of data) {
      monthes.add(item.period)
    }

    return Array.from(monthes).sort(function (a: string, b: string): number {
      return rightMonthes.indexOf(a.toLocaleLowerCase()) - rightMonthes.indexOf(b.toLocaleLowerCase())
    });
  };

  const eChartsOption = {
    legend: {
      // Try 'horizontal'
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    dataset: {
      source: [
        ['lalal', 'В программе ИТ П.', 'В программе ЦП П.', 'Вне программы ИТ П.', 'Вне программы ЦП П.'],
        ['Matcha Latte', 43.3, 85.8, 93.7, 93.7],
        ['Milk Tea', 83.1, 73.4, 55.1, 93.7],
        ['Cheese Cocoa', 86.4, 65.2, 82.5, 93.7],
        ['Walnut Brownie', 72.4, 53.9, 39.1, 93.7]
      ]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
  };

  return (
    <div className="App">
      <ReactEChart option={eChartsOption} />
    </div>
  );
}

export default App;
