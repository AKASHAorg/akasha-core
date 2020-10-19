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
  const totalProfilesCID =
    'bafyriqepi7gd62w7klt4bsn52ku2zw555yxb2drrr5xzyqaspsrf47xjz6dhydc3ivcraekbd6pdyiqqimw5vgchqmk4fffvokafdsif27t72';
  const totalPostsCID =
    'bafyriqho2ymjwa6d6rai2kjx6cem4z7ok2ucosejndtbdfibowwssevdvlvhnf567hd4wsnclnmqgz4myyqneclgjal6tdy4ldbxrta2gal6g';
  const lastEntryCID =
    'bafyriqbbb23vipb7dud3wlohzy5hr3pzxwj5wbyor5bt2xi4twllmp3ppz5b6l2o4ol3j75ib5mwdtlhvd3e542olf5nwwkuubwa23udsowcm';
  const indexEntries =
    'bafyriqdnqurnks7pct7qmu47tjtkeslv4qv3262ckfiqumqwnjpqszy7gxbufovbke3va46g4wfshr6fwl4oyqu4qd4azyyfzxvdwcje6p66o';
  const indexProfiles =
    'bafyriqga4z4nxve3ya6lvls4lf45a4xg2eoo2j4k7vai6wi674cezj773jbn36s3kizzbdvewjbrzia4odnerjjwghryebxxunxdzhypdquq6';

  const fetchDagNode = async (node: string) => {
    const ipfs = await invoke(commonServices[IPFS_SERVICE]).getInstance();
    try {
      return await ipfs.dag.get(node, { timeout: 35000 });
    } catch (e) {
      return null;
    }
  };
  const getPosts = async (req: { results?: number; offset?: string }) => {
    let last = req.offset || lastEntryCID;
    const results = req.results || 5;
    const result = [];
    while (last && result.length < results) {
      const current = await fetchDagNode(last);
      const prev = current?.value.prev;
      const record = current?.value.record;
      const author = current?.value.author;
      if (prev && record) {
        last = prev.toBaseEncodedString();
        const postData = await getPost({ record });
        const authorData = await getProfile({ address: author }, false);
        result.push({ author: authorData, data: postData });
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

    profile = await fetchDagNode(`${indexProfiles}/${identifier.address}`);

    const defaultProvider = profile?.value.providers[profileProvider].toBaseEncodedString();
    profile = await fetchDagNode(defaultProvider);
    profile = profile?.value;
    const profileData = await fetchDagNode(`${defaultProvider}/profile`);
    // const profileAvatar = await fetchDagNode()
    if (!profileData) {
      return profile?.value;
    }
    Object.assign(profile, JSON.parse(profileData?.value?.Data.toString()));

    if (resolve) {
      for (const link of profileData.value.Links) {
        if (profileLinks.includes(link.Name)) {
          const linkData = await fetchDagNode(link.Hash);
          Object.assign(profile, { [link.Name]: linkData.value.Data.toString() });
        }
      }
    }

    return profile;
  };

  const getPost = async (identifier: { id?: string; record?: string }) => {
    if (!identifier.id && !identifier.record) {
      throw new Error('Must specify one id or record for the post!');
    }
    let postEntry: any;
    let excerpt;
    let featuredImage;
    // let fullEntryHash;
    const ipfs = await invoke(commonServices[IPFS_SERVICE]).getInstance();
    if (identifier.record) {
      postEntry = await fetchDagNode(identifier.record);
      for (const link of postEntry.value.Links) {
        if (postLinks.includes(link.Name)) {
          if (link.Name === postExcerpt) {
            excerpt = await fetchDagNode(`${identifier.record}/${postExcerpt}`);
          } else if (link.Name === featuredImageI) {
            featuredImage = await fetchDagNode(`${identifier.record}/${featuredImageI}`);
          }
        }
      }
      // fullEntryHash = await fetchDagNode(`${identifier.record}/${fullEntryI}`);
    } else {
      const postsIndex = await fetchDagNode(`${indexEntries}/${identifier.id}`);
      if (postsIndex?.value.record) {
        return getPost({ record: postsIndex.value.record.toBaseEncodedString() });
      }
      throw new Error('Invalid post data format!');
    }
    return {
      post: postEntry?.value.Data.toString(),
      excerpt: excerpt?.value.Data.toString(),
      // fullEntryHash: fullEntryHash,
      featuredImage: featuredImage?.value.Data.toString(),
    };
  };

  return { getPosts, getProfiles, getPost, getProfile };
};

export default { service, name: PROFILE_LEGACY };
