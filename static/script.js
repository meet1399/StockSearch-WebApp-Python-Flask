currentBox = '#company'
msg = ""
globalTicker = ""

function doClear() {
    $("#bar").hide();
    $("#info").hide();
    $("#info").html('');
    currentBox = '#company';
}

function getCompanyProfile(object) {
    globalTicker = object['ticker'];
    let text = `
    <div id="companySec">
        <img id="companyLogo" src="${object['logo']}">
        <table class="companyTable">
            <tr class="companyR">
                <th class="companyH">Company Name</th>
                <td class="companyD">${object['name']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Stock Ticker Symbol</th>
                <td class="companyD">${object['ticker']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Stock Exchange Code</th>
                <td class="companyD">${object['exchange']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Company IPO Date</th>
                <td class="companyD">${object['ipo']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Category</th>
                <td class="companyD">${object['finnhubIndustry']}</th>
            </tr>
        </table>
    </div>
    `
    return text
}

function getCompanySummary(object) {
    if (object['quote']['d'] != null) {
        if (object['quote']['d'] < 0) {
            dImg = "/static/img/RedArrowDown.png";
        } else if (object['quote']['d'] > 0) {
            dImg = "/static/img/GreenArrowUp.png";
        }
    }
    if (object['quote']['dp'] != null) {
        if (object['quote']['dp'] < 0) {
            dpImg = "/static/img/RedArrowDown.png";
        } else if (object['quote']['dp'] > 0) {
            dpImg = "/static/img/GreenArrowUp.png";
        }
    }
    let text = `
    <div id="summarySec">
        <table class="companyTable">
            <tr class="companyR">
                <th class="companyH">Stock Ticker Symbol</th>
                <td class="companyD">${globalTicker}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Trading Day</th>
                <td class="companyD">${object['quote']['t']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Previous Closing Price</th>
                <td class="companyD">${object['quote']['pc']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Opening Price</th>
                <td class="companyD">${object['quote']['o']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">High Price</th>
                <td class="companyD">${object['quote']['h']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Low Price</th>
                <td class="companyD">${object['quote']['l']}</th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Change</th>
                <td class="companyD">${object['quote']['d']}
                    <img class="arrow" src="${dImg}">
                </th>
            </tr>
            <tr class="companyR">
                <th class="companyH">Change Percent</th>
                <td class="companyD">${object['quote']['dp']}
                    <img class="arrow" src="${dpImg}">
                </th>
            </tr>
        </table>
        <div class="trends">
            <div class="trendText" id="redTrendText">Strong<br>Sell</div>
            <div class="trendBox" id="box1">${object['recommendation']['strongSell']}</div>
            <div class="trendBox" id="box2">${object['recommendation']['sell']}</div>
            <div class="trendBox" id="box3">${object['recommendation']['hold']}</div>
            <div class="trendBox" id="box4">${object['recommendation']['buy']}</div>
            <div class="trendBox" id="box5">${object['recommendation']['strongBuy']}</div>
            <div class="trendText" id="greenTrendText">Strong<br>Buy</div>
        </div>
        <div class="trendText1">Recommendation Trends</div>
    </div>
    `
    return text
}

function getTrendsChart(result) {
    (async () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        } 
        if (mm < 10) {
            mm = '0' + mm;
        } 
        today = yyyy + '-' + mm + '-' + dd;

        Highcharts.stockChart('chartSec', {
            chart: {
                zoomType: 'xy',
                height: 600
            },
            yAxis: [{
                labels: {
                    format: '{value}'
                },
                title: {
                    text: 'Stock Price'
                },
                opposite: false
              }, {
                title: {
                    text: 'Volume'
                },
                labels: {
                    formatter: function() {
                        return this.value / 1000000 + "M";
                    }
                },
                max: Math.max(...result['v'].map((item) => item[1]))*2,
                opposite: true
            }],
            rangeSelector: {
                allButtonsEnabled: true,
                buttons: [
                    {
                        type: 'day',
                        count: 7,
                        text: '7d',
                        dataGrouping: {
                            forced: true,
                            units: [
                                ['day', [1]]
                            ]
                        }
                    }, {
                        type: 'day',
                        count: 15,
                        text: '15d',
                        dataGrouping: {
                            forced: true,
                            units: [
                            ['day', [1]]
                            ]
                        }
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m',
                        dataGrouping: {
                            forced: true,
                            units: [
                            ['day', [1]]
                            ]
                        }
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3m',
                        dataGrouping: {
                            forced: true,
                            units: [
                            ['day', [1]]
                            ]
                        }
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m',
                        dataGrouping: {
                            forced: true,
                            units: [
                            ['day', [1]]
                            ]
                        }
                    }
                ],
                inputEnabled: false,
                selected: 4
            },
            tooltip: {
                shared: true
            },
            title: {
                text: `Stock Price ${globalTicker} ${today}`
            },
            subtitle: {
                text: '<a href=\'https://polygon.io/\' target="_blank">Source: Polygon.io</a>',
                useHTML: true
            },
            navigator: {
                series: {
                    accessibility: {
                        exposeAsGroupOnly: true
                    }
                }
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 120,
                verticalAlign: 'top',
                y: 100,
                floating: true,
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }, 
                column: {
                    pointPlacement: 'on'
                }
            },
            series: [
                {
                    type: 'area',
                    name: 'Stock Price',
                    data: result['c'],
                    marker: {
                        enabled: null, 
                        radius: 0,
                        lineWidth: 1,
                        lineColor: '#ffffff'
                    },
                    tooltip: {
                        valueDecimals: 2
                    }
                }, {
                    type: 'column',
                    name: 'Volume',
                    yAxis: 1,
                    maxPointWidth: 10,
                    data: result['v'],
                    color: "black",
                    marker: {
                        enabled: null, 
                        color: 'gray',
                        radius: 1,
                        pointWidth: 1,
                        lineWidth: 1,
                        lineColor: '#ffffff'
                    }
                }
            ]
        });
    })();
}

function prepareChartsData(object) {
    var result = {}
    var price = []
    var volume = []
    for (i = 0; i < object['results'].length; i++) {
        price.push([object['results'][i]['t'], object['results'][i]['c']]);
        volume.push([object['results'][i]['t'], object['results'][i]['v']]);
    }
    result['c'] = price;
    result['v'] = volume;

    return result;
}

function getCompanyNews(object) {
    var text = "<div id=\"newsSec\">\n";
    object.forEach((value) => {
        text += `
        <div class="newsItem">
            <img class="newsImg" src="${value['image']}">
            <div class="newsContent">
                <p class="newsHead">${value['headline']}</p>
                <p>${value['datetime']}</p>
                <a href="${value['url']}" target="_blank">See Original Post</a>
            </div>
        </div>
        `;
    })
    text += "</div>"
    return text
}

function displayError() {
    return `
    <div id="errorSec">
        Error: No record has been found, please enter a valid symbol
    </div>
    `
}

function handleNotFound() {
    doClear();
    let text = displayError();
    $("#info").html(text);
    $("#info").show();
}

function displayCompany() {
    $.ajax({
        url: "profile/" + msg,
        type: "GET",
        dataType: "json",
        success: (data) => {
            var object = data;
            if (object['found'] == 'N') {
                handleNotFound();
            } else {
                let text = getCompanyProfile(object);
                globalTicker = object['ticker'];
                $("#info").html(text);
                $("#bar").show();
                $("#info").show();
            }
        },
        error: (xhr, type) => {
            handleNotFound();
        }
    });
}

function displaySummary() {
    $.ajax({
        url: "profile/" + msg,
        type: "GET",
        dataType: "json",
        success: (data) => {
            var object = data;
            if (object['found'] == 'N') {
                handleNotFound();
            } else {
                globalTicker = object['ticker'];
                $.ajax({
                    url: "summary/" + msg,
                    type: "GET",
                    dataType: "json",
                    success: (data) => {
                        var object = data;
                        let text = getCompanySummary(object);
                        $("#info").html(text);
                    },
                    error: (xhr, type) => {
                        handleNotFound();
                    }
                });
            }
        },
        error: (xhr, type) => {
            handleNotFound();
        }
    });
}

function displayCharts() {
    let text = `
        <figure class="figure">
            <div id="chartSec"></div>
        </figure>
    `;
    $("#info").html(text);
    $.ajax({
        url: "profile/" + msg,
        type: "GET",
        dataType: "json",
        success: (data) => {
            var object = data;
            if (object['found'] == 'N') {
                handleNotFound();
            } else {
                globalTicker = object['ticker'];
                $.ajax({
                    url: "charts/" + msg,
                    type: "GET",
                    dataType: "json",
                    success: (data) => {
                        var object = data;
                        var result = prepareChartsData(object);
                        getTrendsChart(result);
                    },
                    error: (xhr, type) => {
                        handleNotFound();
                    }
                });
            }
        },
        error: (xhr, type) => {
            handleNotFound();
        }
    });
}

function displayNews() {
    $.ajax({
        url: "profile/" + msg,
        type: "GET",
        dataType: "json",
        success: (data) => {
            var object = data;
            if (object['found'] == 'N') {
                handleNotFound();
            } else {
                globalTicker = object['ticker'];
                $.ajax({
                    url: "news/" + msg,
                    type: "GET",
                    dataType: "json",
                    success: (data) => {
                        var object = data;
                        let text = getCompanyNews(object);
                        $("#info").html(text);
                    },
                    error: (xhr, type) => {
                        handleNotFound();
                    }
                });
            }
        },
        error: (xhr, type) => {
            handleNotFound();
        }
    });
}

function submitInput() {
    var isValid = document.querySelector('#inputForm').reportValidity();
    $(".box").css('background-color', '#f8f9fa'); 
    msg = $("#inputField").val().trim().toUpperCase();
    if (msg == '') {
        doClear();
    } else {
        $("#company").css('background-color', 'gray');
        displayCompany();
    }
}

$(document).ready(() => {

    $("#bar").hide()

    $("#searchButton").click(() => {
        submitInput();
    });

    $("#clearButton").click(() => {
        doClear();
        $("#inputField").val('');
    });

    $("#inputForm").submit(e => {
        e.preventDefault();
        submitInput();
    });

    $("#company").hover(() => {
        if (currentBox != '#company') {
            $("#company").css('background-color', 'lightgray')
        }
    }, () => {
        if (currentBox != '#company') {
            $("#company").css('background-color', '#f8f9fa');
        }
    });

    $("#summary").hover(() => {
        if (currentBox != '#summary') {
            $("#summary").css('background-color', 'lightgray')
        }
    }, () => {
        if (currentBox != '#summary') {
            $("#summary").css('background-color', '#f8f9fa');
        }
    });

    $("#charts").hover(() => {
        if (currentBox != '#charts') {
            $("#charts").css('background-color', 'lightgray');
        }
    }, () => {
        if (currentBox != '#charts') {
            $("#charts").css('background-color', '#f8f9fa');
        }
    });

    $("#news").hover(() => {
        if (currentBox != '#news') {
            $("#news").css('background-color', 'lightgray');
        }
    }, () => {
        if (currentBox != '#news') {
            $("#news").css('background-color', '#f8f9fa');
        }
    });

    $(".box").click(() => {
        $(".box").css('background-color', '#f8f9fa');
    });

    $("#company").click(() => {
        currentBox = '#company'
        $("#company").css('background-color', 'gray');
        displayCompany();
    });

    $("#summary").click(() => {
        currentBox = '#summary'
        $("#summary").css('background-color', 'gray');
        displaySummary();
    });

    $("#charts").click(() => {
        currentBox = '#charts'
        $("#charts").css('background-color', 'gray');
        displayCharts();
    });

    $("#news").click(() => {
        currentBox = '#news'
        $("#news").css('background-color', 'gray');
        displayNews();
    });
});