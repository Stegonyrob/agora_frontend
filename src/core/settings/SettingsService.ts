import { ISettings } from "./ISettings";
import { SettingsRepository } from "./SettingsRepository";

export class SettingsService {
  private repo = new SettingsRepository();

  getSettings(userId: number) {
    return this.repo.getSettings(userId);
  }

  saveSettings(userId: number, settings: ISettings) {
    return this.repo.saveSettings(userId, settings);
  }

  deleteSettings(userId: number) {
    return this.repo.deleteSettings(userId);
  }
}
