exports.handler = async (event) => {
    console.log("S3 Event: ", JSON.stringify(event, null, 2));
    
    const s3Record = event.Records[0].s3;
    const bucketName = s3Record.bucket.name;
    const objectKey = s3Record.object.key;

    console.log(`A file was uploaded to bucket ${bucketName} with key ${objectKey}`);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `File uploaded to ${bucketName}/${objectKey}`,
        }),
    };
};
