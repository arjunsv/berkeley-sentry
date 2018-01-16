from zillowAPI import zillow
import requests

z = zillow()
api_key = "X1-ZWz1g6p3pcqpsb_94p25"
zestimate_result = z.GetZestimate(api_key, zpid=48749425, rentzestimate=True)

# notes
# [lon, lat, bedrooms, bathrooms, ]


r = requests.get('https://data.cityofberkeley.info/resource/s24d-wsnp.json')
