import asyncio
import json
from services import rag_service, ai_service, evaluation_service

async def test():
    try:
        similar = await rag_service.search_similar('Convert Celsius to Fahrenheit', top_k=5)
        print('RAG ok')
        analysis = await ai_service.analyze_problem('Convert Celsius to Fahrenheit', similar)
        print('AI ok')
        prob = await evaluation_service.create_problem('Convert Celsius to Fahrenheit', analysis.model_dump(), mode='practice')
        print('Eval ok', prob)
    except Exception as e:
        import traceback
        traceback.print_exc()

asyncio.run(test())
