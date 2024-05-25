export interface BukkitConfig {
  jarPath: string;
  options: string[];
  removeLogHeader: boolean;
  loadingEnd: RegExp;
  onServerLog: (msg: string) => void;
}

export interface BukkitConfigParams {
  jarPath: string;
  options?: string[];
  removeLogHeader?: boolean;
  loadingEnd?: RegExp;
  onServerLog?: (msg: string) => void;
}
