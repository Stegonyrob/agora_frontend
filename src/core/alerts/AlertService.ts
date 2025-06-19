import { AlertRepository } from "./AlertRepository";
import { IAlert } from "./IAlert";
import { IAlertDTO } from "./IAlertDTO";

export class AlertService {
  repository: AlertRepository;

  constructor(repository = new AlertRepository()) {
    this.repository = repository;
  }

  async getAlerts(): Promise<IAlert[]> {
    return await this.repository.getAll();
  }

  async getAlertById(id: number): Promise<IAlert> {
    return await this.repository.getById(id);
  }

  async createAlert(alert: IAlertDTO): Promise<IAlert> {
    return await this.repository.create(alert);
  }

  async updateAlert(id: number, alert: IAlertDTO): Promise<IAlert> {
    return await this.repository.update(id, alert);
  }

  async deleteAlert(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
