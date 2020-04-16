export default async function upload(
  content: Buffer | ArrayBuffer | string,
  ipfs: { getUtils: any; getInstance: any },
  isUrl: boolean = false,
  log: any,
) {
  let source;
  let result;
  const instance = await ipfs.getInstance();
  if (isUrl && typeof content === 'string') {
    const { urlSource } = await ipfs.getUtils();
    source = urlSource(content);
  } else {
    source = content;
  }
  for await (const entry of instance.add(source)) {
    log.info({ entry, msg: 'uploaded on ipfs' });
    result = entry.cid.toBaseEncodedString();
  }
  return result;
}
