import axios from "axios";
import type { IPost } from "./IPost";

export default class PostRepository {

    uri: string = import.meta.env.VITE_APP_API_ENDPOINT

    async getAll(): Promise<IPost[]> {
        try {
            const response = await axios.get(this.uri + '/posts')            
            return response.data
        } catch (error) {
            throw new Error('Error API response: ' + error)
        }
    }

}