import React, { useEffect, useReducer, Fragment, useCallback } from 'react'
import Page404 from './Page404'

const stateInitialValue = { App: () => 'Загрузка...', Layout: Fragment, layoutProps: {} }


async function getLayoutPropsFromModule(module, forceUpdate) {

    const summaryLayoutProps = module.layoutProps || {}
    const funcLayoutProps = module.funcLayoutProps || {}

    for (const [propName, propValue] of Object.entries(funcLayoutProps)) {

        if (typeof propValue !== 'function') throw new Error('Значения полей funcLayoutProps должны быть функциями')

        let result = propValue(summaryLayoutProps, forceUpdate)

        if (result?.then) result = await result

        summaryLayoutProps[propName] = result
    }

    return summaryLayoutProps

}

class InvalidAppModuleError extends Error { }


export default function AppRouter({ setError, appName }) {

    const [{ App, Layout, layoutProps }, setState] = useReducer(
        (prevState, newState) => ({ ...prevState, ...newState }),
        stateInitialValue
    )

    const [forceUpdateState, forceUpdate] = useReducer(() => ({}))

    const setLayoutProps = useCallback((layoutProps) => setState({ layoutProps }), [setState])

    useEffect(() => {
        (async () => {
            try {

                // импортируем модуль приложения
                let appModule = await import(
                    /* webpackMode: "lazy-once" */
                    /* webpackChunkName: "apps" */
                    `../apps/${appName}/index.js`
                )

                // при наличии, считываем свойства макета из модуля
                let layoutProps = await getLayoutPropsFromModule(appModule, forceUpdate)

                // если была экспортирована функция appGenerator, загружаем с ее помощью модуль приложения
                if (appModule.appGenerator) {

                    let pageModule = appModule.appGenerator()
                    // функция может быть асинхронной
                    if (pageModule.then) pageModule = await pageModule

                    // загружаем свойства макета, если они есть
                    const pageLayoutProps = await getLayoutPropsFromModule(pageModule, forceUpdate)

                    // сам макет
                    if (pageModule.Layout) appModule.Layout = pageModule.Layout

                    layoutProps = Object.assign({}, layoutProps, pageLayoutProps)
                    appModule.default = pageModule.default || pageModule.Page
                }

                if (!appModule.default && !appModule.App && !appModule.Page) throw new InvalidAppModuleError('Модуль приложения (страницы) должен содержать компонент, экспортированный по умолчанию или с помощью именованного экспорта с именем App или Page')

                if (appModule.Layout) {
                    setState({ App: appModule.default || appModule.App || !appModule.Page, Layout: appModule.Layout, layoutProps })
                } else if (Layout) {
                    setState({ ...stateInitialValue, App: appModule.default || appModule.App || !appModule.Page })
                }

            } catch (err) {
                if (err.code === 'MODULE_NOT_FOUND') {
                    setState({ App: Page404, Layout: Fragment, layoutProps: {} })
                } else {
                    setError(err.message)
                }
            }
        })()


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, forceUpdateState, setState, Layout, appName, setError])

    if (Layout !== Fragment) layoutProps['setError'] = setError

    return (
        <Layout {...layoutProps}>
            <App forceUpdateApp={forceUpdate} setError={setError} appName={appName} setLayoutProps={setLayoutProps} />
        </Layout>
    )
}