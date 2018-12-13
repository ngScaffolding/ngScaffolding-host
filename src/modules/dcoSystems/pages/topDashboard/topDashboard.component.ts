import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from 'ngscaffolding-core';
import { ChartDetailModel, DataShapes } from '@ngscaffolding/models';

@Component({
  templateUrl: 'topDashboard.component.html',
  styleUrls: ['topDashboard.component.scss']
})
export class TopDashboardComponent implements OnInit, AfterViewInit {
  constructor(private route: ActivatedRoute, private dataSource: DataSourceService) {
    this.route.queryParams.subscribe(params => {
      // this.dataSource.getData({name: 'Finder.Device.Details', inputData: JSON.stringify({ComputerSystemID: this.computerSystemID}) })
      // .subscribe(data => {
      //   this.topData = JSON.parse(data.jsonData);
      // });
    });
  }
  chartDetailDryAirInlet: ChartDetailModel = {
    title: '',
    dataSourceName: 'Maramba_Temperatures',
    dataShape: DataShapes.RowToObject,
    propertyLocations: [['y', 'data.dryAirIn.t']],
    chartOptions: {
      chart: {
        type: 'gauge',
        backgroundColor: '#EEEEEE',
        borderColor: '#444444',
        borderRadius: 5,
        borderWidth: 2,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Dry Air Inlet',
        margin: 5,
        y: 20,
        style: {
            color: '#222222',
            font: 'Open Sans',
            fontSize: '16pt'
        }
    },
    subtitle: {
        text: null
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },
    plotOptions: {
        series: {
            animation: false,
            dataLabels: {
                style: {
                    font: "Open Sans",
                    fontSize: "12pt",
                    fontWeight: "normal",
                    textOutline: "none"
                }
            }
        }
    },
    // the value axis
    yAxis: {
      min: 110,
      max: 140,

      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',

      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
          step: 2,
          rotation: 'auto'
      },
      title: {
          text: '%'
      },
      plotBands: [{
        from: 110,
        to: 120,
        color: '#DF5353' // red
    }, {
        from: 120,
        to: 130,
        color: '#55BF3B' // green
    }, {
        from: 130,
        to: 140,
        color: '#5353DF' // blue
    }]
    },
    series: [{
      name: 'Water Content',
      data: [3.0],
      tooltip: {
          valueSuffix: '%'
      }
  }]
    }
  };

  chartDetailMidAirInlet: ChartDetailModel = {
    title: '',
    dataSourceName: 'Maramba_Temperatures',
    dataShape: DataShapes.RowToObject,
    propertyLocations: [['y', 'data.midAirIn.t']],
    chartOptions: {
      chart: {
        type: 'gauge',
        backgroundColor: '#EEEEEE',
        borderColor: '#444444',
        borderRadius: 5,
        borderWidth: 2,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Mid Air Inlet',
        margin: 5,
        y: 20,
        style: {
            color: '#222222',
            font: 'Open Sans',
            fontSize: '16pt'
        }
    },
    subtitle: {
        text: null
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },
    plotOptions: {
        series: {
            animation: false,
            dataLabels: {
                style: {
                    font: "Open Sans",
                    fontSize: "12pt",
                    fontWeight: "normal",
                    textOutline: "none"
                }
            }
        }
    },
    // the value axis
    yAxis: {
        min: 110,
        max: 140,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: '%'
        },
        plotBands: [{
          from: 110,
          to: 120,
          color: '#DF5353' // red
      }, {
          from: 120,
          to: 130,
          color: '#55BF3B' // green
      }, {
          from: 130,
          to: 140,
          color: '#5353DF' // blue
      }]
    },
    series: [{
      name: 'Water Content',
      data: [3.0],
      tooltip: {
          valueSuffix: '%'
      }
  }]
    }
  };

  chartDetailWetAirInlet: ChartDetailModel = {
    title: '',
    dataSourceName: 'Maramba_Temperatures',
    dataShape: DataShapes.RowToObject,
    propertyLocations: [['y', 'data.wetAirIn.t']],
    chartOptions: {
      chart: {
        type: 'gauge',
        backgroundColor: '#EEEEEE',
        borderColor: '#444444',
        borderRadius: 5,
        borderWidth: 2,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Wet Air Inlet',
        margin: 5,
        y: 20,
        style: {
            color: '#222222',
            font: 'Open Sans',
            fontSize: '16pt'
        }
    },
    subtitle: {
        text: null
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },
    plotOptions: {
        series: {
            animation: false,
            dataLabels: {
                style: {
                    font: "Open Sans",
                    fontSize: "12pt",
                    fontWeight: "normal",
                    textOutline: "none"
                }
            }
        }
    },
    // the value axis
    yAxis: {
        min: 140,
        max: 170,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: '%'
        },
        plotBands: [{
          from: 140,
          to: 150,
          color: '#DF5353' // red
      }, {
          from: 150,
          to: 160,
          color: '#55BF3B' // green
      }, {
          from: 160,
          to: 170,
          color: '#5353DF' // blue
      }]
    },
    series: [{
      name: 'Water Content',
      data: [3.0],
      tooltip: {
          valueSuffix: '%'
      }
  }]
    }
  };
  chartDetail: ChartDetailModel = {
    title: '24hr Temperature',
    dataSourceName: 'Maramba_Temperatures',
    dataShape: DataShapes.RowToObject,
    propertyLocations: [['y', 'data.outputMeter.moisture']],
    chartOptions: {
      chart: {
        type: 'gauge',
        backgroundColor: '#EEEEEE',
        borderColor: '#444444',
        borderRadius: 5,
        borderWidth: 2,
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
    },
    title: {
        text: 'Tea Moisture Content',
        margin: 5,
        y: 20,
        style: {
            color: '#222222',
            font: 'Open Sans',
            fontSize: '16pt'
        }
    },
    subtitle: {
        text: null
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    pane: {
        startAngle: -150,
        endAngle: 150,
        background: [{
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#FFF'],
                    [1, '#333']
                ]
            },
            borderWidth: 0,
            outerRadius: '109%'
        }, {
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, '#333'],
                    [1, '#FFF']
                ]
            },
            borderWidth: 1,
            outerRadius: '107%'
        }, {
            // default background
        }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
        }]
    },
    plotOptions: {
        series: {
            animation: false,
            dataLabels: {
                style: {
                    font: "Open Sans",
                    fontSize: "12pt",
                    fontWeight: "normal",
                    textOutline: "none"
                }
            }
        }
    },
    // the value axis
    yAxis: {
        min: 0.0,
        max: 6.0,

        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',

        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: '%'
        },
        plotBands: [{
          from: 0,
          to: 2.5,
          color: '#DF5353' // red
      }, {
          from: 2.5,
          to: 3.5,
          color: '#55BF3B' // green
      }, {
          from: 3.5,
          to: 6.0,
          color: '#5353DF' // blue
      }]
    },
    series: [{
      name: 'Water Content',
      data: [3.0],
      tooltip: {
          valueSuffix: '%'
      }
  }]
    }
  };

  ngOnInit() {
    setTimeout(() => {
      console.log('Swapping');
      this.chartDetail.chartOptions.series[0].data = [143934, 12503, 157177, 19658, 197031, 19931, 37133, 54175];
      this.chartDetail.chartOptions.series[0].name = 'New Installation';
    }, 5000);
  }

  ngAfterViewInit(): void {}
}
