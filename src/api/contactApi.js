const API_URL = "http://localhost:8050";

export async function sendContactMessage(data) {

  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {

    let errorMessage = "Failed to send message.";

    try {
      const errorData = await response.json();

      if (errorData.message) {
        errorMessage = errorData.message;
      }

    } catch (error) {
      console.error("Error parsing response:", error);
    }

    throw new Error(errorMessage);
  }

  return await response.text();
}