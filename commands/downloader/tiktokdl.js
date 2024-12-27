const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tiktokdl",
    aliases: ["tiktok", "tiktoknowm", "tt", "ttdl", "vt", "vtdl", "vtdltiktok", "vtnowm"],
    category: "downloader",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/ -a"))}\n` +
            quote(tools.msg.generatesFlagInformation({
                "-a": "Otomatis kirim audio.",
                "-m": "Unduh musik."
            }))
        );

        const flag = tools.general.parseFlag(input, {
            "-a": {
                type: "boolean",
                key: "audio"
            },
            "-m": {
                type: "boolean",
                key: "music"
            }
        });

        const url = flag.input || null;

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const mediaType = flag.audio ? "audio" : "video_image";

            const apiUrl = tools.api.createUrl("https://api.tiklydown.eu.org", "/api/download", {
                url
            }, null, ["url"]);
            const {
                data
            } = await axios.get(apiUrl);

            if (mediaType === "audio") {
                return await ctx.reply({
                    audio: {
                        url: data.music.play_url
                    },
                    mimetype: mime.lookup("mp3")
                });
            }

            if (mediaType === "video_image") {
                if (data.video?.noWatermark) {
                    return await ctx.reply({
                        video: {
                            url: data.video.noWatermark
                        },
                        mimetype: mime.lookup("mp4"),
                        caption: `${quote(`URL: ${url}`)}\n` +
                            "\n" +
                            config.msg.footer
                    });
                }

                if (data.images && data.images.length > 0) {
                    for (const image of data.images) {
                        await ctx.reply({
                            image: {
                                url: image.url
                            },
                            mimetype: mime.lookup("png")
                        });
                    }
                }
            }

            if (flag.music) {
                const apiUrl = tools.api.createUrl("vreden", "/api/tikmusic", {
                    url
                }, null, ["url"]);
                const {
                    result
                } = (await axios.get(apiUrl)).data;

                return await ctx.reply({
                    audio: {
                        url: data.url
                    },
                    mimetype: mime.lookup("mp3"),
                    caption: `${quote(`URL: ${url}`)}\n` +
                        "\n" +
                        config.msg.footer
                });
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};