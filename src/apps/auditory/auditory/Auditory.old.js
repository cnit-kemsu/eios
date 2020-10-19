import React from 'react';
import { fetchDevApi as fetchApi } from 'public/utils/api'

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
import RaisedButton from 'material-ui/RaisedButton';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionDone from 'material-ui/svg-icons/action/done';
import ContentUndo from 'material-ui/svg-icons/content/undo';

import Loading from '../Loading'

import _ from 'lodash'


export default class Auditory extends React.Component {

    state = {

        addModeState: true,

        auditoryList: [],
        auditoryTypeList: [],
        buildingList: [],

        buildingId: null,
        typeIdFilter: '',
        nameFilter: '',

        addModeAuditoryTypeId: null,
        addModeBuildingId: null,
        addModeAudName: '',
        addModeCountOfSeats: 0,
        addModeAudArea: 0,

        editModeData: {}
    }

    componentWillReceiveProps(newProps) {

        let state = {};

        if (newProps.auditoryTypeList.length > 0) {
            state.addModeAuditoryTypeId = newProps.auditoryTypeList[0].Id;
        }

        if (!this.state.addModeBuildingId && newProps.buildingList.length > 0) {
            state.addModeBuildingId = newProps.buildingList[0].Id;
        }

        if (state.addModeAuditoryTypeId || state.addModeBuildingId) {
            this.setState(state);
        }

    }

    updateAuditoryList = async () => {

        let auditoryList = await fetchApi("auditory", { toJSON: true, throwError: true })

        this.setState({
            auditoryList: auditoryList.result
        });
    }

    handleChangeAudNameAddMode = (e, value) => this.setState({ addModeAudName: value });
    handleChangeAudAreaAddMode = (e, value) => this.setState({ addModeAudArea: value });
    handleChangeCountOfSeatsAddMode = (e, value) => this.setState({ addModeCountOfSeats: value });
    handleChangeAudTypeAddMode = (e, i, value) => this.setState({ addModeAuditoryTypeId: value });
    handleChangeBuildingAddMode = (e, i, value) => this.setState({ addModeBuildingId: value });

    handleChangeAudNameEditMode = (e, value) => {
        this.state.editModeData.Name = value;
        this.setState({ editModeData: this.state.editModeData });
    }
    handleChangeAudAreaEditMode = (e, value) => {
        this.state.editModeData.Area = value;
        this.setState({ editModeData: this.state.editModeData });
    }
    handleChangeNumberOfSeatsEditMode = (e, value) => {
        this.state.editModeData.NumberOfSeats = value;
        this.setState({ editModeData: this.state.editModeData });
    }
    handleChangeAudTypeEditMode = (e, i, value) => {
        this.state.editModeData.Type = value;
        this.setState({ editModeData: this.state.editModeData });
    }
    handleChangeBuildingEditMode = (e, i, value) => {
        this.state.editModeData.Building = value;
        this.setState({ editModeData: this.state.editModeData });
    }

    handleClickAddMode = async () => {

        let { addModeAuditoryTypeId, addModeBuildingId,
            addModeAudName, addModeCountOfSeats, addModeAudArea } = this.state;

        if (addModeAuditoryTypeId && addModeBuildingId &&
            addModeAudName) {

            this.setState({
                addModeState: false
            });

            try {

                await fetchApi("auditory", {
                    method: "post",
                    body: JSON.stringify({
                        name: addModeAudName,
                        typeId: addModeAuditoryTypeId,
                        buildingId: addModeBuildingId,
                        area: addModeAudArea,
                        numberOfSeats: addModeCountOfSeats
                    })
                }, true, true);

                await this.props.updateAuditoryList(this.state.addModeBuildingId, this.state.typeIdFilter);

            } catch (err) {

                let result = await err.json()

                if (!result.success && result.error === "Auditory already exists.") {
                    alert("Аудитория с таким номером (названием) уже существует.");
                } else {
                    alert(result.error || result.message)
                }

            } finally {
                this.setState({
                    addModeState: true
                });
            }

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

            if (!confirm('Вы уверены, что хотите удалить данные по выбранной аудитории?')) {
                return
            }

            try {
                await fetchApi("auditory/" + id, {
                    method: "delete",
                    throwError: true
                })

                await this.props.updateAuditoryList(this.state.addModeBuildingId, this.state.typeIdFilter)

            } catch (err) {
                let json = await err.json()
                alert(json.error || json.message)
            }
        }
    }

    handleClickAcceptEdit = async () => {

        try {

            let data = this.state.editModeData;

            await fetchApi("auditory/" + data.Id, {
                method: "post",
                body: JSON.stringify({
                    name: data.Name,
                    typeId: data.Type,
                    buildingId: data.Building,
                    area: data.Area,
                    numberOfSeats: data.NumberOfSeats
                }),
                throwError: true
            })

            this.setState({
                editModeData: {}
            })

            await this.props.updateAuditoryList(this.state.addModeBuildingId, this.state.typeIdFilter)

        } catch (err) {
            let json = await err.json()
            alert(json.error || json.message)
        }
    }

    handleClickCancelEdit = () => {
        this.setState({
            editModeData: {}
        })
    }

    handleClickChooseBuilding = () => {

        this.setState({
            buildingId: this.state.addModeBuildingId
        })

        this.props.updateAuditoryList(this.state.addModeBuildingId, this.state.typeIdFilter)
    }

    handleChangeTypeFilter = async (e) => {

        this.setState({ typeIdFilter: e.target.value });
        await this.props.updateAuditoryList(this.state.addModeBuildingId, e.target.value, this.state.nameFilter);
    }

    applyAudNameFilter = _.debounce((buildingId, typeId, name) => {

        this.setState({ nameFilter: name });
        this.props.updateAuditoryList(buildingId, typeId, name);

    }, 1000)

    hanldeAudNameFilter = (e) => {
        this.applyAudNameFilter(this.state.addModeBuildingId, this.state.typeIdFilter, e.target.value);
    }

    render() {

        return this.props.buildingList.length > 0 ? (
            <div style={{ width: "70%", marginLeft: "15%" }}>

                <br />

                <p>Выберите корпус:</p>

                <SelectField style={{ fontSize: "13px" }} value={this.state.addModeBuildingId} onChange={this.handleChangeBuildingAddMode}>
                    {this.props.buildingList.map((item) => {
                        return <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />
                    })}
                </SelectField>

                <br />

                <RaisedButton label="Выбрать корпус" onClick={this.handleClickChooseBuilding} />

                <br />

                {this.state.buildingId && (
                    [<Table key="header" selectable={false}>

                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Номер (название): <input placeholder="Фильтр" onChange={this.hanldeAudNameFilter} /></TableHeaderColumn>
                                <TableHeaderColumn>
                                    <select style={{ width: "100%" }} onChange={this.handleChangeTypeFilter}>
                                        <option value="">Тип: Все</option>
                                        {this.props.auditoryTypeList.map((item) => {
                                            return <option key={item.Id} value={item.Id}>Тип: {item.Name}</option>
                                        })}
                                    </select>
                                </TableHeaderColumn>
                                <TableHeaderColumn>Площадь (м<sup>2</sup>)</TableHeaderColumn>
                                <TableHeaderColumn>Количество мест</TableHeaderColumn>
                                <TableHeaderColumn></TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                    </Table>,
                    <Table key="add" selectable={false}>
                        <TableBody displayRowCheckbox={false}>
                            <TableRow>
                                <TableRowColumn>
                                    <TextField value={this.state.addModeAudName} onChange={this.handleChangeAudNameAddMode} inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} />
                                </TableRowColumn>

                                <TableRowColumn>
                                    <SelectField style={{ fontSize: "13px" }} value={this.state.addModeAuditoryTypeId} onChange={this.handleChangeAudTypeAddMode}>
                                        {this.props.auditoryTypeList.map((item) => {
                                            return <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />
                                        })}
                                    </SelectField>
                                </TableRowColumn>

                                <TableRowColumn>
                                    <TextField min={0} value={this.state.addModeAudArea} onChange={this.handleChangeAudAreaAddMode} type="number" inputStyle={{ height: "auto", fontSize: "13px" }} style={{ height: "36px" }} />
                                </TableRowColumn>

                                <TableRowColumn>
                                    <TextField min={0} value={this.state.addModeCountOfSeats} onChange={this.handleChangeCountOfSeatsAddMode} type="number" inputStyle={{ height: "auto", fontSize: "13px" }} style={{ height: "36px" }} />
                                </TableRowColumn>

                                <TableRowColumn style={{ textAlign: "center" }}>
                                    <FloatingActionButton title="Добавить аудиторию" disabled={!this.state.addModeState} mini={true} secondary={false} onClick={this.handleClickAddMode}>
                                        <ContentAdd />
                                    </FloatingActionButton>
                                </TableRowColumn>

                            </TableRow>
                        </TableBody>
                    </Table>,
                    !this.props.loading ?
                        (<Table key="data" selectable={false} height="600px">
                            <TableBody displayRowCheckbox={false}>
                                {this.props.auditoryList && this.props.auditoryList.map((item) => {

                                    if (this.state.editModeData.Id == item.Id) {
                                        return (
                                            <TableRow key={item.Id}>
                                                <TableRowColumn>
                                                    <TextField inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} value={this.state.editModeData.Name} onChange={this.handleChangeAudNameEditMode} />
                                                </TableRowColumn>

                                                <TableRowColumn>
                                                    <SelectField style={{ fontSize: "13px" }} value={this.state.editModeData.Type} onChange={this.handleChangeAudTypeEditMode}>
                                                        {this.props.auditoryTypeList.map((item) => {
                                                            return <MenuItem key={item.Id} value={item.Id} primaryText={item.Name} />
                                                        })}
                                                    </SelectField>
                                                </TableRowColumn>

                                                <TableRowColumn>
                                                    <TextField type="number" inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} value={this.state.editModeData.Area} onChange={this.handleChangeAudAreaEditMode} />
                                                </TableRowColumn>

                                                <TableRowColumn>
                                                    <TextField type="number" inputStyle={{ height: "auto", width: "100%", fontSize: "13px" }} style={{ height: "36px" }} value={this.state.editModeData.NumberOfSeats} onChange={this.handleChangeNumberOfSeatsEditMode} />
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
                                                <TableRowColumn>{item.Name}</TableRowColumn>
                                                <TableRowColumn>{item.TypeName}</TableRowColumn>
                                                <TableRowColumn>{item.Area}</TableRowColumn>
                                                <TableRowColumn>{item.NumberOfSeats}</TableRowColumn>
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

                        </Table>) : <Loading key="loading" />]
                )}

            </div>
        ) : (
                <Loading />
            );
    }
}