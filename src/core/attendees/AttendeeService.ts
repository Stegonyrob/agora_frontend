import { AttendeeRepository } from "./AttendeeRepository";
import { IAttendee } from "./IAttendee";
import { IAttendeeDTO } from "./IAttendeeDTO";

export class AttendeeService {
  repository: AttendeeRepository;

  constructor(repository = new AttendeeRepository()) {
    this.repository = repository;
  }

  async getAttendees(eventId: number): Promise<IAttendee[]> {
    return await this.repository.getAll(eventId);
  }

  async registerAttendee(
    eventId: number,
    sanitizedForm: { name: string; email: string; phone: string },
    p0: string,
    attendee: IAttendeeDTO
  ): Promise<IAttendee> {
    return await this.repository.register(eventId, attendee);
  }

  async deleteAttendee(eventId: number, attendeeId: number): Promise<void> {
    return await this.repository.delete(eventId, attendeeId);
  }

  async verifyRecaptcha(token: string): Promise<number> {
    return await this.repository.verifyRecaptcha(token);
  }
}
