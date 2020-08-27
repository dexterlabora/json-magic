from pyjsonata import jsonata

my_expression = "$"
my_json = "{'foo': 'bar'}"

# "{'foo': 'bar'}"

try:
    result = jsonata(my_expression, my_json)
except PyjsonataError as e:
    print("Error: ", e)