export default async function upload(
  data: {
    content: Buffer | ArrayBuffer | string | any;
    isUrl?: boolean;
  }[],
  ipfs: { getUtils: any; getInstance: any },
  log: any,
) {
  const source = [];
  const result = [];
  const instance = await ipfs.getInstance();
  const { urlSource } = await ipfs.getUtils();
  for (const entryData of data) {
    if (entryData.isUrl && typeof entryData.content === 'string') {
      for await (const content of urlSource(entryData.content)) {
        source.push(content);
      }
    } else {
      source.push(entryData.content);
    }
  }

  for await (const entry of instance.add(source)) {
    log.info({ entry, msg: 'uploaded on ipfs' });
    result.push(entry.cid.toBaseEncodedString());
  }
  return result;
}
