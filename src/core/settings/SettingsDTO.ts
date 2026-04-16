import { ISettings } from "./ISettings";

export interface SettingsDTO {
  getSettings(userId: number): Promise<ISettings>;
  saveSettings(userId: number, settings: ISettings): Promise<void>;
  deleteSettings(userId: number): Promise<void>;
}
