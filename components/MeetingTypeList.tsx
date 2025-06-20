"use client"

import { useState } from "react"
import HomeCard from "./HomeCard"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { toast } from "sonner"
import { Textarea } from "./ui/textarea"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Input } from "./ui/input"

const MeetingTypeList = () => {
    const router = useRouter()
    const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const { user } = useUser()
    const client = useStreamVideoClient()
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })
    const [callDetails, setCallDetails] = useState<Call>()
    
    const createMeeting = async () => {
      if(!client || !user) return

      try {
        if(!values.dateTime){
          toast('Please select a date and time')
          return
        }

        const id = crypto.randomUUID()
        const call = client.call('default', id)

        if(!call) throw new Error('Failed to create call')

        const startAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString()  
        const description = values.description || 'Instant meeting'

        await call.getOrCreate({
          data: {
            starts_at: startAt,
            custom: {
              description
            }
          }
        })

        setCallDetails(call)

        if(!values.description) {
          router.push(`/meeting/${call.id}`)
        }
        toast('Meeting Created')
      } catch (error) {
        console.log(error)
        toast("Failed to create meeting.")
      }
    }

    const handleJoinMeeting = () => {
      if (!values.link) {
        toast('Please enter a meeting link')
        return
      }
      router.push(values.link)
    }

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an instant meeting"
        handleClick={() => setMeetingState('isInstantMeeting')}
        className='bg-orange-500'
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your meeting"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className='bg-blue-500'
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        className='bg-purple-500'
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setMeetingState('isJoiningMeeting')} 
        className='bg-yellow-500'
      />
      
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Create Meeting'
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-100">
              Add a description
            </label>
            <Textarea 
              onChange={(e) => {
                setValues({...values, description: e.target.value})
              }}
              className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
             <label className="text-base text-normal leading-[22px] text-sky-100">
              Select date and time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date: Date | null) => setValues({...values, dateTime: date || new Date()})}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded bg-dark-2 p-2 focus:outline-none text-white"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Meeting Created'
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast('Link copied')
          }}
          image={'/icons/checked.svg'}
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}
      
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an Instant Meeting'
        buttonText='Start Meeting'
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Type the link here'
        buttonText='Join Meeting'
        handleClick={handleJoinMeeting}
      >
        <Input 
          placeholder="Meeting link"
          onChange={(e) => setValues({...values, link: e.target.value})}
          className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </MeetingModal>

    </section>
  )
}

export default MeetingTypeList