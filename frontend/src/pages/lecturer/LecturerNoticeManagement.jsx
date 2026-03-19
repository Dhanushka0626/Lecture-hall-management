import { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import API from "../../api/axiosClient";
import { AuthContext } from "../../context/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useToast } from "../../hooks/useToast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const LecturerNoticeManagement = () => {

  // notices will be loaded from the backend; start empty
  const [notices, setNotices] = useState([]);
  const [incomingNotices, setIncomingNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const location = useLocation();
  const [openedNoticeId, setOpenedNoticeId] = useState(null);
  const autoOpenedNoticeIdRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const resp = await API.get('/notifications');
      const data = resp.data || [];
      
      // Separate incoming and published
      const incoming = data.filter(n => n.isIncoming);
      const published = data.filter(n => !n.isIncoming);
      
      // Map for display
      const mappedPublished = published.map(n => ({
        id: n.id,
        title: n.title || n.message || 'Notice',
        content: n.message,
        courseCode: '',
        audience: '',
        priority: 'Normal',
        date: new Date(n.date).toISOString().split('T')[0],
        isRead: n.isRead
      }));
      
      const mappedIncoming = incoming.map(n => ({
        id: n.id,
        title: n.title || n.message || 'Notice',
        content: n.message,
        author: n.author || 'Unknown',
        date: new Date(n.date).toISOString().split('T')[0],
        isRead: n.isRead
      }));
      
      setNotices(mappedPublished);
      setIncomingNotices(mappedIncoming);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-open notice from URL param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const noticeId = params.get('noticeId');
    if (noticeId && autoOpenedNoticeIdRef.current !== noticeId) {
      autoOpenedNoticeIdRef.current = noticeId;
      setOpenedNoticeId(noticeId);
      handleViewNotice(noticeId);
    }
  }, [location.search]);

  const handleViewNotice = async (noticeId) => {
    const notice = incomingNotices.find(n => n.id === noticeId);
    if (!notice) return;

    // Set selected notice to display in modal
    setSelectedNotice(notice);

    // Mark as read if not already
    if (!notice.isRead) {
      try {
        await API.put(`/notifications/${noticeId}/read`);
        // Update local state
        setIncomingNotices(incomingNotices.map(n => 
          n.id === noticeId ? { ...n, isRead: true } : n
        ));
        // Notify navbar to refresh badge count
        window.dispatchEvent(new Event('lecturerDashboardChange'));
      } catch (err) {
        console.error('Failed to mark notice as read:', err);
      }
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    courseCode: "",
    audience: "",
    priority: "",
  });

  /* HANDLERS */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {

    const send = async () => {
      try {
        // determine payload for backend
        const payload = { message: formData.content };

        if (formData.audience && formData.audience.startsWith('Batch')) {
          const parts = formData.audience.split(' ');
          if (parts.length > 1) payload.batch = parts[1];
        } else if (formData.audience && formData.audience.toLowerCase().includes('students')) {
          payload.receiverRole = 'STUDENT';
        } else if (formData.audience && formData.audience.toLowerCase().includes('lecturer')) {
          payload.receiverRole = 'LECTURER';
        }

        if (formData.courseCode) payload.course = formData.courseCode;

        // send to backend API
        await API.post('/notifications', payload);

        // refresh the list from backend so UI shows latest
        await fetchNotifications();
        setShowModal(false);
        setEditingNotice(null);
        setFormData({
          title: "",
          content: "",
          courseCode: "",
          audience: "",
          priority: "",
        });

        toast.success('Notification sent');
      } catch (err) {
        console.error('Failed to send notification', err);
        const serverMsg = err?.response?.data?.message || err?.message || 'Failed to send notification';
        toast.error(serverMsg);
      }
    };

    send();
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData(notice);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setNotices(notices.filter((n) => n.id !== id));
  };

  const handleIncomingNoticeClick = (noticeId) => {
    handleViewNotice(noticeId);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300";
      case "Medium":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300";
      default:
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300";
    }
  };

  return (
    <DashboardLayout role="lecturer">

      <div className="space-y-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-slate-100">
              Notice Management
            </h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2">
              Manage incoming notifications and publish announcements
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            <Plus size={18} />
            Post New Notice
          </button>
        </div>

        {/* RECEIVED NOTICES */}
        {incomingNotices.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Received Notifications</h2>
            <div className="space-y-4">
              {incomingNotices.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => handleIncomingNoticeClick(notice.id)}
                  className={`border rounded-2xl p-6 cursor-pointer transition ${
                    notice.isRead
                      ? 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                  } hover:shadow-sm`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                        From: {notice.author}
                      </p>
                    </div>
                    {!notice.isRead && (
                      <span className="px-3 py-1 bg-amber-600 text-white text-xs rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                    {notice.content}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-slate-500 mt-4">
                    {notice.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PUBLISHED NOTICES */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Published Notices</h2>
          <div className="space-y-6">

            {notices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm p-8 hover:shadow-md transition-colors"
              >

                <div className="flex justify-between items-start mb-4">

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {notice.courseCode} • {notice.audience}
                    </p>
                  </div>

                  <span
                    className={`text-sm px-4 py-1 rounded-full ${getPriorityStyle(
                      notice.priority
                    )}`}
                  >
                    {notice.priority}
                  </span>

                </div>

                <p className="text-gray-600 dark:text-slate-400 mb-6">
                  {notice.content}
                </p>

                <div className="flex justify-between items-center">

                  <span className="text-sm text-gray-400 dark:text-slate-500">
                    Posted on {notice.date}
                  </span>

                  <div className="flex gap-4">

                    <button
                      onClick={() => handleEdit(notice)}
                      className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="flex items-center gap-2 text-red-600 hover:underline text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden transition-colors">
            {/* HEADER */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-start gap-4 flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-slate-100 break-words">
                  {selectedNotice.title || 'Notification'}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNotice.category && (
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                      {selectedNotice.category}
                    </span>
                  )}
                  {selectedNotice.isRead && (
                    <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                      Read
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 text-3xl font-light"
              >
                ×
              </button>
            </div>

            {/* METADATA */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm flex-shrink-0 transition-colors">
              <div className="min-w-0">
                <p className="text-gray-500 dark:text-slate-400 font-medium text-xs sm:text-sm">From</p>
                <p className="text-gray-900 dark:text-slate-100 mt-1 break-words text-sm">{selectedNotice.author || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-slate-400 font-medium">Sent Date</p>
                <p className="text-gray-900 dark:text-slate-100 mt-1">{new Date(selectedNotice.date).toLocaleString()}</p>
              </div>
              {selectedNotice.readAt && (
                <div>
                  <p className="text-gray-500 dark:text-slate-400 font-medium">Read Date</p>
                  <p className="text-gray-900 dark:text-slate-100 mt-1">{new Date(selectedNotice.readAt).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* CONTENT - SCROLLABLE */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 min-h-0">
              <div className="text-gray-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words word-break">
                {selectedNotice.content || selectedNotice.message}
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 flex justify-end gap-3 flex-shrink-0 transition-colors">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 sm:px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 w-full max-w-2xl rounded-2xl p-8 shadow-xl space-y-6 transition-colors">

            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              {editingNotice ? "Edit Notice" : "Create New Notice"}
            </h2>

            <div className="space-y-4">

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Notice Title"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-3 transition-colors"
              />

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your notice here..."
                rows="4"
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-3 transition-colors"
              />

              <div className="grid grid-cols-2 gap-4">

                <select
                  name="courseCode"
                  value={formData.courseCode}
                  onChange={handleChange}
                  className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-3 transition-colors"
                >
                  <option value="">Select Course</option>
                  <option value="SE301">Software engineering</option>
                  <option value="DB302">Database systems</option>
                </select>

                <select
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-3 transition-colors"
                >
                  <option value="">Select Audience</option>
                  <option value="Batch 2024">E22</option>
                  <option value="Batch 2025">E23</option>
                </select>

              </div>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 rounded-lg px-4 py-3 transition-colors"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Normal">Normal</option>
              </select>

            </div>

            <div className="flex justify-end gap-4 pt-4">

              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded-lg"
              >
                {editingNotice ? "Update Notice" : "Post Notice"}
              </button>

            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LecturerNoticeManagement;