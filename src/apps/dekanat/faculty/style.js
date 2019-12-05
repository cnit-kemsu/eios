import { css } from '@emotion/core'



export const statisticItemCss = css`
    display: flex;
    justify-content: space-between;
    padding: 0px;    
    padding-bottom: 14px;

    &:not(:first-child) {
        padding-top: 14px;
    }

    &:not(:last-child) {
        border-bottom: 1px solid rgb(230, 230, 230);
    }
`
export  const statisticsContainerCss = css`
    display: flex;

    & > * {
        flex: 1 0 auto;
    }
`

export const remindersCss = css`
    display: flex;
    justify-content: center;
`