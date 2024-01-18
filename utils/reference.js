
function generateReference() {
    // Use a library or your own logic to generate a unique reference
    const timestamp = new Date().getTime();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const reference = `REF_${timestamp}_${randomSuffix}`;
    console.log(reference)
    return reference;
}