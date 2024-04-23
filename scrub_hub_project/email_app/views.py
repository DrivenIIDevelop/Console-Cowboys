from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from bs4 import BeautifulSoup
from mailjet_rest import Client
from dotenv import load_dotenv
import base64
import os

load_dotenv()

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def send_email(request):
    subject = request.data.get('subject')
    body_html = request.data.get('body') # Assume HTML or plain text is sent in this field
    sender = request.data.get('sender')
    recipient = request.data.get('recipient')
    attachments = request.FILES.getlist('attachment') # Get all attachments

    # Convert HTML to plain text
    soup = BeautifulSoup(body_html, "html.parser")
    body_plain = soup.get_text()

		# Initialize Mailjet client
    api_key = os.getenv('MAILJET_API_KEY')
    api_secret = os.getenv('MAILJET_API_SECRET')
    mailjet = Client(auth=(api_key, api_secret), version='v3.1')

    # Prepare the email data for Mailjet
    data = {
        'Messages': [
            {
                "From": {
                    "Email": sender,
                    "Name": "Your Name" # You can customize this
                },
                "To": [
                    {
                        "Email": recipient,
                        "Name": "Recipient Name" # You can customize this
                    }
                ],
                "Subject": subject,
                "TextPart": body_plain,
                "HTMLPart": body_html,
                "CustomID": "AppGettingStartedTest" # You can customize this
            }
        ]
    }

		# Handle attachments
    if attachments:
      data['Messages'][0]['Attachments'] = []
      for attachment in attachments:
        # Read the file content and encode it in base64
        content = attachment.read()
        encoded_content = base64.b64encode(content).decode('utf-8')
        # Ensure the correct content type for .docx files
        content_type = attachment.content_type if attachment.content_type else 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        # Add the attachment to the email data
        data['Messages'][0]['Attachments'].append({
          "ContentType": content_type,
          "Filename": attachment.name,
          "Base64Content": encoded_content
        })

    # Send the email using Mailjet
    result = mailjet.send.create(data=data)
    if result.status_code == 200:
        return Response({"message": "Email sent successfully"})
    else:
        return Response({"message": "Failed to send email", "error": result.json()}, status=400)
