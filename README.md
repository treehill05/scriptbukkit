# ScriptBukkit
JavaScript package for running Minecraft server as a child process.

## Installation
```bash
npm install scriptbukkit
```

## Configuration
```javascript
{
  jarPath: string, // Path to the server jar file
  options: Array<string>, // Additional options to pass to the server. Default: ["-Xmx1G", "-Xms1G"]
  removeLogHeader: boolean, // Remove the log header. Default: true
  loadingEnd: regex, // Regular expression to match the end of the loading process. Default: /Done \(.*s\)! For help, type "help"/
  onServerLog: (log: string) => void, // Callback for server log. Default: console.log
}
```

## Usage
```javascript
import { ScriptBukkit } from 'scriptbukkit';

const bukkit = new ScriptBukkit({
  jarPath: "./server/paper.jar", // Path to the server jar file
});

(async () => {
  // Start the server
  await bukkit.init();
  // Promise resolves when the server is ready

  // Send a command to the server
  bukkit.command("time set 3000");

  // Send a command and get the response
  let resp = await bukkit.query("help");
  console.log(resp);
  
  // Stop the server
  bukkit.stop();
})()
```