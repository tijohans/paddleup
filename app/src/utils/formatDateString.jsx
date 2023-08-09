/* 
    Helper function for formatting the date;
    Takes in the date from the database and formats it "human-readable" format
    
    e.g. 
        input   2023-04-22T17:43:55.456+00:00
        output  lør. 22. apr. 2023
*/
export const formatDateString = (date) => {
    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }

    return date.toLocaleString('en-UK', options)
}
