function range (defaultRange, newColumn, newRow) {
    // ERROR HANDLING: Basic type check for the parameters.

    // Check if the string has at least two characters
    if (defaultRange.length < 2) {
        return defaultRange; // Return the original string if it doesn't
    }

    // Convert the string to an array of characters
    const charArray = defaultRange.split('');

    // Replace the second letter (index 1)
    charArray[0] = newColumn;
    charArray[1] = newRow;

    // Join the array back into a string
    return charArray.join('');
}

export default range