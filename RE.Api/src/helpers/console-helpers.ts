import moment from 'moment/moment';

type sourceKeys = 'Database' | 'Index' | 'Logger';
type colorCodes = '\x1b[31m' | '\x1b[32m' | '\x1b[33m' | '\x1b[0m';

const source: { [key: string]: string } = {
    Database: 'Database',
    Index: 'Index',
    Logger: 'Logger'
};

const getLogMessage = (sourceKey: sourceKeys, message: string, colorCode: colorCodes = '\x1b[0m'): string => {
    const sourceText: string = source[sourceKey];

    // get longest source's text length
    const maxSourceLength: number = Object.keys(source)
        .map(key => source[key].length)
        .sort((a, b) => b - a)[0];

    // calculate number of spaces required for current source to match the longest source's length
    const numberOfPadding: number = maxSourceLength - sourceText.length;

    return `${colorCode}${' '.repeat(numberOfPadding)}[${sourceText}] [${moment().utc().format('DD/MM/YYYY HH:mm:ss A')}] - ${message}${colorCode}`;
};

const logMessage = (sourceKey: sourceKeys, message: string): void => {
    console.log(getLogMessage(sourceKey, message));
};

const logErrorMessage = (sourceKey: sourceKeys, message: string): void => {
    console.log(getLogMessage(sourceKey, message, '\x1b[31m'));
};

const logSuccessMessage = (sourceKey: sourceKeys, message: string): void => {
    console.log(getLogMessage(sourceKey, message, '\x1b[32m'));
};

const logWarningMessage = (sourceKey: sourceKeys, message: string): void => {
    console.log(getLogMessage(sourceKey, message, '\x1b[33m'));
};

export const ConsoleHelpers = {
    logMessage,
    logErrorMessage,
    logSuccessMessage,
    logWarningMessage
};
