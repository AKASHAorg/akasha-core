import Router from 'koa-router';
import koa from 'koa';
import { ThreadID } from '@textile/hub';
import { getAppDB, verifyEd25519Sig } from './helpers';
import promClient from 'prom-client';
import ProfileAPI from './datasources/profile';
import ModerationReportAPI from './datasources/moderation-report';
import ModerationDecisionAPI from './datasources/moderation-decision';
import ModerationAdminAPI from './datasources/moderation-admin';
import ModerationReasonAPI from './datasources/moderation-reasons';
// import { Invite } from './collections/interfaces';

export const promRegistry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: promRegistry });

const adminSecret = process.env.MODERATION_ADMIN_SECRET;

/**
 * Init ThreadDB and collections APIs.
 */
const dbID = ThreadID.fromString(process.env.AWF_THREADdb);
const dataSources = {
  profileAPI: new ProfileAPI({ dbID, collection: 'Profiles' }),
  reportingAPI: new ModerationReportAPI({ dbID, collection: 'ModerationReports' }),
  decisionsAPI: new ModerationDecisionAPI({ dbID, collection: 'ModerationDecisions' }),
  reasonsAPI: new ModerationReasonAPI({ dbID, collection: 'ModerationReasons' }),
  moderatorsAPI: new ModerationAdminAPI({ dbID, collection: 'Moderators' }),
};

/**
 * Check to see if the user is part of the admins.
 * @param request - The HTTP request object
 * @param ctx - The Koa Context object
 * @returns A boolean if the user is allowed, and the Koa Context object
 */
const isAdmin = async (request, ctx) => {
  let ok = false;
  ctx.status = 401;
  if (request.secret === adminSecret) {
    ok = true;
  } else if (request.data.adminEthAddress) {
    // check if the user is local (exists)
    const profile = await dataSources.profileAPI.getProfile(request.data.adminEthAddress);
    if (profile && profile.pubKey && request.data.signature) {
      try {
        // verify request signature (from client)
        const verified = await verifyEd25519Sig({
          pubKey: profile.pubKey,
          data: request.data,
          signature: request.signature,
        });
        // check is the user has admin rights to be able to add moderators
        const isAdmin = await dataSources.moderatorsAPI.isAdmin(request.data.adminEthAddress);
        if (!verified || !isAdmin) {
          ctx.status = 403;
        } else {
          ok = true;
          ctx.status = 200;
        }
      } catch (error) {
        ctx.body = `Error trying to validate signature: ${error}`;
        ctx.status = 500;
      }
    }
  }
  return {
    ok,
    ctx
  }
};

/**
 * Init router
 */
const api = new Router({
  prefix: '/api',
});

/**
 * Get metrics for the server.
 */
api.get('/metrics', async (ctx: koa.Context, next: () => Promise<any>) => {
  ctx.set('Content-Type', promRegistry.contentType);
  ctx.body = await promRegistry.metrics();
  await next();
});

/**
 * Validate an invitation token.
 */
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

/**
 * Create a new moderation report.
 */
api.post('/moderation/reports/new', async (ctx: koa.Context, next: () => Promise<any>) => {
  const report = ctx?.request.body;
  if (!report.data || !report.contentId || !report.contentType || !report.signature) {
    ctx.status = 400;
  } else {
    // check if the user is local (exists)
    const profile = await dataSources.profileAPI.getProfile(report.data.user);
    if (!profile.length || !report.data.signature) {
      ctx.status = 401;
    }
    // verify request signature (from client)
    const verified = await verifyEd25519Sig({
      pubKey: profile.pubKey,
      data: report.data,
      signature: report.signature,
    });
    if (!verified) {
      ctx.status = 403;
    } else {
      // check if the user has already reported this content identifier
      const exists = await dataSources.reportingAPI.exists(report.contentId, report.data.user);
      if (exists) {
        ctx.status = 409;
        ctx.body = `You have already reported this content.`;
      } else {
        try {
          // add report
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
  }
  await next();
});

/**
 * List reports for a specific content identifier.
 */
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

/**
 * Check moderation status (reported/moderated/delisted)for a list of content identifiers.
 */
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
      // get decision for the current contentID
      const decision = await dataSources.decisionsAPI.getDecision(contentID);
      if (decision) {
        status.moderated = decision.moderated;
        status.delisted = decision.delisted;
        // check if the current logged user has already reported this content
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

/**
 * Get total counters for pending/moderated content.
 */
api.get('/moderation/status/counters', async (ctx: koa.Context, next: () => Promise<any>) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = await dataSources.decisionsAPI.countDecisions();
  ctx.status = 200;
  await next();
});

/**
 * Moderate content.
 */
api.post('/moderation/decisions/moderate', async (ctx: koa.Context, next: () => Promise<any>) => {
  const report = ctx?.request.body;
  if (!report.data || !report.contentId || !report.signature) {
    ctx.status = 400;
  } else {
    // check if the user is local (exists)
    const profile = await dataSources.profileAPI.getProfile(report.data.moderator);
    if (!profile.length || !report.data.signature) {
      ctx.status = 401;
    }
    // verify request signature (from client)
    const verified = await verifyEd25519Sig({
      pubKey: profile.pubKey,
      data: report.data,
      signature: report.signature,
    });
    if (!verified) {
      ctx.status = 403;
    } else {
      try {
        // store moderation decision
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
  }
  await next();
});

/**
 * Get data for a specific moderation decision.
 */
api.get('/moderation/decisions/:contentId', async (ctx: koa.Context, next: () => Promise<any>) => {
  const contentID = ctx?.params?.contentId;
  if (!contentID) {
    ctx.status = 400;
    ctx.body = 'Missing "contentId" attribute from request.';
  } else {
    ctx.set('Content-Type', 'application/json');
    ctx.body = await dataSources.decisionsAPI.getFinalDecision(contentID);
    ctx.status = 200;
  }
  await next();
});

/**
 * Get a list of pending moderation decisions.
 */
api.post('/moderation/decisions/pending', async (ctx: koa.Context, next: () => Promise<any>) => {
  const req = ctx?.request.body;
  const decisions = await dataSources.decisionsAPI.listDecisions(
    false,
    false,
    req.offset,
    req.limit,
  );
  const list = [];
  for (const decision of decisions.results) {
    // get the full data for each decision
    list.push(await dataSources.decisionsAPI.getFinalDecision(decision.contentID));
  }
  ctx.set('Content-Type', 'application/json');
  ctx.body = {
    results: list,
    nextIndex: decisions.nextIndex,
    total: decisions.total,
  };
  ctx.status = 200;
  await next();
});

/**
 * Get a list of all decisions that have been moderated.
 */
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
    const list = [];
    for (const decision of decisions.results) {
      // get the full data for each decision
      list.push(await dataSources.decisionsAPI.getFinalDecision(decision.contentID));
    }
    ctx.set('Content-Type', 'application/json');
    ctx.body = {
      results: list,
      nextIndex: decisions.nextIndex,
      total: decisions.total,
    };
    ctx.status = 200;
  }
  await next();
});

/**
 * Get a public log of all content that has been moderated, for transparency purposes.
 */
api.post('/moderation/decisions/log', async (ctx: koa.Context, next: () => Promise<any>) => {
  const req = ctx?.request.body;
  ctx.body = await dataSources.decisionsAPI.publicLog(req.offset, req.limit);
  ctx.set('Content-Type', 'application/json');
  ctx.status = 200;

  await next();
});

/**
 * Add a new moderator.
 */
api.post('/moderation/moderators/new', async (ctx: koa.Context, next: () => Promise<any>) => {
  const request = ctx?.request.body;
  if (!request.data || !request.secret) {
    ctx.status = 400;
  } else {
    try {
      let allowed = await isAdmin(request, ctx);
      ctx = allowed.ctx;
      if (allowed.ok) {
        // add the new moderator
        await dataSources.moderatorsAPI.updateModerator(
          request.data.ethAddress,
          request.data.admin,
          request.data.active,
        );
        ctx.status = 200;
      }
    } catch (error) {
      ctx.body = `Cannot add moderator! Error: ${error}`;
      ctx.status = 500;
    }
  }
  await next();
});

/**
 * Check if the given user (ETH address) is a moderator or not.
 */
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

/**
 * Get data for a given moderator.
 */
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

/**
 * Get list of moderation reasons.
 */
 api.post(
  '/moderation/reasons',
  async (ctx: koa.Context, next: () => Promise<any>) => {
    const request = ctx?.request.body;
    ctx.set('Content-Type', 'application/json');
    ctx.body = request && request.active ? await dataSources.reasonsAPI.listReasons(true) :
    await dataSources.reasonsAPI.listReasons(false);
    ctx.status = 200;
  }
);

/**
 * Add a new moderation reason.
 */
api.post(
  '/moderation/reasons/new',
  async (ctx: koa.Context, next: () => Promise<any>) => {
    const request = ctx?.request.body;
    if (!request.data.label && (!request.data.ethAddress || request.secret)) {
      ctx.status = 400;
      ctx.body = 'Missing "label" attribute from request.';
    } else {
      let allowed = await isAdmin(request, ctx);
      ctx = allowed.ctx;
      if (allowed.ok) {
        try {
          // add the new reason
          await dataSources.reasonsAPI.updateReason(
            request.data.label,
            request.data.description,
            request.data.active,
          );
          ctx.status = 200;
        } catch (error) {
          ctx.body = `Cannot add reason! Error: ${error}`;
          ctx.status = 500;
        }
      }
    }
    await next();
  }
);

/**
 * Delete a moderation reason.
 */
api.delete(
  '/moderation/reasons',
  async (ctx: koa.Context, next: () => Promise<any>) => {
    const request = ctx?.request.body;
    if (!request.data.id) {
      ctx.status = 400;
      ctx.body = 'Missing "id" attribute from request.';
    } else {
      let allowed = await isAdmin(request, ctx);
      ctx = allowed.ctx;
      if (allowed.ok) {
        try {
          // delete reason
          const existed = await dataSources.reasonsAPI.deleteReason(
            request.data.id
          );
          ctx.status = 200;
          if (!existed) {
            ctx.status = 404;
          }
        } catch (error) {
          ctx.status = 500;
          ctx.body = `Cannot delete reason! Error: ${error}`;
          if (error.message.includes('instance not found')) {
            ctx.status = 404;
          }
        }
      }
    }
    await next();
  }
);

export default api;
