import Button from '../Button/Button'

const testFunction = () => {
    alert('test')
}

export default {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        children: {
            description: 'Usually the text to display.'
        },
        link: {
            description:
                'Link to navigate to, relative to the page. Works only if onClick is not defined.',
            type: 'string'
        },
        onClick: {
            description: 'Function to execute when clicking. Overwrites link.',
            type: 'object',
            defaultValue: { testFunction }
        },
        disabled: {
            description:
                'Disables the link / function connected to the button, makes it unclickable and sets the text to a question mark.',
            type: 'boolean'
        }
    }
}

export const Default = {
    argTypes: { variant: { control: 'select' } },
    args: {
        children: 'Link',
        link: '/players',
        disabled: false
    }
}

export const Large = {
    args: {
        children: 'Login',
        link: '/login',
        disabled: false
    }
}

export const Disabled = {
    args: {
        children: 'Disabled',
        disabled: true
    }
}
