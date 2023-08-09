// Helper function for returning a color based on the palette for the project

export const getColorVariant = (variant) => {
    switch (variant) {
        case 1:
            return '#2EC4B6' // Green
        case 2:
            return '#FF3366' // Red
        case 3:
            return '#20A4F3' // Blue
        case 4:
            return '#FBAF00' // Yellow
        case 5:
            return '#FFC4EB' // Pink
        default:
            return 'grey' // Default
    }
}
