import { useState, useContext } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { AuthContext } from "../../context/AuthContext";
import lecturerService from "../../services/lecturerService";
import hodService from "../../services/hodService";
import { Search } from "lucide-react";
import { useToast } from "../../hooks/useToast";

const LecturerHallAvailability = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [subject, setSubject] = useState("");
  const [targetBatch, setTargetBatch] = useState("");

  const [halls, setHalls] = useState([]);
  const [allHalls, setAllHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSearch = async () => {
    setError("");

    if (!isAuthenticated()) {
      return setError("Please log in to search available halls.");
    }

    if (!date || !startTime || !endTime) {
      return setError("Please select date and time range.");
    }

    // allow HOD to search/book past dates (they can override)
    if (!(user && user.role === "HOD")) {
      if (date < today) {
        return setError("Cannot book hall for past date.");
      }
    }

    const startMinutes = startTime.split(":")[1] || "";
    const endMinutes = endTime.split(":")[1] || "";
    if (startMinutes !== "00" || endMinutes !== "00") {
      return setError("Please select times on the hour (e.g. 13:00).");
    }

    if (startTime >= endTime) {
      return setError("End time must be after start time.");
    }

    try {
      setLoading(true);

      // require subject selection if user has courses
      if (user && user.courses && user.courses.length > 0 && !subject) {
        return setError("Please select a subject from your allocated courses.");
      }

      const data = await lecturerService.searchAvailableHalls({ date, startTime, endTime, capacity });
      setHalls(data);
    } catch (err) {
      console.error("Search halls error:", err);
      const status = err?.response?.status;
      if (status === 401) {
        // token invalid/expired
        logout();
        return setError("Session expired — please log in again.");
      }
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      setError(serverMsg || "Failed to search halls.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setDate("");
    setStartTime("");
    setEndTime("");
    setCapacity("");
    setSubject("");
    setTargetBatch("");
    setHalls([]);
    setError("");
  };

  const handleBook = async (hallId) => {
    if (!isAuthenticated()) {
      return toast.warning("Please log in to send a booking request.");
    }

    try {
      // ensure subject is selected
      if (user && user.courses && user.courses.length > 0 && !subject) {
        return toast.warning("Please select the subject for this booking.");
      }

      // use HOD booking endpoint (HOD can also override past-time checks)
      await hodService.bookHall({ hallId, date, startTime, endTime, subject, targetBatch, capacity });

      toast.success("Booking request sent successfully!");
      handleSearch();
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        logout();
        return toast.error("Session expired — please log in again.");
      }
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err.message;
      toast.error(serverMsg || "Hall is not available.");
    }
  };

  return (
    <DashboardLayout role="lecturer">
      <div className="space-y-10">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Lecture Hall Availability
          </h1>
          <p className="text-gray-500 mt-2">
            Search and book available lecture halls
          </p>
        </div>

        {/* SEARCH SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">

          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Search & Filter
            </h2>

            <button
              onClick={handleClear}
              className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Clear Filters
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="grid md:grid-cols-4 gap-6">

            <div>
              <label className="text-sm text-gray-600">Date</label>
              <input
                type="date"
                min={user && user.role === "HOD" ? undefined : today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Start Time</label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select start</option>
                {Array.from({ length: 10 }).map((_, idx) => {
                  const i = 8 + idx; // 08..17
                  const hh = (i < 10 ? "0" : "") + i;
                  return (
                    <option key={hh} value={`${hh}:00`}>
                      {`${hh}:00`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">End Time</label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select end</option>
                {Array.from({ length: 10 }).map((_, idx) => {
                  const i = 9 + idx; // 09..18
                  const hh = (i < 10 ? "0" : "") + i;
                  return (
                    <option key={hh} value={`${hh}:00`}>
                      {`${hh}:00`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Min. Capacity</label>
              <input
                type="number"
                placeholder="e.g. 50"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Subject</label>
              {user && user.courses && user.courses.length > 0 ? (
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select subject</option>
                  {user.courses.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>

            <div>
              <label className="text-sm text-gray-600">Target Batch</label>
              <input
                type="text"
                placeholder="e.g. 2024, Y3CSE"
                value={targetBatch}
                onChange={(e) => setTargetBatch(e.target.value)}
                className="mt-1 w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

          </div>

          <button
            onClick={handleSearch}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            <Search size={18} />
            Search Available Halls
          </button>
        </div>

        {/* SEARCH RESULTS */}
        <div>
          <h2 className="text-xl font-semibold mb-6">
            Available Halls ({halls.length})
          </h2>

          {loading ? (
            <p className="text-gray-500">Searching...</p>
          ) : halls.length === 0 ? (
            <div>
              <p className="text-gray-500">
                No halls available for selected time.
              </p>
              <p className="text-sm text-gray-400 mt-2">Note: current system has slots between <strong>08:00</strong> and <strong>18:00</strong>. Please choose times within that range.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {halls.map((hall) => (
                <div
                  key={hall.id}
                  className={`rounded-2xl border p-6 transition hover:shadow-md ${
                    hall.status === "AVAILABLE"
                      ? "bg-white border-gray-200"
                      : "bg-gray-100 border-gray-200 opacity-70"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {hall.name}
                    </h3>

                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            hall.status === "AVAILABLE"
                              ? "bg-green-100 text-green-600"
                              : hall.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {hall.status === "AVAILABLE"
                            ? "Available"
                            : hall.status === "PENDING"
                            ? "Pending"
                            : hall.status === "BOOKED"
                            ? "Booked"
                            : "Unavailable"}
                        </span>
                  </div>

                  <p className="text-gray-600">
                    Capacity: <strong>{hall.capacity} students</strong>
                  </p>

                  <div className="mt-6">
                    {hall.status === "AVAILABLE" ? (
                      <button
                        onClick={() => handleBook(hall.id)}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Book Hall
                      </button>
                    ) : hall.status === "PENDING" ? (
                      <button
                        disabled
                        className="w-full bg-yellow-100 text-yellow-700 py-2 rounded-lg cursor-not-allowed"
                      >
                        Pending Request
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed"
                      >
                        Not Available
                      </button>
                    )}
                  </div>
                  {(hall.status === "PENDING" || hall.status === "BOOKED") && (
                    <div className="mt-3 text-sm text-gray-600">
                      {hall.bookedSlots && hall.bookedSlots.length > 0 && (
                        <div className="text-red-600">Booked: {hall.bookedSlots.join(", ")}</div>
                      )}
                      {hall.lockedSlots && hall.lockedSlots.length > 0 && (
                        <div className="text-yellow-700">Pending: {hall.lockedSlots.join(", ")}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default LecturerHallAvailability;