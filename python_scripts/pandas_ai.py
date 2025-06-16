import pandas as pd
from pandasai import SmartDataframe
from pandasai.llm.openai import OpenAI
from maps_text_search import create_csv
from maps_details import get_place_details
from dotenv import load_dotenv
import ast
import os


def map_price_level(pl):
        if pd.isna(pl) or pl == 'PRICE_LEVEL_UNSPECIFIED':
            return 'small'
        elif pl == 'PRICE_LEVEL_MODERATE':
            return 'moderate'
        elif pl == 'PRICE_LEVEL_EXPENSIVE':
            return 'big'
        else:
            return 'unknown'

def get_final_df(places):
    places_list = [place.strip() for place in places.split(',')]
    places_list = list(set([place.strip() for place in places.split(',')]))
    all_dfs = [get_place_details(place) for place in places_list]

    final_df = pd.concat(all_dfs, ignore_index=True)

    expected_columns = [
        'displayName.text', 'primaryTypeDisplayName.text', 'priceLevel',
        'editorialSummary.text', 'internationalPhoneNumber', 'websiteUri',
        'shortFormattedAddress', 'currentOpeningHours.openNow', 'photos'
    ]
    for col in expected_columns:
        final_df[col] = final_df.get(col, None)

    rename_map = {
        'displayName.text': 'name',
        'primaryTypeDisplayName.text': 'type',
        'priceLevel': 'price',
        'editorialSummary.text': 'description',
        'internationalPhoneNumber': 'phone',
        'websiteUri': 'website',
        'shortFormattedAddress': 'address',
        'currentOpeningHours.openNow': 'open'
    }
    final_df.rename(columns=rename_map, inplace=True)

    priority_cols = ['name', 'type', 'price', 'open', 'phone', 'description']
    final_cols = priority_cols + [col for col in final_df.columns if col not in priority_cols]
    final_df = final_df[final_cols]

    final_df['price'] = final_df['price'].apply(map_price_level)

    return final_df

def build_activities_query(activity_types):
    if not activity_types:
        activity_str = ''
    elif len(activity_types) == 1:
        activity_str = activity_types[0]
    elif len(activity_types) == 2:
        activity_str = ' and '.join(activity_types)
    else:
        activity_str = ', '.join(activity_types[:-1]) + ' and ' + activity_types[-1]
    return activity_str
    

def reccomend_attractions (city, group_type, budget_type, activity_types):
    load_dotenv()
    API_KEY = os.getenv('OPENAI_API_KEY')
    model = 'gpt-3.5-turbo'
    llm = OpenAI(api_token=API_KEY, model=model)
    create_csv(city, activity_types)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'results.csv')
    data = pd.read_csv(csv_path)
    df_data = SmartDataframe(data, config={'llm': llm})
    activity_types = build_activities_query(activity_types)

    response=df_data.chat(f"""
    You are a travel assistant helping a {group_type} visiting {city}. They are interested in these activity types: {activity_types}.
    Their budget is {budget_type}, but this is the least important factor.
    You must recommend place IDs from the dataset of tourist places.
    Follow these strict rules:
    1. You must return **exactly 5 places for each activity type: {activity_types}**.
    2. Focus only on places that are highly relevant to the activity types. Ignore budget unless needed to choose between equally relevant places.
    3. Use the following activity type mappings to understand what types of places to include:
    - sightseeing includes: landmark, monument, museum, tour_agency, travel_agency, tourist_attraction, cultural_center, church, historical_landmark, historical_place, observation_deck
    - food includes: local cuisine, local restaurant, cafe, bakery, fine_dining_restaurant
    - nightlife includes: bar, club, music venue
    - shopping includes: shopping_mall, boutique, market
    - outdoor adventures includes: park, hiking_area, nature spot, adventure_sports_center
    - relaxation includes: spa, wellness center, park, church
    **IMPORTANT:**
    You must return ONLY the list of selected place IDs, separated by commas.
    These IDs must be taken from the `id` column in the dataset.
    Do NOT include any text, titles, explanations, or formatting.
    """)

    return response

def get_final_json(activity_types, city, group, budget):
    return get_final_df(reccomend_attractions(city, group, budget, activity_types)).to_json(orient='records')


