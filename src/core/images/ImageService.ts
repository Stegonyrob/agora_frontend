import { IImage } from "./IImage";
import { ImageRepository } from "./ImageRepository";

export default class ImageService {
  repository: ImageRepository;

  constructor(repository = new ImageRepository()) {
    this.repository = repository;
  }

  async getAllImages(): Promise<IImage[]> {
    return await this.repository.getAll();
  }

  async uploadImages(formData: FormData): Promise<IImage[]> {
    return await this.repository.upload(formData);
  }

  async deleteImage(imageName: string): Promise<void> {
    return await this.repository.delete(imageName);
  }
}
