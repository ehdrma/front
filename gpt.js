import { API_KEY } from '@env';

// 예시로 OpenAI API를 호출하는 비동기 함수
export async function CallGPT(prompt) {
  const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions'; // OpenAI GPT API 엔드포인트
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  };

  const requestBody = {
    prompt,
    max_tokens: 100, // 예시 값, 필요에 따라 조절 가능
    temperature: 0.7, // 예시 값, 필요에 따라 조절 가능
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('OpenAI API 호출 오류:', error);
    throw error;
  }
}
//gpt.js