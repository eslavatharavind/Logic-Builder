import json
import math

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\update_topics.py', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('raw_data = """') + len('raw_data = """')
end_idx = content.find('"""\n\nlines =')
raw_data = content[start_idx:end_idx]

lines = [line.strip() for line in raw_data.split('\n') if line.strip() and len(line.strip()) > 4 and not line.endswith("?")]

# 18 categories for 1800+ items
headers = [
    "Variables & I/O",
    "Conditions",
    "Loops",
    "Strings",
    "Lists",
    "Tuples",
    "Dictionaries",
    "Sets",
    "Functions",
    "Nested Loops",
    "Pattern Programs",
    "File Handling",
    "Exception Handling",
    "OOPs",
    "Searching Algorithms",
    "Sorting Algorithms",
    "Recursion",
    "Stack & Queue"
]

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

# Remove any topic that is >= T9 or starts with "9. Real World" to clean up
topics = [t for t in topics if not str(t.get('topicId')).startswith('T9') and not str(t.get('topicId')).startswith('T1') or len(str(t.get('topicId'))) <= 2]
# Specifically keep T1 to T8, delete T9 to T26
topics = [t for t in topics if t.get('topicId') in ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8']]

# Group by 100
chunk_size = math.ceil(len(lines) / len(headers))
# or exactly 100 since we have 1833 lines and 18 headers? Wait, 1833 / 18 = 101.8. Let's just use math.ceil to divide evenly or chunk by 100.
# The user's list actually has exactly 100 for each, maybe 100-105 for some.
# Let's chunk dynamically:
chunk_size = 100

start_id = 9
for i, header in enumerate(headers):
    topic_lines = lines[i*chunk_size : (i+1)*chunk_size]
    if i == len(headers) - 1:
        # last header gets all remaining
        topic_lines = lines[i*chunk_size:]
        
    new_topic = {
        "topicId": f"T{start_id + i}",
        "title": f"{start_id + i}. Real World: {header}",
        "focus": "Practical scenario based questions",
        "problems": []
    }
    
    for j, q in enumerate(topic_lines):
        new_topic["problems"].append({
            "id": f"T{start_id + i}-{j + 1}",
            "desc": q
        })
        
    topics.append(new_topic)

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'w', encoding='utf-8') as f:
    json.dump(topics, f, indent=2)

print(f"Reorganized {len(lines)} questions into {len(headers)} categories.")
