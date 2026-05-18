import asyncio
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    api_key=os.environ.get('GROQ_API_KEY'),
    base_url='https://api.groq.com/openai/v1'
)

async def test():
    try:
        print("Testing basic generation...")
        res = await client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            messages=[
                {'role': 'system', 'content': 'You MUST return ONLY valid JSON.'},
                {'role': 'user', 'content': 'Hello'}
            ],
            response_format={'type': 'json_object'},
            temperature=0.7
        )
        print("SUCCESS:", res)
    except Exception as e:
        print("ERROR:")
        print(type(e))
        print(e.response.json() if hasattr(e, 'response') else e)

asyncio.run(test())
