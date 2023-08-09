/** @type { import('@storybook/react').Preview } */

// Import PicoCSS & custom theme to Storybook preview
import '@picocss/pico'
import '../src/style/theme.css'

const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        }
    }
}

// ! Support for react-router in Storybook
// ! Source: https://stackoverflow.com/questions/58909666/storybook-w-react-router-you-should-not-use-link-outside-router
import { MemoryRouter } from 'react-router'

export const decorators = [
    (Story) => (
        <MemoryRouter initialEntries={['/']}>
            <Story />
        </MemoryRouter>
    )
]

export default preview
