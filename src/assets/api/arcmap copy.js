import Basemap from '@/assets/api/basemap'
import esriLoader from 'esri-loader'
import centerstarPng from '@/assets/imgicon/earthCenter.png'
import his_ear_data from "@/assets/imgicon/历史灾害地震@hdpi.png"
// import centerstarPng from '@/assets/mapimg/centerStar.png'
// import nearCityPng from '@/assets/mapimg/nearCity3.png'
import nearCityPng from '@/assets/imgicon/newNearCity.png'
// import HIS_EQ_MARKER_1 from '@/assets/imgicon/tdhis1.png'
// import HIS_EQ_MARKER_2 from '@/assets/imgicon/tdhis2.png'
// import HIS_EQ_MARKER_3 from '@/assets/imgicon/tdhis3.png'
import historyEarth from '@/assets/imgicon/historyEarth.png'
// import Other_EQ_MARKER from '@/assets/imgicon/tdhisother.png'
import pub from '@/assets/pubFile.json'

function ArcMap(id, eqCenter, eqNear) {
    this.HIS_EQ_MARKER = historyEarth;
    // this.HIS_EQ_MARKER = [HIS_EQ_MARKER_1, HIS_EQ_MARKER_2, HIS_EQ_MARKER_3];
    this.eqCenter = eqCenter;
    //此处有发布的震中信息(ckw)
    this.eqNear = eqNear

    this.hisEq = null;
    this.map = null;
    this.view = null;
    this.activeWidget = null
        //js来源
    let option = {
            url: "http://" + pub.ip + "/arcgis/init.js"
        }
        //加载css
    esriLoader.loadCss('http://' + pub.ip + '/arcgis/esri/css/main.css');

    esriLoader.loadModules([
        "esri/Map",
        "esri/Basemap",
        "esri/views/SceneView",
        "esri/layers/ElevationLayer",
        "esri/layers/BaseElevationLayer",
        "esri/layers/WebTileLayer",
        "esri/layers/support/TileInfo",
        "esri/layers/OpenStreetMapLayer",
        "esri/widgets/Home",
        "esri/widgets/Fullscreen",
        "esri/config",
        "esri/widgets/DirectLineMeasurement3D",
        "esri/widgets/Legend",
        "esri/widgets/Expand",
        "esri/widgets/Search",
        "dojo/domReady!",
        
    ], option).then(([Map, Basemap, SceneView, ElevationLayer, BaseElevationLayer, WebTileLayer, TileInfo, OpenStreetMapLayer, Home, Fullscreen, config, DirectLineMeasurement3D, Legend, Expand, Search, domReady, featureLayer, BasemapGallery
    ]) => {
        var ExaggeratedElevationLayer = BaseElevationLayer.createSubclass({
            //高程夸张系数
            properties: {
                exaggeration: 1
            },
            //加载高程数据
            load: function() {
                this._elevation = new ElevationLayer({
                    url: "//elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
                });
                this.addResolvingPromise(this._elevation.load());
            },

            //瓦片
            fetchTile: function(level, row, col) {
                return this._elevation.fetchTile(level, row, col)
                    .then(function(data) {

                        var exaggeration = this.exaggeration;

                        for (var i = 0; i < data.values.length; i++) {
                            data.values[i] = data.values[i] * exaggeration;
                        }
                        return data;
                    }.bind(this));
            }
        });

        this.map = new Map({
            basemap: "satellite", //myBaseMap,
            ground: {
                layers: [
                    new ExaggeratedElevationLayer()
                ]
            },
            showLabels: true,
            wkid: 4326, //所用坐标系    EPSG对每个坐标系都有一个编号，天地图的CGCS2000是EPSG:4548，而4326是wgs84，wgs84和CGCS2000偏移不大
            showLabels: true,
        });
        // config.request.corsEnabledServers.push('http://t0.tianditu.com')
        config.request.corsEnabledServers.push('https://map.tianditu.gov.cn/')

        var kansasExtent = { // autocasts as new Extent()
            xmax: parseFloat(eqCenter.longitude) + 0.1,
            xmin: parseFloat(eqCenter.longitude) - 0.1,
            ymax: parseFloat(eqCenter.latitude) + 0.1,
            ymin: parseFloat(eqCenter.latitude) - 0.1,
            spatialReference: { // autocasts as new SpatialReference()
                wkid: 4326
            }
        };
        //view
        let mapmodel = 'global'
        if (window.screen.width <= 768) {
            mapmodel = 'local'
        }
        this.view = new SceneView({
            container: id,
            viewingMode: mapmodel,
            //local||global
            map: this.map,
            camera: {
                position: {
                    x: eqCenter.longitude,
                    y: eqCenter.latitude - 0.05,
                    z: 15000,
                },
                heading: 0,
                tilt: 45
            },
            clippingArea: kansasExtent,
            extent: kansasExtent,
            center: [eqCenter.longitude, eqCenter.latitude],
            constraints: {
                snapToZoom: true,
                altitude: {
                    // min:0
                }
            }
        });
        
        //----------------------------------  



        //----------------------------------  

        // 搜索定位功能
        let searchWidget = new Search({
            view: this.view
        });
        this.view.ui.add(searchWidget, "top-right");

        // 震中
        let homeBtn = new Home({
            view: this.view
        });
        this.view.ui.add(homeBtn, "top-right");


        this.view.popup.collapsed = false
        this.view.popup.dockEnabled = false
        this.view.popup.dockOptions = {
            buttonEnabled: true
        }

        //全屏
        let fullscreen = new Fullscreen({
            view: this.view
        });
        this.view.ui.add(fullscreen, "top-right");

        //抓屏截图
        this.view.ui.add("screen", "top-right");

        //量算工具
        this.view.ui.add("topbar", "top-right");

        //三维图例
        let legend = new Expand({
            //content包含四种写法:1.指定小部件 2.html 3.dom节点 4.带有Dijit的内容
            content: `<div style='background-color:#fff;border-radius:10px;'><h3>图例</h3><p style="width:100px"></p><p><span style='font-size: 16px;'>地震中心:</span><img src=` + centerstarPng + ` style='width:16px;height:16px;'></p><p><span style='font-size: 16px;'>附近城镇:</span><img src=` + nearCityPng + ` style='width:16px;height:16px;'></p><p><span style='font-size: 16px;'>历史地震:</span><img src=` + this.HIS_EQ_MARKER + ` style='width:16px;height:16px;'></p></div>`,
            view: this.view,
            // 默认展开折叠
            expanded: false
        });
        this.view.ui.add(legend, "top-right"); 
        let baseMapMarker = new WebTileLayer("https://{subDomain}.tianditu.gov.cn/DataServer?t=cia_w&x={col}&y={row}&l={level}&tk=ff8a70be92b11b0a15b79f40eab2f64d", {
            copyright: 'Tianditu',
            id: 'Tianditu1',
            subDomains: ['t0'],
        });
        let basedivision = new WebTileLayer("https://{subDomain}.tianditu.gov.cn/DataServer?t=ibo_w&x={col}&y={row}&l={level}&tk=ff8a70be92b11b0a15b79f40eab2f64d", {
            copyright: 'Tianditu',
            id: 'Tianditu2',
            subDomains: ['t0'],
        });
        this.map.add(baseMapMarker);
        this.map.add(basedivision);
    })

}
ArcMap.prototype = new Basemap();


//全国历史地震渲染（崔珂玮）
ArcMap.prototype.setHistoryMarker = function(data, type) {
    esriLoader.loadModules([
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/layers/support/LabelClass"
    ]).then(([FeatureLayer, Graphic, LabelClass]) => {
        var that = this
        data.forEach(function(item, index) {
            let symbolCenter = {
                type: "point-3d",
                symbolLayers: [{
                    type: "icon", // autocasts as new IconSymbol3DLayer()
                    size: 20, // points
                    resource: {
                        href: his_ear_data
                    },
                    // material: {
                    //     color: "red"
                    // }
                }]
            }
            let pointCenter = {
                type: 'point',
                longitude: item.longitude, //lonlat.x,
                latitude: item.latitude, //lonlat.y,
            }
            let pointGraphic = new Graphic({
                geometry: pointCenter,
                symbol: symbolCenter,
            });
            var features = [
                pointGraphic
            ];
            let NearPopupTemplate = {
                title: "历史地震信息",
                content: that.setContent('', item, "hisEarData"),
                overwriteActions: true
            }
            that.peaks = new FeatureLayer({
                //*设置3d标签可见*
                labelsVisible: true,
                source: features,
                popupTemplate: NearPopupTemplate,
                // Set a renderer that will show the points with icon symbols
                renderer: {
                    type: "simple", // autocasts as new SimpleRenderer()
                    symbol: {
                        type: "point-3d",
                        symbolLayers: [{
                            type: "icon", // autocasts as new IconSymbol3DLayer()
                            size: 30, // points
                            resource: {
                                href: his_ear_data
                            },
                            // material: {
                            //     color: "#C71585"
                            // }
                        }]
                    }
                },
                fields: [{
                    name: "ObjectID",
                    alias: "ObjectID",
                    type: "oid"
                }],
                objectIdField: "ObjectID",
                geometryType: "point",
                outFields: ["ObjectID"],
                // Add labels with callouts of type line to the icons
                labelingInfo: [new LabelClass({
                    // When using callouts on labels, "above-center" is the only allowed position
                    labelExpressionInfo: {
                        value: item.name, /////////////////////////////////////////////////////////////////////////////////////////////
                    },
                    symbol: {
                        type: "label-3d", // autocasts as new LabelSymbol3D()
                        symbolLayers: [{
                            type: "text", // autocasts as new TextSymbol3DLayer()
                            material: {
                                color: "#FF3300"
                            },
                            halo: {
                                color: [0, 0, 0, 0.4],
                                size: 1
                            },
                            size: 15
                        }],
                    },
                    labelPlacement: "center-right",
                })]
            });
            that.map.add(that.peaks);
        })
    })
}

//附近城镇渲染
ArcMap.prototype.setMarker = function(data, type) {
    esriLoader.loadModules([
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/layers/support/LabelClass"
    ]).then(([FeatureLayer, Graphic, LabelClass]) => {
        var that = this
        data.forEach(function(item, index) {
            let symbolCenter = {
                type: "point-3d",
                symbolLayers: [{
                    type: "icon", // autocasts as new IconSymbol3DLayer()
                    size: 20, // points
                    resource: {
                        href: centerstarPng
                    },
                    material: {
                        color: "red"
                    }
                }]
            }
            let pointCenter = {
                type: 'point',
                longitude: item.longitude, //lonlat.x,
                latitude: item.latitude, //lonlat.y,
            }
            let NearPopupTemplate = {
                title: "附近城镇信息",
                content: that.setContent('', item, "nearCity"),
                overwriteActions: true
            }
            let pointGraphic = new Graphic({
                geometry: pointCenter,
                symbol: symbolCenter,

            });
            var features = [
                pointGraphic
            ];
            that.peaks = new FeatureLayer({
                //*设置3d标签可见*
                labelsVisible: true,
                source: features,
                popupTemplate: NearPopupTemplate,
                // Set a renderer that will show the points with icon symbols
                renderer: {
                    type: "simple", // autocasts as new SimpleRenderer()
                    symbol: {
                        type: "point-3d",
                        symbolLayers: [{
                            type: "icon", // autocasts as new IconSymbol3DLayer()
                            size: 30, // points
                            resource: {
                                href: nearCityPng
                            },
                            material: {
                                color: "#C71585"
                            }
                        }]
                    }
                },
                fields: [{
                    name: "ObjectID",
                    alias: "ObjectID",
                    type: "oid"
                }],
                objectIdField: "ObjectID",
                geometryType: "point",
                outFields: ["ObjectID"],
                // Add labels with callouts of type line to the icons
                labelingInfo: [new LabelClass({
                    // When using callouts on labels, "above-center" is the only allowed position
                    labelExpressionInfo: {
                        value: item.name, /////////////////////////////////////////////////////////////////////////////////////////////
                    },
                    symbol: {
                        type: "label-3d", // autocasts as new LabelSymbol3D()
                        symbolLayers: [{
                            type: "text", // autocasts as new TextSymbol3DLayer()
                            material: {
                                color: "#FF3300"
                            },
                            halo: {
                                color: [0, 0, 0, 0.4],
                                size: 1
                            },
                            size: 15
                        }],
                    },
                    labelPlacement: "center-right",
                })]
            });

            that.map.add(that.peaks);
        })
    })
}

//历史地震渲染
ArcMap.prototype.setHisEq = function(hisEq) {
    esriLoader.loadModules([
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "dojo/domReady!",
    ]).then(([GraphicsLayer, Graphic]) => {
        let GLayer = new GraphicsLayer
        this.hisEq = hisEq
        for (let key in this.hisEq) {
            let val = this.hisEq[key]
            let symbolCenter = {
                type: "point-3d",
                symbolLayers: [{
                    type: "icon", // autocasts as new IconSymbol3DLayer()
                    size: 30, // points
                    resource: {
                        href: this.HIS_EQ_MARKER
                    },

                }]
            }
            let pointCenter = {
                type: 'point',
                longitude: val.longitude, //lonlat.x,
                latitude: val.latitude, //lonlat.y,
            }
            let HisPopupTemplate = {
                title: "历史地震信息",
                content: this.setContent('', val, "hisEq")
            }
            let pointGraphic = new Graphic({
                geometry: pointCenter,
                symbol: symbolCenter,
                popupTemplate: HisPopupTemplate,
                overwriteActions: true
            });
            GLayer.add(pointGraphic);
        }
        this.map.add(GLayer);
    })
}

//添加震中标签
ArcMap.prototype.epiLabel = function() {
    esriLoader.loadModules([
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/layers/support/LabelClass"
    ]).then(([FeatureLayer, Graphic, LabelClass]) => {
        

        let pointCenter = {
            type: 'point',
            longitude: this.eqCenter.longitude, //lonlat.x,
            latitude: this.eqCenter.latitude, //lonlat.y,
        }
        let symbolCenter = {
            type: "point-3d",
            symbolLayers: [{
                type: "icon", // autocasts as new IconSymbol3DLayer()
                size: 20, // points
                resource: {
                    href: centerstarPng
                },
                material: {
                    color: "red"
                }
            }]
        }
        
        let CenterPopupTemplate = {
            title: "震中信息",
            content: this.setContent('', this.eqCenter, "EqCenter"),
            overwriteActions: true
        }
        let pointGraphic = new Graphic({
            geometry: pointCenter,
            symbol: symbolCenter,

        });
        var features = [
            pointGraphic
        ];
        this.peaks = new FeatureLayer({
            //*设置3d标签可见*
            labelsVisible: true,
            source: features,
            popupTemplate: CenterPopupTemplate,
            // Set a renderer that will show the points with icon symbols
            renderer: {
                type: "simple", // autocasts as new SimpleRenderer()
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "icon", // autocasts as new IconSymbol3DLayer()
                        size: 40, // points
                        resource: {
                            href: centerstarPng
                        },
                        material: {
                            color: "red"
                        }
                    }]
                }
            },
            fields: [{
                name: "ObjectID",
                alias: "ObjectID",
                type: "oid"
            }],
            objectIdField: "ObjectID",
            geometryType: "point",
            outFields: ["ObjectID"],
            // Add labels with callouts of type line to the icons
            labelingInfo: [new LabelClass({
                // When using callouts on labels, "above-center" is the only allowed position
                labelExpressionInfo: {
                    value: this.eqCenter.district + this.eqCenter.magnitude + "级", /////////////////////////////////////////////////////////////////////////////////////////////
                    // expression: this.eqCenter.district + this.eqCenter.magnitude + "级"
                },
                symbol: {
                    type: "label-3d", // autocasts as new LabelSymbol3D()
                    symbolLayers: [{
                        type: "text", // autocasts as new TextSymbol3DLayer()
                        material: {
                            color: "#FF0000"
                        },
                        halo: {
                            color: [0, 0, 0, 0.4],
                            size: 1
                        },
                        size: 20
                    }],
                },
                labelPlacement: "center-right",
            })]
        });

        this.map.add(this.peaks);
    })
}

//量算分件
ArcMap.prototype.setActiveWidget = function(type) {
    esriLoader.loadModules(["esri/widgets/DirectLineMeasurement3D"]).then(([DirectLineMeasurement3D]) => {
        switch (type) {
            case 'distance':
                this.activeWidget = new DirectLineMeasurement3D({
                    view: this.view
                });
                this.view.ui.add(this.activeWidget, "top-right");
                this.setActiveButton(document.getElementById("distanceButton"));
                break;
            case null:
                if (this.activeWidget) {
                    this.view.ui.remove(this.activeWidget);
                    this.activeWidget.destroy();
                    this.activeWidget = null;
                }
                break;
        }
    })

}

// 量算分件
ArcMap.prototype.setActiveButton = function(selectedButton) {
    // 将视图聚焦到激活键盘快捷键
    this.view.focus();
    let elements = document.getElementsByClassName("active");
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("active");
    }
    if (selectedButton) {
        selectedButton.classList.add("active");
    }
}

// 量算主件
ArcMap.prototype.measure = function() {
    this.setActiveWidget(null);
    if (!document.getElementById("distanceButton").classList.contains('active')) {
        this.setActiveWidget('distance');
    } else {
        this.setActiveButton(null);
    }
}

// 点击任意点弹出窗口
ArcMap.prototype.locator = function() {
    esriLoader.loadModules([
        "esri/tasks/Locator"
    ]).then(([Locator]) => {
        let locatorTask = new Locator({
            //提供数据的url
            url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        this.view.on("click", (event) => {
            // 在视图中获取点击的坐标
            let lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
            let lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
            const screenPoint = {
                x: event.x,
                y: event.y
            };
            // console.log(event)
            //计算两经纬度点之间的距离
            let radLat1 = this.eqCenter.latitude * Math.PI / 180.0; //lat纬度
            let radLat2 = lat * Math.PI / 180.0;
            let nearlon = this.eqCenter.longitude * Math.PI / 180.0 - lon * Math.PI / 180.0; //经度
            let nearlat = this.eqCenter.latitude * Math.PI / 180.0 - lat * Math.PI / 180.0; //纬度
            let nearDistance1 = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(nearlat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(nearlon / 2), 2))) * 6378.137;
            let nearDistance = Math.round(nearDistance1 * 10000) / 10000;

            this.view.hitTest(screenPoint).then((response) => {
                // console.log(response.results)
                if (response.results[0].graphic == null) {
                    event.stopPropagation();
                    this.view.popup.open({
                        // 将弹出的标题设置为位置的坐标
                        title: "此点信息",
                        // 将弹出的位置设置为单击的位置
                        location: event.mapPoint
                    });
                    let z = event.mapPoint.z >= 0 ? event.mapPoint.z : 无此处信息;
                    // 显示弹窗
                    // 使用点击的位置执行反向地理代码
                    locatorTask.locationToAddress(event.mapPoint).then((response) => {
                        // 如果成功找到了地址，请在弹出的内容中显示它
                        this.view.popup.content = '<table class="table-bordered table-condensed"><tr><td width="45%">' + "经纬度：" + '</td><td>' + "[" + lon.toFixed(2) + ", " + lat.toFixed(2) + " " + "]" + '</td></tr><tr><td>' + "地址:" + '</td><td>' + response.address + '</td></tr><tr><td>' + "距震中距离:" + '</td><td>' + nearDistance.toFixed(1) + "公里" + '</td></tr><tr><td>' + "海拔" + '</td><td>' + z.toFixed(2) + "米" + '</td></tr></table>';
                    }).catch((error) => {
                        // 如果承诺失败，没有发现结果，则显示一条通用消息
                        this.view.popup.content = "无此处信息";
                    });
                }

            });

        });
    })
}

// 截取三维地形图
ArcMap.prototype.screenshot = function() {

    // 触发区域选择模式的按钮
    let screenshotBtn = document.getElementById("screenshotBtn");

    // 用于选择区域的橙色蒙版
    let maskDiv = document.getElementById("maskDiv");

    // 元素，我们在其中显示打印预览
    let screenshotDiv = document.getElementById("screenshotDiv");

    // 添加事件侦听器以触发区域选择模式
    screenshotBtn.classList.add("active");

    this.view.container.classList.add("screenshotCursor");
    let area = null;

    //  并计算所选区域
    let that = this;
    let dragHandler = this.view.on("drag", function(event) {

        // 阻止视图中的导航
        event.stopPropagation();
        // 当用户开始拖动或正在拖动时
        if (event.action !== "end") {
            // 通过拖动光标计算选定区域的范围

            let xmin = clamp(Math.min(event.origin.x, event.x), 0, that.view.width);
            let xmax = clamp(Math.max(event.origin.x, event.x), 0, that.view.width);
            let ymin = clamp(Math.min(event.origin.y, event.y), 0, that.view.height);
            let ymax = clamp(Math.max(event.origin.y, event.y), 0, that.view.height);

            area = {
                x: xmin,
                y: ymin,
                width: xmax - xmin,
                height: ymax - ymin
            };
            // 设置标记所选区域的div元素的位置
            setMaskPosition(area);
            // 当用户停止拖动时
        } else {
            // 从SceneView中删除拖动事件侦听器
            dragHandler.remove();
            // 所选区域的屏幕截图被获取
            that.view.takeScreenshot({
                    area: area,
                    format: "png"
                })
                .then(function(screenshot) {
                    // 显示图像的预览
                    showPreview(screenshot);

                    // 创建要下载的映像
                    document.getElementById("downloadBtn").onclick = function() {

                        const text = document.getElementById("textInput").value;
                        // 如果存在文本，则将其添加到图像中
                        if (text) {
                            const dataUrl = getImageWithText(screenshot, text);
                            downloadImage("有文本的截图" + ".png", dataUrl);
                            // 否则只下载截图
                        } else {
                            downloadImage("没有文本的截图" + ".png", screenshot.dataUrl);
                        }
                    }

                    // 屏幕截图模式被禁用
                    screenshotBtn.classList.remove("active");
                    that.view.container.classList.remove("screenshotCursor");
                    setMaskPosition(null);
                });
        }
    });


    function setMaskPosition(area) {
        if (area) {
            maskDiv.classList.remove("screenhide");
            maskDiv.style.left = area.x + "px";
            maskDiv.style.top = area.y + "px";
            maskDiv.style.width = area.width + "px";
            maskDiv.style.height = area.height + "px";
        } else {
            maskDiv.classList.add("screenhide");
        }
    }

    function clamp(value, from, to) {
        return value < from ? from : value > to ? to : value;
    }

    // 创建将添加到DOM的映像
    // 这样用户就可以预览他们将要下载的内容
    function showPreview(screenshot) {
        screenshotDiv.classList.remove("screenhide");
        // 添加截图dataUrl作为图像元素的src
        let screenshotImage = document.getElementsByClassName("js-screenshot-image")[0];
        screenshotImage.width = screenshot.data.width;
        screenshotImage.height = screenshot.data.height;
        screenshotImage.src = screenshot.dataUrl;
    }

    // 返回通过向webscene图像添加自定义文本创建的新图像
    function getImageWithText(screenshot, text) {

        const imageData = screenshot.data;

        // 为了将文本添加到屏幕快照中，我们创建了一个新的画布元素
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = imageData.height;
        canvas.width = imageData.width;

        // 将屏幕截图数据添加到画布
        context.putImageData(imageData, 0, 0);
        context.font = "20px Arial";
        context.fillStyle = "#000";
        context.fillRect(0, imageData.height - 40, context.measureText(text).width + 20, 30);

        // 从textInput元素添加文本
        context.fillStyle = "#fff";
        context.fillText(text, 10, imageData.height - 20);

        return canvas.toDataURL();
    }

    function downloadImage(filename, dataUrl) {

        // 下载在微软浏览器中处理方式不同
        // 因为不支持元素的下载属性
        if (!window.navigator.msSaveOrOpenBlob) {
            // 在支持下载属性的浏览器中
            // 一个链接被创建，一个程序化的点击将触发下载
            let binStr = atob(dataUrl.split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }
            let blob = new Blob([arr])
            const element = document.createElement("a");
            element.setAttribute("href", URL.createObjectURL(blob));
            element.setAttribute("download", filename);
            element.style.display = "none";
            document.body.appendChild(element);
            element.click()
        } else {
            const byteString = atob(dataUrl.split(",")[1]);
            const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0]
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], {
                type: mimeString
            });
            window.navigator.msSaveOrOpenBlob(blob, filename);
        }
    }
    document.getElementById("closeBtn").addEventListener("click", function() {
        screenshotDiv.classList.add("screenhide");
    });
}
ArcMap.prototype.addfault_zone = function(data) {
    esriLoader.loadModules([
        "esri/layers/GraphicsLayer",
        "esri/Graphic"
    ]).then(([GraphicsLayer, Graphic]) => {
        let lineSymbol = {
            type: "line-3d",
            symbolLayers: [{
                type: "line",
                size: 1,
                material: {
                    color: [255, 255, 0]
                }
            }]
        };
        let GLayer = new GraphicsLayer();
        data.forEach(e => {
            let lineAtt = {
                "断裂的名称": e.name,
            };
            let polyline = {
                type: "polyline",
                paths: e.lonlat
            };
            let polylineGraphic = new Graphic({
                geometry: polyline,
                symbol: lineSymbol,
                attributes: lineAtt,
                popupTemplate: {
                    title: "{断裂的名称}",
                    content: [{
                        type: "fields",
                        fieldInfos: [{
                            fieldName: "断裂的名称"
                        }, ]
                    }]
                },
                overwriteActions: true
            });
            GLayer.add(polylineGraphic)
        })
        this.map.add(GLayer)
    })
}
ArcMap.prototype.addfault_zoneF = function(data) {
        esriLoader.loadModules([
            "esri/Graphic",
            "esri/layers/FeatureLayer",
            "esri/layers/support/LabelClass"
        ]).then(([Graphic, FeatureLayer, LabelClass]) => {
            let lableclass = new LabelClass({
                // When using callouts on labels, "above-center" is the only allowed position
                labelExpressionInfo: {
                    //value: "$feature.断裂带的名称",
                    expression: "$feature.FaultZoneName"
                },
                symbol: {
                    type: "label-3d", // autocasts as new LabelSymbol3D()
                    symbolLayers: [{
                        type: "text", // autocasts as new TextSymbol3DLayer()
                        material: {
                            color: [255, 255, 0]
                        },
                        halo: {
                            color: [0, 0, 0, 0.4],
                            size: 1
                        },
                        size: 10
                    }],
                },
                labelPlacement: "center-right",
            })
            let lineSymbol = {
                type: "line-3d",
                symbolLayers: [{
                    type: "line",
                    size: 1,
                    material: {
                        color: [255, 255, 0]
                    }
                }]
            };
            let featureLayer = new FeatureLayer({
                fields: [{
                        name: "ObjectID",
                        alias: "ObjectID",
                        type: "oid"
                    },
                    {
                        name: 'FaultZoneName',
                        alias: 'FaultZoneName',
                        type: 'string'
                    }
                    // ,{
                    //      name:"NAME",
                    //      alias:"NAME",
                    //      type:"sqlTypeNVarchar"
                    //  }
                ],
                objectIdField: "ObjectID",
                geometryType: "polyline",
                outFields: ["*"],
                labelingInfo: [lableclass],
                renderer: {
                    type: "simple", // autocasts as new SimpleRenderer()
                    symbol: lineSymbol
                },
            })
            let Graphics = []
            data.forEach(e => {

                let polyline = {
                    type: "polyline",
                    paths: e.lonlat
                };
                let polylineGraphic = {
                    geometry: polyline,
                    attributes: {
                        FaultZoneName: e.name,
                    },
                    // popupTemplate: {
                    //     title: "{NAME}",
                    //     content: [{
                    //         type: "fields",
                    //         fieldInfos: [{
                    //             fieldName: "NAME"
                    //         }, ]
                    //     }]
                    // },
                    // overwriteActions :true
                };
                Graphics.push(polylineGraphic)
            })
            featureLayer.source = Graphics
                // featureLayer.refresh()
            this.map.add(featureLayer)
                // console.log(this.map)
        })
}

// 搜索定位功能
ArcMap.prototype.locator = function() {
    esriLoader.loadModules([
        "esri/widgets/Search"
    ]).then(([Search]) => {
        let searchWidget = new Search({
            view: this.view
        });

        // Add the search widget to the top right corner of the view
        this.view.ui.add(searchWidget, {
            position: "bottom"
        });
    })
}

export default ArcMap;