import React from 'react'

import { useFadeTransition } from '../../hooks'

import { rootCss, fadeInCss, fadeOutCss } from './style'

export default function AppContent({ children }) {

    const contentTransitionProps = useFadeTransition(children, fadeInCss, fadeOutCss, rootCss)

    return (
        <main {...contentTransitionProps} />
    )
}