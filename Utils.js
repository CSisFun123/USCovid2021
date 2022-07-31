class Utils {
    constructor(props) {
        this.props = props;
    }

    formatStateDateByMonth(statedata, countiesdata, statecodedata) {
        const formatdata = statedata.map((d) => {
            const date = parseTime(d['date']);
            const month = date.getMonth();
            const monthLabel = MONTH_STRING[month];
            return {
                ...d,
                date: date,
                dateNumeric: date.getDate(),
                month,
                monthLabel,
                cases: parseInt(d.cases),
                deaths: parseInt(d.deaths),
            };
        });
        const formatcountiesdata = countiesdata.map((d) => {
            const date = parseTime(d['date']);
            const month = date.getMonth();
            const monthLabel = MONTH_STRING[month];
            return {
                ...d,
                date: date,
                dateNumeric: date.getDate(),
                month,
                monthLabel,
                cases: parseInt(d.cases),
                deaths: parseInt(d.deaths),
            };
        });

        const states = [...new Set(formatdata.map((item) => item.state))];
        const statesdata = states.map((s) => {
            const stateonly = formatdata.filter((fd) => fd.state == s);
            const stateCode = statecodedata.filter((sc) => sc.State == s);
            const counties = formatcountiesdata.filter((fd) => fd.state == s);
            const statedatabyMonth = MONTH_STRING.map((ms) => {
                const m = stateonly.filter((so) => ms == so.monthLabel);
                const countiesMonthOnly = counties.filter(
                    (so) => ms == so.monthLabel,
                );
                const sumOfCases = m.reduce(
                    (total, obj) => obj.cases + total,
                    0,
                );
                const sumOfDeaths = m.reduce(
                    (total, obj) => obj.deaths + total,
                    0,
                );
                let obj = {
                    cases: sumOfCases,
                    deaths: sumOfDeaths,
                    monthLabel: ms,
                    data: m,
                    state: s,
                    statecode: stateCode.length > 0 ? stateCode[0]['Code'] : '',
                    total: sumOfCases + sumOfDeaths,
                    countiesdata: countiesMonthOnly,
                };
                return obj;
            });
            return statedatabyMonth;
        });

        const flatdata = statesdata.flat();
        const dataByMoth = MONTH_STRING.map((m) => {
            const f = flatdata.filter((fd) => fd.monthLabel == m);
            const totalCases = f.reduce((total, obj) => obj.cases + total, 0);
            const totalDeaths = f.reduce((total, obj) => obj.deaths + total, 0);
            const avgeragecases = totalCases / f.length;
            const avgeragedeaths = totalDeaths / f.length;
            const fdata = f.map((ff) => {
                return {
                    ...ff,
                    avgeragecases,
                    avgeragedeaths,
                };
            });
            return {
                month: m,
                totalDeaths,
                totalCases,
                avgeragecases,
                avgeragedeaths,
                data: fdata,
            };
        });

        return dataByMoth;
    }

    filterMonthData(dataByMonth, month) {
        const findIndex = dataByMonth.findIndex((dm) => dm.month == month);
        return dataByMonth[findIndex];
    }
}
