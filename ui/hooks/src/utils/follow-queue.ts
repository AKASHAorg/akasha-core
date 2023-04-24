import getSDK from '@akashaorg/awf-sdk';
import { BehaviorSubject, concatMap, EMPTY, share } from 'rxjs';

class FollowUnfollowQueue {
  static sdk = getSDK();
  static queue = new BehaviorSubject(null);
  static results = this.queue.pipe(
    concatMap(async val => {
      let response;
      switch (val?.type) {
        case 'follow':
          response = await this.sdk.api.profile.follow(val.ethAddress);
          break;
        case 'unFollow':
          response = await this.sdk.api.profile.unFollow(val.ethAddress);
          break;
        default:
          return Promise.resolve(EMPTY);
      }
      return { ...val, response };
    }),
    share(),
  );

  static addToQueue(obj) {
    this.queue.next(obj);
  }
}
