const ytdl = require("ytdl-core");
require("dotenv").config();
const YouTube = require("simple-youtube-api");
const youtube = new YouTube(process.env.YTTOKEN);
const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

const ffmpeg_static = require("ffmpeg-static");

export default class Music {
  constructor() {
    this.cmd = "music";
    this.name = "music download";
  }
  async exec(client, message, args) {
    let music = await youtube.searchVideos(args.join(" "), 1);

    
    // Envia mensagem que esta baixando a musica
    await client.sendText(
      message.from,
      `🎵 *Estou baixando sua musica:* \n${music[0].title}\nPor favor Aguarde!`
    );

    // Locais para salvar os arquivos de musica
    let baseLocation = "C:/Users/lucas/Projetos/bootwhatsapp/WhatsAppBotUtils/audios";
    let wavMusicFile = `${baseLocation}${music[0].id}.wav`;
    let mp3MusicFile = `${baseLocation}${music[0].id}.mp3`;

    // abre a stream com o arquivo de audio .wav
    let fileOpenStream = ytdl(music[0].url, { filter: "audioonly" }).pipe(
      await fs.createWriteStream(wavMusicFile)
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
      // Apos o fechamento da stream com o arquivo de audio
      .on("close", async (err) => {
        await ffmpeg(wavMusicFile)
          .setFfmpegPath(ffmpeg_static)
          .format("mp3")
          .on("end", async () => {
            await client
              .sendFile(message.from, mp3MusicFile, `${music[0].title}.mp3`)
              .then(async (result) => {
                await fs.unlinkSync(mp3MusicFile);
                await fs.unlinkSync(wavMusicFile);
                console.log("Musica enviada: ", music[0].title);
              })
              .catch((erro) => {
                console.error("Error when sending: ", erro);
              });
          })
          .on("error", (err) => {
            console.error(err);
          })
          .save(mp3MusicFile);
      });
  }
}
