/* eslint-disable no-plusplus */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IDoughnutChartProps {
  sectionLables: string[];
  graphData: number[];
  tooltipGraphLabel: string;
  sectionColor: string[];
  graphBorderWidth: number;
}

const DoughnutChart = ({
  sectionLables,
  graphData,
  tooltipGraphLabel,
  sectionColor,
  graphBorderWidth,
}: IDoughnutChartProps) => {
  const chartData = {
    labels: [...sectionLables],
    datasets: [
      {
        label: tooltipGraphLabel,
        data: [...graphData],
        backgroundColor: [...sectionColor],
        // borderColor: [
        //   `${getRandomColorString(1)}`,
        //   `${getRandomColorString(1)}`,
        //   `${getRandomColorString(1)}`,
        //   `${getRandomColorString(1)}`,
        //   `${getRandomColorString(1)}`,
        //   'rgba(212, 212, 212, 1)',
        // ],
        borderWidth: graphBorderWidth,
      },
    ],
  };

  const options = {
    cutout: '65%',
    // onClick: onClickHandler,
  };

  const textCenter = {
    id: 'textCenter',
    afterDraw(chart: any, args: any, pluginOptions: any) {
      const xAxis = chart.getDatasetMeta(0).data[0].x;
      const yAxis = chart.getDatasetMeta(0).data[0].y;

      const { ctx } = chart;

      const templiveGraphDataArray = chart.data.datasets[0].data;
      const liveGraphDataArray = templiveGraphDataArray.filter(
        (element: any) => typeof element === 'number'
      ); // getting the array of data values of the chart, chart variable theke access korte hobe, karon ekmatro chart parameter ta dynamic thake jokhon textcenter re plugins er moddhe dhukano hoy. afterDraw er moddhe only shudhu ei afterDraw er parameter gulai shochol thake, and data change hole oi motabek parameter er values auto change hoy. So, bairer theke kono variable or array niye ashle oita static theke jaay, cz oitar ekta certain moment er value boshe sharajibon oi value theke jay. Ei karone graphData props theke jinish paati calculate korte partesina, cz graphData er jinish paati ekdom prothom initiation e ja value thake oitai theke jaay. Pore graphData array er values jotoi change houk na kn, oi prothom values diyei doughnut er plugins configuration er moddhe dhuke boshe thake. graphData live access korte chaile system hoilo (charts,args, pluginOptions) parameter gular chart theke chart.data.datasets[0].data evabe access kora. Tao abar kahini ase, ei array er length graphData er cheye boro hoy, onnanno functions o dhuke thake, console kore dekhe ne... Tai live graphData pete hole, chart.data.datasets[0].data theke copy array korbo j array te only numbers thakbe!!!!!!!!!!!! chorom koshto hoisilo ei jinish ber korte vaire vai..........

      let totalDoneProgress = 0;
      for (let i = 0; i < liveGraphDataArray.length - 1; i++) {
        // loop lliveGraphDataArray.length - 1 porjonto cholbe, karon last er ta remaining Progress. Ami dekhabo total done progress
        totalDoneProgress += liveGraphDataArray[i];
      }

      ctx.save();

      ctx.font = 'bolder 25px sans-serif';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${totalDoneProgress}%`, xAxis, yAxis);

      ctx.restore();
    },
  };

  return (
    <Doughnut
      // redraw
      // ref={chartRef}
      data={chartData}
      options={options}
      plugins={[textCenter]}
    />
  );
};

export default DoughnutChart;
