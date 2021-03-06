import React, {Component} from 'react'
import {View, Text, ScrollView, TouchableWithoutFeedback, TextInput, StyleSheet, Dimensions} from 'react-native'
import LineChart from "../../chart/LineChart";
import {Spinner} from "native-base";


const colors = {
    chartBlue: '#4286F5',
    chartRed: '#DC4437',
    chartYellow: '#F5B400',
    chartBlueOpacity: null, //'rgba(66, 134, 245,0.3)',
    chartRedOpacity: null,//'rgba(220, 68, 55, 0)',
    chartYellowOpacity: null,//'rgba(245, 180, 0, 0)',
}

export class PointInfo extends React.Component {

    constructor(props) {
        console.disableYellowBox = true;
        super(props);
        this.selectChart = this.selectChart.bind(this);
        this.state = {
            height: 150,
            ready: false
        }
        this._calcChart();
    }

    _calcChart() {
        let data = Object.keys(this.props.point.properties).filter(key => ["pm10", "no2", "no", "predictedpm10"].includes(key)).map(key => {
            let obj = {};
            obj.key = key;
            obj.values = [];
            obj.values.push(Math.ceil(this.props.point.properties[key]));
            obj.values.push(Math.ceil(Math.abs(obj.values[0] + (Math.random() * 40 - 20))));
            obj.values.push(Math.ceil(Math.abs(obj.values[0] + (Math.random() * 40 - 20))));
            obj.values.push(Math.ceil(Math.abs(obj.values[0] + (Math.random() * 40 - 20))));
            obj.values.push(Math.ceil(Math.abs(obj.values[0] + (Math.random() * 40 - 20))));
            obj.values.push(Math.ceil(Math.abs(obj.values[0] + (Math.random() * 40 - 20))));
            obj.values.push(Math.ceil(Math.abs(obj.values[0] + (Math.random() * 40 - 20))));
            return obj;
        });

        var chart = {
            values: data.map(obj => obj.values),
            colors: {
                labelsColor: [colors.chartBlue, colors.chartRed, colors.chartYellow, colors.chartBlue],
                fillColor: [colors.chartBlueOpacity, colors.chartRedOpacity, colors.chartYellowOpacity, colors.chartBlueOpacity],
                strokeColor: [colors.chartBlue, colors.chartRed, colors.chartYellow, colors.chartBlue],
                axisColor: 'rgba(216, 216, 216, 1)',
                axisTextColor: 'gray',
            },
            options: {
                strokeWidth: 1,
                margin: {
                    left: 40,
                    right: 10,
                    top: 10,
                    bottom: 20
                },
                labelWidth: 50,
            },
            showAxis: false,
            labels: data.map(obj => obj.key),
            selected: 3,
            axis: ['10/09', '11/09', '12/09', '13/09', '14/09', '15/09', '16/09'],
        }

        let count = [
            0,
            0,
            0,
        ];

        chart.values.forEach((data, index) => {
            data.forEach((elem) => {
                count[index] += elem;
            });
        });
        this.setState({
            chart: chart,
            count: count,
            ready: true
        })
    }

    selectChart(index) {
        let chart = this.state.chart;
        chart["selected"] = index;
        this.setState({chart: chart});
    }

    getChartWidth() {
        return Dimensions.get('window').width - 16 - 2;
    }


    render() {
        console.log("chart render");
        const {chart, count} = this.state;
        let labels, subtitle, buttonRemoveSelected;
        if (this.state.ready) {
            labels = count.map((elem, index) => {
                let value = 0;
                let color = {color: chart.colors.labelsColor[index]};
                let borderColor = {borderColor: chart.colors.labelsColor[index]};
                let border = {};
                if (index == 1) {
                    border = {borderLeftWidth: 0.5, borderRightWidth: 0.5};
                }
                if (chart.selected != null)
                    value = chart.values[index][chart.selected];

                return (
                    <View key={index} style={[styles.listItemRow, border]}>
                        <Text
                            style={[styles.listItemRowText, styles.listItemRowTextTitle, color]}>{chart.labels[index]}</Text>
                        <View style={[styles.listItemRowSeparator, borderColor]}></View>
                        <Text style={[styles.listItemRowTextValue]}>{value}</Text>
                    </View>
                )
            });

            subtitle = " " + chart.axis[0] + "  " + chart.axis[chart.axis.length - 1];
            buttonRemoveSelected = null;
            if (chart.selected != null) {
                subtitle = " " + chart.axis[chart.selected];
            }
        }

        let content;

        if (this.state.ready) {
            content = (
                <ScrollView contentContainerStyle={styles.container}>
                    <ScrollView style={styles.card}>
                        <LineChart onPressItem={this.selectChart} height={this.state.height}
                                   width={this.getChartWidth()} chart={chart}/>
                        <View style={[styles.listSubtitle]}>
                            <Text style={[styles.listSubtitleText]}>{subtitle}</Text>
                        </View>
                        <View style={[styles.listItemColumn]}>
                            {labels}
                        </View>
                    </ScrollView>
                </ScrollView>)
        }
        else
            content = (
                <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
                    <Spinner color='blue'/>
                </View>);

        return content;
    }

    componentWillReceiveProps() {
        const height = 150;
        if (this.state.strPoint !== JSON.stringify(this.props.point)) {
            console.log("different");
            this.setState({
                strPoint: JSON.stringify(this.props.point),
                height: this.state.height === height ? 149 : 150,
                ready: false
            })
            setTimeout(() => this._calcChart(), 500);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderRadius: 1,
        borderWidth: 0.5,
        borderColor: 'lightgray',
        backgroundColor: '#FFF',
        margin: 8,
    },
    listHeaderText: {
        fontSize: 16,
    },
    listHeader: {
        display: 'flex',
        paddingTop: 10,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderColor: 'lightgray',
    },
    listSubtitle: {
        display: 'flex',
        paddingTop: 8,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingBottom: 8,
        borderTopWidth: 0.5,
        borderColor: 'lightgray',
        flexDirection: 'row',
    },
    listSubtitleText: {
        fontSize: 13,
        textAlign: 'center',
        flex: 1,
    },
    listSubtitleButton: {
        alignSelf: 'flex-end',
    },
    listSubtitleButtonText: {
        color: 'blue',
        fontSize: 13,
    },
    listItemColumn: {
        borderTopWidth: 0.5,
        borderColor: 'lightgray',
        display: 'flex',
        flexDirection: 'row',
    },
    listItemRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        borderColor: 'lightgray',
        borderBottomWidth: 0.5,
    },
    listItemRowText: {
        textAlign: 'center'
    },
    listItemRowTextTitle: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingTop: 3,
        paddingBottom: 3,
        flex: 1,
    },
    listItemRowSeparator: {
        borderTopWidth: 2,
    },
    listItemRowTextValue: {
        textAlign: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        fontSize: 14,
    },
});