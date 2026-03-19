import { useState } from "react";
import API from "../api/axiosClient";
import { useToast } from "../hooks/useToast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await API.post("/contact/send-message", formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-slate-900 min-h-screen transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* PAGE TITLE */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-50 mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto px-4">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* LEFT SIDE - CONTACT INFO */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gray-900 dark:text-slate-50">
              Get in Touch
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-950 p-3 sm:p-4 rounded-xl text-indigo-600 dark:text-indigo-400 text-lg sm:text-xl">
                  ✉
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg dark:text-slate-100">Email</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300">
                    supporttimelyx@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-950 p-3 sm:p-4 rounded-xl text-indigo-600 dark:text-indigo-400 text-lg sm:text-xl">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg dark:text-slate-100">Phone</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300">
                    0705113030
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 dark:bg-indigo-950 p-4 rounded-xl text-indigo-600 dark:text-indigo-400 text-xl">
                  📍
                </div>
                <div>
                  <h3 className="font-semibold text-lg dark:text-slate-100">Office</h3>
                  <p className="text-gray-600 dark:text-slate-300">
                    Faculty of Engineering, <br />
                    University of Jaffna, <br />
                    Ariviyal Nagar, Killinochchi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="bg-gray-200 dark:bg-slate-800 p-10 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-slate-50">
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-100">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-600 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-100">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-600 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-100">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Your message..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 placeholder-gray-600 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;