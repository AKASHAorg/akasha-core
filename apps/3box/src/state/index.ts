import { action, thunk, createComponentStore, persist, Action, Thunk } from 'easy-peasy';

// @ts-ignore
import { authenticateBox, getProfile } from '../services/box';

export interface DataBox {
  name?: string;
  image?: string;
  coverPhoto?: string;
  description?: string;
}

export interface DataBoxModel {
  data: DataBox;
  updateData: Action<DataBoxModel, DataBox>;
  getProfile: Thunk<DataBoxModel, string>;
  fetchCurrent: Thunk<DataBoxModel>;
}

export const dataBoxModel: DataBoxModel = {
  data: persist({ name: '', image: '', coverPhoto: '', description: '' }),
  updateData: action((state, payload) => {
    state.data = Object.assign({}, state.data, payload);
  }),
  fetchCurrent: thunk(async (actions, _ethAddress, { injections }) => {
    const { channels, channelUtils } = injections;
    const { commons } = channels;
    const $stash = commons.cache_service.getStash(null);
    const $web3Instance = commons.web3_service.web3(null);
    const $web3Utils = commons.web3_utils_service.getUtils(null);
    const call = channelUtils.observable.forkJoin({
      stash: $stash,
      web3Instance: $web3Instance,
      web3Utils: $web3Utils,
    });
    return call.subscribe(async (deps: any) => {
      const profileData = await authenticateBox(deps.stash, deps.web3Instance, deps.web3Utils);
      if (profileData.hasOwnProperty('image') && profileData.image.length) {
        profileData.image = profileData.image[0].contentUrl;
      }
      actions.updateData(profileData);
    });
  }),
  getProfile: thunk(async (actions, _ethAddress, { injections }) => {
    const { getProfileData, channelUtils } = injections;
    const call = channelUtils.operators.from(getProfileData(_ethAddress));
    return call.subscribe((data: any) => actions.updateData(data));
  }),
};

export const useBoxProfile = (channels?: any, channelUtils?: any) =>
  createComponentStore(dataBoxModel, {
    name: 'BoxStore',
    injections: { channels, channelUtils, getProfileData: getProfile },
  })();
