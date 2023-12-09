import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(verification_code, e_mail):
    # Email credentials
    username = 'borgahaktanbilen01@gmail.com'
    password = 'nwky zven kavk qidw'

    # Email content
    sender_email = 'hakitaki819@gmail.com'
    receiver_email = e_mail
    subject = 'Your PetLink Verification Code'
    body = f"Your verification code is {verification_code}"

    # Setup the MIME
    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = subject

    # Add body to the email
    message.attach(MIMEText(body, 'plain'))

    # Connect to Gmail's SMTP server
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()  # Secure the connection
        server.login(username, password)  # Login to the email server
        text = message.as_string()
        server.sendmail(sender_email, receiver_email, text)

    return True
