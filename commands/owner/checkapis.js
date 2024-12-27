const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "checkapis",
    aliases: ["cekapi", "checkapi"],
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        try {
            const waitMsg = await ctx.reply(config.msg.wait);

            const APIs = tools.api.listUrl();
            let resultText = "";

            for (const [name, api] of Object.entries(APIs)) {
                try {
                    const response = await axios.get(api.baseURL, {
                        timeout: 5000,
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                        }
                    });

                    if (response.status >= 200 && response.status < 500) {
                        resultText += quote(`${api.baseURL} 🟢 (${response.status})\n`);
                    } else {
                        resultText += quote(`${api.baseURL} 🔴 (${response.status})\n`);
                    }
                } catch (error) {
                    if (error.response) {
                        resultText += quote(`${api.baseURL} 🔴 (${error.response.status})\n`);
                    } else if (error.request) {
                        resultText += quote(`${api.baseURL} 🔴 (Tidak ada respon)\n`);
                    } else {
                        resultText += quote(`${api.baseURL} 🔴 (Kesalahan: ${error.message})\n`);
                    }
                }
            }

            return await ctx.editMessage(waitMsg.key,
                `${resultText.trim()}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};