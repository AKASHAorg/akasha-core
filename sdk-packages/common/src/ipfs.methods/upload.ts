export const folderPrefix = 'ewa/';
export default async function upload(
  data: {
    content: Buffer | ArrayBuffer | string | any;
    path?: string;
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
        if (entryData.path) {
          content.path = folderPrefix + entryData.path;
        }
        source.push(content);
      }
    } else {
      source.push({ path: folderPrefix + entryData.path, content: entryData.content });
    }
  }

  for await (const entry of instance.addAll(source)) {
    log.info({ entry, msg: 'uploaded on ipfs' });
    result.push(entry.cid.toBaseEncodedString());
  }
  // ignore folder path atm
  result.pop();
  return result;
}
