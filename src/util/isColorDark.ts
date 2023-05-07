import pSBC from "shade-blend-color";

export function isColorDark(color: string): boolean {
    const hexColor = color[0] === "#" ?
        pSBC(0, color):
        pSBC(0, color, "c");

    // all credits to https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
    const c = hexColor.substring(1, 7);
    const rgb = parseInt(c, 16);
    const red = (rgb >> 16) & 0xff;
    const green = (rgb >> 8) & 0xff;
    const blue = (rgb >> 0) & 0xff;

    const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

    return luma < 40;
}