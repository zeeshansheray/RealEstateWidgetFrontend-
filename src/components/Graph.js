

import React from 'react';

import {Line} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import { ColorSchemeCode } from '../enums/ColorScheme';

export default function Graph(props){
    var lineChartOptions = {
        scales: {
            xAxes: [{
                gridLines: {
                    display      : true,
                    color        : ColorSchemeCode.neutral20,
                    borderDash   : [3],
                    zeroLineColor: ColorSchemeCode.neutral20
                }   
            }],
            yAxes: [{
                gridLines: {
                    display: false,
                    zeroLineColor : ColorSchemeCode.neutral20
                },
                ticks: {
                    display: false
               }
            }],
        },
        legend: {
            display: false
        },
        layout: {
            padding: {
              top: 8
            }
        },
        maintainAspectRatio: false

      };

      var barChartOptions = {
        scales: {
            xAxes: [{
                gridLines: {
                    display:false
                },
            }],
            yAxes: [{
                gridLines: {
                    display:false
                },
                ticks: {
                    beginAtZero: true,
                    display: false
                },  
            }],
        },
        legend: {
            display: false
        },
        layout: {
            padding: {
              top: 8
            }
        },
        cornerRadius: 20,
        maintainAspectRatio: false
      };
      
    return(
        <div id="graph col-md-4">
            {
                props.type=="line" ? 
                    <Line data={props.data} options={lineChartOptions} height={props.height ? props.height : '240px'}/> :
                    <Bar  data={props.data} options={barChartOptions}/>
            }
        </div>

    )
}