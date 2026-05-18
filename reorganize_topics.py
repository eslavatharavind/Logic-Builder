import json

# Read the raw data we saved earlier
with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\update_topics.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the raw_data string
import ast
# We'll just extract it using a simple regex or string manipulation
start_idx = content.find('raw_data = """') + len('raw_data = """')
end_idx = content.find('"""\n\nlines =')
raw_data = content[start_idx:end_idx]

lines = [line.strip() for line in raw_data.split('\n') if line.strip()]

# Identify categories
categories = {}
current_category = None

for line in lines:
    if len(line) < 5 or line.endswith("?"):
        continue
    if "Real-World Questions" in line:
        continue
        
    # Check if this line is a header (some headers have "(Python)" or are just single words)
    # The headers from the list are:
    headers = [
        "Variables & Input/Output (Python)", "Conditions (if-else)", "Loops", "Strings", "Lists", 
        "Tuples", "Dictionaries", "Sets", "Functions", "Nested Loops", "Pattern Programs", 
        "File Handling", "Exception Handling", "OOPs (Object-Oriented Programming)", 
        "Searching Algorithms", "Sorting Algorithms", "Recursion", "Stack & Queue"
    ]
    
    # special cases in the text like "Queue (FIFO) Real-World Questions" or "Stack (LIFO) Real-World Questions"
    if line in headers or "Real-World Questions" in line or "Stack (LIFO)" in line or "Queue (FIFO)" in line:
        if line in headers:
            current_category = f"Real World: {line}"
            categories[current_category] = []
        elif "Stack (LIFO)" in line or "Queue (FIFO)" in line:
            # group them under Stack & Queue
            current_category = "Real World: Stack & Queue"
            if current_category not in categories:
                categories[current_category] = []
        continue
        
    if current_category is None:
        # Fallback if first line isn't a header
        current_category = "Real World: Variables & Input/Output (Python)"
        categories[current_category] = []
        
    categories[current_category].append(line)

# Load existing topics
with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

# Remove the old T9
topics = [t for t in topics if not str(t.get('topicId')).startswith('T9') and not str(t.get('title')).startswith('9. REAL')]

# Append new categorized topics
start_id = 9
for i, (cat_name, questions) in enumerate(categories.items()):
    new_topic = {
        "topicId": f"T{start_id + i}",
        "title": f"{start_id + i}. {cat_name}",
        "focus": "Practical scenario based questions",
        "problems": []
    }
    
    for j, q in enumerate(questions):
        new_topic["problems"].append({
            "id": f"T{start_id + i}-{j + 1}",
            "desc": q
        })
        
    topics.append(new_topic)

with open(r'c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json', 'w', encoding='utf-8') as f:
    json.dump(topics, f, indent=2)

print(f"Reorganized into {len(categories)} sub-topics.")
