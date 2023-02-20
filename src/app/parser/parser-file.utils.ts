import { fromError } from '@rabo/utils/error';

export function readFileToString(file: File) {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = (error) => {
            reject(fromError(error, 'Error parsing XML statement file'));
        };
        reader.readAsText(file);
    });
}
