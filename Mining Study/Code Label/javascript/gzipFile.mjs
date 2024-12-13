import {createReadStream, createWriteStream} from 'fs';
import {createGzip} from 'zlib';
import {pipeline} from 'stream/promises';

//generated by ChatGPT
async function gzipFile(inputFilePath, outputFilePath) {
    try {
        const readStream = createReadStream(inputFilePath);
        const gzipStream = createGzip();
        const writeStream = createWriteStream(outputFilePath);

        await pipeline(
            readStream,  // Read from the input file
            gzipStream,  // Compress with gzip
            writeStream  // Write to the output file
        );

        console.log(`File '${inputFilePath}' has been gzipped and saved as '${outputFilePath}'.`);
    } catch (err) {
        console.error('An error occurred:', err);
    }
}

const inputFilePath = 'combined.json';
const outputFilePath = 'officers.gz';

await gzipFile(inputFilePath, outputFilePath);
