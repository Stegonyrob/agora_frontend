export default interface IBanned {
  id?: number;
  userId: number;
  reason: string;
  bannedAt?: Date;
  bannedBy?: number; // ID del admin que hizo el baneo
}
