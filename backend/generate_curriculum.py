import json
import random

topics = [
    "Variables, Input/Output & Math",
    "Conditionals & Logic",
    "Loops & Iteration",
    "Lists & Arrays",
    "Strings & Text Manipulation"
]

templates_by_topic = {
    "Variables, Input/Output & Math": [
        "A user enters {item} and {item}. Write a program to calculate their {math_op}.",
        "Given the {property} of a {shape}, calculate its {math_property}.",
        "Convert {unit1} to {unit2} given that the conversion rate is {rate}.",
        "Calculate the final price of a {item} after applying a {percent}% discount.",
        "A system needs you to calculate the {metric} of {target}."
    ],
    "Conditionals & Logic": [
        "Given a user's {user_property}, determine if they are eligible for {benefit}.",
        "Write a program that takes {data_type} and checks if it is {condition}.",
        "Determine the {outcome} based on whether the input {target} is {condition}.",
        "Compare two {item}s and return the one with the {compare_metric}.",
        "Check if a {item} falls within the acceptable range of {range_str}."
    ],
    "Loops & Iteration": [
        "Given a list of {item}s, iterate through them and find the {metric}.",
        "Write a loop to generate the first {number} elements of the {sequence} sequence.",
        "Iterate over {data_structure} and print all {item}s that are {condition}.",
        "Using a loop, calculate the {math_op} of all {condition} numbers between 1 and {number}.",
        "Continuously prompt the user for {item} until they enter a {stop_condition}."
    ],
    "Lists & Arrays": [
        "Given an array of {data_type}, find the {metric} element.",
        "Write a function to reverse an array of {item}s in-place.",
        "Filter a list of {item}s to only include those that are {condition}.",
        "Merge two sorted arrays of {data_type} into a single sorted array.",
        "Find the number of times {target} appears in an array of {data_type}."
    ],
    "Strings & Text Manipulation": [
        "Check if a given string of {item}s is a palindrome.",
        "Count the number of {char_type} in a string.",
        "Write a function to replace all occurrences of {target} with {replacement} in a string.",
        "Extract the {part} from a given formatted string.",
        "Determine if two strings are {string_condition}."
    ]
}

fillers = {
    "item": ["numbers", "words", "ages", "prices", "weights", "scores", "coordinates", "temperatures", "names", "emails"],
    "math_op": ["sum", "product", "difference", "average", "remainder", "factorial"],
    "property": ["length", "radius", "width", "base", "height"],
    "shape": ["circle", "rectangle", "triangle", "cylinder", "sphere"],
    "math_property": ["area", "perimeter", "volume", "surface area"],
    "unit1": ["Celsius", "Miles", "Kilograms", "Hours", "Dollars", "Liters", "Inches"],
    "unit2": ["Fahrenheit", "Kilometers", "Pounds", "Minutes", "Euros", "Gallons", "Centimeters"],
    "rate": ["a constant multiplier", "a standard conversion formula", "a fixed percentage"],
    "percent": ["10", "15", "20", "25", "50", "75"],
    "metric": ["maximum", "minimum", "average", "median", "total", "variance"],
    "target": ["the input value", "a specific string", "the number zero", "a negative number", "a vowel"],
    "user_property": ["age", "income", "credit score", "years of experience", "account balance"],
    "benefit": ["a loan", "a discount", "a promotion", "free shipping", "membership upgrade"],
    "data_type": ["integers", "strings", "positive numbers", "floats"],
    "condition": ["even", "odd", "greater than zero", "negative", "a prime number", "empty"],
    "outcome": ["success/failure", "true/false", "pass/fail", "approved/rejected"],
    "compare_metric": ["highest value", "longest length", "oldest date", "shortest duration"],
    "range_str": ["1 to 100", "0 to 1", "-100 to 100", "50 to 500"],
    "number": ["10", "15", "20", "50", "100", "1000"],
    "sequence": ["Fibonacci", "even number", "odd number", "prime number", "harmonic"],
    "data_structure": ["a list", "an array", "user input", "a sequence of numbers", "a tuple"],
    "stop_condition": ["negative number", "'quit' string", "empty input", "zero"],
    "char_type": ["vowels", "consonants", "uppercase letters", "digits", "spaces"],
    "replacement": ["a hyphen", "an underscore", "an empty string", "a specific character"],
    "part": ["domain name", "file extension", "first word", "last name", "protocol"],
    "string_condition": ["anagrams", "identical", "rotations of each other", "subsequences"]
}

def generate_problem(topic, i):
    templates = templates_by_topic[topic]
    desc = random.choice(templates)
    for key, values in fillers.items():
        while f"{{{key}}}" in desc:
            desc = desc.replace(f"{{{key}}}", random.choice(values), 1)
            
    prefix = random.choice(["Write an algorithm: ", "Design a solution: ", "Create a logic flow: ", "Write a function: ", "Analyze: "])
    desc = prefix + desc
    
    return {
        "id": f"{topic[:3].upper()}-{i}",
        "title": f"Problem #{i}",
        "desc": desc
    }

# 60 days total. 5 topics. 12 days per topic.
# 200 problems per topic. So Day i has about 16 or 17 problems.

curriculum_days = []
current_day = 1

for t in topics:
    topic_problems = []
    for i in range(1, 201):
        topic_problems.append(generate_problem(t, i))
        
    # Split the 200 problems into 12 days chunks (~16, 16, 17...)
    chunk_size, remainder = divmod(200, 12)
    start = 0
    for day_in_topic in range(12):
        end = start + chunk_size + (1 if day_in_topic < remainder else 0)
        daily_chunk = topic_problems[start:end]
        start = end
        
        curriculum_days.append({
            "day": current_day,
            "topic": t,
            "problems": daily_chunk
        })
        current_day += 1

import os
os.makedirs(r"c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data", exist_ok=True)
with open(r"c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\curriculum.json", "w") as f:
    json.dump(curriculum_days, f, indent=2)
