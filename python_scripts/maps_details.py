import pandas as pd 
from google_apis import create_service

def get_place_details(id):
    client_secret_file = 'client_secret.json'
    API_NAME = 'places'
    API_VERSION = 'v1'
    SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

    service = create_service(client_secret_file, API_NAME, API_VERSION, SCOPES)

    response = service.places().get(
        name = f'places/{id}',
        fields='internationalPhoneNumber,shortFormattedAddress,' \
        'websiteUri,priceLevel,displayName.text,' \
        'primaryTypeDisplayName.text,currentOpeningHours.openNow,' \
        'editorialSummary.text'
    ).execute()

    df = pd.json_normalize(response)
    return df