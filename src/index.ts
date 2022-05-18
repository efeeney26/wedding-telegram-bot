import { config } from 'dotenv';
import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';

import { FACTS, ACTS } from './constants';

config();

const token: string = process.env.BOT_TOKEN as string;

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
    `Ты удивишься, но... 🌚🌚 ${FACTS[Math.floor(Math.random() * FACTS.length)]} 🌚🌚`,
    inlineKeyboard,
  );
  next();
})

bot.action('act', async (ctx, next) => {
  await ctx.reply(
    `Докажи, насколько ты крут. 😎😎 ${ACTS[Math.floor(Math.random() * ACTS.length)]} 😎😎`,
    inlineKeyboard
  );
  next();
})

let conditionToStopEaringMessages: boolean;

bot.action('wish', async (ctx) => {
  conditionToStopEaringMessages = false;
  await ctx.reply('Напиши пожелание молодоженам');
  bot.on('text', async (ctx) => {
    if (ctx.message.text && !conditionToStopEaringMessages) {
        const message = await ctx.copyMessage('-720490123', ctx.message);
        if (message) {
          await ctx.reply('Сообщение отправлено молодоженам! Спасибо!', inlineKeyboard);
        }
        conditionToStopEaringMessages = true;
      }
  });
})

bot.launch();
