import json

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

for topic in topics:
    if topic['topicId'] == 'T9':
        if len(topic['problems']) == 1 and "\n" in topic['problems'][0]['desc']:
            massive_string = topic['problems'][0]['desc']
            lines = [line.strip() for line in massive_string.split('\n') if line.strip()]
            
            new_problems = []
            count = 1
            for line in lines:
                if len(line) < 5 or line.endswith("?"):
                    continue
                # Also ignore lines like "Variables & Input/Output (Python)" or "Real-World Questions"
                if "Real-World Questions" in line or "(" in line:
                    continue
                    
                new_problems.append({
                    "id": f"T9-{count}",
                    "desc": line
                })
                count += 1
                
            topic['problems'] = new_problems
            print(f"Fixed T9: {len(new_problems)} problems added.")
        break

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'w', encoding='utf-8') as f:
    json.dump(topics, f, indent=2)
