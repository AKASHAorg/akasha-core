// const ipfsClient = require("ipfs-http-client");
// const fs = require("fs");
// // const migrateEntries = require('./selected-profiles-entries.json');
//
// const encoding = { format: 'dag-cbor', hashAlg: 'sha3-512', pin: true };
//
// // const migrateEntries = require('./selected-profiles-entries.json');
//
// const ProfileProvider = 'akasha-legacy';
// const ipfs = ipfsClient("https://ipfs.infura.io:5001/api/v0/");
// // const ipfs = ipfsClient("/ip4/127.0.0.1/tcp/5001");
// const ProfileSchema = {
//   AVATAR: 'avatar',
//   LINKS: 'links',
//   ABOUT: 'about',
//   BACKGROUND_IMAGE: 'backgroundImage'
// };
//
// const fetchObj = async (hash) => {
//   try {
//     return await ipfs.object.get(hash, { timeout: 2000 })
//   }catch (e) {
//     return '';
//   }
// }
//
// const fetchLinks = async (hash) => {
//   try {
//     const data =  await ipfs.object.get(hash, { timeout: 2000 })
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
//     if (link.Name === ProfileSchema.BACKGROUND_IMAGE) {
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
//     const isPinned = await pinData(currentHash);
//
//     if(!isPinned){
//       continue;
//     }
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
//   const migrateEntries = [
//     {ipfsHash: "QmQd5oxKPLfrnxCaojPEq8rs2vzAF9aMmXcWdgF3mEfuMe", address: "123"},
//     {ipfsHash: "QmSAS35C3ahkTuWGVR8biJwg6ahZN6YY6xLBG8kqMLmwGA", address: "232323"}
//   ]
//   let prev = null;
//   const notfoundEntries = [];
//   const notfoundProfiles = [];
//   const profileIndex = {};
//   const entriesIndex = {};
//   for (const profile of migrateEntries) {
//     if(!profile.ipfsHash) continue;
//     const profileDataLink = new ipfsClient.CID(profile.ipfsHash);
//
//     const avatarPath = { [ProfileSchema.AVATAR]: '' };
//     const aboutPath = { [ProfileSchema.ABOUT]: '' };
//     const profileBase = await fetchObj(profileDataLink);
//     let final = {};
//     if(profileBase) {
//       const links = await fetchLinks(profileDataLink);
//       final = await buildLinks(links, {});
//     }
//     console.log(final);
//     const fetched = Object.assign({}, {
//       data: profileBase.Data
//     }, final);
//     const fetchedFinal = await ipfs.dag.put(fetched, encoding);
//     const profileData = await ipfs.dag.put(
//       {
//         nameHash: profile.nameHash,
//         createdAt: profile.blockNumber,
//         profile: fetchedFinal,
//         username: profile.userName,
//         address: profile.address,
//         entries: profile.entries
//       }, encoding
//     );
//     const cidProfile = await ipfs.dag.put({
//       address: profile.address,
//       providers: { [ProfileProvider]: profileData }
//     }, encoding)
//
//     totalProfiles.push(cidProfile);
//     Object.assign(profileIndex, {[profile.address]: cidProfile});
//     console.log(profile.userName, cidProfile);
//   }
//   const totalProfilesCID = await ipfs.dag.put(totalProfiles, encoding);
//   const indexProfiles = await ipfs.dag.put(profileIndex, encoding);
//
//   fs.writeFileSync('./stored-profiles-slingshot.json',
//     JSON.stringify(
//       {
//         totalProfilesCID: totalProfilesCID.toString(),
//         indexProfiles: indexProfiles.toString()
//       }))
// }
//
// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
