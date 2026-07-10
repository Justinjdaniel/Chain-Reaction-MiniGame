import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Navigate to local server
    page.goto("http://localhost:5173")
    page.wait_for_timeout(1000)

    # We should see the dashboard lobby and instructions
    # Find player 2 type select dropdown and toggle to 'human' (it starts as 'ai')
    page.select_option("select:has-text('AI Bot')", "human")
    page.wait_for_timeout(1000)

    # Let's toggle it back to AI Bot
    page.select_option("select:has-text('Human')", "ai")
    page.wait_for_timeout(1000)

    # Take screenshot of the lobby
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    screenshot_path = "/home/jules/verification/screenshots/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot taken and saved to {screenshot_path}")

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
