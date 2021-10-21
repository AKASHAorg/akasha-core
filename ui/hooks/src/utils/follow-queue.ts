import getSDK from '@akashaproject/awf-sdk';
import { BehaviorSubject, concatMap, EMPTY, lastValueFrom, share } from 'rxjs';

class FollowUnfollowQueue {
  static sdk = getSDK();
  static queue = new BehaviorSubject(null);
  static results = this.queue.pipe(
    concatMap(async val => {
      let response;
      switch (val?.type) {
        case 'follow':
          response = await lastValueFrom(this.sdk.api.profile.follow(val.ethAddress));
          break;
        case 'unFollow':
          response = await lastValueFrom(this.sdk.api.profile.unFollow(val.ethAddress));
          break;
        default:
          return EMPTY;
      }
      return { ...val, response };
    }),
    share(),
  );
  static addToQueue(obj) {
    this.queue.next(obj);
  }
}
