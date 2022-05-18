import { config } from 'dotenv';
import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';

import { FACTS, ACTS } from './constants';

config();

const token: string = process.env.BOT_TOKEN as string;
const WISHES_CHAT_ID: string = process.env.WISHES_CHAT_ID as string
const ACTS_CHAT_ID: string = process.env.ACTS_CHAT_ID as string

const bot: Telegraf<Context<Update>> = new Telegraf(token);

const inlineKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('Получить забавный факт о молодоженах', 'fact'),
  Markup.button.callback('Получить задание', 'act'),
  Markup.button.callback('Отправить пожелание молодоженам', 'wish'),
], {
  columns: 1,
});

bot.start((ctx) => {
  ctx.reply(
    `Привет, ${ctx.from.first_name}! Смотри, что я умею:`,
    inlineKeyboard
  );
});

bot.action('fact', async (ctx, next) => {
  await ctx.reply(
    `🌚🌚 Ты удивишься, но... ${FACTS[Math.floor(Math.random() * FACTS.length)]} 🌚🌚`,
    inlineKeyboard,
  );
  next();
})

let conditionToStopEaringMessagesAct: boolean;

bot.action('act', async (ctx) => {
  conditionToStopEaringMessagesAct = false;
  await ctx.reply(`😎😎 Докажи, насколько ты крут. ${ACTS[Math.floor(Math.random() * ACTS.length)]} 😎😎`);
  bot.on('message', async (ctx) => {
    if (!conditionToStopEaringMessagesAct) {
      await ctx.telegram.sendCopy(ACTS_CHAT_ID, ctx.message);
      await ctx.reply('Задание отправлено!', inlineKeyboard);
      conditionToStopEaringMessagesAct = true;
    }
  });
})

let conditionToStopEaringMessagesWish: boolean;

bot.action('wish', async (ctx) => {
  conditionToStopEaringMessagesWish = false;
  await ctx.reply('Напиши пожелание молодоженам');
  bot.on('text',  async (ctx) => {
    if (!conditionToStopEaringMessagesWish) {
        await ctx.telegram.sendMessage(WISHES_CHAT_ID, `"${ctx.message.text}" отправлено от ${ctx.from.username || 'гостя'}`);
        await ctx.reply('Пожелание отправлено молодоженам! Спасибо!', inlineKeyboard);
        conditionToStopEaringMessagesWish = true;
      }
  });
})

bot.launch();
