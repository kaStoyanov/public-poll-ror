import { useState, useMemo } from 'react'
import client from '../api/client'
import Layout from './Layout'
import { useNavigate } from "react-router-dom";

export default function AdminPollCreate() {
  const [title, setTitle] = useState('')
  const [questions, setQuestions] = useState([
    { text: '', question_type: 'text' }
  ])
  const navigate = useNavigate();

  const addQuestion = (type) => {
    setQuestions([...questions, { 
      text: '', 
      question_type: type,
      options: type === 'multiple_choice' ? [''] : undefined 
    }])
  }

  const addOption = (questionIndex) => {
    const newQuestions = [...questions]
    if (!newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options = []
    }
    newQuestions[questionIndex].options.push('')
    setQuestions(newQuestions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await client.post('/polls', {
        poll: {
          title,
          questions_attributes: questions
        }
      })
      navigate("/");
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-100">Poll Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-100 text-black px-2 py-1 border-gray-300"
              placeholder="Enter poll title"
            />
          </div>

          {questions.map((question, qIndex) => (
            <div key={qIndex} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <label className="block pa-2 text-sm font-medium text-gray-100">Question</label>
                <select
                  value={question.question_type}
                  onChange={(e) => {
                    const newQuestions = [...questions]
                    newQuestions[qIndex].question_type = e.target.value
                    newQuestions[qIndex].options = e.target.value === 'multiple_choice' ? [''] : undefined
                    setQuestions(newQuestions)
                  }}
                  className="text-sm text-white px-3 py-2 rounded-md"
                >
                  <option value="text">Text Answer</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>
              
              <input
                value={question.text}
                onChange={(e) => {
                  const newQuestions = [...questions]
                  newQuestions[qIndex].text = e.target.value
                  setQuestions(newQuestions)
                }}
                className="mt-1 block w-full rounded-md bg-gray-100 text-black px-2 py-1 border-gray-300"
                placeholder="Enter question text"
              />

              {question.question_type === 'multiple_choice' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-100">Options</label>
                  {question.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      value={option}
                      onChange={(e) => {
                        const newQuestions = [...questions]
                        newQuestions[qIndex].options[oIndex] = e.target.value
                        setQuestions(newQuestions)
                      }}
                      className="block w-full rounded-md bg-gray-100 text-black px-2 py-1 border-gray-300"
                      placeholder={`Option ${oIndex + 1}`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    + Add Option
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => addQuestion('text')}
              className="text-blue-500 hover:text-blue-600"
            >
              + Add Text Question
            </button>
            <button
              type="button"
              onClick={() => addQuestion('multiple_choice')}
              className="text-blue-500 hover:text-blue-600"
            >
              + Add Multiple Choice Question
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
          >
            Create Poll
          </button>
        </form>
      </div>
    </Layout>
  )
}