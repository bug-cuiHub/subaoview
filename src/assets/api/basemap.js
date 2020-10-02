function Basemap() {
    this.NEAR_EU = {
        name: '城镇',
        GDP: '生产总值',
        POP_ALL: '总人口',
        area: '面积',
        distence: '距震中距离'
    };
    this.EQ_CENTER_EU = {
        district: '震中',
        time: '时间',
        lonLat: '经纬度',
        magnitude: '震级',
        depth: '震源深度(公里)',
        intensity: '预估烈度'
    };
    this.HIS_EU = {
        EarthquakeDate: '时间',
        Macro_epicenter: '地点',
        Magnitude: '震级'
    };
    this.HIS_EAR_DATA = {
        Datetime: '时间',
        Location: '位置',
        Magnitude: '震级',
        Depth: '深度',
        distence: '距震中距离'
    };
    this.NEAE_HISTORY_EU = {
        Datetime: '时间',
        Location: '位置',
        Magnitude: '震级',
        Depth: '深度',
        distence: '距震中距离',
        // latitude: '纬度(°)',
        // longitude: '经度(°)',
    };
}
Basemap.prototype.getRoma = function (num) {
    var lap = ['I', 'V', 'X', 'L', 'C', 'D', 'M'];
    var roma = '';
    var bit = 0;
    while (num > 0) {
        var tempnum = num % 10;
        switch (tempnum) {
            case 3:
                roma = lap[bit] + roma;
                tempnum--;
            case 2:
                roma = lap[bit] + roma;
                tempnum--;
            case 1:
                roma = lap[bit] + roma;
                break;
            case 4:
                roma = lap[bit + 1] + roma;
                roma = lap[bit] + roma;
                break;
            case 8:
                roma = lap[bit] + roma;
                tempnum--;
            case 7:
                roma = lap[bit] + roma;
                tempnum--;
            case 6:
                roma = lap[bit] + roma;
                tempnum--;
            case 5:
                roma = lap[bit + 1] + roma;
                break;
            case 9:
                roma = lap[bit + 2] + roma;
                roma = lap[bit] + roma;
                break;
            default:
                break;
        }
        bit += 2;
        num = Math.floor(num / 10);
    }
    return roma;
}
Basemap.prototype.setContent = function (title, data, type) {
    if (type == "nearCity") {
        let info = {};
        info.name = data.name;
        info.GDP = data.GDP.toFixed(0) + "亿";
        info.POP_ALL = parseInt(data.POP_ALL).toFixed(0) + "万";
        info.area = data.area.toFixed(0) + "平方公里";
        info.distence = data.distence.toFixed(0) + "公里";
        var itemcontent = [];
        var header = '<div class="eqmes-info"><h4 class="info-title" style="font-size: 18px;">' + title + '</h4><div class="info-content"><table class="table table-bordered table-hover table-condensed" style="text-align:center;margin:auto;width: 397px;margin: auto;font-size: 18px;height: 175px;">';
        for (var item in data) {
            if (data.hasOwnProperty(item)) {
                if (item === 'latitude' || item === 'longitude') {
                    data[item] = parseFloat(data[item]).toFixed(2);
                    continue;
                }
                var _itemcontent = '<tr class="info-item"><td><label>' + this.NEAR_EU[item] + '</label></td><td><span>' + info[item] + '</span></td></tr>';
                itemcontent.push(_itemcontent);
            }
        }
        var foot = '</div></div>';
        header += itemcontent.join('');
        var content = header + foot;
        return content;
    } else if (type == "EqCenter") {
        var itemcontent = [];
        var header = '<div class="eqmes-info" style="width: 300px;><h4 class="info-title" style="font-size: 18px;">' + title + '</h4><div class="info-content"><table class="table table-bordered table-hover table-condensed" style="text-align:center;margin:auto;width: 397px;margin: auto;font-size: 18px;height: 175px;">';
        data['magnitude'] = parseFloat(data['magnitude']).toFixed(1)
        for (var item in this.EQ_CENTER_EU) {
            if (this.EQ_CENTER_EU.hasOwnProperty(item) && item !== 'OBJECTID') {
                if (item == "lonLat") {
                    let lon = parseFloat(data['longitude']).toFixed(2);
                    let lat = parseFloat(data['latitude']).toFixed(2);
                    var _itemcontent = '<tr class="info-item"><td><label>' + this.EQ_CENTER_EU['lonLat'] + '</label></td><td><span>' + lon + ' , ' + lat + '</span></td></tr>';
                    itemcontent.push(_itemcontent);
                } else if (item === 'intensity') {
                    let intensity = this.getRoma(parseInt(data[item])) + '(' + data[item] + ')' + "度";
                    var _itemcontent = '<tr class="info-item"><td><label>' + this.EQ_CENTER_EU[item] + '</label></td><td><span>' + intensity + '</span></td></tr>';
                    itemcontent.push(_itemcontent);
                } else if (item == "district") {
                    let districtInfo = data[item] + data['magnitude'] + "级";

                    var _itemcontent = '<tr class="info-item"><td><label>' + this.EQ_CENTER_EU[item] + '</label></td><td><span>' + districtInfo + '</span></td></tr>';
                    itemcontent.push(_itemcontent);
                } else {
                    var _itemcontent = '<tr class="info-item"><td><label>' + this.EQ_CENTER_EU[item] + '</label></td><td><span>' + data[item] + '</span></td></tr>';
                    itemcontent.push(_itemcontent);
                }

            }
        }
        var foot = '</table></div></div>';
        header += itemcontent.join('');
        var content = header + foot;
        return content;
    } else if (type == "hisEq") {
        var itemcontent = [];
        data['magnitude'] = parseFloat(data['magnitude']).toFixed(1)
        var header = '<div class="eqmes-info"><h4 class="info-title" style="font-size: 18px;">' + title + '</h4><div class="info-content"><table class="table table-bordered table-hover table-condensed" >';
        for (var item in this.HIS_EU) {
            if (data.hasOwnProperty(item) && item !== 'OBJECTID') {
                if (item === 'Latitude' || item === 'Longitude') {
                    data[item] = parseFloat(data[item]).toFixed(2);
                }
                var _itemcontent = '<tr class="info-item"><td><label>' + this.HIS_EU[item] + '</label></td><td><span>' + data[item] + '</span></td></tr>';
                itemcontent.push(_itemcontent);
            }
        }
        var foot = '</div></div>';
        header += itemcontent.join('');
        var content = header + foot;
        return content;
    } else if (type == "hisEarData") {
        let info = {};
        info.Datetime = data.Datetime;
        info.Location = data.Location;
        info.Magnitude = data.Magnitude + "级";
        info.Depth = data.Depth + "千米";
        info.distence = data.distence.toFixed(0) + "公里";
        var itemcontent = [];
        var header = '<div class="eqmes-info"><h4 class="info-title" style="font-size: 18px;">' + title + '</h4><div class="info-content" style="text-align:center;width:200px;"><table class="table table-bordered table-hover table-condensed" style="text-align:center;margin:auto;width: 397px;margin: auto;font-size: 18px;height: 175px;">';
        for (var item in data) {
            if (data.hasOwnProperty(item)) {
                if (item === 'latitude' || item === 'longitude') {
                    data[item] = parseFloat(data[item]).toFixed(2);
                    continue;
                }
                var _itemcontent = '<tr class="info-item"><td><label>' + this.HIS_EAR_DATA[item] + '</label></td><td><span>' + info[item] + '</span></td></tr>';
                itemcontent.push(_itemcontent);
            }
        }
        var foot = '</div></div>';
        header += itemcontent.join('');
        var content = header + foot;
        return content;
    } 
    else if (type == "nearhistorydz") {
        var itemcontent = [];
        data['Magnitude'] = parseFloat(data['Magnitude']).toFixed(1)+"级"
        data['Depth'] = data['Depth']+"千米"
        data['distence'] = data['distence']+"公里"
        var header = '<div class="eqmes-info"><h4 class="info-title" style="font-size: 18px;">' + title + '</h4><div class="info-content" style="text-align:center;"><table class="table table-bordered table-hover table-condensed" style="text-align:center;margin:auto;width: 397px;margin: auto;font-size: 18px;height: 175px; >';
        for (var item in this.NEAE_HISTORY_EU) {
            console.log(data.hasOwnProperty(item))
            if (data.hasOwnProperty(item) && item !== 'OBJECTID') {
                if (item === 'Latitude' || item === 'Longitude') {
                    data[item] = parseFloat(data[item]).toFixed(2);
                }
                var _itemcontent = '<tr class="info-item"><td><label>' + this.NEAE_HISTORY_EU[item] + '</label></td><td><span>' + data[item] + '</span></td></tr>';
                itemcontent.push(_itemcontent);
            }
        }
        var foot = '</div></div>';
        header += itemcontent.join('');
        var content = header + foot;
        return content;
    }
}

export default Basemap;