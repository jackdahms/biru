const pieLabelsLine = {
    id: "pieLabelsLine",
    afterDraw(chart) {
        const {
            ctx,
            chartArea: { width, height },
        } = chart;

        const cx = chart._metasets[0].data[0].x;
        const cy = chart._metasets[0].data[0].y;

        const sum = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);

        chart.data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                const { x: a, y: b } = datapoint.tooltipPosition();

                const x = 2 * a - cx;
                const y = 2 * b - cy;

                // draw line
                const halfwidth = width / 2;
                const halfheight = height / 2;
                const xLine = x >= halfwidth ? x + 20 : x - 20;
                const yLine = y >= halfheight ? y + 20 : y - 20;

                const extraLine = x >= halfwidth ? 10 : -10;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, 2, 0, 2 * Math.PI, true);
                ctx.fill();
                ctx.moveTo(x, y);
                ctx.lineTo(xLine, yLine);
                ctx.lineTo(xLine + extraLine, yLine);
                ctx.strokeStyle = "black";
                ctx.stroke();

                // text
                const textWidth = ctx.measureText(chart.data.labels[index]).width;
                ctx.font = "12px Arial";
                // control the position
                const textXPosition = x >= halfwidth ? "left" : "right";
                const plusFivePx = x >= halfwidth ? 5 : -5;
                ctx.textAlign = textXPosition;
                ctx.textBaseline = "middle";
                // ctx.fillStyle = dataset.backgroundColor[index];
                ctx.fillStyle = "black";

                ctx.fillText(
                    chart.data.labels[index],
                    xLine + extraLine + plusFivePx,
                    yLine
                );
            });
        });
    }
};