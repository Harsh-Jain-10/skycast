from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_search_cities_invalid_length():
    response = client.get("/api/weather/search?q=a")
    # Query must be at least 2 chars long (validation error)
    assert response.status_code == 422

def test_search_cities_valid():
    response = client.get("/api/weather/search?q=london")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_weather_no_params():
    response = client.get("/api/weather")
    # Missing parameters (lat/lon or q) should trigger 400 error
    assert response.status_code == 400

def test_get_weather_invalid_city():
    response = client.get("/api/weather?q=ThisIsAVeryFakeCityNameThatDoesNotExist")
    assert response.status_code == 404
