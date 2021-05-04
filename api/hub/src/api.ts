import Router from 'koa-router';
import koa from 'koa';
import { ThreadID } from '@textile/hub';
import { getAppDB, verifyEd25519Sig } from './helpers';
import promClient from 'prom-client';
import ProfileAPI from './datasources/profile';
import ModerationReportAPI from './datasources/moderation-report';
import ModerationDecisionAPI from './datasources/moderation-decision';
import ModerationAdminAPI from './datasources/moderation-admin';
// import { Invite } from './collections/interfaces';

export const promRegistry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: promRegistry });

const adminSecret = process.env.MODERATION_ADMIN_SECRET;

const dbID = ThreadID.fromString(process.env.AWF_THREADdb);
const dataSources = {
  profileAPI: new ProfileAPI({ dbID, collection: 'Profiles' }),
  reportingAPI: new ModerationReportAPI({ dbID, collection: 'ModerationReports' }),
  decisionsAPI: new ModerationDecisionAPI({ dbID, collection: 'ModerationDecisions' }),
  moderatorsAPI: new ModerationAdminAPI({ dbID, collection: 'Moderators' }),
};

const getFinalDecision = async (contentID: string) => {
  let decision = await dataSources.decisionsAPI.getDecision(contentID);

  if (decision.moderator) {
    const moderator = await dataSources.profileAPI.getProfile(decision.moderator);
    decision = Object.assign({}, decision, moderator);
  }
  const first = await dataSources.reportingAPI.getFirstReport(contentID);
  const reportedBy = first.author;
  const reportedDate = first.creationDate;
  const reports = await dataSources.reportingAPI.countReports(contentID);
  const reasons = await dataSources.reportingAPI.getReasons(contentID);
  decision = Object.assign({}, decision, { reports, reportedBy, reportedDate, reasons });
  return decision;
};

const api = new Router({
  prefix: '/api',
});

api.get('/metrics', async (ctx: koa.Context, next: () => Promise<any>) => {
  ctx.set('Content-Type', promRegistry.contentType);
  ctx.body = await promRegistry.metrics();
  await next();
});

api.post('/validate-token/:token', async (ctx: koa.Context, next: () => Promise<any>) => {
  const invite = ctx?.params?.token;
  if (!invite) {
    ctx.status = 401;
  } else {
    const db = await getAppDB();
    const exists = await db.findByID(dbID, 'Invites', invite);
    if (exists) {
      ctx.status = exists.used ? 403 : 200;
    } else {
      ctx.status = 401;
    }
  }
  await next();
});

// api.post('/add-token/:token', async (ctx: koa.Context, next: () => Promise<any>) => {
//   const token = ctx?.params?.token;
//   if (!token) {
//     ctx.status = 401;
//   } else {
//     const invitation = {} as Invite;
//     invitation._id = token;
//     invitation.name = token;
//     invitation.used = false;
//     invitation.updateDate = new Date().getTime();
//     const db = await getAppDB();
//     const id = await db.create(dbID, 'Invites', [invitation]);
//     if (id.length) {
//       ctx.status = 200;
//     } else {
//       ctx.status = 400;
//     }
//   }
//   await next();
// });

api.post('/moderation/reports/new', async (ctx: koa.Context, next: () => Promise<any>) => {
  const report = ctx?.request.body;
  if (!report.data || !report.contentId || !report.contentType || !report.signature) {
    ctx.status = 400;
  } else {
    const profile = await dataSources.profileAPI.getProfile(report.data.user);
    if (!profile.length || !report.data.signature) {
      ctx.status = 401;
    }
    const verified = await verifyEd25519Sig({
      pubKey: profile.pubKey,
      data: report.data,
      signature: report.signature,
    });
    if (!verified) {
      ctx.status = 403;
    }
    const exists = await dataSources.reportingAPI.exists(report.contentId, report.data.user);
    if (exists) {
      ctx.status = 409;
      ctx.body = `You have already reported this content.`;
    } else {
      try {
        await dataSources.reportingAPI.addReport(
          'ModerationDecisions',
          report.contentType,
          report.contentId,
          report.data.user,
          report.data.reason,
          report.data.explanation,
        );
        ctx.status = 201;
      } catch (error) {
        ctx.body = error;
        ctx.status = 500;
      }
    }
  }
  await next();
});

api.post(
  '/moderation/reports/list/:contentId',
  async (ctx: koa.Context, next: () => Promise<any>) => {
    const contentID = ctx?.params?.contentId;
    if (!contentID) {
      ctx.status = 400;
    } else {
      ctx.set('Content-Type', 'application/json');
      ctx.body = await dataSources.reportingAPI.listReports(contentID);
      ctx.status = 200;
    }
    await next();
  },
);

api.post('/moderation/status', async (ctx: koa.Context, next: () => Promise<any>) => {
  const body = ctx?.request.body;
  const contentIDs = body.contentIds;
  if (!contentIDs) {
    ctx.status = 400;
  } else {
    const statuses = [];
    for (const contentID of contentIDs) {
      const status = {
        contentId: contentID,
        reported: false,
        moderated: false,
        delisted: false,
      };
      const decision = await dataSources.decisionsAPI.getDecision(contentID);
      if (decision) {
        status.moderated = decision.moderated;
        status.delisted = decision.delisted;
        if (body.user) {
          const reported = await dataSources.reportingAPI.getReport(contentID, body.user);
          if (reported) {
            status.reported = true;
          }
        }
      }
      statuses.push(status);
    }
    ctx.set('Content-Type', 'application/json');
    ctx.body = statuses;
    ctx.status = 200;
  }
  await next();
});

api.get('/moderation/status/counters', async (ctx: koa.Context, next: () => Promise<any>) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = await dataSources.decisionsAPI.countDecisions();
  ctx.status = 200;
  await next();
});

api.post('/moderation/decisions/new', async (ctx: koa.Context, next: () => Promise<any>) => {
  const report = ctx?.request.body;
  if (!report.data || !report.contentId || !report.signature) {
    ctx.status = 400;
  } else {
    const profile = await dataSources.profileAPI.getProfile(report.data.moderator);
    if (!profile.length || !report.data.signature) {
      ctx.status = 401;
    }
    const verified = await verifyEd25519Sig({
      pubKey: profile.pubKey,
      data: report.data,
      signature: report.signature,
    });
    if (!verified) {
      ctx.status = 403;
    }
    try {
      await dataSources.decisionsAPI.makeDecision(
        report.contentId,
        report.data.moderator,
        report.data.explanation,
        report.data.delisted,
      );
      ctx.status = 200;
    } catch (error) {
      ctx.body = `Cannot moderate content! Error: ${error}`;
      ctx.status = 500;
    }
  }
  await next();
});

api.get('/moderation/decisions/:contentId', async (ctx: koa.Context, next: () => Promise<any>) => {
  const contentID = ctx?.params?.contentId;
  if (!contentID) {
    ctx.status = 400;
    ctx.body = 'Missing "contentId" attribute from request.';
  } else {
    ctx.set('Content-Type', 'application/json');
    ctx.body = await getFinalDecision(contentID);
    ctx.status = 200;
  }
  await next();
});

api.post('/moderation/decisions/pending', async (ctx: koa.Context, next: () => Promise<any>) => {
  const req = ctx?.request.body;
  const decisions = await dataSources.decisionsAPI.listDecisions(
    false,
    false,
    req.offset,
    req.limit,
  );
  const list = await Promise.all(
    decisions.map(decision => {
      return getFinalDecision(decision.contentID);
    }),
  );
  ctx.set('Content-Type', 'application/json');
  ctx.body = list;
  ctx.status = 200;
  await next();
});

api.post('/moderation/decisions/moderated', async (ctx: koa.Context, next: () => Promise<any>) => {
  const req = ctx?.request.body;
  if (req.delisted === undefined) {
    ctx.status = 400;
    ctx.body = 'Missing "delisted" attribute from request.';
  } else {
    const decisions = await dataSources.decisionsAPI.listDecisions(
      req.delisted,
      true,
      req.offset,
      req.limit,
    );
    const list = await Promise.all(
      decisions.map(decision => {
        return getFinalDecision(decision.contentID);
      }),
    );
    ctx.set('Content-Type', 'application/json');
    ctx.body = list;
    ctx.status = 200;
  }
  await next();
});

api.post('/moderation/moderators/new', async (ctx: koa.Context, next: () => Promise<any>) => {
  const request = ctx?.request.body;
  if (!request.data || !request.secret) {
    ctx.status = 400;
  } else {
    let ok = false;
    if (request.secret === adminSecret) {
      ok = true;
    } else {
      const profile = await dataSources.profileAPI.getProfile(request.data.adminEthAddress);
      if (!profile || !profile.pubKey || !request.data.signature) {
        ctx.status = 401;
      } else {
        try {
          const verified = await verifyEd25519Sig({
            pubKey: profile.pubKey,
            data: request.data,
            signature: request.signature,
          });
          const isAdmin = dataSources.moderatorsAPI.isAdmin(request.data.adminEthAddress);
          if (!verified || !isAdmin) {
            ctx.status = 403;
          } else {
            ok = true;
          }
        } catch (error) {
          ctx.body = `Error trying to validate signature: ${error}`;
          ctx.status = 500;
        }
      }
    }
    if (ok) {
      try {
        await dataSources.moderatorsAPI.updateModerator(
          request.data.ethAddress,
          request.data.admin,
          request.data.active,
        );
        ctx.status = 200;
      } catch (error) {
        ctx.body = `Cannot add moderator! Error: ${error}`;
        ctx.status = 500;
      }
    }
  }
  await next();
});

api.head(
  '/moderation/moderators/:ethAddress',
  async (ctx: koa.Context, next: () => Promise<any>) => {
    const ethAddress = ctx?.params?.ethAddress;
    if (!ethAddress) {
      ctx.status = 400;
      ctx.body = 'Missing "ethAddress" attribute from request.';
    } else {
      const isMod = await dataSources.moderatorsAPI.isModerator(ethAddress);
      ctx.status = isMod ? 200 : 404;
    }
    await next();
  },
);

api.get(
  '/moderation/moderators/:ethAddress',
  async (ctx: koa.Context, next: () => Promise<any>) => {
    const ethAddress = ctx?.params?.ethAddress;
    if (!ethAddress) {
      ctx.status = 400;
      ctx.body = 'Missing "ethAddress" attribute from request.';
    } else {
      const isMod = await dataSources.moderatorsAPI.isModerator(ethAddress);
      if (!isMod) {
        ctx.status = 404;
      } else {
        ctx.set('Content-Type', 'application/json');
        ctx.body = await dataSources.moderatorsAPI.getModerator(ethAddress);
        ctx.status = 200;
      }
    }
    await next();
  },
);

export default api;
