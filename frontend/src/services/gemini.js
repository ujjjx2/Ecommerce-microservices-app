import axios from 'axios';

// AI recommendation service that calls the backend endpoint
// This keeps the Gemini API key secure on the server side
export async function analyzeProduct(product) {
  try {
    const response = await axios.get(`/api/products/${product.id}/ai-recommendation`);
    return response.data;
  } catch (error) {
    console.error('Error analyzing product:', error);
    
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(`Failed to analyze product: ${error.message}`);
  }
}
