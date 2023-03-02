import React from 'react';
import ReactEChart from 'echarts-for-react';
import { data } from './data';
import './App.css'

function App() {
  const getMonthes = (dataObj) => {
    //Функция для получения отсортированного массива, хранящего в себе месяца. Для упорядоченного вывода по оси Х
    const rightMonthes = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
    const monthes = new Set();

    for (let item of dataObj) {
      monthes.add(item.period)
    }

    return Array.from(monthes).sort(function (a, b) {
      return rightMonthes.indexOf(a.toLocaleLowerCase()) - rightMonthes.indexOf(b.toLocaleLowerCase())
    });
  };

  const getSortedValuesByMonthes = (dataObj, name) => {
    /*
    Функция сортирует по месяцам значения value, в объекте которого name соответствует введеному в атрибут значению.
    То есть,для объектов, содержащих в поле name, к примеру, значение "В программе ЦП", значения value будут сложены по определенным месяцам.
 
    Пример получаемого на выходе значения: 
    {
      "Март": 220,
      "Апрель": 110,
      "Май": 50
    }
    */
    const monthes = getMonthes(data);
    const obj = {};

    for (let item of monthes) {
      obj[item] = 0
    }

    for (let item of dataObj) {
      if (item.name === name) {
        obj[item.period] += item.value;
      }
    }

    return obj
  }


  const getNames = (dataObj) => {
    //Функция для получения уникальных значений поля name. На выходе получаем массив строк с уникальными значениями
    const set = new Set();

    for (let item of dataObj) {
      set.add(item.name);
    }

    return Array.from(set)
  }

  const names = getNames(data);

  const series1 = [
    {
      name: `${names[0]} П.`,
      data: Object.values(getSortedValuesByMonthes(data, names[0])),
    },
    {
      name: `${names[1]} П.`,
      data: Object.values(getSortedValuesByMonthes(data, names[1])),
    },
  ];

  const series2 = [
    {
      name: `${names[2]} П.`,
      data: Object.values(getSortedValuesByMonthes(data, names[2])),
    },
    {
      name: `${names[3]} П.`,
      data: Object.values(getSortedValuesByMonthes(data, names[3])),
    }
  ]

  const getFormatter = (series) => {
    return (params) => {
      let sum = 0;

      series.forEach(item => {
        sum += item.data[params.dataIndex];
      });
      // inProgrammCount += params.value;
      // console.log(inProgrammCount)
      return sum;
    }
  };

  const eChartsOption = {
    color: ['#56B9F2', '#0078D2', '#22C38E', '#00724C'],
    legend: {
      top: 'bottom',
      icon: 'circle'
    },
    tooltip: {
      feature: {
        magicType: {
          type: 'stack'
        }
      },
      trigger: 'axis',
      formatter: function (params) {
        const inProgramm = [];
        const notInProgramm = [];
        let inProgrammCount = 0;
        let notInProgrammCount = 0;
        let axisValueCount = 0;
        for (let item of params) {
          axisValueCount += item.value;
        }
        for (let item of params) {
          if (item.seriesName.includes('В программе')) {
            inProgramm.push(item);
            inProgrammCount += item.value;
          } else {
            notInProgramm.push(item);
            notInProgrammCount += item.value;
          }
        }

        //В документации написано, что на выходе получается строка. Другой тип на странице не показывается, поэтому сделано так
        return `
          <div class="tooltip__custom"> 
            <p class="tooltip__custom--axis">${params[0].axisValue}</p>         
              ${inProgramm.length === 0 ? '' :
            `<p class="tooltip__custom--in">В программе <span>${Math.floor((inProgrammCount / axisValueCount) * 100)}% | ${inProgrammCount} шт.</span></p>
              <div>
                ${inProgramm.map(item => {
              return `<div class="tooltip__custom--wrapper"><div>${item.marker} ${item.seriesName.includes('ИТ') ? 'Проекты ИТ' : 'Проекты ЦП'}</div> <div class="tooltip__custom--span">${item.value} шт.</div></div>`
            }).join('')}
              </div>`}

              ${notInProgramm.length === 0 ? '' :
            `<p class="tooltip__custom--in">В программе <span>${Math.ceil((notInProgrammCount / axisValueCount) * 100)}% | ${notInProgrammCount} шт.</span></p>
              <div>
                ${notInProgramm.map(item => {
              return `<div class="tooltip__custom--wrapper"><div>${item.marker} ${item.seriesName.includes('ИТ') ? 'Проекты ИТ' : 'Проекты ЦП'}</div> <div class="tooltip__custom--span">${item.value} шт.</div></div>`
            }).join('')}
              </div>`}
              `
      }
    },
    xAxis: {
      type: 'category',
      data: getMonthes(data),
    },
    yAxis: {
      type: 'value'
    },
    series: [
      ...series1.map((item, index) => Object.assign(item, {
        type: 'bar',
        stack: item.name.includes('Вне') ? 'stack2' : 'stack1',
        label: {
          show: index === series1.length - 1,
          // show: true,
          // formatter: getFormatter(series1),
          formatter: getFormatter(series1),
          fontSize: 20,
          color: 'black',
          position: 'top'
        },
      })),
      ...series2.map((item, index) => Object.assign(item, {
        type: 'bar',
        stack: item.name.includes('Вне') ? 'stack2' : 'stack1',
        label: {
          show: index === series2.length - 1,
          formatter: getFormatter(series2),
          fontSize: 20,
          color: 'black',
          position: 'top'
        },
      })),
    ]
  };

  return (
    <div className="App" >
      <ReactEChart option={eChartsOption} />
    </div >
  );
}

export default App;
