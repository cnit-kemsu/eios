import React from 'react'

import { rootCss } from './style'

export default function AppContent({ children }) {
    return (
        <main css={rootCss}>{children}</main>
    )
}