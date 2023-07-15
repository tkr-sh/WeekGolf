export const darkenColor = (color: string | undefined, factor: number): string => {

    if (color === undefined) return "#000000";


    // Convert the string color into an array of RGB values
    const rgbArray = color.match(/\w\w/g)?.map((val) => parseInt(val, 16));
  
    if (!rgbArray || rgbArray.length !== 3) {
		// Return the original color if the input is not valid
		return color;
    }
  
    // Darken the RGB values by the factor
    const darkenedRgbArray = rgbArray.map((val) => Math.round(val * (1 - factor)));
  
    // Convert the RGB values back into a string in the #RRGGBB format
    const darkenedColor = darkenedRgbArray.map((val) => val.toString(16).padStart(2, '0')).join('');
  
    return `#${darkenedColor}`;
}
