const ytdl = require("ytdl-core");
require("dotenv").config();
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(process.env.YTTOKEN);
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const ffmpeg_static = require("ffmpeg-static");

export default class Video {
  constructor() {
    this.cmd = "video";
    this.name = "video download";
  }
  async exec(client, message, args) {
    let music = await youtube.searchVideos(args.join(" "), 1);

    // Envia mensagem que esta baixando a musica
    await client.sendText(
      message.from,
      `🎵 *Estou baixando seu video:* \n${video[0].title}\nPor favor Aguarde!`
    );

    // Locais para salvar os arquivos de musica
    let baseLocation = "C:/Users/lucas/Projetos/bootwhatsapp/WhatsAppBotUtils/videos";
    let wavVideoFile = `${baseLocation}${video[0].id}.wav`;
    let mp4VideoFile = `${baseLocation}${video[0].id}.mp4`;

    // abre a stream com o arquivo de audio .wav
    let fileOpenStream = ytdl(music[0].url).pipe(
      await fs.createWriteStream(wavVideoFile)
    );

    // Stream data from audio file
    fileOpenStream
      .on("data", (chunk) => {
        console.log(chunk);
        readStream.destroy();
      })
      .on("end", () => {
        console.log("All the data in the file has been read");
      })
      // Apos o fechamento da stream com o arquivo do vídeo
      .on("close", async (err) => {
        await ffmpeg(wavMusicFile)
          .setFfmpegPath(ffmpeg_static)
          .format("mp4")
          
          .on("end", async () => {
            await client
              .sendFile(message.from, mp3VideoFile, `${music[0].title}.mp4`)
              .then(async (result) => {
                await fs.unlinkSync(mp4VideoFile);
                await fs.unlinkSync(wavVideoFile);
                console.log("Video enviado: ", video[0].title);
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro);
              });
          })
          .on("error", (err) => {
            console.error(err);
          })
          .save(mp4VideoFile);

      });
  }
}
