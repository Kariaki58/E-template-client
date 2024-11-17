// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { Toaster, toast } from 'react-hot-toast';
// import 'quill/dist/quill.snow.css';
// import Quill from 'quill';

// const EmailList = () => {
//   const [emails, setEmails] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [emailContent, setEmailContent] = useState({
//     subject: '',
//     message: '',
//   });
//   const [sending, setSending] = useState(false);

//   const editorRef = useRef(null);
//   const quillInstance = useRef(null);

//   // Initialize the Quill editor when the component mounts
//   useEffect(() => {
//     if (editorRef.current && !quillInstance.current) {
//       quillInstance.current = new Quill(editorRef.current, {
//         theme: 'snow',
//         modules: {
//           toolbar: [
//             [{ header: [1, 2, 3, false] }],
//             ['bold', 'italic', 'underline', 'strike'],
//             [{ color: [] }, { background: [] }],
//             [{ align: [] }],
//             [{ list: 'ordered' }, { list: 'bullet' }],
//             ['image', 'video', 'blockquote', 'code-block'],
//             ['clean'],
//           ],
//         },
//       });

//       // Listen for content changes and update the state with the editor content
//       quillInstance.current.on('text-change', () => {
//         const currentContent = quillInstance.current.root.innerHTML;
//         setEmailContent((prevContent) => ({
//           ...prevContent,
//           message: currentContent,
//         }));
//       });
//     }
//   }, []); // Empty dependency array ensures this only runs once

//   // Fetch email list from the server
//   useEffect(() => {
//     const fetchEmails = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/email`,
//           { withCredentials: true }
//         );
//         if (response.data.error) {
//           throw new Error(response.data.error);
//         }
//         setEmails(response.data.emails);
//       } catch (err) {
//         setError(err.response?.data?.error || 'Please check your internet connection');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmails();
//   }, []);

//   const handleInputChange = (name, value) => {
//     setEmailContent((prevContent) => ({
//       ...prevContent,
//       [name]: value,
//     }));
//   };

//   // Function to send email
//   const handleSendEmail = async () => {
//     setSending(true);

//     if (emailContent.subject.trim() === '') {
//       setSending(false);
//       toast.error('Subject is required');
//       return;
//     }
//     if (emailContent.message.trim() === '<p><br></p>' || emailContent.message.trim() === '') {
//       setSending(false);
//       toast.error('Message is required');
//       return;
//     }

//     try {
//       await axios.post(
//         `${import.meta.env.VITE_APP_BACKEND_BASEURL}/admin/send-email`,
//         emailContent,
//         { withCredentials: true }
//       );
//       toast.success('Emails sent successfully!');
//       setEmailContent({ subject: '', message: '' });
//       if (quillInstance.current) {
//         quillInstance.current.root.innerHTML = ''; // Reset the Quill editor content
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.error || 'Failed to send emails');
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center text-gray-600">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Email List</h1>
//       <div className="flex flex-col lg:flex-row gap-8 flex-1">
//         {/* Email Form Section */}
//         <div className="flex-1 bg-gray-50 p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-6 text-gray-800">Send Email</h2>
//           <div className="space-y-6">
//             {/* Subject Input */}
//             <div>
//               <label className="block text-lg font-medium mb-2 text-gray-700">
//                 Subject
//               </label>
//               <input
//                 type="text"
//                 name="subject"
//                 value={emailContent.subject}
//                 onChange={(e) => handleInputChange(e.target.name, e.target.value)}
//                 className="border border-gray-300 rounded-lg w-full p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="Enter email subject"
//               />
//             </div>

//             {/* Message Input */}
//             <div>
//               <label className="block text-lg font-medium mb-2 text-gray-700">
//                 Message
//               </label>
//               <div
//                 ref={editorRef}
//                 style={{ height: '300px', border: '1px solid #ccc' }}
//               />
//             </div>

//             {/* Send Button */}
//             <button
//               onClick={handleSendEmail}
//               className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-500 transition duration-150 flex items-center justify-center"
//               disabled={sending}
//             >
//               {sending ? (
//                 <span className="flex items-center">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-3 text-white"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path d="M4 12a8 8 0 018-8v8z" fill="currentColor" />
//                   </svg>
//                   Sending...
//                 </span>
//               ) : (
//                 'Send Email'
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//       <Toaster position="bottom-right" />
//     </div>
//   );
// };

// export default EmailList;
