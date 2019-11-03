import React, { useEffect, useReducer, Fragment, useCallback } from 'react'
import Page404 from './Page404'

const stateInitialValue = { App: () => 'Загрузка...', Layout: Fragment, layoutProps: {} }


async function getLayoutPropsFromModule(module) {

    const summaryLayoutProps = module.layoutProps || {}
    const asyncLayoutProps = module.asyncLayoutProps || {}
    const funcLayoutProps = module.funcLayoutProps || {}

    for (const [propName, propValue] of Object.entries(asyncLayoutProps)) {

        if (typeof propValue !== 'function') throw new Error('Значения полей asyncLayoutProps должны быть асинхронными функциями')

        summaryLayoutProps[propName] = await propValue()
    }

    for (const [propName, propValue] of Object.entries(funcLayoutProps)) {

        if (typeof propValue !== 'function') throw new Error('Значения полей funcLayoutProps должны быть функциями')

        summaryLayoutProps[propName] = propValue(summaryLayoutProps)
    }

    return summaryLayoutProps

}

class InvalidAppModuleError extends Error { }


export default function AppRouter({ setError, appName }) {

    const [{ App, Layout, layoutProps }, setState] = useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        stateInitialValue
    )

    const setLayoutProps = useCallback((layoutProps) => setState({ layoutProps }), [setState])

    useEffect(() => {
        (async () => {
            try {

                let appModule = await import(`/apps/${appName}/index.js`)

                let layoutProps = await getLayoutPropsFromModule(appModule)

                if (!appModule.default && !appModule.getAppPage) throw new InvalidAppModuleError('Модуль приложения должен экспортировать либо компонент (экспорт по умолчанию), либо функцию getPageApp (именованный экспорт)')


                if (appModule.getAppPage) {
                    let pageModule = appModule.getAppPage()

                    if (pageModule.then) pageModule = await pageModule

                    if (!pageModule.default) throw new InvalidAppModuleError('Модуль страницы приложения должен экспортировать компонент (экспорт по умолчанию)')

                    const pageLayoutProps = await getLayoutPropsFromModule(pageModule)

                    if (pageModule.Layout) appModule.Layout = pageModule.Layout
                    layoutProps = Object.assign({}, layoutProps, pageLayoutProps)

                    appModule.default = pageModule.default
                }

                if (appModule.Layout) {
                    setState({ App: appModule.default, Layout: appModule.Layout, layoutProps })
                } else if (Layout) {
                    setState({ ...stateInitialValue, App: appModule.default, })
                }

            } catch (err) {
                if (err instanceof InvalidAppModuleError) {
                    setError(err.message)
                } else {
                    setState({ App: Page404, Layout: Fragment, layoutProps: {} })
                }
            }
        })()


    }, [location.pathname])

    if (Layout !== Fragment) layoutProps['setError'] = setError

    return (
        <Layout {...layoutProps}>
            <App setError={setError} appName={appName} setLayoutProps={setLayoutProps} />
        </Layout>
    )
}