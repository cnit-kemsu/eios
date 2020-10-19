import React from 'react'
import { FloatingActionButton, RaisedButton, MenuItem, DropDownMenu } from 'material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import { NavigationArrowDropRight } from 'material-ui/svg-icons'
import { css } from 'react-emotion'

import { fetchDevApi as fetchApi } from 'public/utils/api'

import Loading from '../Loading'


const rootCss = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 300px;
    
`

const navItemCss = css`    
    &:active, &:visited {
        color: black;
    }
`

export default function NameBindingForm({ auditoryId }) {

    const [parent, setParent] = React.useState(null)
    const [names, setNames] = React.useState([])
    const [bindings, setBindings] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    const parents = React.useRef([])

    React.useEffect(() => {

        (async () => {

            setLoading(true)

            try {
                const response = await fetchApi(`auditory/name?parentId=${(parent && parent.Id) || 'null'}`, { method: "get" }, true, true)


                setNames((await response.json()).result)
            } catch (err) {
                console.error(err)
            }

            setLoading(false)

        })()

    }, [parent && parent.Id])

    React.useEffect(() => {
        updateNameBindingList()
    }, [])

    async function updateNameBindingList() {

        try {

            const response = await fetchApi(`auditory/${auditoryId}/name`, { method: "get" }, true, true)
            const bindings = await response.json()            
            setBindings(bindings)

        } catch (err) {
            console.error(err)
        }

    }

    function checkInBindingList(id) {
        return bindings.some(({ Id }) => id === Id)
    }


    if (loading) return <Loading />

    return (
        <div>

            <h3>Существующие привязки</h3>

            {bindings.length > 0 ? bindings.map(({ Id, Name }, i) => (<React.Fragment key={i}>
                {i > 0 ? <hr /> : null}
                <div className={rootCss}>
                    <span style={{ marginRight: "8px" }}>{Name}</span>
                    <FloatingActionButton title="Удалить привязку" mini={true} secondary onClick={async () => {
                        try {
                            await fetchApi(`auditory/${auditoryId}/name/${Id}`, { method: "delete" }, true, true)
                            await updateNameBindingList()

                        } catch (err) {
                            console.error(err)
                        }
                    }}><ActionDelete /></FloatingActionButton>

                </div>


            </React.Fragment>)) : <i>- Привязки отсутствуют -</i>}

            <br />

            <h3>Создание привязки</h3>

            <br />

            <a className={navItemCss} href="" onClick={(e) => { e.preventDefault(); parents.current = []; setParent(null) }}>Наименования</a>
            {parents.current.map((p, i) => <React.Fragment><span> / </span><a className={navItemCss} href="" onClick={(e) => { e.preventDefault(); parents.current = parents.current.slice(0, i + 1); setParent(p); }}>{p.Name}</a></React.Fragment>)}

            <br /> <br />

            {names.map((nameItem, i) => {

                const inBindingList = checkInBindingList(nameItem.Id)

                return (<React.Fragment key={i}>
                    {i > 0 ? <hr /> : null}
                    <div className={rootCss}>
                        <span style={{ marginRight: "8px" }}>{nameItem.Name}</span>
                        <FloatingActionButton title={nameItem.ChildCount > 0 ? "Перейти к дочерним элементам" : (inBindingList ? "Удалить привязку" : "Создать привязку")} secondary={inBindingList} onClick={async () => {

                            if (nameItem.ChildCount > 0) {
                                setParent(nameItem)
                                parents.current.push(nameItem)
                            } else {

                                try {

                                    await fetchApi(`auditory/${auditoryId}/name/${nameItem.Id}`, { method: inBindingList ? "delete" : "post" }, true, true)
                                    await updateNameBindingList()

                                } catch (err) {
                                    console.error(err)
                                }
                            }


                        }} mini={true}>{nameItem.ChildCount === 0 ? (inBindingList ? <ActionDelete /> : <ContentAdd />) : <NavigationArrowDropRight />}</FloatingActionButton>
                    </div>
                </React.Fragment>)
            })}
        </div>
    )

}