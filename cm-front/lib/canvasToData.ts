export function canvasToData(canvas: HTMLCanvasElement, format: 'base64' | 'arraybuffer' = 'base64'): string | ArrayBuffer {
    // Get the canvas data as a data URL
    const dataURL = canvas.toDataURL();

    if (format === 'base64') {
        // Return the base64 string directly
        return dataURL.split(',')[1];
    } else if (format === 'arraybuffer') {
        // Convert base64 to ArrayBuffer
        const base64String = dataURL.split(',')[1];
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < len; i++) {
            view[i] = binaryString.charCodeAt(i);
        }

        return buffer;
    }else {
        return ''
    }
}