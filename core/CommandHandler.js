export default async function invoke(client, message) {
  if (message) {
    if (message.body) {
      if (message.body.startsWith("!")) {
        let cmd = message.body.replace("!", "").split(" ");
        let command = client.commands.get(cmd[0]);

        if (command) {
          cmd.shift();
          command.exec(client, message, cmd);
        }
      }
    }
  }
}
