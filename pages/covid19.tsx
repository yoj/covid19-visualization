import { GetStaticProps } from 'next'
import fs from 'fs'
import Layout from '../components/Layout'
import * as Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'
//import ndjson from 'ndjson'
import {ndjsonToJsonText} from 'ndjson-to-json-text'

type Infected = {
    date: string,
    name_jp: string,
    npatients: string
}

type InfectedAll = Infected[]

const Covid19Page = ( {InfectedAll} ) => {
    const xDate: string[] = []
    const yInfected: number[] = []
    InfectedAll.map((data: Infected, index: number) => {
        const nextItem = InfectedAll[(index + 1)]
        
        let dailyinfected = 0
        if(nextItem !== undefined) {
            dailyinfected = Number(data.npatients) - nextItem.npatients
        }

        xDate.push(data.date)
        yInfected.push(dailyinfected)
    })
    
    /*** HightChart ***/
    if (typeof Highcharts === 'object') {
        HighchartsMore(Highcharts);
      }
      const options = {
        chart: {
          type: 'line'
        },
     
        accessibility: {
          description:
            'A spiderweb chart compares the allocated budget against actual spending within an organization. The spider chart has six spokes. Each spoke represents one of the 6 departments within the organization: sales, marketing, development, customer support, information technology and administration. The chart is interactive, and each data point is displayed upon hovering. The chart clearly shows that 4 of the 6 departments have overspent their budget with Marketing responsible for the greatest overspend of $20,000. The allocated budget and actual spending data points for each department are as follows: Sales. Budget equals $43,000; spending equals $50,000. Marketing. Budget equals $19,000; spending equals $39,000. Development. Budget equals $60,000; spending equals $42,000. Customer support. Budget equals $35,000; spending equals $31,000. Information technology. Budget equals $17,000; spending equals $26,000. Administration. Budget equals $10,000; spending equals $14,000.'
        },
     
        title: {
          text: 'Covid-19 Tokyo',
          x: -80
        },
     
        pane: {
          size: '80%'
        },
     
        xAxis: {
          //categories: ['Sales', 'Marketing', 'Development', 'Customer Support', 'Information Technology', 'Administration'],
          categories: xDate.reverse(),
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
     
        yAxis: {
          //gridLineInterpolation: 'polygon',
          lineWidth: 0,
          min: 0
        },
     
        tooltip: {
          shared: true,
          pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
        },
     
        legend: {
          align: 'right',
          verticalAlign: 'middle',
          layout: 'vertical'
        },
     
        series: [
          {
            name: 'Tokyo Daily infected',
            data: yInfected.reverse(),
            pointPlacement: 'on'
          },
          /*{
            name: 'Actual Spending',
            data: [50000, 39000, 42000, 31000, 26000, 14000],
            pointPlacement: 'on'
          }*/
        ],
     
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  align: 'center',
                  verticalAlign: 'bottom',
                  layout: 'horizontal'
                },
                pane: {
                  size: '70%'
                }
              }
            }
          ]
        }
      };

    return (
        <Layout title="Covid19 graph">
            <h1>Covid19</h1>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </Layout>
    )
}
export default Covid19Page



export const getStaticProps = async () => {

    /** 感染者数 */
    const res = await fetch("https://opendata.corona.go.jp/api/Covid19JapanAll?dataName=%E6%9D%B1%E4%BA%AC%E9%83%BD")
    const json = await res.json()
    const InfectedAll = json.itemList as InfectedAll

    /** ワクチン接種数 */
    const vaccination = await fetch("https://vrs-data.cio.go.jp/vaccination/opendata/latest/prefecture.ndjson")
    const vaccinationText = await vaccination.text()
    const vaccinationJson = ndjsonToJsonText(vaccinationText)
    const vaccinationJsonObject = JSON.parse(vaccinationJson)

    console.log(vaccinationJsonObject)
    
    /*fs.createReadStream("https://vrs-data.cio.go.jp/vaccination/opendata/latest/prefecture.ndjson")
        .pipe(ndjson.parse())
        .on('data', function(obj) {
            // obj is a javascript object
            console.log(obj)
        })
    */
    return {
        props: {InfectedAll}
    }
}

