import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: "AIzaSyB0ZW0SdLn3EEyZ9ZoJuwhD2idV2IuHk-4",
});

async function run() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: "Hello world",
            config: {
                httpOptions: { apiVersion: 'v1beta' }
            }
        });
        console.log("Success with gemini-1.5-flash (v1beta):", response.text);
    } catch (err: any) {
        console.error("v1beta error:", err.message);
    }

    try {
        const response2 = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Hello world"
        });
        console.log("Success with gemini-2.5-flash:", response2.text);
    } catch (e: any) {
        console.log("v2.5 error:", e.message)
    }

    try {
        const response3 = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: "Hello world"
        });
        console.log("Success with gemini-2.0-flash:", response3.text);
    } catch (e: any) {
        console.log("v2.0 error:", e.message)
    }
}
run();
