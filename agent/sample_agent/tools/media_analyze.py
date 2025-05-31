import requests
import json
from sample_agent.configuration import API_BASE_URL

def analyze_media_url(media_url: str) -> dict:
    """
    Analyzes the given media URL by calling the frontend API.

    Args:
        media_url: The URL of the media to analyze.

    Returns:
        A dictionary containing the analysis results from the API.
        Returns an error dictionary if the API call fails.
    """
    endpoint = "/api/media/analyze"
    full_url = f"{API_BASE_URL}{endpoint}"
    payload = {"url": media_url}

    try:
        response = requests.post(full_url, json=payload)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {e}"}
    except json.JSONDecodeError:
        return {"error": "Failed to decode JSON response from API"}

if __name__ == '__main__':
    # Example usage (for testing purposes)
    sample_url = "http://example.com/sample_media.mp4"
    print(f"Analyzing media URL: {sample_url}")
    analysis_result = analyze_media_url(sample_url)
    print("Analysis Result:")
    print(json.dumps(analysis_result, indent=2))

    # Example with a potentially non-existent or problematic URL for error testing
    # sample_error_url = "http://localhost:3000/nonexistent"  # Assuming this would cause an error
    # print(f"\nAnalyzing media URL (expecting error): {sample_error_url}")
    # error_result = analyze_media_url(sample_error_url)
    # print("Analysis Result (Error):")
    # print(json.dumps(error_result, indent=2))