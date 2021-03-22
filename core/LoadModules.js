import { readdirSync } from "fs";
import ascii from "ascii-table";

export default class ModuleHandler {
  constructor(client) {
    this.client = client;
  }

  syncCommands() {
    let table = new ascii("Modulos Carregados");

    table.setHeading("Modulo", "Arquivo", "Status");

    readdirSync("./src/modules/").forEach((dir) => {
      const commandsFileList = readdirSync(`./src/modules/${dir}`).filter(
        (file) => file == "index.js"
      );

      for (const file of commandsFileList) {
        let pull = require(`../src/modules/${dir}/${file}`).default;
        let cmd = new pull();

        if (cmd.name && cmd.cmd) {
          this.client.commands.set(cmd.cmd, cmd);
          table.addRow(dir, file, "✅");
        } else {
          table.addRow(
            file,
            `❌ -> Verifique o arquivo se esta seguindo o padrao corretamente.`
          );
          continue;
        }
      }
    });

    console.log(table.toString());
  }
}
