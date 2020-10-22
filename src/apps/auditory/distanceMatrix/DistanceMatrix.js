import React from 'react'

import { fetchDevApi as fetchApi} from 'share/utils'

import {
    Table,
    TableBody,    
    TableRow,
    TableRowColumn,
} from 'material-ui/Table'

import TextField from 'material-ui/TextField'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionDone from 'material-ui/svg-icons/action/done'

export default class DistanceMatrix extends React.Component {

    matrix = [];

    state = {
        firstId: null,
        secondId: null,

        firstIdInFocus: null,
        secondIdInFocus: null,
        elInFocus: false,

        distance: 0
    }

    getDistance = (firstId, secondId) => {

        if ((this.state.firstIdInFocus == firstId && this.state.secondIdInFocus == secondId) ||
            (this.state.firstIdInFocus == secondId && this.state.secondIdInFocus == firstId)) {
            return this.state.distance;
        }

        for (let el of this.props.distanceList) {
            if ((el.FirstBuilding == firstId && el.SecondBuilding == secondId) ||
                (el.FirstBuilding == secondId && el.SecondBuilding == firstId)) {
                return el.Distance;
            }
        }

        return '';
    }

    handleClickAcceptEdit = async () => {
        try {

            await fetchApi('auditory/building/distance', {
                method: "post",
                body: JSON.stringify({
                    distance: this.state.distance,
                    firstBuildingId: this.state.firstIdInFocus,
                    secondBuildingId: this.state.secondIdInFocus
                })
            });

            await this.props.updateDistanceList();

            this.setState({
                elInFocus: false
            });

        } catch (err) {
            console.log(err);
        }
    }

    handleChangeDistance = (_e, i) => {
        this.setState({ distance: +i });
    }

    render() {

        let buildingList = [];

        for (let el of this.props.buildingList) {
            if (el.Type == 21) {
                buildingList.push(el);
            }
        }

        return (
            <div style={{ width: "90%", marginLeft: "5%" }}>

                <Table selectable={false} style={{ width: "auto" }} bodyStyle={{ overflowX: "auto" }}>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow>
                            <TableRowColumn></TableRowColumn>
                            {buildingList.map(item => (
                                <TableRowColumn key={item.Id} style={{ whiteSpace: "unset" }}>
                                    <span title={item.Name} style={{ fontWeight: this.state.secondId == item.Id ? "bold" : "normal", color: this.state.secondId == item.Id ? "red" : "initial" }}>{item.Number}</span>
                                </TableRowColumn>
                            ))}
                        </TableRow>
                        {buildingList.map((item, x) => (
                            <TableRow key={item.Id}>
                                <TableRowColumn style={{ whiteSpace: "unset" }}><span title={item.Name} style={{ fontWeight: this.state.firstId == item.Id ? "bold" : "normal", color: this.state.firstId == item.Id ? "red" : "initial" }}>{item.Number}</span></TableRowColumn>
                                {buildingList.map((otherItem, y) => (
                                    <TableRowColumn key={otherItem.Id}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            {item.Id != otherItem.Id ?
                                                (<TextField name={`distance_${x}_${y}`} onChange={this.handleChangeDistance} onFocus={() => this.setState({ elInFocus: true, firstIdInFocus: item.Id, secondIdInFocus: otherItem.Id, distance: this.getDistance(item.Id, otherItem.Id) })} title={`${item.Name} и ${otherItem.Name}`} value={this.getDistance(item.Id, otherItem.Id)} min={0} onMouseEnter={() => {

                                                    this.setState({
                                                        firstId: item.Id,
                                                        secondId: otherItem.Id
                                                    });

                                                }} type="number" style={{ width: "100%", marginRight: "13px" }} />) : 0}
                                            {item.Id == this.state.firstIdInFocus && otherItem.Id == this.state.secondIdInFocus && this.state.elInFocus ? (
                                                <FloatingActionButton title="Принять изменения" mini={true} secondary={false} onClick={this.handleClickAcceptEdit}>
                                                    <ActionDone />
                                                </FloatingActionButton>
                                            ) : null}
                                        </div>
                                    </TableRowColumn>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            </div>);
    }

}