import pandas as pd 
from google_apis import create_service
import os

def generate_rectangles(lat, lng, delta_lat, delta_lng):
    return [
        (lat - delta_lat, lng - delta_lng, lat, lng),
        (lat - delta_lat, lng, lat, lng + delta_lng),
        (lat, lng - delta_lng, lat + delta_lat, lng),
        (lat, lng, lat + delta_lat, lng + delta_lng)
    ]

def get_attractions(service, query, price_level, lat_low, lng_low, lat_high, lng_high):
    request_body = {
        'textQuery': query,
        'locationRestriction': {
            'rectangle': {
                'low': {
                    'latitude': lat_low, 'longitude': lng_low
                },
                'high': {
                    'latitude': lat_high, 'longitude': lng_high
                }
            }
        },
        'priceLevels': [price_level]
    }

    response = service.places().searchText(
    body=request_body,
    fields='places.primaryType,places.id,places.types,' \
    'places.displayName.text,places.primaryTypeDisplayName.text,' \
    'places.editorialSummary.text,places.goodForChildren,' \
    'places.goodForGroups,places.priceLevel'
    ).execute()

    places_list = response.get('places', [])
    df = pd.json_normalize(places_list)
    return df

def get_city_data(city):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, 'cities_data.csv')
    df_cities = pd.read_csv(csv_path)
    city_row = df_cities[df_cities['city'].str.lower() == city.lower()]

    lat = city_row.iloc[0]['lat_center']
    lng = city_row.iloc[0]['lng_center']
    delta_lat = city_row.iloc[0]['delta_lat']
    delta_lng = city_row.iloc[0]['delta_lng']
    country = city_row.iloc[0]['country']
    return lat, lng, delta_lat, delta_lng, country

def get_city_attractions(service, city, activity_types):
    price_levels=['PRICE_LEVEL_UNSPECIFIED', 'PRICE_LEVEL_MODERATE', 'PRICE_LEVEL_EXPENSIVE']
    lat, lng, delta_lat, delta_lng, country = get_city_data(city)
    rectangles = generate_rectangles(lat, lng, delta_lat, delta_lng)
    query=f'{activity_types} tourist places in {city.title()}, {country}'

    dfs = []
    for rect in rectangles:
        lat_low, lng_low, lat_high, lng_high = rect
        for price_level in price_levels:
                df = get_attractions(service, query, price_level, lat_low, lng_low, lat_high, lng_high)
                dfs.append(df)

    return pd.concat(dfs, ignore_index=True)

def create_csv(city, activity_types):
    client_secret_file = 'client_secret.json'
    API_NAME = 'places'
    API_VERSION = 'v1'
    SCOPES = ['https://www.googleapis.com/auth/cloud-platform']
    service = create_service(client_secret_file, API_NAME, API_VERSION, SCOPES)

    all_dfs = []

    for activity in activity_types:
        df = get_city_attractions(service, city, activity)
        df['activity_type'] = activity
        all_dfs.append(df)

    df = pd.concat(all_dfs, ignore_index=True).drop_duplicates(subset='id')

    df.rename(columns={
        'displayName.text': 'displayName',
        'primaryTypeDisplayName.text': 'primaryTypeDisplayName',
        'editorialSummary.text': 'editorialSummary'
    }, inplace=True)

    def map_price_level(pl):
        if pd.isna(pl) or pl == 'PRICE_LEVEL_UNSPECIFIED':
            return 'small'
        elif pl == 'PRICE_LEVEL_MODERATE':
            return 'moderate'
        elif pl == 'PRICE_LEVEL_EXPENSIVE':
            return 'big'
        else:
            return 'unknown' 

    df['priceLevel'] = df['priceLevel'].apply(map_price_level)
    df = df[~df['displayName'].str.contains("starbucks", case=False, na=False)]
    df = df.drop_duplicates(subset='id')
    script_dir = os.path.dirname(os.path.abspath(__file__))
    results_path = os.path.join(script_dir, 'results.csv')

    df.to_csv(results_path, index=False, encoding="utf-8")
