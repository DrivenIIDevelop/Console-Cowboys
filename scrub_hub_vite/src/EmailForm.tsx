import React, { useState, FormEvent } from 'react';
import axios from 'axios';

const EmailForm: React.FC = () => {
	const [sender, setSender] = useState<string>('');
	const [recipient, setRecipient] = useState<string>('');
	const [subject, setSubject] = useState<string>('');
	const [body, setBody] = useState<string>('');
	const [attachments, setAttachments] = useState<File[]>([]); // array of file objects

	const sendEmail = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('sender', sender);
    formData.append('recipient', recipient);
    formData.append('subject', subject);
    formData.append('body', body);
    if (attachments) {
			attachments.forEach((attachment) => {
				formData.append('attachment', attachment);
			});
	}
    try {
      const response = await axios.post('http://localhost:8000/api/send-email/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
 };


 const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	if (e.target.files) {
		 setAttachments(prevAttachments => [...prevAttachments, ...Array.from(e.target.files as FileList)]);
	}
 };


 const handleRemoveAttachment = (index: number) => {
	setAttachments(prevAttachments => prevAttachments.filter((_, i) => i !== index));
 };


 return (
    <form onSubmit={sendEmail}>
      <input type="text" placeholder="Sender" value={sender} onChange={(e) => setSender(e.target.value)} />
      <input type="text" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea placeholder="Body (HTML or plain text)" value={body} onChange={(e) => setBody(e.target.value)} />
      <input type="file" multiple onChange={handleAttachmentChange} />
			{/* Showing individual attachments and allowing the removal of files */}
			{attachments.map((attachment, index) => (
 				<div key={index}>
    			<span>{attachment.name}</span>
    			<button onClick={() => handleRemoveAttachment(index)}>Remove</button>
 				</div>
			))}
      <button type="submit">Send Email</button>
    </form>
 );
};


export default EmailForm;
