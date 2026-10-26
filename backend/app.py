# for backend local runnning ----
# uvicorn app:app --reload --port 5000
# python app.py


# for server run -------
# uvicorn app:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips="*"

import os
import json
import time
import shutil
import smtplib
import threading
import urllib.request
import urllib.error
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Request, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from werkzeug.utils import secure_filename  # pip install werkzeug (Flask ke saath already aata hai)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_FILE = os.path.join(BASE_DIR, '.env')

# Explicitly load .env from backend folder or root
if os.path.exists(ENV_FILE):
    load_dotenv(ENV_FILE, override=True)
else:
    load_dotenv(override=True)

app = FastAPI(title="LMS Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

COURSES_FILE = os.path.join(BASE_DIR, 'courses.json')
ADMISSIONS_FILE = os.path.join(BASE_DIR, 'admissions.json')
STUDY_MATERIALS_FILE = os.path.join(BASE_DIR, 'study_materials.json')
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# /uploads/<filename> se images serve hongi
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'pdf', 'mp4'}

# Admin credentials
ADMIN_USER = os.environ.get('ADMIN_USER', 'admin')
ADMIN_PASS = os.environ.get('ADMIN_PASS', 'admin@0025')

# Mail config (.env se)
SMTP_USER = os.environ.get('SMTP_USER', '').strip()
SMTP_PASS = os.environ.get('SMTP_PASS', '').strip()
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', SMTP_USER)

file_lock = threading.Lock()


def get_recipients():
    """
    Returns list of admin recipient emails.
    Supports ADMIN_EMAILS (comma/semicolon separated), ADMIN_EMAIL, or SMTP_USER.
    """
    try:
        if os.path.exists(ENV_FILE):
            load_dotenv(ENV_FILE, override=True)
        else:
            load_dotenv(override=True)
    except Exception:
        pass
    raw = os.environ.get('ADMIN_EMAILS') or os.environ.get('ADMIN_EMAIL') or os.environ.get('SMTP_USER', '') or ''
    cleaned = raw.replace(';', ',')
    recipients = [e.strip() for e in cleaned.split(',') if e.strip() and '@' in e]
    smtp_user = os.environ.get('SMTP_USER', '').strip()
    return recipients or ([smtp_user] if smtp_user else [])


def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_json(filepath, data):
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False


def load_json(filepath, default_val=None):
    if default_val is None:
        default_val = []
    if not os.path.exists(filepath):
        save_json(filepath, default_val)
        return default_val
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return default_val


def error(message: str, status: int):
    return JSONResponse(status_code=status, content={'success': False, 'error': message})


# ─── HTTPS EMAIL CLIENTS (FOR RENDER / CLOUD HOSTING) ─────────────────────────
def send_via_brevo_api(api_key: str, sender_email: str, recipients: list, subject: str, html_body: str, plain_body: str, reply_to: str = "") -> bool:
    """
    Sends email via Brevo HTTPS REST API (Port 443).
    Bypasses Render's outbound SMTP port blocking (ports 25, 465, 587 are blocked on Free Tier).
    Free tier allows 300 emails/day forever with verified personal sender address (e.g. Gmail).
    """
    try:
        url = "https://api.brevo.com/v3/smtp/email"
        payload = {
            "sender": {
                "name": "The Prime Career Admissions",
                "email": sender_email
            },
            "to": [{"email": r.strip()} for r in recipients if r.strip() and '@' in r],
            "subject": subject,
            "htmlContent": html_body,
            "textContent": plain_body
        }
        if reply_to and '@' in reply_to:
            payload["replyTo"] = {"email": reply_to.strip()}

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json",
                "User-Agent": "LMS-FastAPI-Brevo/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            resp_data = resp.read().decode("utf-8", errors="ignore")
            print(f"[BREVO SUCCESS] Email dispatched via HTTPS API (Status {resp.status}): {resp_data}")
            return True
    except urllib.error.HTTPError as he:
        body = he.read().decode('utf-8', errors='ignore')
        print(f"[BREVO HTTP ERROR {he.code}] {body}")
        return False
    except Exception as ex:
        print(f"[BREVO ERROR] {ex}")
        return False


def send_via_resend_api(api_key: str, sender_email: str, recipients: list, subject: str, html_body: str, plain_body: str, reply_to: str = "") -> bool:
    """
    Sends email via Resend HTTPS REST API (Port 443).
    """
    try:
        url = "https://api.resend.com/emails"
        from_email = sender_email if ("@" in sender_email and not sender_email.lower().endswith("@gmail.com")) else "The Prime Career Admissions <onboarding@resend.dev>"
        payload = {
            "from": from_email,
            "to": [r.strip() for r in recipients if r.strip() and '@' in r],
            "subject": subject,
            "html": html_body,
            "text": plain_body
        }
        if reply_to and '@' in reply_to:
            payload["reply_to"] = reply_to.strip()

        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "LMS-FastAPI-Resend/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            resp_data = resp.read().decode("utf-8", errors="ignore")
            print(f"[RESEND SUCCESS] Email dispatched via HTTPS API (Status {resp.status}): {resp_data}")
            return True
    except urllib.error.HTTPError as he:
        body = he.read().decode('utf-8', errors='ignore')
        print(f"[RESEND HTTP ERROR {he.code}] {body}")
        return False
    except Exception as ex:
        print(f"[RESEND ERROR] {ex}")
        return False


def send_via_webhook(webhook_url: str, record: dict, recipients: list, subject: str, html_body: str, plain_body: str) -> bool:
    """
    Sends email payload to a custom HTTPS Webhook (e.g. Google Apps Script Web App).
    """
    try:
        payload = {
            "to": ", ".join(recipients),
            "recipients": recipients,
            "subject": subject,
            "htmlBody": html_body,
            "html": html_body,
            "plainBody": plain_body,
            "text": plain_body,
            "replyTo": record.get("email", ""),
            "record": record
        }
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            webhook_url,
            data=data,
            headers={
                "Content-Type": "application/json",
                "User-Agent": "LMS-FastAPI-Webhook/1.0"
            },
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            print(f"[WEBHOOK SUCCESS] Email delivered via Webhook (Status {resp.status})")
            return True
    except Exception as ex:
        print(f"[WEBHOOK ERROR] {ex}")
        return False


def send_via_direct_smtp(smtp_user: str, smtp_pass: str, recipients: list, subject: str, html_body: str, plain_body: str, reply_to: str = "") -> bool:
    """
    Sends email via direct Gmail SMTP socket (Port 587 STARTTLS / Port 465 SSL).
    Note: Works on Localhost or Paid hosting. Blocked on Render Free Tier.
    """
    msg = MIMEMultipart('alternative')
    msg['From'] = f"The Prime Career Admissions <{smtp_user}>"
    msg['To'] = ", ".join(recipients)
    msg['Subject'] = subject
    if reply_to:
        msg['Reply-To'] = reply_to
    msg.attach(MIMEText(plain_body, 'plain', 'utf-8'))
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    # Step 1: Port 587 STARTTLS (4-second timeout to avoid locking Render workers)
    try:
        print(f"[SMTP 587] Attempting smtp.gmail.com:587 for {len(recipients)} recipient(s)...")
        server = smtplib.SMTP('smtp.gmail.com', 587, timeout=4)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, recipients, msg.as_string())
        server.quit()
        print(f"[SMTP 587 SUCCESS] Email sent to: {', '.join(recipients)}")
        return True
    except Exception as e587:
        print(f"[SMTP 587 WARN] Port 587 failed: {e587}. Trying Port 465 (SSL)...")

    # Step 2: Fallback to Port 465 SSL (4-second timeout)
    try:
        server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=4)
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, recipients, msg.as_string())
        server.quit()
        print(f"[SMTP 465 SUCCESS] Email sent via SSL 465 to: {', '.join(recipients)}")
        return True
    except Exception as e465:
        print(f"[SMTP 465 ERROR] Port 465 also failed: {e465}")
        return False


# ─── MAIN EMAIL DISPATCHER ────────────────────────────────────────────────────
def send_admission_mail(record: dict) -> bool:
    try:
        if os.path.exists(ENV_FILE):
            load_dotenv(ENV_FILE, override=True)
        else:
            load_dotenv(override=True)
    except Exception:
        pass

    recipients = get_recipients()
    if not recipients:
        print("[MAIL ERROR] Koi recipient email address configured nahi hai")
        return False

    smtp_user = os.environ.get('SMTP_USER', '').strip() or 'theprimecareers@gmail.com'
    smtp_pass = os.environ.get('SMTP_PASS', '').strip().replace(' ', '')
    brevo_api_key = os.environ.get('BREVO_API_KEY', '').strip()
    resend_api_key = os.environ.get('RESEND_API_KEY', '').strip()
    webhook_url = os.environ.get('EMAIL_WEBHOOK_URL', '').strip()

    subject = f"🎓 New Admission Ticket #{record['id']} - {record['name']} ({record['course']})"

    plain_body = f"""==================================================
        NEW COURSE ENROLLMENT / ADMISSION TICKET
==================================================

Application / Ticket ID : {record['id']}
Student Name            : {record['name']}
Father's Name           : {record['fatherName']}
Selected Course         : {record['course']}
Qualification           : {record.get('education', 'N/A')} ({record.get('branch', 'N/A')})
Mobile / WhatsApp       : {record['phone']}
Student Email           : {record['email']}
State                   : {record.get('state', 'N/A')}
District                : {record.get('district', 'N/A')}
City                    : {record.get('city', 'N/A')}
Pincode                 : {record.get('pincode', 'N/A')}
Free Hostel Facility    : {'YES (Free Stay Allotted - No Rent)' if record.get('hostelRequired') else 'No'}
Submission Time         : {record.get('createdAt', datetime.now().strftime('%d %b %Y, %I:%M %p'))}
Status                  : Pending Verification

==================================================
The Prime Career Admissions System
"""

    html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }}
    .container {{ max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }}
    .header {{ background: linear-gradient(135deg, #1d4ed8, #4338ca); color: #ffffff; padding: 28px 24px; text-align: center; }}
    .ticket-badge {{ display: inline-block; background: #fbbf24; color: #1e293b; font-weight: 800; font-size: 11px; padding: 4px 14px; border-radius: 9999px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; }}
    .title {{ font-size: 22px; font-weight: 900; margin: 0 0 4px 0; color: #ffffff; }}
    .sub {{ font-size: 13px; color: #bfdbfe; margin: 0; }}
    .ticket-box {{ background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 14px; padding: 14px; margin: 20px 24px; text-align: center; }}
    .ticket-label {{ font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }}
    .ticket-val {{ font-size: 24px; font-weight: 900; font-family: 'Courier New', monospace; color: #1d4ed8; letter-spacing: 0.08em; }}
    .content {{ padding: 0 24px 24px 24px; }}
    table {{ width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 6px; }}
    td {{ padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }}
    td.label {{ color: #64748b; font-weight: 600; width: 36%; }}
    td.value {{ color: #0f172a; font-weight: 700; }}
    .badge-green {{ color: #047857; font-weight: 800; background: #d1fae5; padding: 4px 10px; border-radius: 6px; display: inline-block; font-size: 12px; }}
    .footer {{ background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="ticket-badge">New Student Enrollment Ticket</div>
      <h1 class="title">The Prime Career Admissions</h1>
      <p class="sub">A new student has submitted their course admission form</p>
    </div>
    
    <div class="ticket-box">
      <div class="ticket-label">Application / Ticket ID</div>
      <div class="ticket-val">{record['id']}</div>
    </div>
    
    <div class="content">
      <table>
        <tr>
          <td class="label">Student Full Name</td>
          <td class="value">{record['name']}</td>
        </tr>
        <tr>
          <td class="label">Father's Name</td>
          <td class="value">{record['fatherName']}</td>
        </tr>
        <tr>
          <td class="label">Selected Course</td>
          <td class="value" style="color: #1d4ed8; font-size: 14px;">{record['course']}</td>
        </tr>
        <tr>
          <td class="label">Qualification & Branch</td>
          <td class="value">{record.get('education', 'N/A')} ({record.get('branch', 'N/A')})</td>
        </tr>
        <tr>
          <td class="label">Mobile / WhatsApp</td>
          <td class="value"><a href="tel:{record['phone']}" style="color: #1d4ed8; text-decoration: none;">{record['phone']}</a></td>
        </tr>
        <tr>
          <td class="label">Email Address</td>
          <td class="value"><a href="mailto:{record['email']}" style="color: #1d4ed8; text-decoration: none;">{record['email']}</a></td>
        </tr>
        <tr>
          <td class="label">State & District</td>
          <td class="value">{record.get('state', 'N/A')} - {record.get('district', 'N/A')}</td>
        </tr>
        <tr>
          <td class="label">City & Pincode</td>
          <td class="value">{record.get('city', 'N/A')} - {record.get('pincode', 'N/A')}</td>
        </tr>
        <tr>
          <td class="label">Free Hostel Facility</td>
          <td class="value"><span class="badge-green">{'YES (Free Stay Room - No Rent)' if record.get('hostelRequired') else 'No'}</span></td>
        </tr>
        <tr>
          <td class="label">Enrollment Time</td>
          <td class="value" style="color: #64748b; font-weight: 500;">{record.get('createdAt', '')}</td>
        </tr>
      </table>
    </div>
    
    <div class="footer">
      Delivered to {len(recipients)} administrator email(s): {', '.join(recipients)}
    </div>
  </div>
</body>
</html>"""

    # 1. PRIORITY 1: Brevo HTTPS REST API (Port 443 - Recommended for Render Free Tier)
    if brevo_api_key:
        print(f"[MAIL] Sending via Brevo HTTPS API (Port 443) for {len(recipients)} recipient(s)...")
        if send_via_brevo_api(brevo_api_key, smtp_user, recipients, subject, html_body, plain_body, reply_to=record.get('email', '')):
            print(f"[MAIL SUCCESS] Ticket #{record['id']} delivered via Brevo API")
            return True
        print("[MAIL WARN] Brevo API failed, trying next configured method...")

    # 2. PRIORITY 2: Resend HTTPS REST API (Port 443)
    if resend_api_key:
        print(f"[MAIL] Sending via Resend HTTPS API (Port 443) for {len(recipients)} recipient(s)...")
        if send_via_resend_api(resend_api_key, smtp_user, recipients, subject, html_body, plain_body, reply_to=record.get('email', '')):
            print(f"[MAIL SUCCESS] Ticket #{record['id']} delivered via Resend API")
            return True
        print("[MAIL WARN] Resend API failed, trying next configured method...")

    # 3. PRIORITY 3: HTTPS Webhook (Port 443 - Google Apps Script / Zapier)
    if webhook_url:
        print(f"[MAIL] Sending via HTTPS Webhook (Port 443) for {len(recipients)} recipient(s)...")
        if send_via_webhook(webhook_url, record, recipients, subject, html_body, plain_body):
            print(f"[MAIL SUCCESS] Ticket #{record['id']} delivered via Webhook")
            return True
        print("[MAIL WARN] Webhook failed, trying direct SMTP...")

    # 4. PRIORITY 4: Direct Gmail SMTP (Port 587/465)
    # Note: On Localhost or Paid Clouds, this works 100%. On Render Free Tier, ports 587/465 are blocked by firewall.
    if smtp_user and smtp_pass:
        print(f"[MAIL] Attempting direct Gmail SMTP socket for {len(recipients)} recipient(s)...")
        if send_via_direct_smtp(smtp_user, smtp_pass, recipients, subject, html_body, plain_body, reply_to=record.get('email', '')):
            print(f"[MAIL SUCCESS] Ticket #{record['id']} delivered via Gmail SMTP")
            return True

    print("[MAIL ERROR] All configured mail delivery methods failed or none were configured.")
    return False


# ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
@app.get('/api/health')
def health():
    try:
        if os.path.exists(ENV_FILE):
            load_dotenv(ENV_FILE, override=True)
        else:
            load_dotenv(override=True)
    except Exception:
        pass

    smtp_user = os.environ.get('SMTP_USER', '').strip()
    smtp_pass = os.environ.get('SMTP_PASS', '').strip()
    brevo_key = os.environ.get('BREVO_API_KEY', '').strip()
    resend_key = os.environ.get('RESEND_API_KEY', '').strip()
    webhook_url = os.environ.get('EMAIL_WEBHOOK_URL', '').strip()

    active_methods = []
    if brevo_key:
        active_methods.append('Brevo HTTPS API (Port 443 - Cloud/Render Recommended)')
    if resend_key:
        active_methods.append('Resend HTTPS API (Port 443)')
    if webhook_url:
        active_methods.append('HTTPS Webhook (Port 443)')
    if smtp_user and smtp_pass:
        active_methods.append('Direct Gmail SMTP (Port 587/465 - Local/Paid Host)')

    return {
        'status': 'ok',
        'backend': 'Python FastAPI LMS Server',
        'recipients': get_recipients(),
        'smtp_configured': bool(active_methods),
        'mail_methods': active_methods,
        'time': datetime.now().isoformat()
    }


# ─── MAIL TEST API (SUPPORTS BOTH GET AND POST) ────────────────────────────────
@app.get('/api/test-mail')
@app.post('/api/test-mail')
def test_mail_endpoint():
    try:
        if os.path.exists(ENV_FILE):
            load_dotenv(ENV_FILE, override=True)
        else:
            load_dotenv(override=True)
    except Exception:
        pass

    recipients = get_recipients()
    smtp_user = os.environ.get('SMTP_USER', '').strip() or 'theprimecareers@gmail.com'
    smtp_pass = os.environ.get('SMTP_PASS', '').strip()
    brevo_key = os.environ.get('BREVO_API_KEY', '').strip()
    resend_key = os.environ.get('RESEND_API_KEY', '').strip()
    webhook_url = os.environ.get('EMAIL_WEBHOOK_URL', '').strip()

    active_transport = []
    if brevo_key:
        active_transport.append('Brevo HTTPS API (Port 443)')
    if resend_key:
        active_transport.append('Resend HTTPS API (Port 443)')
    if webhook_url:
        active_transport.append('HTTPS Webhook (Port 443)')
    if smtp_user and smtp_pass:
        active_transport.append('Direct Gmail SMTP (Port 587/465)')

    if not active_transport:
        return JSONResponse(status_code=400, content={
            'success': False,
            'message': 'No email delivery method configured in environment. Set BREVO_API_KEY (for Render) or SMTP_USER/SMTP_PASS.',
            'recipients': recipients
        })

    dummy_record = {
        'id': f"TEST-{int(time.time())}",
        'name': "Test Candidate",
        'fatherName': "Test Parent",
        'city': "New Delhi",
        'district': "Central",
        'email': smtp_user,
        'phone': "9876543210",
        'course': "Aviation & Cabin Crew (System Test)",
        'hostelRequired': True,
        'createdAt': datetime.now().strftime("%d %b %Y, %I:%M %p"),
    }

    success = send_admission_mail(dummy_record)
    if success:
        return {
            'success': True,
            'message': f"Test email successfully delivered to {len(recipients)} recipient(s): {', '.join(recipients)}",
            'recipients': recipients,
            'active_transport': active_transport
        }
    return JSONResponse(status_code=500, content={
        'success': False,
        'message': 'Failed to send email. If running on Render Free Tier, note that Render blocks outbound SMTP ports 587 and 465. Add BREVO_API_KEY in Render Environment Variables to send over Port 443 HTTPS.',
        'recipients': recipients,
        'active_transport': active_transport
    })



# ─── FILE UPLOAD API ──────────────────────────────────────────────────────────
@app.post('/api/upload', status_code=201)
def upload_file(
    request: Request,
    file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
):
    upload = file or image
    if upload is None:
        return error('No file part in request', 400)
    if not upload.filename:
        return error('No selected file', 400)
    if not allowed_file(upload.filename):
        return error('Invalid file type. Allowed: png, jpg, jpeg, webp, gif, svg', 400)

    filename = f"course_{int(time.time())}_{secure_filename(upload.filename)}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    with open(filepath, 'wb') as f:
        shutil.copyfileobj(upload.file, f)

    host = str(request.base_url).rstrip('/')
    return {
        'success': True,
        'url': f"{host}/uploads/{filename}",
        'filename': filename,
        'message': 'Image uploaded successfully'
    }


# ─── ADMIN AUTHENTICATION ─────────────────────────────────────────────────────
@app.post('/api/admin/login')
def admin_login(data: dict = Body(default={})):
    user_id = str(data.get('id', '')).strip()
    password = str(data.get('password', '')).strip()

    # 'admin' ya 'admin@lms.com' dono chalenge
    if user_id.lower() in [ADMIN_USER.lower(), 'admin@lms.com'] and password == ADMIN_PASS:
        return {
            'success': True,
            'message': 'Login successful',
            'token': f"admin-token-{int(time.time())}",
            'user': {'id': user_id, 'role': 'Administrator', 'name': 'LMS Admin'}
        }

    return JSONResponse(status_code=401, content={
        'success': False,
        'message': 'Invalid Admin ID or Password. Please try again ..'
    })


# ─── STUDENT AUTHENTICATION ───────────────────────────────────────────────────
@app.post('/api/student/login')
def student_login(data: dict = Body(default={})):
    email_or_phone = str(data.get('email') or data.get('identifier', '')).strip().lower()
    password = str(data.get('password', '')).strip()

    if not email_or_phone or not password:
        return error('Please enter both Email and Password.', 400)

    admissions = load_json(ADMISSIONS_FILE)

    matched = None
    for a in admissions:
        a_email = str(a.get('email', '')).strip().lower()
        a_phone = str(a.get('phone', '')).strip().lower()
        a_id = str(a.get('id', '')).strip().lower()

        if email_or_phone in [a_email, a_phone, a_id]:
            matched = a
            break

    if not matched:
        return JSONResponse(status_code=404, content={
            'success': False,
            'message': 'No registered admission found with this email. Please check your credentials or register for a course first.'
        })

    stored_pass = str(matched.get('password', '')).strip()
    if stored_pass:
        if stored_pass != password:
            return JSONResponse(status_code=401, content={
                'success': False,
                'message': 'Incorrect password. Please verify your credentials and try again.'
            })
    else:
        # Fallback for admissions created without a password
        if password not in [matched.get('phone'), '123456', password]:
            return JSONResponse(status_code=401, content={
                'success': False,
                'message': 'Incorrect password. Please verify your registered credentials.'
            })

    student_profile = {
        'id': matched.get('id'),
        'name': matched.get('name'),
        'fatherName': matched.get('fatherName'),
        'email': matched.get('email'),
        'phone': matched.get('phone'),
        'course': matched.get('course'),
        'education': matched.get('education'),
        'branch': matched.get('branch'),
        'state': matched.get('state'),
        'district': matched.get('district'),
        'city': matched.get('city'),
        'pincode': matched.get('pincode'),
        'hostelRequired': matched.get('hostelRequired'),
        'createdAt': matched.get('createdAt'),
        'role': 'student',
        'token': f"student-token-{int(time.time())}"
    }

    return {
        'success': True,
        'message': f"Welcome back, {matched.get('name')}!",
        'student': student_profile
    }


# ─── DYNAMIC COURSES API ──────────────────────────────────────────────────────
@app.get('/api/courses')
def get_courses():
    courses = load_json(COURSES_FILE)
    return {'success': True, 'count': len(courses), 'data': courses}


@app.post('/api/courses', status_code=201)
def add_course(data: dict = Body(default={})):
    title = str(data.get('title', '')).strip()
    if not title:
        return error('Course title is required', 400)

    theme = data.get('theme') or {
        'bgGradient': 'from-blue-100/90 via-sky-50/50 to-white',
        'cardBorder': 'border-blue-200/80',
        'iconBg': 'bg-[#0284c7]',
        'btnBg': 'bg-[#0284c7] hover:bg-[#0369a1]',
        'checkColor': 'text-[#0284c7]'
    }

    new_course = {
        'id': f"course-{int(time.time())}",
        'title': title,
        'tagline': data.get('tagline', 'Specialized Career Course'),
        'iconType': data.get('iconType', 'plane'),
        'image': data.get('image', 'aviation'),
        'highlights': data.get('highlights', [
            '100% Practical Training',
            'Industry Certification',
            'Job Placement Support',
            'Live Simulator Labs'
        ]),
        'duration': data.get('duration', '6 Months'),
        'eligibility': data.get('eligibility', '10th / 12th Pass or Graduate'),
        'facilities': data.get('facilities', [
            '✈️ Practical Labs & Simulator Training',
            '🗣️ English Speaking & Personality Grooming',
            '🤝 100% Placement Assistance'
        ]),
        'syllabus': data.get('syllabus', [
            'Industry Fundamentals & Core Concepts',
            'Practical Real-world Training',
            'Advanced Application & Case Studies',
            'Interview Preparation & Soft Skills'
        ]),
        'careerRoles': data.get('careerRoles', 'Industry Specialist, Executive Officer'),
        'theme': theme,
        'createdAt': datetime.now().isoformat()
    }

    with file_lock:
        courses = load_json(COURSES_FILE)
        courses.append(new_course)
        save_json(COURSES_FILE, courses)

    return {'success': True, 'message': 'Course added successfully', 'course': new_course}


@app.put('/api/courses/{course_id}')
def update_course(course_id: str, data: dict = Body(default={})):
    with file_lock:
        courses = load_json(COURSES_FILE)
        for i, c in enumerate(courses):
            if c.get('id') == course_id:
                courses[i] = {**c, **data, 'id': course_id}
                save_json(COURSES_FILE, courses)
                return {'success': True, 'message': 'Course updated successfully'}

    return error('Course not found', 404)


@app.delete('/api/courses/{course_id}')
def delete_course(course_id: str):
    with file_lock:
        courses = load_json(COURSES_FILE)
        filtered = [c for c in courses if c.get('id') != course_id]
        if len(filtered) == len(courses):
            return error('Course not found', 404)
        save_json(COURSES_FILE, filtered)

    return {'success': True, 'message': 'Course deleted successfully'}


# ─── ADMISSIONS REGISTRATION API ──────────────────────────────────────────────
@app.get('/api/admissions')
def get_admissions():
    admissions = load_json(ADMISSIONS_FILE)
    return {'success': True, 'count': len(admissions), 'data': admissions}


@app.post('/api/enroll', status_code=201)
def enroll_student(background_tasks: BackgroundTasks, data: dict = Body(default={})):
    name = str(data.get('name', '')).strip()
    father_name = str(data.get('fatherName', '')).strip()
    education = str(data.get('education', '12th Pass')).strip()
    branch = str(data.get('branch', '')).strip()
    state = str(data.get('state', '')).strip()
    district = str(data.get('district', '')).strip()
    city = str(data.get('city', '')).strip()
    pincode = str(data.get('pincode', '')).strip()
    email = str(data.get('email', '')).strip()
    phone = str(data.get('phone', '')).strip()
    password = str(data.get('password', '')).strip()
    course = data.get('course', 'Aviation Course')
    hostel_required = data.get('hostelRequired', True)

    if not all([name, father_name, email, phone]):
        return error('Name, Father name, email and phone are required', 400)

    app_id = data.get('applicationId') or f"LMS-{int(time.time())}"

    record = {
        'id': app_id,
        'name': name,
        'fatherName': father_name,
        'education': education,
        'branch': branch,
        'state': state,
        'district': district,
        'city': city,
        'pincode': pincode,
        'email': email,
        'phone': phone,
        'password': password,
        'course': course,
        'hostelRequired': hostel_required,
        'createdAt': datetime.now().strftime("%d %b %Y, %I:%M %p"),
        'status': 'Pending Verification'
    }

    with file_lock:
        admissions = load_json(ADMISSIONS_FILE)
        admissions.insert(0, record)
        save_json(ADMISSIONS_FILE, admissions)

    print(f"[LMS Backend] Saved admission for {name} ({course}) - ID: {app_id}")

    # Mail background me jayegi, response slow nahi hoga
    background_tasks.add_task(send_admission_mail, record)

    return {
        'success': True,
        'message': 'Student admission submitted successfully',
        'applicationId': app_id
    }


@app.delete('/api/admissions/{admission_id}')
def delete_admission(admission_id: str):
    with file_lock:
        admissions = load_json(ADMISSIONS_FILE)
        filtered = [a for a in admissions if a.get('id') != admission_id]
        if len(filtered) == len(admissions):
            return error('Admission not found', 404)
        save_json(ADMISSIONS_FILE, filtered)

    return {'success': True, 'message': 'Admission removed successfully'}


# ─── STUDY MATERIALS API (VIDEOS & PDFS) ──────────────────────────────────────
@app.get('/api/materials')
def get_materials(course: Optional[str] = None):
    materials = load_json(STUDY_MATERIALS_FILE)
    if course:
        course_clean = course.strip().lower()
        # Loose match so 'Aviation' matches 'Aviation Course' or 'Aviation - Cabin Crew'
        filtered = [
            m for m in materials
            if course_clean in m.get('course', '').lower() or m.get('course', '').lower() in course_clean
        ]
        return {'success': True, 'count': len(filtered), 'data': filtered}
    return {'success': True, 'count': len(materials), 'data': materials}


@app.post('/api/materials', status_code=201)
def add_material(data: dict = Body(default={})):
    title = str(data.get('title', '')).strip()
    url = str(data.get('url', '')).strip()
    course = str(data.get('course', 'Aviation Course')).strip()
    m_type = str(data.get('type', 'video')).strip().lower()  # 'video' or 'pdf'

    if not title:
        return error('Title is required', 400)
    if not url:
        return error('URL / Link is required', 400)

    new_item = {
        'id': f"mat-{int(time.time())}",
        'course': course,
        'type': 'pdf' if m_type == 'pdf' else 'video',
        'title': title,
        'url': url,
        'duration': str(data.get('duration', '15 mins' if m_type == 'video' else '20 Pages')).strip(),
        'description': str(data.get('description', '')).strip(),
        'createdAt': datetime.now().isoformat()
    }

    with file_lock:
        materials = load_json(STUDY_MATERIALS_FILE)
        materials.insert(0, new_item)
        save_json(STUDY_MATERIALS_FILE, materials)

    return {'success': True, 'message': 'Material added successfully', 'material': new_item}


@app.delete('/api/materials/{material_id}')
def delete_material(material_id: str):
    with file_lock:
        materials = load_json(STUDY_MATERIALS_FILE)
        filtered = [m for m in materials if m.get('id') != material_id]
        if len(filtered) == len(materials):
            return error('Material not found', 404)
        save_json(STUDY_MATERIALS_FILE, filtered)

    return {'success': True, 'message': 'Material deleted successfully'}


if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get('PORT', 5000))
    print(f"[SERVER STARTED] FastAPI LMS Backend running on http://localhost:{port}")
    uvicorn.run(app, host='0.0.0.0', port=port)