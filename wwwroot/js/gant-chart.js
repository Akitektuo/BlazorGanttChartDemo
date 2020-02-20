mapMonths = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
];

const MONTH_IN_MILLIS = 2630016000;

const buildChart = element => {
    const labelWidth = 320;
    const columnWidth = 32;
    const rowHight = 64;
    const gridPaddingTop = 32;
    const gridLabelPadding = 4;
    const actionButtonsPadding = 16;

    const selectedPeriod = {
        start: new Date(2019, 0),
        end: new Date(2022, 0)
    };

    const data = [{
        label: "Clinical",
        periods: [{
            start: new Date(2019, 0),
            end: new Date(2021, 1)
        }],
        sublabels: [],
        expanded: false
    }, {
        label: "HEOR",
        periods: [{
            start: new Date(2019, 7),
            end: new Date(2021, 0)
        }],
        sublabels: [],
        expanded: false
    }, {
        label: "Market access",
        periods: [{
            start: new Date(2019, 6),
            end: new Date(2020, 9)
        }],
        sublabels: [{
            label: "Pricing research",
            periods: [{
                start: new Date(2019, 7),
                end: new Date(2020, 2)
            }]
        }, {
            label: "Early HTA advice",
            periods: [{
                start: new Date(2019, 6),
                end: new Date(2020, 1)
            }]
        }, {
            label: "Advisory board on clinical trial design",
            periods: [{
                start: new Date(2019, 6),
                end: new Date(2020, 1)
            }]
        }, {
            label: "Treatment patterns study",
            periods: [{
                start: new Date(2019, 6),
                end: new Date(2020, 1)
            }]
        }, {
            label: "Regulatory and reimbursment tracker",
            periods: [{
                start: new Date(2019, 6),
                end: new Date(2020, 1)
            }]
        }],
        expanded: false
    }, {
        label: "Regulatory",
        periods: [{
            start: new Date(2020, 2),
            end: new Date(2021, 1)
        }],
        sublabels: [],
        expanded: false
    }];

    const categories = data.length;

    const width = element.offsetWidth;
    const height = gridPaddingTop * 6 + rowHight * categories;

    const { start, end } = selectedPeriod;

    const columns = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

    const gridWidth = labelWidth + (columns + 1) * columnWidth;
    
    const svg = d3.select(element)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "main");

    const computeXPosition = (date, relativeTo = selectedPeriod.start) => 
        columnWidth * (date.getTime() - relativeTo.getTime()) / MONTH_IN_MILLIS;

    const addLine = (x1, y1, x2, y2) => {
        svg.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("class", "grid");
    }

    const addGridLabel = (x, y, text) => {
        svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("class", "grid-label")
            .text(text);
    }

    const addYearLabel = (x, y, text) => {
        svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("class", "year-label")
            .text(text);
    }

    const addCategory = (y, text) => {
        const categoryGroup = svg.append("g")
            .attr("class", "group-clickable ripple");

        categoryGroup.append("rect")
            .attr("x", 0)
            .attr("y", y)
            .attr("height", rowHight)
            .attr("width", labelWidth)
            .attr("fill", "transparent");

        categoryGroup.append("image")
            .attr("x", labelWidth - columnWidth)
            .attr("y", y + rowHight / 2 - gridLabelPadding)
            .attr("href", "https://img.icons8.com/ios-filled/16/034596/expand-arrow.png");

        categoryGroup.append("text")
            .attr("x", labelWidth - columnWidth - actionButtonsPadding)
            .attr("y", y + rowHight / 2 + gridLabelPadding * 2)
            .attr("class", "category")
            .text(text);
    }

    const addPeriods = (y, periods) => periods.forEach(p => {
        console.log(computeXPosition(p.start));
        svg.append("rect")
            .attr("x", labelWidth + computeXPosition(p.start))
            .attr("y", y + rowHight / 4)
            .attr("height", rowHight / 2)
            .attr("width", computeXPosition(p.end, p.start))
            .attr("class", "period-category")
    });

    for (let c = 0; c <= columns; c++) {
        addLine(labelWidth + columnWidth * c, gridPaddingTop * (c % 12 === 0 ? 1 : 2), labelWidth + columnWidth * c, height);

        if (c % 12 === 0) {
            addYearLabel(labelWidth + columnWidth * c + gridLabelPadding, gridPaddingTop * 2 - gridLabelPadding * 3, selectedPeriod.start.getFullYear() + Math.floor(c / 12));
        }

        if (c === columns) {
            continue;
        }
        addGridLabel(labelWidth + columnWidth * c + gridLabelPadding, gridPaddingTop * 3 - gridLabelPadding * 2, mapMonths[c % 12]);
    }

    for (let i = 0; i <= categories; i++) {
        const y = gridPaddingTop * 3 + i * rowHight;
        addLine(labelWidth * 0.3, y, gridWidth, y);
        if (i === categories) {
            continue;
        }
        addCategory(y, data[i].label);
        addPeriods(y, data[i].periods);
    }

    const collapseGroup = svg.append("g")
        .attr("class", "group-clickable");

    collapseGroup.append("rect")
        .attr("x", labelWidth / 2 - actionButtonsPadding * 2)
        .attr("y", gridPaddingTop * 3 - actionButtonsPadding * 2)
        .attr("height", actionButtonsPadding * 2)
        .attr("width", actionButtonsPadding * 5 + gridLabelPadding)
        .attr("fill", "transparent");

    collapseGroup.append("image")
        .attr("x", labelWidth / 2 - actionButtonsPadding * 2)
        .attr("y", gridPaddingTop * 3 - actionButtonsPadding - gridLabelPadding)
        .attr("href", "https://img.icons8.com/ios-filled/12/034596/up.png");

    collapseGroup.append("text")
        .attr("x", labelWidth / 2 - actionButtonsPadding)
        .attr("y", gridPaddingTop * 3 - actionButtonsPadding / 2)
        .attr("class", "collapse-all")
        .text("Collapse All");

    const expandGroup = svg.append("g")
        .attr("class", "group-clickable");

    expandGroup.append("rect")
        .attr("x", labelWidth * 3 / 4 - actionButtonsPadding)
        .attr("y", gridPaddingTop * 3 - actionButtonsPadding * 2)
        .attr("height", actionButtonsPadding * 2)
        .attr("width", actionButtonsPadding * 5 + gridLabelPadding)
        .attr("fill", "transparent");

    expandGroup.append("image")
        .attr("x", labelWidth * 3 / 4 - actionButtonsPadding)
        .attr("y", gridPaddingTop * 3 - actionButtonsPadding - gridLabelPadding)
        .attr("href", "https://img.icons8.com/ios-filled/12/C0C0C0/down.png");

    expandGroup.append("text")
        .attr("x", labelWidth * 3 / 4)
        .attr("y", gridPaddingTop * 3 - actionButtonsPadding / 2)
        .attr("class", "expand-all")
        .text("Expand All");

}

window.buildGantChart = buildChart;