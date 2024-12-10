import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import client from '../api/client'
import Layout from './Layout'

export default function PollResults() {
  const { id } = useParams()
  const [poll, setPoll] = useState(null)
  const [votes, setVotes] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPollAndVotes = async () => {
      try {
        const [pollRes, votesRes] = await Promise.all([
          client.get(`/polls/${id}`),
          client.get(`/polls/${id}/votes`)
        ])
        setPoll(pollRes.data)
        setVotes(votesRes.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPollAndVotes()
  }, [id])

  if (loading) return (
    <Layout>
      <div>Loading...</div>
    </Layout>
  )

  if (!poll) return (
    <Layout>
      <div>Poll not found</div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{poll.title} - Results</h1>
        
        <div className="space-y-8">
          {poll.questions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl text-gray-500 font-semibold mb-4">{question.text}</h2>
              
              {question.question_type === 'multiple_choice' ? (
                <div className="space-y-4">
                  {question.options.map((option) => {
                    const voteCount = votes[question.id]?.filter(v => v.answer_text === option).length || 0
                    const percentage = votes[question.id]?.length 
                      ? ((voteCount / votes[question.id].length) * 100).toFixed(1)
                      : 0

                    return (
                      <div key={option} className="space-y-1">
                        <div className="flex justify-between">
                          <span className='text-gray-500'>{option}</span>
                          <span className='text-gray-500'>{voteCount} votes ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {votes[question.id]?.map((vote, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-500 font-semibold rounded-md"
                    >
                      {vote.answer_text}
                    </div>
                  ))}
                  {(!votes[question.id] || votes[question.id].length === 0) && (
                    <p className="text-gray-500">No responses yet</p>
                  )}
                </div>
              )}
              
              <div className="mt-4 text-md text-gray-500">
                Total responses: <span className='font-bold'>{votes[question.id]?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}