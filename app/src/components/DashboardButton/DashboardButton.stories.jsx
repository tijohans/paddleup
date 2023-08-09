// DashboardButton.stories.js|jsx

import DashboardButton from './DashboardButton'

//👇 This default export determines where your story goes in the story list

const testFunction = () => {
    alert('Test')
}

export default {
    title: 'Components/DashboardButton',
    component: DashboardButton,
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
        variant: {
            description:
                'Change the color variant of the button. Takes values from 1-6. If the value is unspecified, or out of range - the color will be grey.',
            type: 'number'
        },
        icon: {
            description: 'Link to icon to be shown next to button, preferrably a svg file.',
            type: 'string'
        },
        size: {
            description: 'Default size is small, input "large" to get a large button.',
            type: 'string'
        },
        disabled: {
            description:
                'Disables the link / function connected to the button, makes it unclickable and sets the text to a question mark.',
            type: 'boolean'
        }
    }
}

export const Default = {
    argTypes: { variant: { control: 'select', options: [1, 2, 3, 4, 5, 6] } },
    args: {
        children: 'Players',
        link: '/players',
        variant: 5,
        icon: '/icons/players_icon.svg',
        size: '',
        disabled: false
    }
}

export const Large = {
    args: {
        children: 'Play a match',
        onClick: { testFunction },
        variant: 1,
        icon: '/icons/match_icon.svg',
        size: 'large',
        disabled: false
    }
}

export const Disabled = {
    args: {
        children: 'Leaderboard',
        icon: '/icons/leaderboard_icon.svg',
        disabled: true
    }
}
