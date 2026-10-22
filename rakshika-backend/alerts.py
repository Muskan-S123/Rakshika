import os, httpx
from datetime import datetime
from zoneinfo import ZoneInfo
from html import escape

def send_sos_emails(to_emails: list[str], user_name: str, lat, lng, track_url) -> dict:
    key = os.getenv("RESEND_API_KEY")
    if not key:
        print("RESEND_API_KEY is missing")
        return {"sent": 0, "failed": len(to_emails)}

    now = datetime.now(ZoneInfo("Asia/Kolkata")).strftime("%d %b %Y, %I:%M %p IST")
    where = (
        f'<a href="https://maps.google.com/?q={lat},{lng}">Open location in Maps</a>'
        if lat is not None and lng is not None
        else "Location not shared"
    )
    name = escape(user_name)
    sent, failed = 0, 0

    for to in to_emails:
        try:
            r = httpx.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {key}"},
                json={
                    "from": "onboarding@resend.dev",
                    "to": [to],
                    "subject": f"SOS from {user_name}",
                    "html":(
                        f"<p>{name} triggered an SOS at {now}.</p>"
                        f"<p>{where}</p>"
                        f'<p><a href="{escape(track_url)}">Track live location</a></p>'

                    ),
                },
                timeout=10,
            )
            if r.status_code >= 400:
                print("Resend rejected:", to, r.status_code, r.text)
                failed += 1
            else:
                sent += 1
        except Exception as e:
            print("SOS email failed:", to, e)
            failed += 1
  
    print("SOS email result:", {"sent": sent, "failed": failed}, "to:", to_emails)
    return {"sent": sent, "failed": failed}