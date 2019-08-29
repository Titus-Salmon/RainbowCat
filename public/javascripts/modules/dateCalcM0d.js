//begin date difference calculator////////////////////////////////////////////////////
Date.dateDiff = function (datepart, fromdate, todate) {
    datepart = datepart.toLowerCase();
    var diff = todate - fromdate;
    var divideBy = {
        w: 604800000, //ms in one week
        d: 86400000, //ms in one day
        h: 3600000, //ms in one hour
        m: 60000, //ms in one minute
        s: 1000 //ms in one second
    };

    return Math.floor(diff / divideBy[datepart]);
}
//end date difference calculator////////////////////////////////////////////////////