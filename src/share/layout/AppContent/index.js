import React from 'react'

import { useTransitionFromPrevChildren } from '../../hooks'

import { rootCss, fadeInCss, fadeOutCss } from './style'

export default function AppContent({ children }) {

    const contentTransitionProps = useTransitionFromPrevChildren(children, fadeInCss, fadeOutCss, rootCss)

    return (
        <main {...contentTransitionProps} />
    )
}