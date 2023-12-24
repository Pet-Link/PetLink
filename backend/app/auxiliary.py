import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(verification_code, e_mail):
    # Email credentials
    username = ''
    password = ''

    # Email content
    sender_email = ''
    receiver_email = e_mail
    subject = 'Your PetLink Verification Code!'
    body = f"Your verification code is: {verification_code}"

    # Set up the MIME
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


def send_email_mes(mes, about, e_mail):
    # Email credentials
    username = 'petlink011@gmail.com'
    password = 'onho tsfu yncj ymmb'

    # Email content
    sender_email = 'petlink011@gmail.com'
    receiver_email = e_mail
    subject = f'Petlink Notification About {about}!'
    body = f"{mes}"

    # Set up the MIME
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
