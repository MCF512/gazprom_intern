import React from 'react';
import ReactEChart from 'echarts-for-react';
import { data } from './data';

function App() {
  const getMonthes = (dataObj: any): string[] => {
    //Функция для получения отсортированного массива, хранящего в себе месяца. Для упорядоченного вывода по оси Х
    const rightMonthes: string[] = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь']
    const monthes = new Set<string>();

    for (let item of dataObj) {
      monthes.add(item.period)
    }

    return Array.from(monthes).sort(function (a: string, b: string): number {
      return rightMonthes.indexOf(a.toLocaleLowerCase()) - rightMonthes.indexOf(b.toLocaleLowerCase())
    });
  };

  const getFullValue = (dataObj: any): number => {
    //Функция для получения суммы всех значений value. Для дальнейшего перевода в проценты.
    let sum: number = 0;

    for (let item of dataObj) {
      sum += item.value
    }

    return sum
  }

  const getSortedValuesByMonthes = (dataObj: any, name: string) => {
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
    const obj: any = {};

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


  const getNames = (dataObj: any): string[] => {
    //Функция для получения уникальных значений поля name. На выходе получаем массив строк с уникальными значениями
    const set = new Set<string>();

    for (let item of dataObj) {
      set.add(item.name);
    }

    return Array.from(set)
  }

  const names: string[] = getNames(data);

  const eChartsOption = {
    legend: {},
    tooltip: {
      // formatter: '{@111}',
      valueFormatter: (value: any) => value + 'шт.',
      trigger: 'axis',
      axisPointer: {
        label: {
          formatter: 'some text {value} some text',
        }
      },
      formatter: function (params: Array<any>): string {
        const inProgramm: Array<any> = [];
        const notInProgramm: Array<any> = [];
        let inProgrammCount: number = 0;
        let notInProgrammCount: number = 0;
        let axisValueCount: number = 0;
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


        console.log(inProgramm)
        console.log(notInProgramm)
        //В документации написано, что на выходе получается строка. Другой тип на странице не показывается, поэтому сделано так
        return `
          <div class="tooltip__custom">          
          
              ${inProgramm.length == 0 ? '' :
            `<h3>В программе <span>${Math.floor((inProgrammCount / axisValueCount) * 100)}% | ${inProgrammCount} шт.</span></h3>
              <div>
              ${inProgramm.map(item => {
              return item.marker + item.value
            })}
              </div>`}
              `
      }
    },
    xAxis: {
      type: 'category',
      data: getMonthes(data),
    },
    yAxis: {},
    series: [
      {
        name: `${names[0]} П.`,
        type: 'bar',
        stack: 'bar1',
        label: {
          show: true,
          formatter: '{@111}'
        },
        emphasis: {
          focus: 'series'
        },
        data: Object.values(getSortedValuesByMonthes(data, names[0])),
        markPoint: {
          symbolSize: 1,
          // symbolOffset: [0, '50%'],
          label: {

          },
          data: [
            { type: 'max' },
          ]
        }
      },
      {
        name: names[1],
        type: 'bar',
        stack: 'bar1',
        label: {
          show: true,
        },
        emphasis: {
          focus: 'series'
        },
        data: Object.values(getSortedValuesByMonthes(data, names[1]))
      },
      {
        name: names[2],
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: Object.values(getSortedValuesByMonthes(data, names[2]))
      },
      {
        name: names[3],
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: Object.values(getSortedValuesByMonthes(data, names[3]))
      },
    ]
  };

  return (
    <div className="App" >
      <ReactEChart option={eChartsOption} />
    </div >
  );
}

export default App;
