// const ipfsClient = require("ipfs-http-client");
// const fs = require("fs");
// //const migrateEntries = require('./selected-entries.json');
//
// const encoding = { format: 'dag-cbor', hashAlg: 'sha3-512', pin: true };
//
// // const migrateEntries = require('./selected-profiles-entries.json');
//
// const ProfileProvider = 'akasha-legacy';
// const ipfs = ipfsClient("https://ipfs.infura.io:5001/api/v0/");
// // const ipfs = ipfsClient("/ip4/127.0.0.1/tcp/5001");
//
// const EXCERPT = 'excerpt';
// const FEATURED_IMAGE = 'featuredImage';
// const CARD_INFO = 'cardInfo';
// const DRAFT_PART = 'draft-part';
// const PREVIOUS_VERSION = 'previous-version';
// const rootProfiles = 'bafyriqdcqf47tfpfipzi2rnkclenzawdltep7qfnweitvz427lwisggjkp77zvfiaixzct7x65w5lidpnqpycwqdhsu3a7jnmmcbhtz4bgsx6';
//
// const fetchObj = async (hash) => {
//   try {
//     return await ipfs.object.get(hash, { timeout: 15000 })
//   }catch (e) {
//     return '';
//   }
// }
//
// const fetchLinks = async (hash) => {
//   try {
//     const data =  await ipfs.object.get(hash, { timeout: 15000 })
//     return data.Links;
//   }catch (e) {
//     return '';
//   }
// }
//
// const pinData = async (hash) => {
//   try {
//     await ipfs.pin.add(hash, { timeout: 10000, recursive: true })
//     return true;
//   }catch (e) {
//     return false;
//   }
// }
//
// const buildLinks = async (links, accumulator) => {
//   if(!links.length) return '';
//
//   for(const link of links) {
//     if(!link.Name) continue;
//     const data = await fetchObj(link.Hash)
//     if(!data) continue;
//     let currentHash= new ipfsClient.CID(link.Hash);
//
//     if (link.Name === FEATURED_IMAGE) {
//       const backData = Buffer.from(data.Data).toString();
//       try {
//         const dataObj = JSON.parse(backData);
//         for(const key of Object.keys(dataObj)) {
//           if(dataObj[key].hasOwnProperty("src")){
//             const dataImg = await fetchObj(dataObj[key].src);
//             const isPinned = await pinData(dataObj[key].src);
//             if(dataImg && isPinned) {
//               dataObj[key].src = new ipfsClient.CID(dataObj[key].src);
//               dataObj[key] = await ipfs.dag.put(dataObj[key], encoding);
//             }else {
//               delete dataObj[key];
//             }
//
//           }
//         }
//         currentHash = await ipfs.dag.put(dataObj, encoding);
//       }catch (e){
//
//       }
//     }
//
//     const isPinned = await pinData(currentHash);
//
//     if(!isPinned){
//       continue;
//     }
//
//     const currentObj = {[link.Name]: currentHash};
//
//     if(!accumulator.hasOwnProperty(link.Name)){
//       Object.assign(accumulator, currentObj);
//     }
//     await buildLinks(data.Links, accumulator);
//   }
//   return accumulator;
// }
//
// async function main () {
//   const totalPosts = [];
//   const totalProfiles = [];
//   const encoding = { format: 'dag-cbor', hashAlg: 'sha3-512', pin: true };
//   let prev = null;
//   const notfoundEntries = [];
//   const notfoundProfiles = [];
//   const profileIndex = {};
//   const entriesIndex = {};
//   const profileEntriesIndex = {};
//   const finalEntries = {"totalPostsCid":"bafyriqer5jri6mpbidxbiyn4sydkzdz7jodgf5cfs72zrforfrz72bvnfp6ryo4nrur5ppwv2zw5jrxdqg7yhocvuwoa5kxxhbk7cxwaatyok","lastEntry":"bafyriqhufacbyvbvvpl5e2m7guxy3f25qscuejnd6lr3rgbo5cdtsg4bsplou4k33mrrv2nfgritzjm6dxd3iq6shnw56z3lseombgi4xdg2y","indexEntries":"bafyriqgg6bguwijplfpswclsgidwijn6aquc7rhb7udmsbrbmaryup4suebu6imqowmc4bqpefmzmezmj4biahmsmennmfm2s46mo4xcstdda","profileEntriesIndex":"bafyriqhmzcqo7qj65yz37ni2nhdymh66pyseibjyievupafbjgwgohdtoik3c7p27txyr7kkurmrck4e2p5vhkywfqkr45nfcrun7q46uviq6"}
//   const finalProfiles = {"totalProfilesCID":"bafyriqhrspd6flvqcayxspsltqgip7x4pjjnbnejpikdyv2kjffvtocc4gwxwz3ektdkr3onpebemlijwwulbbhk7g2fpvev5t3ci6phb7he4","indexProfiles":"bafyriqagpl5kghrigrwbxiaqkrvxbqd5v46qkpqg4abgksmexei4v2xzycptc2tjccgdp4pds5fld7disgvlzzfigv755gaowdjtvukyjluhk"}
//   const mergedObj = Object.assign({}, finalEntries, finalProfiles);
//   const finalObj = {};
//   for(const key of Object.keys(mergedObj)){
//     const tmpObj = {[key]: new ipfsClient.CID(mergedObj[key])}
//     Object.assign(finalObj, tmpObj);
//   }
//   console.log(finalObj);
//   const finalCID = await ipfs.dag.put(finalObj, encoding);
//   console.log('FINAL CID', finalCID);
//   // for (const entry of migrateEntries) {
//   //   try {
//   //     const q = await fetchObj(entry.ipfsHash);
//   //     let final;
//   //
//   //     if(!q) {
//   //       console.log('skip', entry.ipfsHash);
//   //       continue;
//   //     }
//   //     const links = await fetchLinks(entry.ipfsHash);
//   //     final = await buildLinks(links, {});
//   //
//   //     if(!Object.keys(final).length) {
//   //       console.log(`skip no links ${entry.ipfsHash}`, final );
//   //       continue;
//   //     }
//   //
//   //     const fetched = Object.assign({}, {
//   //       data: q.Data,
//   //       id: entry.id,
//   //       author: entry.author
//   //     }, final);
//   //     const fetchedFinal = await ipfs.dag.put(fetched, encoding);
//   //     const entryLd = { record: fetchedFinal, prev };
//   //     const cidEntry = await ipfs.dag.put(
//   //       entryLd,
//   //       encoding
//   //     )
//   //     totalPosts.push(cidEntry);
//   //     Object.assign(entriesIndex, {[entry.id]: cidEntry})
//   //     if(!profileEntriesIndex.hasOwnProperty(entry.author)){
//   //       Object.assign(profileEntriesIndex, {[entry.author]: {}})
//   //     }
//   //     Object.assign(profileEntriesIndex[entry.author], {[entry.id]: cidEntry})
//   //     prev = cidEntry;
//   //     console.log('linked entry', prev)
//   //
//   //   }catch (err){
//   //     console.log('not found Entry######', entry.ipfsHash)
//   //   }
//   // }
//   // const indexEntriesCID = await ipfs.dag.put(entriesIndex, encoding);
//   // const totalPostsCID = await ipfs.dag.put(totalPosts, encoding);
//   // const profileEntriesIndexCID = await ipfs.dag.put(profileEntriesIndex, encoding);
//   // fs.writeFileSync('./stored-profiles-slingshot.json',
//   //   JSON.stringify(
//   //     {
//   //       totalPostsCid: totalPostsCID.toString(),
//   //       lastEntry: prev.toString(),
//   //       indexEntries: indexEntriesCID.toString(),
//   //       profileEntriesIndex: profileEntriesIndexCID.toString()
//   //     }))
// }
//
// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
