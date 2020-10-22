import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { PROFILE_LEGACY } from './constants';
import commonServices, { IPFS_SERVICE } from '@akashaproject/sdk-common/lib/constants';

const service: AkashaService = (invoke, log) => {
  const profileProvider = 'akasha-legacy';
  const profileAvatar = 'avatar';
  const profileAbout = 'about';
  const profileBackground = 'backgroundImage';
  const profileLinks = [profileAvatar, profileAbout, profileBackground];
  const postExcerpt = 'excerpt';
  const featuredImageI = 'featuredImage';
  const postLinks = [postExcerpt, featuredImageI];
  const fullEntryI = 'draft-part0';

  const entriesLog = {
    totalPostsCID:
      'bafyriqer5jri6mpbidxbiyn4sydkzdz7jodgf5cfs72zrforfrz72bvnfp6ryo4nrur5ppwv2zw5jrxdqg7yhocvuwoa5kxxhbk7cxwaatyok',
    lastEntryCID:
      'bafyriqhufacbyvbvvpl5e2m7guxy3f25qscuejnd6lr3rgbo5cdtsg4bsplou4k33mrrv2nfgritzjm6dxd3iq6shnw56z3lseombgi4xdg2y',
    indexEntriesCID:
      'bafyriqgg6bguwijplfpswclsgidwijn6aquc7rhb7udmsbrbmaryup4suebu6imqowmc4bqpefmzmezmj4biahmsmennmfm2s46mo4xcstdda',
    profileEntriesIndexCID:
      'bafyriqhmzcqo7qj65yz37ni2nhdymh66pyseibjyievupafbjgwgohdtoik3c7p27txyr7kkurmrck4e2p5vhkywfqkr45nfcrun7q46uviq6',
  };
  const profilesLog = {
    totalProfilesCID:
      'bafyriqhrspd6flvqcayxspsltqgip7x4pjjnbnejpikdyv2kjffvtocc4gwxwz3ektdkr3onpebemlijwwulbbhk7g2fpvev5t3ci6phb7he4',
    indexProfilesCID:
      'bafyriqagpl5kghrigrwbxiaqkrvxbqd5v46qkpqg4abgksmexei4v2xzycptc2tjccgdp4pds5fld7disgvlzzfigv755gaowdjtvukyjluhk',
  };
  const sourceData = { sourcesCID: 'bafybeicu3lcedpnbotbvgsakhjbwb62ua4rvqfegkoi77u4ilekeam5qma' };

  const fetchDagNode = async (node: string) => {
    const ipfs = await invoke(commonServices[IPFS_SERVICE]).getInstance();
    try {
      return await ipfs.dag.get(node, { timeout: 5000 });
    } catch (e) {
      return null;
    }
  };

  const resolveCIDs = async cidObj => {
    const ipfsUtils = await invoke(commonServices[IPFS_SERVICE]).getUtils();
    for (const key of Object.keys(cidObj)) {
      if (ipfsUtils.CID.isCID(cidObj[key])) {
        const data = await fetchDagNode(cidObj[key]);
        const hash = cidObj[key].toBaseEncodedString();
        cidObj[key] = { hash, data: data.value };
      }
    }
    return cidObj;
  };
  const getPosts = async (req: { results?: number; offset?: string }) => {
    let last = req.offset || entriesLog.lastEntryCID;
    const results = req.results || 5;
    const result = [];
    while (last && result.length < results) {
      const current = await fetchDagNode(last);
      const prev = current?.value.prev;
      const record = current?.value.record;
      if (prev && record) {
        last = prev.toBaseEncodedString();
        const postData = await getPost({ record });
        const authorData = await getProfile({ address: postData.author }, false);
        result.push({ author: authorData, post: postData });
      } else {
        break;
      }
    }
    return { result, last };
  };

  const getProfiles = async (offset: number = 0, results: number = 5) => {
    // page of profiles?
    return offset;
  };

  const getProfile = async (identifier: { address: string }, resolve: boolean = true) => {
    let profile;
    if (!identifier.address) {
      throw new Error('Must specify address for the profile!');
    }
    profile = await fetchDagNode(`${profilesLog.indexProfilesCID}/${identifier.address}`);
    const defaultProvider = profile?.value.providers[profileProvider].toBaseEncodedString();
    profile = await fetchDagNode(defaultProvider);
    profile = profile?.value;
    const profileData = await fetchDagNode(`${defaultProvider}/profile`);
    // const profileAvatar = await fetchDagNode()
    if (!profileData) {
      return profile?.value || { address: identifier.address };
    }
    const tmpProfileData = profileData.value;
    if (tmpProfileData.data) {
      tmpProfileData.data = JSON.parse(tmpProfileData?.data.toString());

      Object.assign(profile, tmpProfileData);
    }

    if (resolve) {
      const entries = await fetchDagNode(`${entriesLog.profileEntriesIndexCID}/${profile.address}`);
      Object.assign(profile, { entries });
    }
    profile = await resolveCIDs(profile);
    return profile;
  };

  const getPost = async (identifier: { id?: string; record?: string }) => {
    if (!identifier.id && !identifier.record) {
      throw new Error('Must specify one id or record for the post!');
    }
    let postEntry: any;
    let data;
    if (identifier.record) {
      postEntry = await fetchDagNode(identifier.record);
      postEntry = postEntry?.value;

      if (!postEntry) return null;

      data = JSON.parse(postEntry.data.toString());
      if (postEntry.hasOwnProperty(postExcerpt)) {
        postEntry[postExcerpt] = (
          await fetchDagNode(postEntry[postExcerpt])
        )?.value?.Data?.toString();
      }
      if (postEntry.hasOwnProperty(featuredImageI)) {
        const sizes = (await fetchDagNode(postEntry[featuredImageI]))?.value;
        postEntry[featuredImageI] = {
          sizes,
          hash: postEntry[featuredImageI].toBaseEncodedString(),
        };
      }
      // fullEntryHash = await fetchDagNode(`${identifier.record}/${fullEntryI}`);
    } else {
      const postsIndex = await fetchDagNode(`${entriesLog.indexEntriesCID}/${identifier.id}`);
      if (postsIndex?.value.record) {
        return getPost({ record: postsIndex.value.record.toBaseEncodedString() });
      }
      throw new Error('Invalid post data format!');
    }
    postEntry = await resolveCIDs(postEntry);
    Object.assign(postEntry, data);
    return postEntry;
  };

  return { getPosts, getProfiles, getPost, getProfile };
};

export default { service, name: PROFILE_LEGACY };
