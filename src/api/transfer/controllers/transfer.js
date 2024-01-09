"use strict";
      const { sanitize } = require("@strapi/utils");
      /**
       * A set of functions called "actions" for `transfer`
       * You won't see the transfer API appear on the admin panel, and it is a standalone API, not a collection type.
       */
      module.exports = {
        index: async (ctx) => {
          const { data: { sender, receiver, amount },} = ctx.request.body;
          let entity;
          // deduct amount from sender
          // add amount to reciver
          // add the transaction to transact
          // strapi is a global object to access different properties and methods
          const [senderAcc] = await strapi.entityService.findMany(
            "api::account.account",
            {
              filters: { name: { $eq: sender } },
            }
          );

          const [receiverAcc] = await strapi.entityService.findMany(
            "api::account.account",
            {
              filters: { name: { $eq: receiver } },
            }
          );
          
          // @ts-ignore
          senderAcc.balance = parseFloat(senderAcc.balance) - parseFloat(amount);
          // @ts-ignore
          receiverAcc.balance = parseFloat(receiverAcc.balance) + parseFloat(amount);

          await strapi.entityService.update("api::account.account", senderAcc.id, {
            data: senderAcc,
          });
          await strapi.entityService.update("api::account.account", receiverAcc.id, {
            data: receiverAcc,
          });
          entity = await strapi.entityService.create("api::transact.transact", {
            data: { sender, receiver, amount },
          });
          //The sanitizeOutput function removes all private fields from the model and its relations.
          // @ts-ignore
          const sanitizedEntity = await sanitize.contentAPI.output(entity);
          return sanitizedEntity;
        },
      };