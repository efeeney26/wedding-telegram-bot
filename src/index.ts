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
    `Докажи, насколько ты крут. 😎😎 ${ACTS[Math.floor(Math.random() * FACTS.length)]} 😎😎`,
    inlineKeyboard
  );
  next();
})

bot.launch();
