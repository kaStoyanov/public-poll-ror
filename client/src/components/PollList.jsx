import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";
import Layout from "./Layout";
import { HiChartBar, HiDocumentDuplicate } from "react-icons/hi";
import Snackbar from "./Snackbar";

export default function PollList() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCopyNotification, setShowCopyNotification] = useState(false);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { data } = await client.get("/polls");
        setPolls(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);
  const copyPollLink = (pollId) => {
    setShowCopyNotification(false);
    const pollUrl = `${window.location.origin}/polls/${pollId}`;
    navigator.clipboard.writeText(pollUrl);
    setShowCopyNotification(true);
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 bg-gray-550">
        <h1 className="text-2xl font-bold">Available Polls</h1>
        {polls.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">You have no polls yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <Link to={`/polls/${poll.id}`}>
                  <h2 className="text-xl text-gray-500 font-bold">
                    {poll.title}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    {poll.questions.length} question
                    {poll.questions.length !== 1 && "s"}
                  </p>
                </Link>

                <div className="mt-4 flex justify-end space-x-3">
                  <Link
                    to={`/admin/polls/${poll.id}/results`}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                  >
                    <HiChartBar size={20} />
                  </Link>

                  <button
                    onClick={() => copyPollLink(poll.id)}
                    className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                  >
                    <HiDocumentDuplicate size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {showCopyNotification && (
          <Snackbar
            message="Poll link copied to clipboard!"
            onClose={() => setShowCopyNotification(false)}
          />
        )}
      </div>
    </Layout>
  );
}
