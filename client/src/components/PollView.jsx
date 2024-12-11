import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import client from "../api/client";
import Layout from "./Layout";
import Snackbar from "./Snackbar";

export default function PollView() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessSnack, setShowSuccessSnack] = useState(false);
  const [formKey, setFormKey] = useState(0)
  const [ snackKey, setSnackKey ] = useState(0)

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const { data } = await client.get(`/polls/${id}`);
        setPoll(data);
      } catch (error) {
        console.error(error);
        setError("Poll not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // await Promise.all(
      //   Object.entries(answers).map(([questionId, answerText]) =>
      //     client.post("/votes", {
      //       vote: {
      //         question_id: questionId,
      //         answer_text: answerText,
      //       },
      //     })
      //   )
      // );
      await client.post("/votes", {
        votes: Object.entries(answers).map(([questionId, answerText]) => ({
          question_id: questionId,
          answer_text: answerText,
        })),
      });
      setAnswers({});
      console.log(answers);
      setFormKey(prevKey => prevKey + 1) // setAnswers({}) isnt reseting radio button selectoin
      setSnackKey(prevKey => prevKey + 1)
      setShowSuccessSnack(true);
    } catch (error) {
      setSnackKey(prevKey => prevKey + 1)
      setError(
        error?.response?.data?.error ||
        (error.response?.data?.errors?.base && 
          error.response?.data?.errors?.base[0]) ||
          "You have already voted on this poll"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }

  if (!poll) {
    return (
      <Layout>
        <div>Poll not found</div>
      </Layout>
    );
  }

  return (
    <div className="max-w-2xl mt-12 px-4 bg-gray-550 mx-auto">
      <h1 className="text-2xl font-bold mb-6">{poll.title}</h1>

      <form key={formKey} onSubmit={handleSubmit} className="space-y-6">
        {poll.questions.map((question) => (
          <div key={question.id} className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-500">
              {question.text}
            </h2>
            <div className="space-y-2">
              {question.question_type === "multiple_choice" ? (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        onChange={(e) =>
                          setAnswers({
                            ...answers,
                            [question.id]: e.target.value,
                          })
                        }
                        className="text-blue-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      [question.id]: e.target.value,
                    })
                  }
                  value={answers[question.id] || ""}
                  className="w-full px-3 py-2 text-black border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
                  placeholder="Enter your answer"
                />
              )}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Answers"}
        </button>
      </form>
      
      {showSuccessSnack && (
        <Snackbar
          message="Poll answered successfuly!!"
          onClose={() => setShowSuccessSnack(false)}
        />
      )}
      {error && (
        <Snackbar key={snackKey} message={error} isError={true} onClose={() => setError("")} />
      )}
    </div>
  );
}
