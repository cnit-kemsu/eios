import React from 'react'
import RefreshIndicator from 'material-ui/RefreshIndicator'

const Loading = () => (
    <div style={{
        position: "relative",
        textAlign: "center"
    }}>
        <RefreshIndicator
            size={100}
            status="loading"
            left={0}
            top={0}
            style={{
                position: "relative",
                display: "inline-block",
                marginTop: "12px"
            }}
        />
    </div>
)

export default Loading