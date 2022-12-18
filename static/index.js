const pie_canvas = document.getElementById('pie');

const pieLabelsLine = {
    id: 'pieLabelsLine',
    afterDraw(chart) {
        const {
            ctx,
            chartArea: { width, height },
        } = chart;

        const cx = chart._metasets[0].data[0].x;
        const cy = chart._metasets[0].data[0].y;
        const halfwidth = width / 2;
        const halfheight = height / 2;
        const text_height = 12;
        const text_padding = 1;
        ctx.font = text_height + "px Arial";

        const values = []
        chart.data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                const { x: a, y: b } = datapoint.tooltipPosition();

                const x = (4/3)*(a - cx) + cx;
                const y = (4/3)*(b - cy) + cy;

                const xLine = x >= halfwidth ? x + 20 : x - 20;
                const yLine = y >= halfheight ? y + 20 : y - 20;

                const extraLine = x >= halfwidth ? 10 : -10;

                const textWidth = ctx.measureText(chart.data.labels[index]).width;
                const textXPosition = x >= halfwidth ? "left" : "right";
                const plusFivePx = x >= halfwidth ? 5 : -5;

                const v = {
                    x: x,
                    y: y,
                    x_line: xLine,
                    y_line: yLine,
                    extra_line: extraLine,
                    text_width: textWidth,
                    text_x_pos: textXPosition,
                    plus_five: plusFivePx,
                    text_x: xLine + extraLine + plusFivePx,
                };
                values.push(v);
            });
        });

        console.log('---');
        for (let i = 0; i < values.length; i++) {
            for (let k = i + 1; k < values.length; k++) {
                if (i == k) {
                    continue
                }

                const rect1 = {
                    x: values[i].x_line,
                    w: values[i].text_width,
                    y: values[i].y_line,
                    h: text_height + text_padding
                };
                const rect2 = {
                    x: values[k].x_line,
                    w: values[k].text_width,
                    y: values[k].y_line,
                    h: text_height + text_padding
                };

                if (rect1.x < rect2.x + rect2.w &&
                    rect1.x + rect1.w > rect2.x &&
                    rect1.y < rect2.y + rect2.h &&
                    rect1.h + rect1.y > rect2.y
                ) {
                    if (rect1.x > halfwidth && rect1.y < halfheight) {
                        values[i].y_line -= (values[i].y_line + text_height) - values[k].y_line + text_padding;
                    } else if (rect1.x > halfwidth && rect1.y > halfheight) {
                        values[k].y_line += (values[i].y_line + text_height) - values[k].y_line + text_padding;
                    } else if (rect1.x < halfwidth && rect1.y > halfheight) {
                        values[i].y_line += (values[k].y_line + text_height) - values[i].y_line + text_padding;
                    } else if (rect1.x < halfwidth && rect1.y < halfheight) {
                        values[k].y_line -= (values[k].y_line + text_height) - values[i].y_line + text_padding;
                    }
                    i = 0;
                    break;
                }
            }
        }

        chart.data.datasets.forEach((dataset, i) => {
            chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                const x = values[index].x;
                const y = values[index].y;
                const xLine = values[index].x_line;
                const yLine = values[index].y_line;
                const extraLine = values[index].extra_line;
                const textWidth = values[index].text_width;
                const plusFivePx = values[index].plus_five;

                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.arc(x, y, 2, 0, 2 * Math.PI, true); // the dot
                ctx.fill();
                ctx.moveTo(x, y);
                ctx.lineTo(xLine, yLine); // first line segment
                ctx.lineTo(xLine + extraLine, yLine); // second line segment
                ctx.strokeStyle = "black";
                ctx.stroke();
                
                ctx.textAlign = values[index].text_x_pos;
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.fillText(chart.data.labels[index] + index, values[index].text_x, yLine);
            });
        });
    },
};

const config = {
    type: 'pie',
    options: {
        cutout: '50%', // note the x and y equations only work at this cutoff percentage (and maybe this aspect ratio!) for a full pie, they are 2a-cx
        aspectRatio: 2,
        layout: {
            padding: {
                top: 50,
                bottom: 30,
            },
        },
        plugins: {
            legend: {
                display: false,
            }
        }
    },
    plugins: [pieLabelsLine]
};

$.ajax({
    dataType: "json",
    url: '/transactions',
    data: {
        start: $('#start')[0].value,
        end: $('#end')[0].value
    },
    success: function(data, status, xhr) {
        $('#table').append(data.rows);

        cats = $('#categories');
        cats.empty();
        data.categories.forEach(function(e) {
            cats.append('<li>' + e + '</li>');
        });

        config.data = {
            labels: data.categories,
            datasets: [{
                label: 'Transactions',
                data: data.amounts,
                hoverOffset: 4
            }]
        };
        new Chart(pie_canvas, config);
    }
});
