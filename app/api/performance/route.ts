import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }) as any;

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();

        const prompt = `
            Analyze the performance of this code snippet and provide numerical values for the following metrics: execution time, memory usage, CPU usage, and approximate time complexity. Provide the execution time in milliseconds and memory usage in megabytes. For CPU usage, provide a percentage value. For time complexity, provide the Big O notation.
            Take the input of your choice for the worst-case scenario. Return the results in only numerical values.
            format:
            {
                "execution_time": 100,
                "memory_usage": 50,
                "cpu_usage": 80,
                "time_complexity": "O(n^2)"
            }

            Code Snippet: ${data.code}
            Language: ${data.language}
        `

        const completion = await groq.chat.completions.create({
            model: "llama3-groq-8b-8192-tool-use-preview",
            messages: [{ role: "system", content: prompt }, { role: "assistant", content: "```json" }],
            stream: true,
        });

        const stream = new ReadableStream({
            async start(controller){
                const encoder = new TextEncoder();
                try{
                    for await(const chunk of completion){
                        const content= chunk.choices[0]?.delta?.content
                        if(content){
                            const text= encoder.encode(content);
                            controller.enqueue(text);
                        }
                    }
                }
                catch(error){
                    console.error(error);
                    controller.error(error);
                } finally{
                    controller.close();
                }
            },
        })

        console.log(stream);

        return new NextResponse(stream, {status: 200, headers: { "Content-Type": "text/plain" }});
    } catch (error : any) {
        console.error(error);
        return new NextResponse(error.message, { status: 500 });
    }
}