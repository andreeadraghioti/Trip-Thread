import sys
from pandas_ai import get_final_json

if __name__ == "__main__":
    activities = sys.argv[1].split(",")
    city = sys.argv[2]
    group = sys.argv[3]
    budget = sys.argv[4]

    result = get_final_json(activities, city, group, budget)
    print(result)