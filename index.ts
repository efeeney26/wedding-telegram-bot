import { config } from 'dotenv';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';

config();

const token: string = process.env.BOT_TOKEN as string;

const bot: Telegraf<Context<Update>> = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply(`Hello ${ctx.from.first_name}!`);
});

bot.launch();
