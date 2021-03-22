import { create } from "venom-bot";

import Invoke from "./core/CommandHandler.js";
import Module from "./core/LoadModules.js";

create()
  .then((client) => {
    client.commands = new Map();
    start(client);
  })
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  let modules = new Module(client);
  modules.syncCommands();

  client.onMessage(async (message) => {
    Invoke(client, message);
  });
}
