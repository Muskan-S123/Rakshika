import os, httpx

def send_sos_emails(to_emails: list[str], user_name: str, lat, lng):
    key = os.getenv("RESEND_API_KEY")
    if not key:
        return
    where = f"https://maps.google.com/?q={lat},{lng}" if lat is not None else "Location unavailable"
    for to in to_emails:
        try:
            r=httpx.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {key}"},
                json={
                    "from": "onboarding@resend.dev",
                    "to": [to],
                    "subject": f"SOS from {user_name}",
                    "html": f"<p>{user_name} triggered an SOS.</p><p>{where}</p>",
                },
                timeout=10,
            )
            if r.status_code >=400:
                print("Resend rejected:", to, r.status_code, r.text )
        except Exception as e:
            print("SOS email failed:", to, e)
