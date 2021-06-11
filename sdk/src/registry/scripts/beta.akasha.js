// const bre = require("@nomiclabs/buidler");
// const ipfsClient = require("ipfs-http-client");
// //const migrateEntries = require('./selected-profiles-entries.json');
// const bs58 = require('bs58');
// const fs = require("fs");
//
// const encodeHash = function(fn, digestSize, hash) {
//   const fnBuff = Buffer.from(fn.toString(16), "hex");
//   const digestSizeBuff = Buffer.from(digestSize.toString(16), "hex");
//   const hashBuff = Buffer.from(hash.slice(2), "hex");
//   const totalLength = fnBuff.length + digestSizeBuff.length + hashBuff.length;
//   const decoded = Buffer.concat([fnBuff, digestSizeBuff, hashBuff], totalLength);
//
//   return bs58.encode(decoded);
// };
//
// const ProfileProvider = 'akasha-legacy';
// async function main () {
//   /*
//   const totalPosts = [];
//   const totalProfiles = [];
//   const encoding = { format: 'dag-cbor', hashAlg: 'sha3-512', pin: true };
//   const ipfs = ipfsClient("https://ipfs.infura.io:5001/api/v0/");
//   let prev = null;
//   const notfoundEntries = [];
//   const notfoundProfiles = [];
//   for (const profile of migrateEntries) {
//     if(!profile.ipfsHash) continue;
//     const profileDataLink = new ipfsClient.CID(profile.ipfsHash);
//     for (const entry of profile.entries) {
//       const entryLd = { record: new ipfsClient.CID(entry.ipfsHash || null), prev };
//       const cidEntry = await ipfs.dag.put(
//         entryLd,
//         encoding
//       )
//       try {
//         const q = await ipfs.dag.get(entryLd.record, { timeout: 30000 });
//         if(q) {
//           totalPosts.push(cidEntry);
//           prev = cidEntry;
//           console.log('linked entry', prev)
//         }
//       }catch (err){
//         notfoundEntries.push(entry.ipfsHash);
//         console.log('not found Entry######', entry.ipfsHash)
//       }
//     }
//     try {
//       await ipfs.dag.get(profileDataLink, { timeout: 30000 });
//       const profileData = await ipfs.dag.put(
//         {
//           nameHash: profile.nameHash,
//           createdAt: profile.blockNumber,
//           profile: profileDataLink,
//           username: profile.userName,
//           entries: profile.entries
//         }, encoding
//       );
//       const cidProfile = await ipfs.dag.put({
//         address: profile.address,
//         providers: { [ProfileProvider]: profileData }
//       }, encoding)
//
//       totalProfiles.push(cidProfile);
//
//       console.log(profile.userName, cidProfile);
//     }catch(e){
//       notfoundProfiles.push(profile.ipfsHash);
//       console.log('not found Profile######', profile.ipfsHash);
//     }
//   }
//
//
//   //bafyriqepi7gd62w7klt4bsn52ku2zw555yxb2drrr5xzyqaspsrf47xjz6dhydc3ivcraekbd6pdyiqqimw5vgchqmk4fffvokafdsif27t72
//   const totalProfilesCID = await ipfs.dag.put(totalProfiles, encoding);
//   console.log('totalProfilesCID', totalProfilesCID);
//  //bafyriqd5ufw6pasbqdyhpyvevqjnq73iurhv3rmtajyadn4dzs5nngxt7owfftlff5bpwhgpnnyr4hx5giixcrvzcz3er7k7mg6jvphmg2lu4
//   const totalPostsCID = await ipfs.dag.put(totalPosts, encoding);
//   console.log('totalPostsCID', totalPostsCID);
//   fs.writeFileSync('./stored-cids.json',
//     JSON.stringify(
//       {
//         totalProfilesCID: totalProfilesCID.toString(),
//         totalPostsCID: totalPostsCID.toString(),
//         lastEntryCID: prev.toString(),
//         notfoundEntries,
//         notfoundProfiles
//     }))*/
//     const registryAbi = [
//       "event Register(bytes32 indexed label, uint indexed version)",
//       "function hash(bytes32 _subNode) public view returns (bytes32 nameHash)"
//     ];
//     const resolveABI = [
//       "function resolve(bytes32 _node) public view returns (bytes32 _akashaId, address _addr, bool _donationsEnabled, uint8 _fn, uint8 _digestSize, bytes32 _hash)"
//     ]
//
//     const libAbi = [
//       "function getHash(Multihash _multiHash) pure internal returns (uint8, uint8, bytes32)"
//     ]
//
//     const entriesABI = [
//       "function getEntryCount(address _publisher) public view returns (uint256)",
//       "event Publish(address indexed author, bytes32 indexed entryId)",
//       "function getEntry(address _publisher, bytes32 _entryId) public view returns (uint8 _fn, uint8 _digestSize, bytes32 _hash)"
//     ]
//     const commentsABI = [
//       "function totalCommentsOf(address _publisher) public view returns (uint)"
//     ]
//     const votesABI = [
//       "function getRecord(bytes32 _id) public view returns (uint256 _totalVotes, int _score, uint256 _endPeriod, uint256 _totalKarma, bool _claimed)"
//     ]
//     const signers = await bre.ethers.getSigners();
//     const profileContract = new bre.ethers.Contract("0x3f4df77876fb393975daa074301d2913699c28dc", registryAbi, signers[0]);
//     const createEvent = profileContract.filters.Register(null, null);
//     const nameHash = await profileContract.hash("0x6469646e743161626c6500000000000000000000000000000000000000000000");
//     console.log(nameHash);
//     const resolverContract = new bre.ethers.Contract("0xa6100e99dda74e8aad319f4c4bae098694c910a4", resolveABI, signers[0]);
//     const rProfile =  await resolverContract.resolve(nameHash);
//     const entriesContract = new bre.ethers.Contract("0x315406c6e19a0781a65d65dba2f40b4d96dd8952", entriesABI, signers[0])
//     const commentsContract = new bre.ethers.Contract("0x734fd84ca57371025e2062e56754165fa877d629", commentsABI, signers[0])
//     const votesContract = new bre.ethers.Contract("0xc930528719afdede51308e4bbc6d05d3a18f2021", votesABI, signers[0])
//     console.log("====>>>", rProfile);
//   // fetch existing profiles list
//     const events = await profileContract.queryFilter(createEvent,1, 7335728)
//     //console.log("events", events.length, events);
//     const savedProfiles = [];
//     /*for(let event of events) {
//       const nameHash = await profileContract.hash(event.topics[1]);
//       const hName = Buffer.from(event.topics[1].slice(2), "hex");
//       const profile = await resolverContract.resolve(nameHash);
//       const totalPosts = await entriesContract.getEntryCount(profile[1]);
//       const tmpObj = {
//         nameHash, totalPosts: totalPosts.toString(), blockNumber: event.blockNumber,
//         profile, address: profile[1],
//         userName: (hName.toString("utf-8")).replace("\u0000", '')
//       };
//       console.log(tmpObj);
//       savedProfiles.push(tmpObj)
//     }
//     fs.writeFileSync('./all-profiles.json', JSON.stringify(savedProfiles))
//
//     const profileList = savedProfiles;
//     const profilesSelected = [];
//     for(let profile of profileList){
//       if(profile.totalPosts !== "0") {
//         if(profile.profile[3] > 0) {
//           const qmHash = encodeHash(profile.profile[3], profile.profile[4], profile.profile[5])
//           profilesSelected.push(Object.assign({}, profile, { ipfsHash: qmHash }))
//           console.log('selected', profile);
//         } else {
//           profilesSelected.push(profile)
//         }
//       } else {
//         const nrComments = await commentsContract.totalCommentsOf(profile.address);
//         if(nrComments.toString()!== "0") {
//           if(profile.profile[3] > 0) {
//             const qmHash = encodeHash(profile.profile[3], profile.profile[4], profile.profile[5])
//             profilesSelected.push(Object.assign({}, profile, { ipfsHash: qmHash, totalComments: nrComments.toString() }))
//           } else {
//             profilesSelected.push(profile)
//           }
//         }
//       }
//     }
//     console.log("total profiles", profilesSelected.length);
//     fs.writeFileSync('./selected-profiles.json', JSON.stringify(profilesSelected))*/
//
//   // get all the post IDs
//   //   const postEvent = entriesContract.filters.Publish(null, null);
//   //   const publishEvents = await entriesContract.queryFilter(postEvent,1, 7357327)
//   //   const savedEntries = [];
//   //   const dodgedEntries = [];
//   //   for(let postEvent of publishEvents) {
//   //     if(postEvent.removed) {
//   //       dodgedEntries.push({postEvent, reason: "====REMOVED===="})
//   //       continue;
//   //     }
//   //     const post = { id: postEvent.args[1], author: postEvent.args[0] };
//   //     const score = await votesContract.getRecord(post.id);
//   //     const postScore = score._score.toNumber();
//   //     if(postScore<0){
//   //       dodgedEntries.push({postEvent, reason: "====Negative score===="})
//   //       continue;
//   //     }
//   //     const entry = await entriesContract.getEntry(post.author, post.id);
//   //     const entryHash = encodeHash(entry[0], entry[1], entry[2]);
//   //     console.log(savedEntries.length, entryHash);
//   //     savedEntries.push(Object.assign(post, { score: postScore, ipfsHash: entryHash }))
//   //   }
//   //   console.log("total entries", savedEntries.length);
//   //   fs.writeFileSync('./selected-entries.json', JSON.stringify(savedEntries));
//   //   fs.writeFileSync('./excluded-entries.json', JSON.stringify(dodgedEntries));
//
//   // combine profiles and entries lists
//
// /*   let profileListS = fs.readFileSync('./selected-profiles.json').toString();
//     const entriesS = fs.readFileSync('./selected-entries.json').toString();
//     profileListS = profileListS.replace(/\\u([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])([0-9]|[a-fA-F])/g, "")
//     const profileListObj = JSON.parse(profileListS);
//     const entriesListObj = JSON.parse(entriesS);
//     const selectedEntriesP = [];
//     for(let profile of profileListObj) {
//       profile['entries'] = [];
//       for (let entry of entriesListObj) {
//         if (profile.address === entry.author) {
//           profile.entries.push(entry);
//         }
//       }
//       selectedEntriesP.push(profile);
//     }
//       fs.writeFileSync('./selected-profiles-entries.json', JSON.stringify(selectedEntriesP));*/
//
//   // entries published by an author without a profile
//   /*  for(let entry of entriesListObj) {
//       let found = false;
//       for(let profile of profileListObj){
//         if(profile.address === entry.author){
//           found = true;
//         }
//       }
//       if(!found){
//         selectedEntriesP.push(entry)
//       }
//     }
//     fs.writeFileSync('./excluded-profiles-selected-entries.json', JSON.stringify(selectedEntriesP))*/
//
// }
//
// main()
//   .then(() => process.exit(0))
//   .catch(error => {
//     console.error(error);
//     process.exit(1);
//   });
//
// //
// const finalEntries = {"totalPostsCid":"bafyriqer5jri6mpbidxbiyn4sydkzdz7jodgf5cfs72zrforfrz72bvnfp6ryo4nrur5ppwv2zw5jrxdqg7yhocvuwoa5kxxhbk7cxwaatyok","lastEntry":"bafyriqhufacbyvbvvpl5e2m7guxy3f25qscuejnd6lr3rgbo5cdtsg4bsplou4k33mrrv2nfgritzjm6dxd3iq6shnw56z3lseombgi4xdg2y","indexEntries":"bafyriqgg6bguwijplfpswclsgidwijn6aquc7rhb7udmsbrbmaryup4suebu6imqowmc4bqpefmzmezmj4biahmsmennmfm2s46mo4xcstdda","profileEntriesIndex":"bafyriqhmzcqo7qj65yz37ni2nhdymh66pyseibjyievupafbjgwgohdtoik3c7p27txyr7kkurmrck4e2p5vhkywfqkr45nfcrun7q46uviq6"}
// const finalProfiles = {"totalProfilesCID":"bafyriqhrspd6flvqcayxspsltqgip7x4pjjnbnejpikdyv2kjffvtocc4gwxwz3ektdkr3onpebemlijwwulbbhk7g2fpvev5t3ci6phb7he4","indexProfiles":"bafyriqagpl5kghrigrwbxiaqkrvxbqd5v46qkpqg4abgksmexei4v2xzycptc2tjccgdp4pds5fld7disgvlzzfigv755gaowdjtvukyjluhk"}
// const sourceData = {sourcesCID: "bafybeicu3lcedpnbotbvgsakhjbwb62ua4rvqfegkoi77u4ilekeam5qma"}
