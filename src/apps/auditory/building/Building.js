import React from 'react'

import { fetchDevApi as fetchApi} from 'share/utils'

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import FloatingActionButton from 'material-ui/FloatingActionButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentUndo from 'material-ui/svg-icons/content/undo';

export default class Building extends React.Component {

    state = {

        addModeState: true,

        buildingList: [],
        buildingTypeList: [],

        addModeBuildingTypeId: '',
        addModeBuildingNumber: '',
        addModeBuildingName: '',
        addModeAddress: '',

        editModeData: {}
    }

    componentWillReceiveProps(newProps) {

        let buildingTypeId = null;

        if (newProps.buildingTypeList.length > 0) {
            buildingTypeId = newProps.buildingTypeList[0].Id;
        }

        if (buildingTypeId) {
            this.setState({
                addModeBuildingTypeId: buildingTypeId
            });
        }

    }

    updateBuildingList = async () => {
        let buildingList = await fetchApi("auditory/building");

        this.setState({
            buildingList: buildingList.result
        });
    }

    handleChangeBuildingNameAddMode = (e, value) => this.setState({ addModeBuildingName: value });
    handleChangeBuildingNumberAddMode = (e, value) => this.setState({ addModeBuildingNumber: value });
    handleChangeAddressAddMode = (e, value) => this.setState({ addModeAddress: value });
    handleChangeBuildingTypeAddMode = (e, i, value) => this.setState({ addModeBuildingTypeId: value });

    handleChangeBuildingNumberEditMode = (e, value) => {
        this.state.editModeData.Number = value;
        this.setState({ editModeData: this.state.editModeData });
    }

    handleChangeBuildingNameEditMode = (e, value) => {
        this.state.editModeData.Name = value;
        this.setState({ editModeData: this.state.editModeData });
    }

    handleChangeAddressEditMode = (e, value) => {
        this.state.editModeData.Address = value;
        this.setState({ editModeData: this.state.editModeData });
    }

    handleChangeBuildingTypeEditMode = (e, i, value) => {
        this.state.editModeData.Type = value;
        this.setState({ editModeData: this.state.editModeData });
    }

    handleClickAddMode = async () => {

        let { addModeBuildingTypeId, addModeAddress,
            addModeBuildingName, addModeBuildingNumber } = this.state;

        if (addModeBuildingTypeId && addModeAddress &&
            addModeBuildingName) {

            this.setState({
                addModeState: false
            });

            await fetchApi("auditory/building", {
                method: "post",
                body: JSON.stringify({
                    number: addModeBuildingNumber,
                    name: addModeBuildingName,
                    typeId: addModeBuildingTypeId,
                    address: addModeAddress
                })
            })

            await this.props.updateBuildingList();

            this.setState({
                addModeState: true
            });

        }
    }

    handleClickEditModeBuilder = (data) => {
        return () => {
            this.setState({
                editModeData: Object.assign({}, data)
            });
        }
    }

    handleRemoveBtnClickBuilder = (id) => {
        return async () => {


            if (!confirm('Вы уверены, что хотите удалить данные по выбранному корпусу? Будут также удалены данные по связанным аудиториям.')) {
                return;
            }

            await fetchApi("auditory/building/" + id, {
                method: "delete"
            });

            await this.props.updateBuildingList();

        }
    }

    handleClickAcceptEdit = async () => {

        let data = this.state.editModeData;

        await fetchApi("auditory/building/" + data.Id, {
            method: "post",
            body: JSON.stringify({
                number: data.Number,
                name: data.Name,
                typeId: data.Type,
                address: data.Address
            })
        });

        this.setState({
            editModeData: {}
        });

        await this.props.updateBuildingList();
    }

    handleClickCancelEdit = () => {
        this.setState({
            editModeData: {}
        });
    }

    render() {
        return (
            <Table selectable={false} wrapperStyle={{ width: "70%", marginLeft: "15%" }}>

                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn>Номер</TableHeaderColumn>
                        <TableHeaderColumn>Название</TableHeaderColumn>
                        <TableHeaderColumn>Тип</TableHeaderColumn>
                        <TableHeaderColumn>Адрес</TableHeaderColumn>
                        <TableHeaderColumn></TableHeaderColumn>
                    </TableRow>
                </TableHeader>

                <TableBody displayRowCheckbox={false}>
                    <TableRow>

                        <TableRowColumn>
                            <TextField name='buildNumber' min={0} type="number" value={this.state.addModeBuildingNumber} onChange={this.handleChangeBuildingNumberAddMode} inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} />
                        </TableRowColumn>

                        <TableRowColumn>
                            <TextField name='buildName' value={this.state.addModeBuildingName} onChange={this.handleChangeBuildingNameAddMode} inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} />
                        </TableRowColumn>

                        <TableRowColumn>
                            <SelectField style={{ fontSize: "13px" }} value={this.state.addModeBuildingTypeId} onChange={this.handleChangeBuildingTypeAddMode}>
                                {this.props.buildingTypeList.map((item) => {
                                    return <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />
                                })}
                            </SelectField>
                        </TableRowColumn>

                        <TableRowColumn>
                            <TextField name='buildAddress' value={this.state.addModeAddress} onChange={this.handleChangeAddressAddMode} inputStyle={{ height: "auto", fontSize: "13px" }} style={{ height: "36px" }} />
                        </TableRowColumn>

                        <TableRowColumn style={{ textAlign: "center" }}>
                            <FloatingActionButton title="Добавить корпус" disabled={!this.state.addModeState} mini={true} secondary={false} onClick={this.handleClickAddMode}>
                                <ContentAdd />
                            </FloatingActionButton>
                        </TableRowColumn>

                    </TableRow>

                    {this.props.buildingList.map((item) => {

                        if (this.state.editModeData.Id == item.Id) {
                            return (
                                <TableRow key={item.Id}>

                                    <TableRowColumn>
                                        <TextField name='buildNumber' type="number" min={0} inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} value={this.state.editModeData.Number} onChange={this.handleChangeBuildingNumberEditMode} />
                                    </TableRowColumn>

                                    <TableRowColumn>
                                        <TextField name='buildName' inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} value={this.state.editModeData.Name} onChange={this.handleChangeBuildingNameEditMode} />
                                    </TableRowColumn>

                                    <TableRowColumn>
                                        <SelectField style={{ fontSize: "13px" }} value={this.state.editModeData.Type} onChange={this.handleChangeBuildingTypeEditMode}>
                                            {this.props.buildingTypeList.map((item) => {
                                                return <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />
                                            })}
                                        </SelectField>
                                    </TableRowColumn>

                                    <TableRowColumn>
                                        <TextField name='buildAddress' inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} value={this.state.editModeData.Address} onChange={this.handleChangeAddressEditMode} />
                                    </TableRowColumn>

                                    <TableRowColumn style={{ textAlign: "center" }}>

                                        <FloatingActionButton title="Принять изменения" mini={true} secondary={false} onClick={this.handleClickAcceptEdit}>
                                            <ActionDone />
                                        </FloatingActionButton>

                                        <FloatingActionButton style={{ marginLeft: '8px' }} title="Отменить изменения" mini={true} secondary={true} onClick={this.handleClickCancelEdit}>
                                            <ContentUndo />
                                        </FloatingActionButton>

                                    </TableRowColumn>

                                </TableRow>
                            );
                        } else {
                            return (
                                <TableRow key={item.Id}>
                                    <TableRowColumn>{item.Number}</TableRowColumn>
                                    <TableRowColumn>{item.Name}</TableRowColumn>
                                    <TableRowColumn>{item.TypeName}</TableRowColumn>
                                    <TableRowColumn style={{whiteSpace: "break-spaces"}}>{item.Address}</TableRowColumn>

                                    <TableRowColumn style={{ textAlign: "center" }}>

                                        <FloatingActionButton title="Редактировать аудиторию" mini={true} secondary={false} onClick={this.handleClickEditModeBuilder(item)}>
                                            <EditorModeEdit />
                                        </FloatingActionButton>

                                        <FloatingActionButton style={{ marginLeft: '8px' }} title="Удалить аудиторию" mini={true} secondary={true} onClick={this.handleRemoveBtnClickBuilder(item.Id)}>
                                            <ActionDelete />
                                        </FloatingActionButton>

                                    </TableRowColumn>
                                </TableRow>
                            );
                        }

                    })}

                </TableBody>

            </Table>
        );
    }
}