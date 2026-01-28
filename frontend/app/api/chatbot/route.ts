export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the last user message
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || ""

    // Comprehensive emotion detection with specific keywords
    const detectEmotion = (text: string) => {
      // Dangerous/Crisis keywords - highest priority
      const dangerousKeywords = [
        "kill",
        "suicide",
        "suicidal",
        "fatal",
        "deadly",
        "murder",
        "accident",
        "harm myself",
        "end it all",
        "can't go on",
        "want to die",
        "better off dead",
      ]

      // Negative emotions with specific subcategories
      const sadKeywords = [
        "sad",
        "depressed",
        "down",
        "upset",
        "crying",
        "tears",
        "hurt",
        "pain",
        "lonely",
        "miserable",
        "awful",
        "terrible",
        "hopeless",
        "worthless",
        "empty",
        "broken",
        "devastated",
        "heartbroken",
      ]
      const anxiousKeywords = [
        "anxious",
        "worried",
        "nervous",
        "scared",
        "afraid",
        "panic",
        "stress",
        "stressed",
        "overwhelmed",
        "tense",
        "fearful",
        "terrified",
        "paranoid",
        "restless",
      ]
      const angryKeywords = [
        "angry",
        "mad",
        "furious",
        "frustrated",
        "annoyed",
        "irritated",
        "rage",
        "hate",
        "disgusted",
        "outraged",
        "livid",
        "enraged",
        "bitter",
        "resentful",
      ]
      const regretfulKeywords = [
        "regret",
        "regretful",
        "sorry",
        "ashamed",
        "guilty",
        "disappointed",
        "remorseful",
        "embarrassed",
        "humiliated",
      ]
      const melancholicKeywords = [
        "melancholic",
        "sorrowful",
        "gloomy",
        "despondent",
        "dejected",
        "forlorn",
        "mournful",
        "wistful",
        "pensive",
      ]
      const unhappyKeywords = [
        "unhappy",
        "dissatisfied",
        "displeased",
        "troubled",
        "disturbed",
        "unsettled",
        "uncomfortable",
      ]

      // Positive emotions with specific subcategories
      const happyKeywords = [
        "happy",
        "joy",
        "joyful",
        "excited",
        "great",
        "amazing",
        "wonderful",
        "fantastic",
        "good",
        "better",
        "excellent",
        "awesome",
        "brilliant",
        "cheerful",
        "delighted",
        "elated",
        "euphoric",
        "ecstatic",
      ]
      const loveKeywords = [
        "love",
        "loving",
        "adore",
        "cherish",
        "treasure",
        "affection",
        "devoted",
        "passionate",
        "romantic",
        "caring",
      ]
      const contentmentKeywords = [
        "content",
        "contentment",
        "satisfied",
        "peaceful",
        "serene",
        "calm",
        "tranquil",
        "relaxed",
        "comfortable",
        "at ease",
      ]
      const prideKeywords = [
        "proud",
        "pride",
        "accomplished",
        "achieved",
        "successful",
        "confident",
        "self-assured",
        "triumphant",
      ]
      const gratitudeKeywords = ["grateful", "gratitude", "thankful", "blessed", "appreciative", "fortunate", "lucky"]
      const hopeKeywords = [
        "hope",
        "hopeful",
        "optimistic",
        "positive",
        "encouraged",
        "inspired",
        "motivated",
        "uplifted",
      ]
      const blissfulKeywords = [
        "blissful",
        "bliss",
        "heavenly",
        "divine",
        "perfect",
        "magical",
        "enchanted",
        "wonderful",
      ]
      const aweKeywords = [
        "awe",
        "amazed",
        "astonished",
        "impressed",
        "stunned",
        "breathtaking",
        "incredible",
        "remarkable",
      ]

      // Check for dangerous keywords first
      if (dangerousKeywords.some((keyword) => text.includes(keyword))) return "dangerous"

      // Check negative emotions
      if (sadKeywords.some((keyword) => text.includes(keyword))) return "sad"
      if (anxiousKeywords.some((keyword) => text.includes(keyword))) return "anxious"
      if (angryKeywords.some((keyword) => text.includes(keyword))) return "angry"
      if (regretfulKeywords.some((keyword) => text.includes(keyword))) return "regretful"
      if (melancholicKeywords.some((keyword) => text.includes(keyword))) return "melancholic"
      if (unhappyKeywords.some((keyword) => text.includes(keyword))) return "unhappy"

      // Check positive emotions
      if (happyKeywords.some((keyword) => text.includes(keyword))) return "happy"
      if (loveKeywords.some((keyword) => text.includes(keyword))) return "love"
      if (contentmentKeywords.some((keyword) => text.includes(keyword))) return "contentment"
      if (prideKeywords.some((keyword) => text.includes(keyword))) return "pride"
      if (gratitudeKeywords.some((keyword) => text.includes(keyword))) return "gratitude"
      if (hopeKeywords.some((keyword) => text.includes(keyword))) return "hope"
      if (blissfulKeywords.some((keyword) => text.includes(keyword))) return "blissful"
      if (aweKeywords.some((keyword) => text.includes(keyword))) return "awe"

      return "neutral"
    }

    const emotion = detectEmotion(lastMessage)

    // Generate emotion-specific responses with unique recommendations
    const getEmotionResponse = (emotion: string) => {
      switch (emotion) {
        case "dangerous":
          return `🚨 **IMMEDIATE SUPPORT NEEDED** 🚨

I'm very concerned about what you've shared. Your life has value and there are people who want to help you right now.

**🆘 EMERGENCY CONTACTS - CALL NOW:**
• **National Suicide Prevention Lifeline: 988**
• **Crisis Text Line: Text HOME to 741741**
• **Emergency Services: 911**
• **International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/**

**💙 IMMEDIATE STEPS:**
1. **Call 988 right now** - trained counselors are available 24/7
2. **Go to your nearest emergency room** if you're in immediate danger
3. **Call a trusted friend or family member** to stay with you
4. **Remove any means of harm** from your immediate environment

**🌟 REMEMBER:**
• This pain is temporary, but suicide is permanent
• You matter and your life has value
• Help is available and recovery is possible
• Many people who have felt this way have found hope again

**📞 MORE SUPPORT:**
• **SAMHSA National Helpline: 1-800-662-4357**
• **Veterans Crisis Line: 1-800-273-8255**
• **LGBTQ National Hotline: 1-888-843-4564**
• **Teen Line: 1-800-852-8336**

Please reach out for help immediately. You don't have to face this alone. 💚`

        case "sad":
          return `💙 I can feel the sadness in your words, and I want you to know that what you're experiencing is valid and you're not alone.

**🌸 GENTLE HEALING ACTIVITIES:**
• Take a warm, soothing bath with calming scents
• Listen to soft, comforting music or nature sounds
• Wrap yourself in a cozy blanket and have some warm tea
• Look through photos that bring back happy memories
• Write in a journal - let your feelings flow onto paper

**💝 SELF-COMPASSION PRACTICES:**
• Speak to yourself as you would a dear friend
• Practice the "RAIN" technique: Recognize, Allow, Investigate, Nurture
• Try gentle yoga or stretching
• Spend time in nature, even just sitting by a window

**🤝 CONNECTION & SUPPORT:**
• Call a trusted friend or family member
• Consider joining a support group
• Reach out to a counselor or therapist
• **Crisis Support: 988 if you need immediate help**

Remember: Sadness is a natural human emotion. It's okay to feel this way, and these feelings will pass. You are stronger than you know. 🌈`

        case "anxious":
          return `🌊 I understand you're feeling anxious right now. Let's work together to help you find some calm and peace.

**🧘 IMMEDIATE ANXIETY RELIEF:**
• **4-7-8 Breathing**: Inhale for 4, hold for 7, exhale for 8
• **5-4-3-2-1 Grounding**: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
• **Progressive Muscle Relaxation**: Tense and release each muscle group
• **Cold water on wrists** or splash on your face

**🌱 ANXIETY MANAGEMENT TOOLS:**
• Download apps like Headspace, Calm, or Insight Timer
• Practice mindfulness meditation for 5-10 minutes daily
• Try journaling your worries - get them out of your head
• Create a "worry time" - 15 minutes daily to process anxious thoughts

**💪 BUILDING RESILIENCE:**
• Regular exercise (even 10-minute walks help)
• Limit caffeine and alcohol
• Maintain consistent sleep schedule
• Challenge anxious thoughts: "Is this realistic? Is this helpful?"

**📞 PROFESSIONAL SUPPORT:**
• Consider cognitive behavioral therapy (CBT)
• **Anxiety support: 988 for crisis help**
• Look into local anxiety support groups

You're going to get through this. Anxiety feels overwhelming, but you have the strength to manage it. 🌟`

        case "angry":
          return `🔥 I can sense your anger, and that's completely valid. Anger often tells us something important about our boundaries or values.

**⚡ IMMEDIATE ANGER RELEASE:**
• Do 20 jumping jacks or push-ups
• Punch a pillow or scream into it
• Take a cold shower or splash cold water on your face
• Go for a fast walk or run outside
• Listen to loud music and dance it out

**🧠 ANGER PROCESSING TECHNIQUES:**
• **STOP Method**: Stop, Take a breath, Observe, Proceed mindfully
• Count backwards from 100 by 7s
• Write an angry letter (don't send it) - get it all out
• Ask: "What is this anger trying to tell me?"

**💬 HEALTHY COMMUNICATION:**
• Use "I" statements: "I feel frustrated when..."
• Take breaks during heated conversations
• Practice assertive (not aggressive) communication
• Set clear boundaries with others

**🏃 PHYSICAL OUTLETS:**
• Boxing or martial arts classes
• Intense cardio workouts
• Rock climbing or hiking
• Team sports for competitive energy release

Your anger is valid, but how you express it is your choice. You have the power to channel this energy constructively. 💪`

        case "regretful":
          return `💔 I can feel the weight of regret in your words. Regret shows that you care deeply and have learned from your experiences.

**🌱 HEALING FROM REGRET:**
• Practice self-forgiveness - you did the best you could with what you knew then
• Write a letter to yourself offering compassion and understanding
• Focus on what you've learned from this experience
• Consider how this regret can guide better future choices

**🔄 MAKING AMENDS:**
• If possible, apologize to those affected by your actions
• Take concrete steps to make things right
• Commit to different choices moving forward
• Channel regret into positive action

**💝 SELF-COMPASSION PRACTICES:**
• Remember that everyone makes mistakes - you're human
• Practice loving-kindness meditation
• Treat yourself with the same kindness you'd show a friend
• Focus on your growth and positive qualities

**🌟 MOVING FORWARD:**
• Set small, achievable goals for your day or week
• Practice gratitude for the good things in your life
• Be open to new experiences and connections
• Trust that clarity and direction will come with time

I'm here to listen and support you. What would be most helpful for you right now? 💙`

        case "melancholic":
          return `🌙 I sense a deep, reflective sadness in you - that bittersweet feeling that comes with profound contemplation.

**🎨 EMBRACING MELANCHOLY CREATIVELY:**
• Write poetry or in a journal about your feelings
• Listen to beautiful, melancholic music that resonates with your soul
• Create art, draw, or paint your emotions
• Read literature that explores deep human emotions

**🌿 GENTLE SELF-CARE:**
• Take slow, mindful walks in nature
• Practice gentle yoga or tai chi
• Enjoy warm herbal teas while watching the sunset
• Light candles and create a peaceful atmosphere

**💭 PHILOSOPHICAL REFLECTION:**
• Explore what this melancholy is teaching you
• Practice meditation on impermanence and beauty
• Read philosophy or spiritual texts that speak to you
• Consider the beauty in life's bittersweet moments

**🤝 MEANINGFUL CONNECTION:**
• Share your thoughts with someone who appreciates depth
• Seek out others who understand contemplative moods
• Consider therapy to explore these deeper feelings
• Join book clubs or discussion groups about meaningful topics

Melancholy can be a doorway to deeper understanding and appreciation of life's complexity. Honor this feeling while caring for yourself. 🌸`

        case "unhappy":
          return `😔 I hear that you're feeling unhappy, and I want to help you explore what might bring more satisfaction into your life.

**🔍 UNDERSTANDING YOUR UNHAPPINESS:**
• Identify specific areas of dissatisfaction in your life
• Journal about what's missing or what you wish were different
• Consider whether this is temporary or a deeper pattern
• Reflect on your values and whether your life aligns with them

**🌱 SMALL STEPS TO IMPROVEMENT:**
• Make one small positive change in your daily routine
• Set achievable goals that align with your values
• Practice gratitude for 3 things daily, even small ones
• Engage in activities that used to bring you joy

**💪 BUILDING LIFE SATISFACTION:**
• Evaluate your relationships - nurture positive ones
• Consider career or life changes if needed
• Explore new hobbies or interests
• Volunteer for causes you care about

**🎯 CREATING POSITIVE CHANGE:**
• Set boundaries with people or situations that drain you
• Seek therapy to explore deeper sources of unhappiness
• Consider life coaching for goal-setting and motivation
• Join communities of people with similar interests

Unhappiness is often a signal that something needs to change. You have the power to create a more fulfilling life. 🌟`

        case "happy":
          return `🌟 I'm absolutely delighted to hear you're feeling happy! Your joy is contagious and beautiful.

**✨ AMPLIFYING YOUR HAPPINESS:**
• Take a moment to really savor this wonderful feeling
• Share your joy with friends and family - spread the happiness!
• Dance to your favorite upbeat music
• Take photos or create memories of this happy moment

**🎯 BUILDING ON POSITIVE MOMENTUM:**
• Set new exciting goals while you're feeling motivated
• Start a new project or hobby you've been considering
• Plan future activities that bring you joy
• Write down what's making you happy to remember later

**💝 SHARING THE JOY:**
• Do something kind for someone else
• Compliment friends or strangers
• Volunteer for a cause you care about
• Mentor someone who could benefit from your positivity

**🌈 MAINTAINING HAPPINESS:**
• Practice daily gratitude for what's going well
• Keep a happiness journal of positive moments
• Surround yourself with other positive people
• Continue the activities and habits that brought you this joy

Your happiness is a gift - to yourself and to everyone around you. Keep shining bright! 🌞`

        case "love":
          return `💕 What a beautiful emotion to experience! Love in all its forms is one of life's greatest gifts.

**💖 CELEBRATING LOVE:**
• Express your love openly and authentically to those who matter
• Write love letters or notes to people you care about
• Create art, music, or poetry inspired by your loving feelings
• Take time to appreciate the love that surrounds you

**🌹 NURTURING LOVING RELATIONSHIPS:**
• Show appreciation through small, thoughtful gestures
• Practice active listening with your loved ones
• Plan special moments or surprises for those you love
• Be fully present when spending time with loved ones

**💝 SELF-LOVE PRACTICES:**
• Treat yourself with the same kindness you show others
• Practice self-care as an act of self-love
• Celebrate your own growth and achievements
• Forgive yourself for past mistakes with compassion

**🌍 SPREADING LOVE:**
• Perform random acts of kindness
• Volunteer for causes that help others
• Practice loving-kindness meditation
• Be a source of love and support in your community

Love is the most powerful force in the universe. Let it flow through you and touch everyone you meet! 💫`

        case "contentment":
          return `😌 What a peaceful and wonderful state to be in! Contentment is a deep form of happiness that comes from within.

**🕊️ SAVORING CONTENTMENT:**
• Take deep, mindful breaths and appreciate this moment of peace
• Practice meditation to deepen your sense of inner calm
• Spend time in nature, feeling connected to the world around you
• Enjoy simple pleasures like a warm cup of tea or a good book

**🌱 CULTIVATING LASTING CONTENTMENT:**
• Practice gratitude for what you have rather than focusing on what's missing
• Simplify your life by focusing on what truly matters
• Develop a regular mindfulness or meditation practice
• Create routines that support your sense of well-being

**⚖️ MAINTAINING BALANCE:**
• Set healthy boundaries to protect your peace
• Choose activities and relationships that align with your values
• Practice saying no to things that disturb your contentment
• Focus on being rather than constantly doing

**🌸 SHARING YOUR PEACE:**
• Be a calming presence for others who are struggling
• Share wisdom about finding contentment with friends
• Create peaceful environments in your home and workspace
• Model contentment for others through your example

Contentment is a treasure. Nurture it and let it be a foundation for all your other experiences. 🌿`

        case "pride":
          return `🏆 I can feel your sense of pride and accomplishment! You should absolutely celebrate your achievements.

**🎉 CELEBRATING YOUR SUCCESS:**
• Take time to fully acknowledge what you've accomplished
• Share your success with people who have supported you
• Treat yourself to something special as a reward
• Document this achievement in a journal or photo

**💪 BUILDING ON SUCCESS:**
• Reflect on the skills and qualities that led to this success
• Set new, exciting goals that build on this achievement
• Use this confidence to tackle new challenges
• Mentor others who are working toward similar goals

**🌟 HEALTHY PRIDE PRACTICES:**
• Balance pride with humility and gratitude
• Acknowledge others who helped you along the way
• Use your success to inspire and help others
• Remember that this achievement is part of your ongoing growth

**🚀 MOMENTUM FOR THE FUTURE:**
• Create a vision board for your next goals
• Network with others who share your ambitions
• Invest in further learning and skill development
• Take on leadership roles where you can make a difference

Your pride is well-deserved! Use this positive energy to continue growing and achieving. You're capable of amazing things! ⭐`

        case "gratitude":
          return `🙏 Your sense of gratitude is truly beautiful! Gratitude is one of the most powerful emotions for creating happiness and well-being.

**✨ DEEPENING GRATITUDE:**
• Write detailed thank-you notes to people who have impacted your life
• Keep a daily gratitude journal with specific, meaningful entries
• Practice gratitude meditation, focusing on all you appreciate
• Take photos of things you're grateful for throughout your day

**💝 EXPRESSING APPRECIATION:**
• Tell people directly how much they mean to you
• Perform acts of service for those you're grateful for
• Share your gratitude publicly - post about what you appreciate
• Create gratitude art, poetry, or music

**🌱 CULTIVATING MORE GRATITUDE:**
• Practice the "gratitude visit" - visit someone to thank them in person
• Look for silver linings in challenging situations
• Appreciate small, everyday moments and experiences
• Focus on what you have rather than what you lack

**🌍 SPREADING GRATITUDE:**
• Teach others about the power of gratitude
• Start gratitude practices in your family or workplace
• Volunteer for causes you care about as an expression of gratitude
• Be a positive, appreciative presence in all your relationships

Your grateful heart is a gift to the world. Keep nurturing this beautiful perspective! 🌈`

        case "hope":
          return `🌅 Your sense of hope is absolutely inspiring! Hope is the light that guides us through challenges and toward our dreams.

**🌟 NURTURING YOUR HOPE:**
• Visualize your positive future in vivid detail
• Create vision boards or write about your dreams and goals
• Surround yourself with inspiring stories of others who overcame challenges
• Practice positive affirmations about your future

**🚀 TURNING HOPE INTO ACTION:**
• Break your big dreams into small, actionable steps
• Set realistic timelines for achieving your goals
• Celebrate small progress along the way
• Connect with others who share similar hopes and dreams

**💪 BUILDING RESILIENCE:**
• Remember past challenges you've overcome successfully
• Develop coping strategies for when hope feels distant
• Practice mindfulness to stay present while working toward the future
• Build a support network of encouraging people

**🌍 SHARING HOPE:**
• Be a source of encouragement for others who are struggling
• Share your story of hope and resilience
• Volunteer for causes that align with your hopeful vision
• Mentor others who are working toward similar goals

Your hope is a powerful force for positive change. Keep believing in yourself and your bright future! ✨`

        case "blissful":
          return `🌈 What an absolutely magical state you're experiencing! Bliss is pure joy and connection with life itself.

**✨ EMBRACING BLISS:**
• Be fully present in this incredible moment
• Practice deep gratitude for this beautiful experience
• Share your joy with others - let your light shine bright
• Create art, music, or write about this blissful feeling

**🌟 EXTENDING THE EXPERIENCE:**
• Meditate on this feeling of bliss and inner peace
• Spend time in nature to connect with the beauty around you
• Practice loving-kindness toward yourself and others
• Engage in activities that align with this elevated state

**💫 INTEGRATING BLISS:**
• Remember what led to this blissful state so you can return to it
• Use this energy to tackle challenges with a positive mindset
• Set intentions for how you want to live from this elevated perspective
• Practice gratitude for the capacity to experience such joy

**🌍 RADIATING POSITIVITY:**
• Be a source of light and positivity for everyone you meet
• Perform acts of kindness and generosity
• Share wisdom and encouragement with others
• Use this blissful energy to make positive changes in the world

You are experiencing something truly special. Let this bliss transform you and everyone around you! 🦋`

        case "awe":
          return `🌌 What a profound and beautiful emotion you're experiencing! Awe connects us to something greater than ourselves.

**✨ EMBRACING AWE:**
• Take time to fully absorb whatever has inspired this feeling
• Practice mindful observation of the beauty or wonder around you
• Share this amazing experience with others who would appreciate it
• Document this moment through photos, writing, or art

**🔍 CULTIVATING MORE AWE:**
• Seek out experiences in nature that inspire wonder
• Explore art, music, or literature that moves your soul
• Learn about science, space, or other topics that expand your perspective
• Practice seeing ordinary things with fresh, curious eyes

**🌱 GROWING FROM AWE:**
• Reflect on how this experience changes your perspective on life
• Use this sense of wonder to fuel creativity and learning
• Let awe remind you of your connection to something larger
• Practice humility and gratitude for being part of something amazing

**🌟 SHARING WONDER:**
• Introduce others to experiences that create awe
• Become a student of beauty and wonder in all its forms
• Protect and preserve the things that inspire awe in you
• Use your sense of wonder to approach life with curiosity and openness

Awe is a gift that reminds us of life's incredible beauty and mystery. Let it fill you with wonder and purpose! 🌠`

        default:
          return `🤗 I'm here to support you with whatever you're feeling. Sometimes it's perfectly okay to feel neutral or uncertain about our emotions.

**🔍 EXPLORING YOUR FEELINGS:**
• Take a few deep breaths and check in with yourself
• Try journaling about your day or recent experiences
• Use an emotion wheel to identify more specific feelings
• Practice mindfulness to become more aware of your inner state

**🌱 GENERAL WELL-BEING:**
• Maintain healthy routines for sleep, nutrition, and exercise
• Connect with supportive people in your life
• Engage in activities that align with your values and interests
• Practice self-compassion and patience with yourself

**💚 EMOTIONAL AWARENESS:**
• Remember that all emotions are valid and temporary
• Notice patterns in your moods and feelings
• Consider what your emotions might be trying to tell you
• Seek professional support if you're struggling with persistent difficult emotions

**🌟 MOVING FORWARD:**
• Set small, achievable goals for your day or week
• Practice gratitude for the good things in your life
• Be open to new experiences and connections
• Trust that clarity and direction will come with time

I'm here to listen and support you. What would be most helpful for you right now? 💙`
      }
    }

    const response = getEmotionResponse(emotion)

    // Store emotion data for dashboard integration
    const emotionData = {
      emotion,
      timestamp: new Date().toISOString(),
      message: lastMessage,
      response: response.substring(0, 100) + "...",
    }

    // Create a streaming response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Add emotion data to the stream
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "emotion", data: emotionData })}\n\n`))

        // Split response into chunks for streaming effect
        const words = response.split(" ")
        let index = 0

        const sendChunk = () => {
          if (index < words.length) {
            const chunk = words[index] + " "
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
            index++
            setTimeout(sendChunk, 30) // Faster streaming for better UX
          } else {
            controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            controller.close()
          }
        }

        sendChunk()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Chatbot API error:", error)
    return new Response("Error processing request", { status: 500 })
  }
}
