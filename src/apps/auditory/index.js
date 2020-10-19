import React from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { Tabs, Tab } from 'material-ui/Tabs'
import { Paper } from 'material-ui'
import AppBar from 'material-ui/AppBar'

import { red500, indigo500 } from 'material-ui/styles/colors'

import { fetchDevApi as fetchApi, isAccessTokenValid} from 'share/utils'




import Auditory from './auditory/Auditory'
import Building from './building/Building'
import DistanceMatrix from './distanceMatrix/DistanceMatrix'
import Software from './software/Software'


export default class App extends React.Component {

    state = {
        distanceList: [],
        auditoryList: [],
        auditoryTypeList: [],
        buildingList: [],
        buildingTypeList: [],
        softwareList: [],
        nameList: [],
        equipmentList: [],
        softwareLicenseList: [],
        init: false,
        loading: true,
        curTab: localStorage.getItem("auditory.tab") || 'auditory'
    }

    async componentDidMount() {

        try {

            let auditoryTypeList = await (await fetchApi('auditory/type', null, true, true)).json()
            let buildingList = await (await fetchApi("auditory/building", null, true, true)).json()
            let buildingTypeList = await (await fetchApi("auditory/building/type", null, true, true)).json()
            let distanceList = await (await fetchApi("auditory/building/distance", null, true, true)).json()
            let softwareList = await (await fetchApi("auditory/software", null, true, true)).json()
            let nameList = await (await fetchApi("auditory/name", null, true, true)).json()
            let equipmentList = await (await fetchApi("auditory/equipment", null, true, true)).json()
            let softwareLicenseList = await (await fetchApi("auditory/software-license", null, true, true)).json()            

            this.setState({
                distanceList: distanceList.result,
                auditoryTypeList: auditoryTypeList.result,
                buildingList: buildingList.result,
                buildingTypeList: buildingTypeList.result,
                softwareList: softwareList.result,
                nameList: nameList.result,
                equipmentList: equipmentList.result,
                softwareLicenseList: softwareLicenseList.result,
                loading: false
            })

        } catch (err) {
            console.error(err)
        }
    }

    updateAuditoryList = async (buildingId, typeId = "", name = "") => {

        this.setState({
            auditoryList: [],
            loading: true
        })

        let auditoryList = await fetchApi(`auditory?buildingId=${buildingId}&typeId=${typeId}&name=${name}`, { toJSON: true })

        this.setState({
            auditoryList: auditoryList.result,
            loading: false
        })
    }

    updateBuildingList = async () => {

        this.setState({
            buildingList: []
        });

        let buildingList = await fetchApi("auditory/building", { toJSON: true });

        this.setState({
            buildingList: buildingList.result
        });
    }

    updateDistanceList = async () => {

        this.setState({
            distanceList: []
        });

        let distanceList = await fetchApi("auditory/building/distance", { toJSON: true });

        this.setState({
            distanceList: distanceList.result
        });
    }

    updateSoftwareList = async () => {
        this.setState({ softwareList: [] })
        let softwareList = await fetchApi("auditory/software", { toJSON: true })
        this.setState({ softwareList: softwareList.result || [] })
    }    

    handleChangeTab = (value) => {
        localStorage.setItem("auditory.tab", value)
        this.setState({ curTab: value })
    }

    render() {

        return (
            <MuiThemeProvider muiTheme={getMuiTheme({
                palette: {
                    primary1Color: indigo500,
                    accent11Color: red500
                }
            })}>
                <React.Fragment>
                    <AppBar showMenuIconButton={false} title="Аудитории" />
                    {isAccessTokenValid() ?
                        (<Tabs value={this.state.curTab} onChange={this.handleChangeTab}>
                            <Tab label="Аудитории" value="auditory">
                                <Auditory softwareList={this.state.softwareList}  nameList={this.state.nameList} equipmentList={this.state.equipmentList}
                                loading={this.state.loading} updateAuditoryList={this.updateAuditoryList} auditoryList={this.state.auditoryList} auditoryTypeList={this.state.auditoryTypeList} buildingList={this.state.buildingList} />
                            </Tab>
                            <Tab label="Корпуса" value="buildings">
                                <Building loading={this.state.loading} updateBuildingList={this.updateBuildingList} buildingList={this.state.buildingList} buildingTypeList={this.state.buildingTypeList} />
                            </Tab>
                            <Tab label="Матрица расстояний" value="distanceMatrix">
                                <DistanceMatrix loading={this.state.loading} updateDistanceList={this.updateDistanceList} buildingList={this.state.buildingList} distanceList={this.state.distanceList} />
                            </Tab>
                            <Tab label="Программное обеспечение" value="software">
                                <Software setError={this.props.setError} loading={this.state.loading} softwareList={this.state.softwareList} softwareLicenseList={this.state.softwareLicenseList} updateSoftwareList={this.updateSoftwareList} />
                            </Tab>
                        </Tabs>) : (
                            <React.Fragment>
                                <br />
                                <Paper style={{ marginLeft: "15%", marginRight: "15%", padding: "8px"  }}>
                                    <h2 style={{ textAlign: "center" }}>
                                        Вы не авторизованы! Необходимо выполнить <a href="/a/eios?backUrl=@/a/auditory">вход</a> в систему.
                                    </h2>
                                </Paper>
                            </React.Fragment>
                        )
                    }
                </React.Fragment>
            </MuiThemeProvider>
        )
    }
}