// TableButton.stories.js|jsx

import TableButton from './TableButton'

export default {
    title: 'Components/TableButton',
    component: TableButton
}

const testFunction = () => {
    alert('Test')
}

export const DefaultWithLink = {
    args: {
        children: 'Edit user',
        link: '/edit'
    }
}

export const DefaultWithFunction = {
    args: {
        children: 'Do a function',
        onClick: { testFunction }
    }
}
