// DashboardButton.stories.js|jsx
import LoadingOverlay from './LoadingOverlay'

export default {
    title: 'utils/LoadingOverlay',
    component: LoadingOverlay,
    argTypes: {
        children: {
            description: 'Text to display when you want to tell the user what is loading'
        }
    }
}

export const Default = {
    args: {
        children: ''
    }
}

export const withText = {
    args: {
        children: 'Trying to join match'
    }
}
