const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "kodepossearch",
    aliases: ["kodepos", "kodeposs"],
    category: "search",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "bogor"))
        );

        try {
            const apiUrl = await tools.api.createUrl("agatz", "/api/kodepos", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = data.map((d) =>
                `${quote(`ID: ${d.id}`)}\n` +
                `${quote(`Kode Kemendagri: ${d.kode_kemendagri}`)}\n` +
                `${quote(`Kode Pos: ${d.kode_pos}`)}\n` +
                `${quote(`Kelurahan: ${d.kelurahan}`)}\n` +
                `${quote(`Kecamatan: ${d.kecamatan}`)}\n` +
                `${quote(`Kota: ${d.kota}`)}\n` +
                `${quote(`Zona Waktu: ${d.zona_waktu}`)}\n` +
                `${quote(`Lintang: ${d.lintang}`)}\n` +
                `${quote(`Bujur: ${d.bujur}`)}\n` +
                `${quote(`Elevasi: ${d.elevasi}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};