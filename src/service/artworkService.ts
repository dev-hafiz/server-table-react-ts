import axios from 'axios';
import { ArtworkResponse } from '../types';

const API_URL = 'https://api.artic.edu/api/v1/artworks';

export const fetchArtworks = async (page: number): Promise<ArtworkResponse> => {
    const response = await axios.get(`${API_URL}?page=${page}`);
    return {
        artworks: response.data.data,
        total: response.data.pagination.total,
    };
};
