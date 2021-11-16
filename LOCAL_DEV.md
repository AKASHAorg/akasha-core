## Local Development setup

- Setup local graphql server
  1. Create a new file `.env` under `./api/hub` with the contents of [env.example](./api/hub/.env.example).
  2. Setup a [textile account](https://docs.textile.io/hub/accounts/).
  3. Create 2 hub keys, one account type(`APP_API_KEY`) and one user group(`USER_GROUP_API_KEY`). Both must be secure!
  4. Create a new [ThreadID](https://textileio.github.io/js-textile/docs/hub.threadid) for `AWF_THREADdb`.
  5. Follow the comments from [env.example](./api/hub/.env.example) on how to fill in the rest of the values.
  6. To enable adding invitation codes for account registration, add this code to [api.ts](./api/hub/src/api.ts):
     ```typescript
     import { Invite } from './collections/interfaces';
   
     api.post('/add-token/:token', async (ctx: koa.Context, next: () => Promise<unknown>) => {
     const token = ctx?.params?.token;
     if (!token) {
      ctx.status = 401;
     }
     else {
      const invitation = {} as Invite;
      invitation._id = token;
      invitation.name = token;
      invitation.used = false;
      invitation.updateDate = new Date().getTime();
      const db = await getAppDB();
      const id = await db.create(dbID, 'Invites', [invitation]);
      if (id.length) {
        ctx.status = 200;
      } else {
        ctx.status = 400;
      }
     }
     await next();
     });
     ```
     

- Setup env values for building all the awf packages
  1. Create a new file `.env` at the root of the project with the contents of [env.example](./.env.example).
  2. Follow the comments from the example env on how to fill in the values.
  3. From the root of this project run `npm run build:all`.

- To test the playground ethereum-world example application
  1. `npm run dev:server`
  2. `npm run start:feed-app`
  3. To add invitation codes, visit `http://localhost:3113` and run from the console:
     ```typescript
     const invitationCode = 'invite12345';
     fetch("http://localhost:3113/api/add-token/"+ invitationCode, {method: "POST"}).then(x => console.log('added invitation code: ', invitationCode))
     ```

