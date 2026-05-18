import json
import random

topics = ["Basic Logic", "Arrays & Lists", "Strings", "Math & Numbers", "Dictionaries & HashMaps"]
levels = ["Basic", "Intermediate", "Advanced"]

templates = [
    # Basic
    ("Write a simple Python function to find the {metric} of a {data_structure} of {data_type}.", "Basic"),
    ("Given a {data_structure} of {data_type}, return True if it contains {target}, otherwise False.", "Basic"),
    ("Create a script that takes a {data_structure} and {action} it.", "Basic"),
    ("Write a function to count how many times {target} appears in a {data_structure} of {data_type}.", "Basic"),
    
    # Intermediate
    ("Given a {data_structure} of {data_type}, implement an algorithm to remove all {condition} elements.", "Intermediate"),
    ("Write a function to merge two {data_structure}s of {data_type}, ensuring the result is {sort_order}.", "Intermediate"),
    ("Find the {metric} common element between two {data_structure}s.", "Intermediate"),
    ("In a given {data_structure}, find all contiguous subarrays that sum up to {target}.", "Intermediate"),
    ("Write a program to group an array of strings by their {grouping_property}.", "Intermediate"),
    
    # Advanced
    ("Design an efficient algorithm to find the {metric} sequence in a {data_structure} using dynamic programming.", "Advanced"),
    ("Implement a custom {data_structure} that supports {action} in O(1) time.", "Advanced"),
    ("Given a graph represented as an adjacency matrix of {data_type}, compute the {graph_metric}.", "Advanced"),
    ("Write a function that recursively calculates the {math_op} of a tree's nodes.", "Advanced")
]

fillers = {
    "data_structure": ["list", "tuple", "array", "set", "dictionary", "matrix"],
    "data_type": ["integers", "strings", "positive numbers", "floats", "booleans"],
    "metric": ["maximum", "minimum", "average", "median", "longest", "shortest", "first", "last"],
    "target": ["the number 0", "a negative number", "a vowel", "a specific string", "a prime number", "a duplicate"],
    "action": ["reverses", "sorts", "shuffles", "clears", "duplicates", "flattens"],
    "condition": ["even", "odd", "null", "empty", "duplicate", "negative", "positive"],
    "sort_order": ["strictly increasing", "strictly decreasing", "sorted", "randomized"],
    "grouping_property": ["length", "first letter", "anagrams", "character frequency"],
    "graph_metric": ["shortest path", "minimum spanning tree", "number of connected components", "longest path"],
    "math_op": ["sum", "product", "difference", "factorial"]
}

def generate_problem(i):
    template, level = random.choice(templates)
    desc = template
    for key, values in fillers.items():
        if f"{{{key}}}" in desc:
            desc = desc.replace(f"{{{key}}}", random.choice(values))
    
    return {
        "id": i,
        "level": level,
        "title": f"Practice Problem #{i}",
        "desc": desc
    }

problems = []
for i in range(1, 601):
    problems.append(generate_problem(i))

# Ensure problem #1 is a nice classic one
problems[0] = {
    "id": 1,
    "level": "Basic",
    "title": "Two Sum", 
    "desc": "Given an array of integers and a target sum, find the two numbers that add up to the target."
}

import os
# create data dir
os.makedirs(r"c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data", exist_ok=True)
with open(r"c:\Users\ARAVIND\Downloads\Logic-Builder\frontend\src\data\problems.json", "w") as f:
    json.dump(problems, f, indent=2)

print("Generated 600 problems efficiently!")
