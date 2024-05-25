import path from "path";
import { BukkitConfig, BukkitConfigParams } from "./types";
const { spawn } = require("node:child_process");

export class ScriptBukkit {
  private config: BukkitConfig;
  private bat: any;

  constructor(config: BukkitConfigParams) {
    this.config = {
      jarPath: config.jarPath,
      options: config.options || ["-Xmx1G", "-Xms1G"],
      removeLogHeader: config.removeLogHeader || true,
      loadingEnd: config.loadingEnd || /Done \(.*s\)! For help, type "help"/,
      onServerLog: config.onServerLog || ((msg: string) => console.log(msg)),
    };
  }

  private formatData(data: Buffer) {
    let str = data.toString();
    let ind = str.indexOf("]:");
    return this.config.removeLogHeader && ind >= 0
      ? str.substring(ind + 2).trim()
      : str.trim();
  }

  init() {
    return new Promise<void>((resolve) => {
      const handleAbruptTermination = () => {
        if (this.bat) {
          this.stop();
        }
      };

      const waitForLoading = (data: Buffer) => {
        const str = data.toString();
        if (this.config.loadingEnd.test(str)) {
          console.log("Minecraft server is ready!");
          this.bat.stdout.removeListener("data", waitForLoading);
          resolve();
        }
      };

      this.bat = spawn(
        "java",
        [
          "-jar",
          ...this.config.options,
          path.basename(this.config.jarPath),
          "nogui",
        ],
        {
          cwd: path.dirname(this.config.jarPath),
        }
      );

      this.bat.stdin.setDefaultEncoding("utf-8");

      // To detect when the server is ready
      this.bat.stdout.on("data", waitForLoading);

      // To log server output
      this.bat.stdout.on("data", (data: Buffer) =>
        this.config.onServerLog(this.formatData(data))
      );

      // Abrupt termination
      process.on("exit", handleAbruptTermination);
      process.on("SIGINT", handleAbruptTermination);
      process.on("SIGUSR1", handleAbruptTermination);
      process.on("SIGUSR2", handleAbruptTermination);
      process.on("uncaughtException", handleAbruptTermination);
    });
  }

  command(cmd: string) {
    this.bat.stdin.write(`${cmd}\n`);
  }

  query(cmd: string) {
    return new Promise<string>((resolve) => {
      const waitForResponse = (data: Buffer) => {
        this.bat.stdout.removeListener("data", waitForResponse);
        resolve(this.formatData(data));
      };

      this.bat.stdin.write(`${cmd}\n`);
      this.bat.stdout.on("data", waitForResponse);
    });
  }

  stop() {
    this.command("stop");
    this.bat = null;
  }
}
