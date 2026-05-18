import json
import random

topics_data = [
    {
        "id": "T1",
        "title": "1. Variables & Data Types",
        "focus": "int, float, string, bool, type conversion",
        "templates": [
            "Take two integers and print their {math_op}",
            "Take a float and an integer and print their {math_op}",
            "Swap two {type} variables",
            "Convert {type} input to {type} and print it",
            "Find the type of a given variable",
            "Convert {unit1} to {unit2}",
            "Print formatted string using an f-string",
            "Calculate simple interest given principal, rate, and time",
            "Convert minutes into {time_unit}",
            "Check if input is numeric",
            "Read user's name and age, then print a greeting",
            "Convert a string '100' into an integer and add 50 to it"
        ]
    },
    {
        "id": "T2",
        "title": "2. Operators & Expressions",
        "focus": "arithmetic, relational, logical, bitwise operators",
        "templates": [
            "Calculate the {math_op} of {num} and {num}",
            "Check if {num} is {rel_op} than {num}",
            "Evaluate a logical {logic_op} between two boolean expressions",
            "Perform bitwise {bitwise_op} on {num} and {num}",
            "Find the remainder when {num} is divided by {num}",
            "Calculate {num} raised to the power of {num}"
        ]
    },
    {
        "id": "T3",
        "title": "3. Conditional Statements (If-Else)",
        "focus": "if, elif, else, nested conditions",
        "templates": [
            "Check if a given number is {parity}",
            "Find the {extreme} of {amount} numbers",
            "Determine if a given year is a leap year",
            "Check if a given character is a vowel or consonant",
            "Assign a grade based on a score out of 100",
            "Check if a number is positive, negative, or zero"
        ]
    },
    {
        "id": "T4",
        "title": "4. Loops (For & While)",
        "focus": "for loops, while loops, break, continue, range",
        "templates": [
            "Print numbers from 1 to {num} using a loop",
            "Calculate the sum of first {num} natural numbers",
            "Print the multiplication table of {num}",
            "Find the factorial of {num}",
            "Reverse the digits of a given number",
            "Check if {num} is a prime number",
            "Print a pattern of stars with {num} rows"
        ]
    },
    {
        "id": "T5",
        "title": "5. Strings & Text Processing",
        "focus": "indexing, slicing, methods, concatenation",
        "templates": [
            "Count the number of {char_type} in a string",
            "Reverse a given string",
            "Check if a string is a palindrome",
            "Convert a string to {case_type}",
            "Find the longest word in a sentence",
            "Replace all occurrences of '{char}' with '{char}' in a string"
        ]
    },
    {
        "id": "T6",
        "title": "6. Lists & Arrays",
        "focus": "list creation, indexing, appending, removing, slicing",
        "templates": [
            "Find the {extreme} element in a list of integers",
            "Calculate the sum of all elements in a list",
            "Remove duplicates from a list",
            "Reverse a list in-place",
            "Count occurrences of {num} in a list",
            "Merge two sorted lists into one sorted list"
        ]
    },
    {
        "id": "T7",
        "title": "7. Dictionaries & Sets",
        "focus": "key-value pairs, unique elements, set operations",
        "templates": [
            "Create a dictionary of {num} items and their prices",
            "Count the frequency of each character in a given string",
            "Find the intersection of two sets",
            "Remove a specific key from a dictionary",
            "Merge two user dictionaries",
            "Check if one set is a subset of another"
        ]
    },
    {
        "id": "T8",
        "title": "8. Functions & Modules",
        "focus": "def, return, scope, importing",
        "templates": [
            "Write a function to calculate the area of a {shape}",
            "Write a function to check if a number is {parity}",
            "Import the math module and use it to find the square root of {num}",
            "Create a recursive function to find the {num}th Fibonacci number",
            "Write a function that takes a list and returns a new list with unique elements"
        ]
    }
]

fillers = {
    "type": ["integers", "floats", "strings", "booleans"],
    "math_op": ["sum", "difference", "product", "quotient", "average"],
    "unit1": ["Celsius", "Kilometers", "Kilograms", "Hours", "Days"],
    "unit2": ["Fahrenheit", "Miles", "Pounds", "Minutes", "Weeks"],
    "time_unit": ["hours", "seconds", "days"],
    "condition": ["numeric", "uppercase", "lowercase", "alphanumeric"],
    "num": ["10", "20", "50", "100", "5", "3"],
    "rel_op": ["greater", "less", "equal to", "not equal to"],
    "logic_op": ["AND", "OR", "NOT"],
    "bitwise_op": ["AND", "OR", "XOR", "NOT"],
    "parity": ["even or odd", "a multiple of 3", "a prime number"],
    "extreme": ["maximum", "minimum"],
    "amount": ["two", "three", "four", "five"],
    "char_type": ["vowels", "consonants", "uppercase letters", "digits", "spaces"],
    "case_type": ["uppercase", "lowercase", "title case"],
    "shape": ["circle", "rectangle", "triangle", "square"],
    "char": ["A", "B", "C", "D", "E"]
}

def generate_problem(template):
    desc = template
    for key, values in fillers.items():
        while f"{{{key}}}" in desc:
            desc = desc.replace(f"{{{key}}}", random.choice(values), 1)
    
    if len(desc) > 0:
        desc = desc[0].upper() + desc[1:]
    return desc

output_topics = []

for topic in topics_data:
    topic_problems = set()
    templates = topic["templates"]
    
    # Base examples specifically for Topic 1
    base_examples = [
        # Basic Problems
        "Define a string variable with your name and print it",
        "Create boolean variables for True and False, then print their types",
        "Assign the value 3.14 to a variable named pi and print it",
        "Take two integers and print their sum",
        "Swap two variables",
        "Find type of variable",
        # Intermediate Problems
        "Take a string containing a float (e.g., '12.5'), convert it to float, then to int",
        "Convert Celsius to Fahrenheit using the formula (C * 9/5) + 32",
        "Print formatted string using an f-string to display an item and its price",
        "Take a comma-separated string of two numbers, convert them to integers, and add them",
        "Swap three variables a, b, and c without using direct multiple assignment",
        # Real-Time Problems
        "Calculate the total bill amount including a 15% tip for a restaurant order",
        "Convert a user's height from feet and inches to centimeters for a medical form",
        "Calculate a freelancer's weekly pay given their hourly rate and hours worked",
        "Determine the final price of an item after applying a 20% discount coupon",
        "Given the starting and ending odometer readings, calculate the total distance traveled",
    ]
    
    if "Variables" in topic["title"]:
        for ex in base_examples:
            topic_problems.add(ex)
            
    attempts = 0
    while len(topic_problems) < 200 and attempts < 10000:
        t = random.choice(templates)
        p = generate_problem(t)
        topic_problems.add(p)
        attempts += 1
        
    while len(topic_problems) < 200:
        desc = random.choice(templates)
        desc = generate_problem(desc)
        desc += f" (Variation {len(topic_problems)})"
        topic_problems.add(desc)

    topic_problems = list(topic_problems)
    
    problems_list = []
    # Make sure base examples are at the top if it's Topic 1
    if "Variables" in topic["title"]:
        first = [p for p in topic_problems if p in base_examples]
        rest = [p for p in topic_problems if p not in base_examples]
        topic_problems = first + rest
        
    for idx, prob in enumerate(topic_problems):
        problems_list.append({
            "id": f"{topic['id']}-{idx+1}",
            "desc": prob
        })

    output_topics.append({
        "topicId": topic["id"],
        "title": topic["title"],
        "focus": topic["focus"],
        "problems": problems_list
    })

import os
os.makedirs(r"c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data", exist_ok=True)
with open(r"c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\topics.json", "w") as f:
    json.dump(output_topics, f, indent=2)

print("Generated Topics!")
