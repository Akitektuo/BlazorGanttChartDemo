﻿mapMonths = [
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

const selectedPeriod = {
    start: new Date(2019, 0),
    end: new Date(2023, 0)
};

const targets = [{
    label: "POC",
    date: new Date(2019, 0)
}, {
    label: "GT5",
    date: new Date(2019, 11)
}];

const sublabels = [{
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
        start: new Date(2019, 7, 16),
        end: new Date(2019, 10, 17)
    }]
}, {
    label: "Treatment patterns study",
    periods: [{
        start: new Date(2019, 6, 20),
        end: new Date(2019, 10, 17)
    }]
}, {
    label: "Regulatory and reimbursment tracker",
    periods: [{
        start: new Date(2019, 7),
        end: new Date(2020, 8, 10)
    }]
}];

const data = [{
    label: "Clinical",
    periods: [{
        start: new Date(2019, 0, 7),
        end: new Date(2021, 0, 28)
    }],
    sublabels,
    expanded: false
}, {
    label: "HEOR",
    periods: [{
        start: new Date(2019, 6, 20),
        end: new Date(2020, 11, 25)
    }],
    sublabels,
    expanded: false
}, {
    label: "Market access",
    periods: [{
        start: new Date(2019, 5, 28),
        end: new Date(2020, 9)
    }],
    sublabels,
    expanded: true
}, {
    label: "Regulatory",
    periods: [{
        start: new Date(2020, 2, 10),
        end: new Date(2021, 1, 5)
    }],
    sublabels,
    expanded: false
}];

const buildChart = element => {
    const labelWidth = 320;
    const columnWidth = 32;
    const rowHeight = 64;
    const expendedRowHeight = 48;
    const gridPaddingTop = 32;
    const gridLabelPadding = 4;
    const actionButtonsPadding = 16;
    const nowRadius = 24;

    const categories = data.length;

    const width = element.offsetWidth;

    let totalExpandedHeight = 0;
    data.filter(c => c.expanded).forEach(c => {
        totalExpandedHeight += c.sublabels.length * expendedRowHeight;
    });

    const height = gridPaddingTop * 6 + rowHeight * categories + totalExpandedHeight;

    const { start, end } = selectedPeriod;

    const columns = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();

    const gridWidth = labelWidth + (columns + 1) * columnWidth;

    d3.select(element).select("svg").remove();

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

    const addCategory = (y, text, expanded, onClick) => {
        const categoryGroup = svg.append("g")
            .attr("class", "group-clickable ripple")
            .on("click", onClick);;

        categoryGroup.append("rect")
            .attr("x", 0)
            .attr("y", y)
            .attr("height", rowHeight)
            .attr("width", labelWidth)
            .attr("fill", "transparent");

        categoryGroup.append("image")
            .attr("x", labelWidth - columnWidth)
            .attr("y", y + rowHeight / 2 - gridLabelPadding)
            .attr("href", `https://img.icons8.com/ios-filled/16/034596/${expanded ? "expand" : "collapse"}-arrow.png`);

        categoryGroup.append("text")
            .attr("x", labelWidth - columnWidth - actionButtonsPadding)
            .attr("y", y + rowHeight / 2 + gridLabelPadding * 2)
            .attr("class", "category")
            .text(text);
    }

    const addSublabel = (y, text) => svg.append("text")
        .attr("x", labelWidth - columnWidth - actionButtonsPadding)
        .attr("y", y + expendedRowHeight / 2)
        .attr("class", "sublabel")
        .text(text);

    const addPeriods = (y, periods) => periods.forEach(p =>
        svg.append("rect")
            .attr("x", labelWidth + computeXPosition(p.start))
            .attr("y", y + rowHeight / 4)
            .attr("height", rowHeight / 2)
            .attr("width", computeXPosition(p.end, p.start))
            .attr("class", "period-category")
    );

    const addSubPeriods = (y, periods) => periods.forEach(p =>
        svg.append("rect")
            .attr("x", labelWidth + computeXPosition(p.start))
            .attr("y", y + gridLabelPadding)
            .attr("height", expendedRowHeight / 2)
            .attr("width", computeXPosition(p.end, p.start))
            .attr("class", "period-subcategory")
    );

    const addSubcategories = (category, from) => {
        category.sublabels.forEach((l, i) => {
            addSublabel(from + i * expendedRowHeight, l.label);
            addSubPeriods(from + i * expendedRowHeight, l.periods);
        });
    }

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

    let extraHeight = 0;

    for (let i = 0; i <= categories; i++) {
        const y = gridPaddingTop * 3 + i * rowHeight + extraHeight;
        addLine(labelWidth * 0.3, y, gridWidth, y);
        if (i === categories) {
            continue;
        }
        const category = data[i];

        if (category.expanded) {
            const labelsHeight = expendedRowHeight * category.sublabels.length;

            svg.append("rect")
                .attr("x", gridLabelPadding)
                .attr("y", y + gridLabelPadding)
                .attr("height", labelsHeight + rowHeight - 2 * gridLabelPadding)
                .attr("width", gridWidth - gridLabelPadding)
                .attr("class", "expanded-background");

            addSubcategories(category, y + rowHeight);

            extraHeight += labelsHeight;
        }

        addCategory(y, category.label, category.expanded, () => {
            category.expanded = !category.expanded;
            buildChart(element);
        });
        addPeriods(y, category.periods);
    }

    const collapseGroup = svg.append("g")
        .attr("class", "group-clickable")
        .on("click", () => {
            data.forEach(c => c.expanded = false)
            buildChart(element);
        });

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
        .attr("class", "group-clickable")
        .on("click", () => {
            data.forEach(c => c.expanded = true);
            buildChart(element);
        });

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

    targets.forEach(target => {
        const positionX = labelWidth + computeXPosition(target.date);

        svg.append("line")
            .attr("x1", positionX)
            .attr("y1", 0)
            .attr("x2", positionX)
            .attr("y2", height)
            .attr("class", "target-line");

        svg.append("text")
            .attr("x", positionX + actionButtonsPadding / 2)
            .attr("y", actionButtonsPadding)
            .attr("class", "target-text")
            .text(target.label);
    });

    const nowPosition = labelWidth + computeXPosition(new Date());

    svg.append("line")
        .attr("x1", nowPosition)
        .attr("y1", gridPaddingTop * 2)
        .attr("x2", nowPosition)
        .attr("y2", height - gridPaddingTop)
        .attr("class", "now");

    svg.append("circle")
        .attr("cx", nowPosition)
        .attr("cy", gridPaddingTop * 2)
        .attr("r", nowRadius)
        .attr("class", "now-circle");

    svg.append("text")
        .attr("x", nowPosition)
        .attr("y", gridPaddingTop * 2)
        .attr("class", "now-label")
        .text("NOW");
}

window.buildGantChart = buildChart;