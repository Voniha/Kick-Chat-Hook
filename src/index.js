const { Events, Kient } = require("kient");
const fs = require("fs");
const readline = require("readline");
const Logger = require("./util/logger");

(async () => {
  let config = JSON.parse(fs.readFileSync("src/config.json"));
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("close", function () {
    rl.write("Bye, thanks for using my script!");
  });

  rl.write("Welcome to the Kick Chat client by voniha");
  rl.write("\n");

  rl.question("Enter username: ", (username) => {
    rl.question('Would you like to log it on Discord? (y/n): ', (answer) => {
      if (answer.toLocaleLowerCase() == 'y') {
        let config = JSON.parse(fs.readFileSync("src/config.json"));
        rl.question('Enter Discord Webhook URL: ', (url) => {
          config.discord = true;
          config.webhook = url;
          fs.writeFileSync('src/config.json', JSON.stringify(config, null, 2));

          rl.question("Would you like to start script? (y/n): ", async (answer) => {
            if (answer.toLowerCase() == "y") {
              const client = await Kient.create();
              const channel = await client.api.channel.getChannel(username);
              await client.ws.chatroom.listen(channel.data.chatroom.id);
              new Logger().logInfo(
                `Script started on username: ${username}, Chatroom ID: ${channel.data.chatroom.id}`
              );
              client.on(Events.Chatroom.Message, (message) => {
                if (message?.data?.content && message?.data?.sender?.username) {
                  let config = JSON.parse(fs.readFileSync("src/config.json"));
                  new Logger().logChat(
                    message.data.content,
                    message.data.sender.username
                  );
                  if (config.discord) sendWebhook(config.webhook, message.data.sender.username, message.data.content);
                  if (fs.existsSync(`chat.txt`))
                    fs.appendFileSync(
                      `chat.txt`,
                      `[${new Date().toLocaleTimeString()}] [KICK CHAT] ${
                        message.data.sender.username
                      } : ${message.data.content}\n`
                    );
                }
              });
            } else {
              rl.close();
            }
          });
        });
      } else {
        config.discord = false;
        fs.writeFileSync('src/config.json', JSON.stringify(config, null, 2));
        rl.question("Would you like to start script? (y/n): ", async (answer) => {
          if (answer.toLowerCase() == "y") {
            const client = await Kient.create();
            const channel = await client.api.channel.getChannel(username);
            await client.ws.chatroom.listen(channel.data.chatroom.id);
            new Logger().logInfo(
              `Script started on username: ${username}, Chatroom ID: ${channel.data.chatroom.id}`
            );
            client.on(Events.Chatroom.Message, (message) => {
              if (message?.data?.content && message?.data?.sender?.username) {
                new Logger().logChat(
                  message.data.content,
                  message.data.sender.username
                );
                if (fs.existsSync(`chat.txt`))
                  fs.appendFileSync(
                    `chat.txt`,
                    `[${new Date().toLocaleTimeString()}] [KICK CHAT] ${
                      message.data.sender.username
                    } : ${message.data.content}\n`
                  );
              }
            });
          } else {
            rl.close();
          }
        });
      }
    });
  });
})();

function sendWebhook(url, username, content) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      content: content,
    }),
  })
}