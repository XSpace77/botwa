const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "donate",
    aliases: ["donasi"],
    category: "information",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        return await ctx.reply(
            `${quote("085692195658 (DANA)")}\n` +
            `${quote("─────")}\n` +
            `${quote("085692195658 (Gopay)")}\n` +
            `${quote("https://saweria.co/itsukaa (Saweria)")}\n` +
            `${quote("https://files.catbox.moe/t1bmt8.jpg (Qris)")}\n` +
            "\n" +
            config.msg.footer
        ); // Dapat diubah sesuai keinginan Anda
    }
};